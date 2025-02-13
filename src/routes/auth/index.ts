import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users.ts";
import { loginRoute, signupRoute } from "@/routes/auth/routes.ts";
import { checkPassword, hashPassword } from "@/utils/pass.ts";
import jwt from "jsonwebtoken";
import type { Context } from "hono";
import env from "@/env.ts";

const SECRET_KEY = env.JWT_SECRET;

const authRouter = new OpenAPIHono();

// Secure Signup Route with Duplicate Email Check
authRouter.openapi(signupRoute, async (c) => {
  const { email, password, ...rest } = await c.req.json();

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

  await db.insert(users).values({ email, password: hashedPassword, ...rest });

  return c.json({ message: "User created successfully" }, 201);
});

authRouter.openapi(loginRoute, async (c) => {
  const { email, password } = await c.req.json();
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    return c.json({ message: "Login failed: User not found" }, 401);
  }

  const isPasswordValid = await checkPassword(password, user[0].password);
  if (!isPasswordValid) {
    return c.json({ message: "Login failed: Incorrect password" }, 401);
  }

  // Generate JWT Token
  const token = jwt.sign({ id: user[0].id, email: user[0].email }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return c.json({ message: "Login successful", token });
});

// Middleware to verify JWT token
export const verifyToken = async (c: Context, next: () => Promise<void>) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ message: "Unauthorized: No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    c.set("user", decoded); // Attach user info to context
    await next();
  } catch (err: any) {
    console.error("JWT Error:", err.message);
    return c.json({ message: "Unauthorized: Invalid token" }, 401);
  }
};

export default authRouter;
