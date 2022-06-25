import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import AppError from '@shared/errors/AppError';

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const redisClient = new Redis({
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASS || undefined,
      port: Number(process.env.REDIS_PORT),
    });
    if (!redisClient.status) await redisClient.connect();

    //permite que cada ip realize apenas 5 requisições por segundo
    const limiter = new RateLimiterRedis({
      storeClient: redisClient,
      keyPrefix: 'ratelimit',
      points: 5,
      duration: 1,
    });
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    //console.log(err);
    throw new AppError('Too many request.', 429);
  }
}
