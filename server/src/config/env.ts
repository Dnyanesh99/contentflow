export const ENV = {
  PORT: process.env.PORT || 3000,
  CONTENTFUL_ACCESS_TOKEN: process.env.CONTENTFUL_ACCESS_TOKEN,
  DATABASE_URL: process.env.DATABASE_URL,
  CONTENTFUL_SIGNING_SECRET: process.env.CONTENTFUL_SIGNING_SECRET,
  CONTENTFLOW_WEBHOOK_SECRET: process.env.CONTENTFLOW_WEBHOOK_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  NODE_ENV: process.env.NODE_ENV || 'development',
  QSTASH_TOKEN: process.env.QSTASH_TOKEN || '',
  QSTASH_CURRENT_SIGNING_KEY: process.env.QSTASH_CURRENT_SIGNING_KEY || '',
  QSTASH_NEXT_SIGNING_KEY: process.env.QSTASH_NEXT_SIGNING_KEY || '',
  VERCEL_URL: process.env.VERCEL_URL || process.env.APP_URL || 'http://localhost:3000',
};
