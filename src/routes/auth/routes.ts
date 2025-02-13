import { z, createRoute } from "@hono/zod-openapi";
import { userInsertSchema } from "@/db/schema/users.ts";

export const signupRoute = createRoute({
  method: "post",
  path: "/signup",
  summary: "Register a new user",
  tags: ["auth"],
  body: userInsertSchema, // Directly use userInsertSchema
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
    201: { description: "User created" }, // Use 201 for resource creation
    400: { description: "Invalid registration failed" },
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
            email: z.string().email().openapi({ example: "test@example.com" }),
            password: z.string().min(8).openapi({ example: "password123" }),
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
            token: z.string().openapi({
              example:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE2MTUwMzE4MjJ9.0G8f9QzQJ7j7Q6w7h1VJ0J",
            }),
            userId: z.number().openapi({ example: 1 }), // Ensure userId is a number
          }),
        },
      },
    },
    401: { description: "Login failed" },
  },
});
