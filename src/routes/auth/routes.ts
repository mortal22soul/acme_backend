import { z, createRoute } from "@hono/zod-openapi";
import { userInsertSchema } from "@/db/schema/users.ts";

export const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  summary: "Register a new user",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: userInsertSchema.openapi("UserInsert"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "User created",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            userId: z.number(),
            accessToken: z.string(),
            refreshToken: z.string()
          }),
        },
      },
    },
    400: { description: "Invalid registration data" },
  },
});

export const loginRoute = createRoute({
  method: "post",
  path: "/login",
  summary: "Login",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            email: z.string().email(),
            password: z.string().min(8),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Login successful",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
            accessToken: z.string(),
            refreshToken: z.string(),
            userId: z.number()
          }),
        },
      },
    },
    401: { description: "Login failed" },
    429: { description: "Too many login attempts" },
  },
});

export const refreshTokenRoute = createRoute({
  method: "post",
  path: "/refresh",
  summary: "Refresh access token",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            refreshToken: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Token refreshed successfully",
      content: {
        "application/json": {
          schema: z.object({
            accessToken: z.string(),
          }),
        },
      },
    },
    401: { description: "Invalid refresh token" },
  },
});

export const logoutRoute = createRoute({
  method: "post",
  path: "/logout",
  summary: "Logout user",
  tags: ["auth"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            refreshToken: z.string(),
          }),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Logged out successfully",
      content: {
        "application/json": {
          schema: z.object({
            message: z.string(),
          }),
        },
      },
    },
    401: { description: "Invalid refresh token" },
  },
});
