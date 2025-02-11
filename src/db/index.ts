import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index.ts";
import env from "@/env.ts";

export const connection = postgres(env.DATABASE_URL);

export const db = drizzle(connection, {
  schema,
  logger: true,
});

export type db = typeof db;

export default db;
