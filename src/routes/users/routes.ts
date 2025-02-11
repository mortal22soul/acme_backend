import { z, createRoute } from "@hono/zod-openapi";
import { users } from "@/db/schema/users.ts";

export const getUsers = createRoute({
  method: "get",
  path: "/users",
  tags: ["users"],
  summary: "Get all users",
  security: [],
  responses: {
    200: {
      description: "Return all users",
      content: {
        "application/json": {
          schema: z.array(users),
        },
      },
    },
    400: {
      description: "Error",
    },
  },
});
