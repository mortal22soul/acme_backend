import { config } from "dotenv";
import { expand } from "dotenv-expand";

import { ZodError, z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DB_HOST: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.coerce.number(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string().optional(),
  ALLOWED_ORIGIN: z.string().optional(),
  REDIS_URL: z.string(),
});

export type EnvSchema = z.infer<typeof EnvSchema>;

const myEnv = config();
if (myEnv.error) {
  throw new Error("Failed to load .env file");
}

expand(myEnv);

try {
  EnvSchema.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    console.error("Environment validation failed:", error.errors);
  }
  throw error;
}

const env = EnvSchema.parse(process.env);
export default env;
