import { defineConfig } from "drizzle-kit";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users.ts";
import { bookings } from "./bookings.ts";
import { reviews } from "./reviews.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id),
  phone: text().notNull().unique(),
  streetAddress1: text("street_address1").notNull(),
  streetAddress2: text("street_address1"),
  city: text().notNull(),
  zip: text().notNull(),
  dob: timestamp({ mode: "string" }).notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const customersRelations = relations(customers, ({ many, one }) => ({
  user: one(users, {
    fields: [customers.userId],
    references: [users.id],
  }),
  bookings: many(bookings),
  reviews: many(reviews),
}));
