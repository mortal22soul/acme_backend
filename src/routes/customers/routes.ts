import { z, createRoute } from "@hono/zod-openapi";
import {
  customerUpdateSchema,
  customerSelectSchema,
  customerInsertSchema,
} from "@/db/schema/customers.ts";

export const getAllCustomers = createRoute({
  method: "get",
  path: "/",
  tags: ["customers"],
  summary: "Get all customers",
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: "Retrieved customer successfully",
      content: {
        "application/json": {
          schema: customerSelectSchema.openapi("CustomerResponse"),
        },
      },
    },
    400: {
      description: "Customer not found",
    },
  },
});

export const getCustomerById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["customers"],
  summary: "Get customer by id",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Return customer by id",
      content: {
        "application/json": {
          schema: customerSelectSchema.openapi("CustomerResponse"),
        },
      },
    },
    400: {
      description: "Customer not found",
    },
  },
});

export const createCustomer = createRoute({
  method: "post",
  path: "/",
  tags: ["customers"],
  summary: "Create customer",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: customerInsertSchema.openapi("CustomerInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Customer created successfully",
    },
    400: {
      description: "Customer not created",
    },
  },
});

export const updateCustomer = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["customers"],
  summary: "Update customer",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: customerUpdateSchema.openapi("CustomerUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Customer updated successfully",
    },
    400: {
      description: "Customer not updated",
    },
  },
});

export const deleteCustomer = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["customers"],
  summary: "Delete customer",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Customer deleted successfully",
    },
    400: {
      description: "Customer not deleted",
    },
  },
});
