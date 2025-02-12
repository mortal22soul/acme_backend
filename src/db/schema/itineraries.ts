import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";
import { defineConfig } from "drizzle-kit";
import { relations } from "drizzle-orm";
import { trips } from "./trips.ts";
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const itineraries = pgTable("itineraries", {
  id: serial("id").primaryKey(),
  tripId: serial("trip_id")
    .notNull()
    .references(() => trips.id),
  day: integer("day").notNull(),
  activity: text(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const itinerariesRelations = relations(itineraries, ({ one }) => ({
  trip: one(trips, {
    fields: [itineraries.tripId],
    references: [trips.id],
  }),
}));

export const insertItinerarySchema = createInsertSchema(itineraries);
export const updateItinerarySchema = createUpdateSchema(itineraries);
export const selectItinerarySchema = createSelectSchema(itineraries);
