export const ENV = {
  PORT: process.env.PORT || 3000,
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
  UPSTASH_REDIS_URL: process.env.UPSTASH_REDIS_URL || 'redis://localhost:6379',
  DATABASE_URL: process.env.DATABASE_URL,
  CONTENTFUL_SIGNING_SECRET: process.env.CONTENTFUL_SIGNING_SECRET,
  CONTENTFLOW_WEBHOOK_SECRET: process.env.CONTENTFLOW_WEBHOOK_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
