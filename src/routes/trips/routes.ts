import { z, createRoute } from "@hono/zod-openapi";
import {
  insertTripSchema,
  updateTripSchema,
  selectTripSchema,
} from "@/db/schema/trips.ts";

export const getAllTrips = createRoute({
  method: "get",
  path: "/",
  summary: "Get all trips",
  tags: ["trips"],
  // security: [
  // {
  // Bearer: [],
  // },
  // ],
  responses: {
    200: {
      description: "Retrieved trips successfully",
      content: {
        "application/json": {
          schema: z.array(selectTripSchema).openapi("TripResponseArray"),
        },
      },
    },
    400: {
      description: "Failed to retrieve trips",
    },
  },
});

export const getTripById = createRoute({
  method: "get",
  path: "/{id}",
  summary: "Get trip by ID",
  tags: ["trips"],
  // security: [
  // {
  //   Bearer: [],
  // },
  // ],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Trip retrieved successfully",
      content: {
        "application/json": {
          schema: selectTripSchema.openapi("TripResponse"),
        },
      },
    },
    404: {
      description: "Trip not found",
    },
  },
});

export const createTrip = createRoute({
  method: "post",
  path: "/",
  summary: "Create a trip",
  tags: ["trips"],
  // security: [
  //   {
  //     Bearer: [],
  //   },
  // ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertTripSchema.openapi("TripInsert"),
        },
      },
    },
  },
  responses: {
    201: {
      description: "Trip created successfully",
      content: {
        "application/json": {
          schema: selectTripSchema.openapi("TripResponse"),
        },
      },
    },
    400: {
      description: "Invalid trip data",
    },
  },
});

export const updateTrip = createRoute({
  method: "put",
  path: "/{id}",
  summary: "Update a trip by ID",
  tags: ["trips"],
  // security: [
  //   {
  //     Bearer: [],
  //   },
  // ],
  request: {
    params: z.object({
      id: z.number().openapi({ example: 22 }),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateTripSchema.openapi("TripUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Trip updated successfully",
    },
    400: {
      description: "Invalid trip data",
    },
    404: {
      description: "Trip not found",
    },
  },
});

export const deleteTrip = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "Delete a trip by ID",
  tags: ["trips"],
  // security: [
  //   {
  //     Bearer: [],
  //   },
  // ],
  request: {
    params: z.object({
      id: z.number().openapi({ example: 22 }),
    }),
  },
  responses: {
    200: {
      description: "Trip deleted successfully",
    },
    404: {
      description: "Trip not found",
    },
  },
});
