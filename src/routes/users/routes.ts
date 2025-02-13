import { z, createRoute } from "@hono/zod-openapi";
import {
  userInsertSchema,
  userSelectSchema,
  userUpdateSchema,
} from "@/db/schema/users.ts";

export const getUser = createRoute({
  method: "get",
  path: "/",
  tags: ["users"],
  summary: "Get all users",
  security: [],
  responses: {
    200: {
      description: "Retrieved user successfully",
      content: {
        "application/json": {
          schema: userSelectSchema.openapi("UserResponse"),
        },
      },
    },
    400: {
      description: "User not found",
    },
  },
});

export const getUserById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["users"],
  summary: "Get user by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Return user by id",
      content: {
        "application/json": {
          schema: userSelectSchema.openapi("UserResponse"),
        },
      },
    },
    400: {
      description: "User not found",
    },
  },
});

export const getAllUsers = createRoute({
  method: "get",
  path: "/",
  tags: ["users"],
  summary: "Get all users",
  security: [],
  responses: {
    200: {
      description: "Return all users",
      content: {
        "application/json": {
          schema: z.array(userSelectSchema).openapi("UserResponse"),
        },
      },
    },
    400: {
      description: "User not found",
    },
  },
});

export const createUser = createRoute({
  method: "post",
  path: "/",
  tags: ["users"],
  summary: "Create a user",
  security: [],
  request: {
    body: {
      content: {
        "application/json": { schema: userInsertSchema.openapi("UserInsert") },
      },
    },
  },
  responses: {
    200: {
      description: "User created successfully",
      content: {
        "application/json": {
          schema: userSelectSchema.openapi("UserResponse"),
        },
      },
    },
    400: {
      description: "User not found",
    },
  },
});

export const updateUser = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["users"],
  summary: "Update user by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
    body: {
      content: {
        "application/json": { schema: userUpdateSchema.openapi("UserUpdate") },
      },
    },
  },
  responses: {
    200: {
      description: "User updated successfully",
    },
    400: {
      description: "User not found",
    },
  },
});

export const deleteUser = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["users"],
  summary: "Delete a user",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "User deleted successfully",
    },
    400: {
      description: "User not found",
    },
  },
});
