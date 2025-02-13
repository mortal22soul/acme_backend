import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import { trips } from "@/db/schema/trips.ts";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} from "@/routes/trips/routes.ts";

const tripRouter = new OpenAPIHono();

tripRouter.openapi(getAllTrips, async (c) => {
  const tripList = await db.select().from(trips);
  return c.json(tripList);
});

tripRouter.openapi(getTripById, async (c) => {
  const id = Number(c.req.param("id"));
  const trip = await db.select().from(trips).where(eq(trips.id, id)).limit(1);

  if (trip.length === 0) {
    return c.json({ error: "Trip not found" }, 404);
  }

  return c.json(trip[0]);
});

tripRouter.openapi(createTrip, async (c) => {
  const trip = await c.req.json();

  // return the newly created trip
  const [newTrip] = await db.insert(trips).values(trip).returning();

  return c.json(newTrip, 201);
});

tripRouter.openapi(updateTrip, async (c) => {
  const id = Number(c.req.param("id"));
  const trip = await c.req.json();

  // Check if trip exists before updating
  const existingTrip = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .limit(1);

  if (existingTrip.length === 0) {
    return c.json({ error: "Trip not found" }, 404);
  }

  const [updatedTrip] = await db
    .update(trips)
    .set(trip)
    .where(eq(trips.id, id))
    .returning();
  return c.json(updatedTrip);
});

tripRouter.openapi(deleteTrip, async (c) => {
  const id = Number(c.req.param("id"));

  const existingTrip = await db
    .select()
    .from(trips)
    .where(eq(trips.id, id))
    .limit(1);
  if (existingTrip.length === 0) {
    return c.json({ error: "Trip not found" }, 404);
  }

  await db.delete(trips).where(eq(trips.id, id));
  return c.json({ message: "Trip deleted successfully" });
});

export default tripRouter;
