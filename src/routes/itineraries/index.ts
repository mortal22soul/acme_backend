import { OpenAPIHono } from "@hono/zod-openapi";
import { db } from "@/db/index.ts";
import { eq } from "drizzle-orm";
import {
  getAllItineraries,
  getItineraryById,
  createItinerary,
  updateItinerary,
  deleteItinerary,
} from "./routes.ts";
import { itineraries } from "@/db/schema/itineraries.ts";

const itineraryRouter = new OpenAPIHono();

itineraryRouter.openapi(getAllItineraries, async (c) => {
  const itineraryList = await db.select().from(itineraries);
  return c.json(itineraryList);
});

itineraryRouter.openapi(getItineraryById, async (c) => {
  const id = c.req.param("id");

  const itinerary = await db
    .select()
    .from(itineraries)
    .where(eq(itineraries.id, Number(id)));
  return c.json(itinerary);
});

itineraryRouter.openapi(createItinerary, async (c) => {
  const itinerary = await c.req.json();
  await db.insert(itineraries).values(itinerary);
  return c.text("Itinerary created successfully");
});

itineraryRouter.openapi(updateItinerary, async (c) => {
  const id = c.req.param("id");
  const itinerary = await c.req.json();

  await db
    .update(itineraries)
    .set(itinerary)
    .where(eq(itineraries.id, Number(id)));

  return c.text("Itinerary updated successfully");
});

itineraryRouter.openapi(deleteItinerary, async (c) => {
  const id = c.req.param("id");

  await db.delete(itineraries).where(eq(itineraries.id, Number(id)));
  return c.text("Itinerary deleted successfully");
});

export default itineraryRouter;
