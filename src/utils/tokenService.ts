import jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import env from "@/env.ts";
import crypto from "crypto";

const redis = new Redis(env.REDIS_URL);

interface TokenPayload {
  id: number;
  email: string;
  role: string;
}

export class TokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly redis: Redis;

  constructor() {
    this.accessTokenSecret = env.JWT_SECRET;
    this.refreshTokenSecret = env.JWT_REFRESH_SECRET || crypto.randomBytes(32).toString('hex');
    this.redis = redis;
  }

  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.accessTokenSecret, { expiresIn: "15m" });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: "7d" });
  }

  async saveRefreshToken(userId: number, token: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redis.set(key, token, "EX", 7 * 24 * 60 * 60); // 7 days
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, this.accessTokenSecret) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      return jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async revokeRefreshToken(userId: number): Promise<void> {
    const key = `refresh_token:${userId}`;
    await this.redis.del(key);
  }

  async isRefreshTokenValid(userId: number, token: string): Promise<boolean> {
    const storedToken = await this.redis.get(`refresh_token:${userId}`);
    return storedToken === token;
  }
} 