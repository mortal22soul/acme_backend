import { pgTable, serial, integer, text, timestamp } from "drizzle-orm/pg-core";
import { defineConfig } from "drizzle-kit";
import { relations } from "drizzle-orm";
import { customers } from "./customers.ts";
import { trips } from "./trips.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  customerId: serial("customer_id")
    .notNull()
    .references(() => customers.id),
  tripId: serial("trip_id")
    .notNull()
    .references(() => trips.id),
  rating: integer().notNull(),
  comment: text(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  customer: one(customers, {
    fields: [reviews.customerId],
    references: [customers.id],
  }),
  trip: one(trips, {
    fields: [reviews.tripId],
    references: [trips.id],
  }),
}));
