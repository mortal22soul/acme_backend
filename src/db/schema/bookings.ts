import { defineConfig } from "drizzle-kit";
import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { customers } from "./customers.ts";
import { trips } from "./trips.ts";
import { relations } from "drizzle-orm";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const bookingStatus = pgEnum("bookingStatus", [
  "confirmed",
  "canceled",
  "pending",
]);

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerId: serial("customer_id")
    .notNull()
    .references(() => customers.id),
  tripId: serial("trip_id")
    .notNull()
    .references(() => trips.id),
  bookingDate: timestamp("booking_date", { mode: "string" }).notNull(),
  status: bookingStatus("status").notNull().default("pending"),
  travelers: integer("travelers").notNull(),
  totalPrice: text("total_price").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const bookingsRelations = relations(bookings, ({ one }) => ({
  customer: one(customers, {
    fields: [bookings.customerId],
    references: [customers.id],
  }),
  trip: one(trips, {
    fields: [bookings.tripId],
    references: [trips.id],
  }),
}));

export const insertBookingSchema = createInsertSchema(bookings);
export const selectBookingSchema = createSelectSchema(bookings);
export const updateBookingSchema = createUpdateSchema(bookings);
