import { defineConfig } from "drizzle-kit";
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import {
  createSelectSchema,
  createInsertSchema,
  createUpdateSchema,
} from "drizzle-zod";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema",
});

export const role = pgEnum("role", ["admin", "customer", "agent"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  username: text("username").unique().notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  image: text("image").default("https://api.dicebear.com/9.x/bottts/svg"),
  role: role("role").notNull().default("customer"),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);
export const userUpdateSchema = createUpdateSchema(users);
