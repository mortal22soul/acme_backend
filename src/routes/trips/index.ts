import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { trips } from "@/db/schema/trips.ts";
import redis from "@/db/redis.ts";

import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "@/routes/trips/routes.ts";

const tripRouter = new OpenAPIHono();

tripRouter.openapi(getAllTrips, async (c) => {
  const cacheKey = "trips:all";
  const cachedTrips = await redis.get(cacheKey);

  if (cachedTrips) return c.json(JSON.parse(cachedTrips));

  const tripList = await db.select().from(trips);
  await redis.set(cacheKey, JSON.stringify(tripList), "EX", 900);
  // EX - Expire after 900 seconds(1 hour)

  return c.json(tripList);
});

tripRouter.openapi(getTripById, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid trip ID" }, 400);

  const cacheKey = `trips:${id}`;
  const cachedTrip = await redis.get(cacheKey);

  if (cachedTrip) return c.json(JSON.parse(cachedTrip));

  const trip = await db.select().from(trips).where(eq(trips.id, id));
  if (!trip.length) return c.json({ error: "Trip not found" }, 404);

  await redis.set(cacheKey, JSON.stringify(trip[0]), "EX", 900);
  return c.json(trip[0]);
});

tripRouter.openapi(createTrip, async (c) => {
  const trip = await c.req.json();
  await db.insert(trips).values(trip);

  await redis.del("trips:all"); // Invalidate trip list cache
  return c.json({ message: "Trip created successfully" }, 201);
});

tripRouter.openapi(updateTrip, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid trip ID" }, 400);

  const trip = await c.req.json();
  await db.update(trips).set(trip).where(eq(trips.id, id));

  await redis.del("trips:all"); // Invalidate trip list cache
  await redis.del(`trips:${id}`); // Invalidate specific trip cache

  return c.json({ message: "Trip updated successfully" });
});

tripRouter.openapi(deleteTrip, async (c) => {
  const id = Number(c.req.param("id"));
  if (isNaN(id)) return c.json({ error: "Invalid trip ID" }, 400);

  await db.delete(trips).where(eq(trips.id, id));

  await redis.del("trips:all");
  await redis.del(`trips:${id}`);

  return c.json({ message: "Trip deleted successfully" });
});

export default tripRouter;
