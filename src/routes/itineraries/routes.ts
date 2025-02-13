import { z, createRoute } from "@hono/zod-openapi";
import {
  insertItinerarySchema,
  updateItinerarySchema,
  selectItinerarySchema,
} from "@/db/schema/itineraries.ts";

export const getAllItineraries = createRoute({
  method: "get",
  path: "/",
  tags: ["itineraries"],
  summary: "Get all itineraries",
  security: [
    {
      Bearer: [],
    },
  ],
  responses: {
    200: {
      description: "Retrieved itinerary successfully",
      content: {
        "application/json": {
          schema: selectItinerarySchema.openapi("ItineraryResponse"),
        },
      },
    },
    400: {
      description: "Itinerary not found",
    },
  },
});

export const getItineraryById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["itineraries"],
  summary: "Get itinerary by id",
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
      description: "Return itinerary by id",
      content: {
        "application/json": {
          schema: selectItinerarySchema.openapi("ItineraryResponse"),
        },
      },
    },
    400: {
      description: "Itinerary not found",
    },
  },
});

export const createItinerary = createRoute({
  method: "post",
  path: "/",
  tags: ["itineraries"],
  summary: "Insert new itinerary",
  security: [
    {
      Bearer: [],
    },
  ],
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertItinerarySchema.openapi("ItineraryInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Inserted itinerary successfully",
      content: {
        "application/json": {
          schema: insertItinerarySchema.openapi("ItineraryResponse"),
        },
      },
    },
    400: {
      description: "Itinerary not found",
    },
  },
});

export const updateItinerary = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["itineraries"],
  summary: "Update itinerary by id",
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
          schema: updateItinerarySchema.openapi("ItineraryUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated itinerary successfully",
      content: {
        "application/json": {
          schema: updateItinerarySchema.openapi("ItineraryResponse"),
        },
      },
    },
    400: {
      description: "Itinerary not found",
    },
  },
});

export const deleteItinerary = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["itineraries"],
  summary: "Delete an itinerary",
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
      description: "Itinerary deleted successfully",
    },
    400: {
      description: "Itinerary not found",
    },
  },
});
