import { Redis } from "ioredis";
import env from "@/env.ts";

const redis = new Redis(env.REDIS_URL);

export class RateLimiter {
  private readonly redis: Redis;
  private readonly prefix: string;
  private readonly maxAttempts: number;
  private readonly windowMs: number;

  constructor(
    prefix: string = "rate-limit:",
    maxAttempts: number = 5,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {
    this.redis = redis;
    this.prefix = prefix;
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  private getKey(identifier: string): string {
    return `${this.prefix}${identifier}`;
  }

  async increment(identifier: string): Promise<boolean> {
    const key = this.getKey(identifier);
    
    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.pexpire(key, this.windowMs);
    }

    return current <= this.maxAttempts;
  }

  async reset(identifier: string): Promise<void> {
    await this.redis.del(this.getKey(identifier));
  }

  async getRemainingAttempts(identifier: string): Promise<number> {
    const current = await this.redis.get(this.getKey(identifier));
    return this.maxAttempts - (parseInt(current || "0", 10));
  }
} 