import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { reviews } from "@/db/schema/reviews.ts";
import { eq } from "drizzle-orm";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "./routes.ts";

const reviewRouter = new OpenAPIHono();

reviewRouter.openapi(getAllReviews, async (c) => {
  const reviewList = await db.select().from(reviews);

  return c.json(reviewList);
});

reviewRouter.openapi(getReviewById, async (c) => {
  const id = c.req.param("id");

  const review = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, Number(id)));
  return c.json(review);
});

reviewRouter.openapi(createReview, async (c) => {
  const review = await c.req.json();
  await db.insert(reviews).values(review);
  return c.text("Review created successfully");
});

reviewRouter.openapi(updateReview, async (c) => {
  const id = c.req.param("id");
  const review = await c.req.json();

  await db
    .update(reviews)
    .set(review)
    .where(eq(reviews.id, Number(id)));

  return c.text("Review updated successfully");
});

reviewRouter.openapi(deleteReview, async (c) => {
  const id = c.req.param("id");

  await db.delete(reviews).where(eq(reviews.id, Number(id)));
  return c.text("Review deleted successfully");
});

export default reviewRouter;
