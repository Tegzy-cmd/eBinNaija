// src/middleware/rateLimit.middleware.ts
import { Request, Response, NextFunction } from 'express';
import redisService from '../services/redis.service';

interface RateLimitOptions {
  keyPrefix: string;
  windowDurationInSeconds: number; // e.g. 600s = 10 min
  maxRequestsPerWindow: number; // e.g. 5 attempts
}

export const rateLimit =
  ({ keyPrefix, windowDurationInSeconds, maxRequestsPerWindow }: RateLimitOptions) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const rateLimitKey = `${keyPrefix}:${clientIp}`;

    const currentRequestCount = await redisService.increment(rateLimitKey);
    const ttlInSeconds = await redisService.getValue<number>(`ttl:${rateLimitKey}`);

    // Set expiration if it's a new key
    if (ttlInSeconds === null) {
      await redisService.expire(rateLimitKey, windowDurationInSeconds);
    }
    // Check if limit exceeded
    if (currentRequestCount > maxRequestsPerWindow) {
      return res.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    }

    next();
  };
