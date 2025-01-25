import Redis from "ioredis"


export const redisClient = new Redis(process.env.REDIS_URL);

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
export default redis;
