import { Redis } from '@upstash/redis';

const redis = process.env.REDIS_URL && process.env.REDIS_TOKEN
  ? new Redis({ url: process.env.REDIS_URL, token: process.env.REDIS_TOKEN })
  : null;

export async function rateLimit(key: string, limit = 30, windowSeconds = 60) {
  if (!redis) return { success: true, remaining: limit };
  const bucket = `rl:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;
  const count = await redis.incr(bucket);
  if (count === 1) await redis.expire(bucket, windowSeconds);
  return { success: count <= limit, remaining: Math.max(0, limit - count) };
}
