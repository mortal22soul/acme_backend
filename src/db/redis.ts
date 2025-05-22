import { Redis } from "ioredis";
import env from "@/env.ts";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null, // Prevents unnecessary request errors
  enableReadyCheck: false, // Optimizes for cloud-hosted Redis
  lazyConnect: true, // Defers connection until used
});

redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  if (err instanceof Error) {
    console.error("Redis connection error:", err);
  }
});

// Graceful Shutdown Handling
const shutdownRedis = async () => {
  try {
    console.log("Closing Redis connection...");
    await redis.quit();
    console.log("Redis connection closed");
  } catch (error) {
    console.error("Error closing Redis:", error);
  }
};

// Handle process termination
process.on("SIGINT", shutdownRedis);
process.on("SIGTERM", shutdownRedis);

export default redis;
