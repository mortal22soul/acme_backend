import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users.ts";
import { loginRoute, signupRoute, refreshTokenRoute, logoutRoute } from "@/routes/auth/routes.ts";
import { checkPassword, hashPassword, validatePasswordStrength } from "@/utils/pass.ts";
import type { Context } from "hono";
import { RateLimiter } from "@/utils/rateLimiter.ts";
import { TokenService } from "@/utils/tokenService.ts";

const authRouter = new OpenAPIHono();
const rateLimiter = new RateLimiter("login:");
const tokenService = new TokenService();

// Secure Signup Route with Duplicate Email Check and Password Validation
authRouter.openapi(signupRoute, async (c) => {
  const { email, password, ...rest } = await c.req.json();

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    return c.json({ 
      message: "Password is too weak", 
      requirements: passwordValidation.requirements 
    }, 400);
  }

  // Check if user already exists
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));
  if (existingUser.length > 0) {
    return c.json({ message: "User already exists" }, 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Insert the new user
  const [newUser] = await db
    .insert(users)
    .values({ email, password: hashedPassword, ...rest })
    .returning({ id: users.id, email: users.email, role: users.role });

  // Generate tokens
  const accessToken = tokenService.generateAccessToken(newUser);
  const refreshToken = tokenService.generateRefreshToken(newUser);
  
  // Save refresh token
  await tokenService.saveRefreshToken(newUser.id, refreshToken);

  return c.json({
    message: "User created successfully",
    userId: newUser.id,
    accessToken,
    refreshToken
  }, 201);
});

// Login with rate limiting
authRouter.openapi(loginRoute, async (c) => {
  const { email, password } = await c.req.json();

  // Apply rate limiting
  const canAttempt = await rateLimiter.increment(email);
  if (!canAttempt) {
    const remainingTime = await rateLimiter.getRemainingAttempts(email);
    return c.json({ 
      message: "Too many login attempts", 
      tryAgainIn: remainingTime 
    }, 429);
  }

  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    return c.json({ message: "Login failed: Invalid credentials" }, 401);
  }

  const isPasswordValid = await checkPassword(password, user[0].password);
  if (!isPasswordValid) {
    return c.json({ message: "Login failed: Invalid credentials" }, 401);
  }

  // Reset rate limiter on successful login
  await rateLimiter.reset(email);

  // Generate tokens
  const accessToken = tokenService.generateAccessToken({
    id: user[0].id,
    email: user[0].email,
    role: user[0].role
  });
  
  const refreshToken = tokenService.generateRefreshToken({
    id: user[0].id,
    email: user[0].email,
    role: user[0].role
  });

  // Save refresh token
  await tokenService.saveRefreshToken(user[0].id, refreshToken);

  return c.json({ 
    message: "Login successful", 
    accessToken,
    refreshToken,
    userId: user[0].id 
  });
});

// Refresh Token Route
authRouter.openapi(refreshTokenRoute, async (c) => {
  const { refreshToken } = await c.req.json();

  try {
    const decoded = await tokenService.verifyRefreshToken(refreshToken);
    
    // Verify if refresh token is still valid in Redis
    const isValid = await tokenService.isRefreshTokenValid(decoded.id, refreshToken);
    if (!isValid) {
      return c.json({ message: "Invalid refresh token" }, 401);
    }

    // Generate new access token
    const accessToken = tokenService.generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    return c.json({ accessToken });
  } catch (error) {
    return c.json({ message: "Invalid refresh token" }, 401);
  }
});

// Logout Route
authRouter.openapi(logoutRoute, async (c) => {
  const { refreshToken } = await c.req.json();

  try {
    const decoded = await tokenService.verifyRefreshToken(refreshToken);
    await tokenService.revokeRefreshToken(decoded.id);
    return c.json({ message: "Logged out successfully" });
  } catch (error) {
    return c.json({ message: "Invalid refresh token" }, 401);
  }
});

// Middleware to verify JWT token
export const verifyToken = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await tokenService.verifyAccessToken(token);
    c.set("user", decoded); // Attach user info to context
    await next();
  } catch (err: any) {
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};

export default authRouter;
