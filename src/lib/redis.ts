// Redis client - Optional dependency
// If Redis is not available, caching operations will be skipped

let redis: any = null;

if (process.env.REDIS_URL) {
  try {
    // Dynamically import Redis client if available
    // Uncomment when @upstash/redis is installed:
    // const { Redis } = require('@upstash/redis');
    // redis = new Redis({
    //   url: process.env.REDIS_URL,
    //   token: process.env.REDIS_TOKEN,
    // });
  } catch (error) {
    console.warn('Redis client not initialized - caching disabled');
  }
}

export { redis };
