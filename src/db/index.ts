import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema/index.ts";
import env from "@/env.ts";

let connection: ReturnType<typeof postgres>;

if (env.NODE_ENV === "production") {
  connection = postgres(env.DATABASE_URL, { max: 10 }); // Limit connections
} else {
  const globalWithDrizzle = global as typeof globalThis & {
    connection?: ReturnType<typeof postgres>;
  };

  if (!globalWithDrizzle.connection) {
    globalWithDrizzle.connection = postgres(env.DATABASE_URL, { max: 10 });
  }

  connection = globalWithDrizzle.connection;
}

export const db = drizzle(connection, {
  schema,
  logger: true,
});

export default db;
