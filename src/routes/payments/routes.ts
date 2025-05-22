import { z, createRoute } from "@hono/zod-openapi";
import {
  insertPaymentSchema,
  updatePaymentSchema,
  selectPaymentSchema,
} from "@/db/schema/payments.ts";

export const getAllPayments = createRoute({
  method: "get",
  path: "/",
  tags: ["payments"],
  summary: "Get all payments",
  security: [],
  responses: {
    200: {
      description: "Retrieved payment successfully",
      content: {
        "application/json": {
          schema: selectPaymentSchema.openapi("PaymentResponse"),
        },
      },
    },
    400: {
      description: "Payment not found",
    },
  },
});

export const getPaymentById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["payments"],
  summary: "Get payment by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Return payment by id",
      content: {
        "application/json": {
          schema: selectPaymentSchema.openapi("PaymentResponse"),
        },
      },
    },
    400: {
      description: "Payment not found",
    },
  },
});

export const createPayment = createRoute({
  method: "post",
  path: "/",
  tags: ["payments"],
  summary: "Insert new payment",
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertPaymentSchema.openapi("PaymentInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Inserted payment successfully",
      content: {
        "application/json": {
          schema: selectPaymentSchema.openapi("PaymentResponse"),
        },
      },
    },
    400: {
      description: "Payment not created",
    },
  },
});

export const updatePayment = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["payments"],
  summary: "Update payment by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: updatePaymentSchema.openapi("PaymentUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated payment successfully",
      content: {
        "application/json": {
          schema: selectPaymentSchema.openapi("PaymentResponse"),
        },
      },
    },
    400: {
      description: "Payment not updated",
    },
  },
});

export const deletePayment = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["payments"],
  summary: "Delete a payment",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Payment deleted successfully",
    },
    400: {
      description: "Payment not deleted",
    },
  },
});
