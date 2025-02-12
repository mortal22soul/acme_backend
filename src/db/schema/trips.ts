import { defineConfig } from "drizzle-kit";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookings } from "./bookings.ts";
import { itineraries } from "./itineraries.ts";
import { reviews } from "./reviews.ts";
import { agents } from "./agents.ts";
import {
  createInsertSchema,
  createUpdateSchema,
  createSelectSchema,
} from "drizzle-zod";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const type = pgEnum("type", ["one-way", "round-trip", "multi-city"]);

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  agentId: serial("agent_id")
    .notNull()
    .references(() => agents.id),
  destination: text().notNull(),
  origin: text().notNull(),
  departureDate: timestamp("departure_date", { mode: "string" }).notNull(),
  returnDate: timestamp("return_date", { mode: "string" }).notNull(),
  price: text("price").notNull(),
  availableSeats: integer("available_seats").notNull(),
  type: type().notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const tripsRelations = relations(trips, ({ one, many }) => ({
  agent: one(agents, {
    fields: [trips.agentId],
    references: [agents.id],
  }),
  bookings: many(bookings),
  itineraries: many(itineraries),
  reviews: many(reviews),
}));

export const insertTripSchema = createInsertSchema(trips);
export const updateTripSchema = createUpdateSchema(trips);
export const selectTripSchema = createSelectSchema(trips);
