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
import redis from "@/db/redis.ts";

const reviewRouter = new OpenAPIHono();

reviewRouter.openapi(getAllReviews, async (c) => {
  const cacheKey = "reviews:all";
  const cachedReviews = await redis.get(cacheKey);

  if (cachedReviews) return c.json(JSON.parse(cachedReviews));

  const reviewList = await db.select().from(reviews);
  await redis.set(cacheKey, JSON.stringify(reviewList), "EX", 900);

  return c.json(reviewList);
});

reviewRouter.openapi(getReviewById, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid review ID" }, 400);

  const cacheKey = `reviews:${id}`;
  const cachedReview = await redis.get(cacheKey);

  if (cachedReview) return c.json(JSON.parse(cachedReview));

  const reviewList = await db
    .select()
    .from(reviews)
    .where(eq(reviews.tripId, Number(id)));
  if (!reviewList.length) return c.json({ error: "Review not found" }, 404);

  await redis.set(cacheKey, JSON.stringify(reviewList), "EX", 900);

  return c.json(reviewList);
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
