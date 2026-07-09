import Redis from "ioredis";

/* Architecture Note: We instantiate the Redis connection outside the request scope.
 This ensures that the application maintains a single, persistent connection pool
 to Upstash Redis rather than establishing a new connection per incoming webhook request.
 Creating a new connection per request would quickly exhaust connection limits,
 block the Node.js event loop, and severely degrade performance.
*/

import { ENV } from "../config/env";

const redisUrl = ENV.UPSTASH_REDIS_URL;

const createConnection = () => {
  if (ENV.NODE_ENV === "test") {
    const RedisMock = require("ioredis-mock");
    return new RedisMock();
  }

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null, // Required by BullMQ to prevent the queue from hanging
    retryStrategy(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });
};

export const redisConnection = createConnection();

redisConnection.on("error", (err: Error) => {
  console.error("[Redis Connection Error]", err.message || err);
});
