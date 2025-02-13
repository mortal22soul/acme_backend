import { z, createRoute } from "@hono/zod-openapi";
import {
  insertBookingSchema,
  updateBookingSchema,
  selectBookingSchema,
} from "@/db/schema/bookings.ts";

export const getAllBookings = createRoute({
  method: "get",
  path: "/",
  tags: ["bookings"],
  summary: "Get all bookings",
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: "Retrieved booking successfully",
      content: {
        "application/json": {
          schema: selectBookingSchema.openapi("BookingResponse"),
        },
      },
    },
    400: {
      description: "Booking not found",
    },
  },
});

export const getBookingById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["bookings"],
  summary: "Get booking by id",
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
      description: "Return booking by id",
      content: {
        "application/json": {
          schema: selectBookingSchema.openapi("BookingResponse"),
        },
      },
    },
    400: {
      description: "Booking not found",
    },
  },
});

export const deleteBooking = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete booking by id",
  tags: ["bookings"],
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
      description: "Booking deleted successfully",
    },
    400: {
      description: "Booking not found",
    },
  },
});

export const createBooking = createRoute({
  method: "post",
  path: "/",
  tags: ["bookings"],
  summary: "Create booking",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertBookingSchema.openapi("BookingInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Booking created successfully",
      content: {
        "application/json": {
          schema: selectBookingSchema.openapi("BookingResponse"),
        },
      },
    },
    400: {
      description: "Booking not found",
    },
  },
});

export const updateBooking = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["bookings"],
  summary: "Update booking",
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
          schema: updateBookingSchema.openapi("BookingUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Booking updated successfully",
      content: {
        "application/json": {
          schema: selectBookingSchema.openapi("BookingResponse"),
        },
      },
    },
    400: {
      description: "Booking not found",
    },
  },
});
