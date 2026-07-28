import { Redis } from '@upstash/redis';

if (!process.env.REDIS_URL) {
  throw new Error('Missing env.REDIS_URL');
}

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

export const getRateLimitKey = (userId: string, tool: string): string => {
  return `rate-limit:${userId}:${tool}`;
};

export const checkRateLimit = async (
  userId: string,
  tool: string,
  limit: number,
  window: number
): Promise<boolean> => {
  const key = getRateLimitKey(userId, tool);
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, window);
  }

  return current <= limit;
};
