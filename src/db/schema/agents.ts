import { pgTable, serial, timestamp, text } from "drizzle-orm/pg-core";
import { defineConfig } from "drizzle-kit";
import { relations } from "drizzle-orm";
import { users } from "./users.ts";
import { trips } from "./trips.ts";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .notNull()
    .references(() => users.id),
  phone: text("phone_number").notNull(),
  region: text("region").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, {
    fields: [agents.userId],
    references: [users.id],
  }),
  trips: many(trips),
}));

export const agentSelectSchema = createSelectSchema(agents);
export const agentInsertSchema = createInsertSchema(agents);
export const agentUpdateSchema = createUpdateSchema(agents);
