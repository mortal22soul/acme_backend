import { z, createRoute } from "@hono/zod-openapi";
import {
  insertReviewSchema,
  updateReviewSchema,
  selectReviewSchema,
} from "@/db/schema/reviews.ts";

export const getAllReviews = createRoute({
  method: "get",
  path: "/",
  tags: ["reviews"],
  summary: "Get all reviews",
  security: [],
  responses: {
    200: {
      description: "Retrieved review successfully",
      content: {
        "application/json": {
          schema: selectReviewSchema.openapi("ReviewResponse"),
        },
      },
    },
    400: {
      description: "Review not found",
    },
  },
});

export const getReviewById = createRoute({
  method: "get",
  path: "/{id}",
  tags: ["reviews"],
  summary: "Get review by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Return review by id",
      content: {
        "application/json": {
          schema: selectReviewSchema.openapi("ReviewResponse"),
        },
      },
    },
    400: {
      description: "Review not found",
    },
  },
});

export const createReview = createRoute({
  method: "post",
  path: "/",
  tags: ["reviews"],
  summary: "Insert new review",
  security: [],
  request: {
    body: {
      content: {
        "application/json": {
          schema: insertReviewSchema.openapi("ReviewInsert"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Created review successfully",
      content: {
        "application/json": {
          schema: selectReviewSchema.openapi("ReviewResponse"),
        },
      },
    },
    400: {
      description: "Review not found",
    },
  },
});

export const updateReview = createRoute({
  method: "put",
  path: "/{id}",
  tags: ["reviews"],
  summary: "Update review by id",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
    body: {
      content: {
        "application/json": {
          schema: updateReviewSchema.openapi("ReviewUpdate"),
        },
      },
    },
  },
  responses: {
    200: {
      description: "Updated review successfully",
      content: {
        "application/json": {
          schema: selectReviewSchema.openapi("ReviewResponse"),
        },
      },
    },
    400: {
      description: "Review not found",
    },
  },
});

export const deleteReview = createRoute({
  method: "delete",
  path: "/{id}",
  tags: ["reviews"],
  summary: "Delete a review",
  security: [],
  request: {
    params: z.object({
      id: z.string().openapi({ example: "22" }),
    }),
  },
  responses: {
    200: {
      description: "Review deleted successfully",
    },
    400: {
      description: "Review not found",
    },
  },
});
