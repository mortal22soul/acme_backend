import { defineConfig } from "drizzle-kit";
import { pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { bookings } from "./bookings.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const status = pgEnum("status", ["successful", "failed", "pending"]);
export const method = pgEnum("method", [
  "credit card",
  "debit card",
  "net banking",
]);

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: serial("booking_id")
    .notNull()
    .references(() => bookings.id),
  date: timestamp({ mode: "string" }).notNull(),
  amount: text().notNull(),
  status: status(),
  method: method(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
});

export const paymentsRelations = relations(payments, ({ one }) => ({
  booking: one(bookings, {
    fields: [payments.bookingId],
    references: [bookings.id],
  }),
}));
