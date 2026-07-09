# ContentFlow - Backend Services

This directory contains the core engine for ContentFlow: an Express REST API and a BullMQ background worker powered by Redis and PostgreSQL.

## ⚡ Architecture & Features

- **DAG Execution Engine:** Uses a BFS algorithm to traverse the workflow graph and execute steps sequentially.
- **Contentful Secure Webhooks:** Implements cryptographic signature verification (`x-contentful-signature`) to ensure all incoming triggers are authentically from Contentful.
- **Built-in Integrations:** 
  - **OpenAI/Anthropic:** AI-powered translations and content generation using the Vercel AI SDK.
  - **Contentful Write-Back:** Automatically updates Contentful entries via the Content Management API (CMA).
  - **Slack Notify:** Webhook-based Slack alerts.
- **Granular Execution Logging:** Every node in the DAG reports its exact start time, end time, inputs, outputs, and errors for crystal-clear observability.

## 🛠️ Tech Stack

- **Runtime:** Node.js v20
- **Database:** PostgreSQL (with `pg` driver)
- **Queue & Cache:** Redis + BullMQ
- **Validation:** Zod
- **Testing:** Jest + Supertest

## 🚀 Local Development

First, ensure your environment variables are configured in `src/.env` (use the provided `.env.example` as a baseline). Ensure PostgreSQL and Redis are running (or use `docker-compose up postgres redis` from the root).

```bash
# Install dependencies
npm ci

# Run the REST API server (runs on port 3000 by default)
npm run start:api

# Run the background workflow processor
npm run start:worker

# Run the test suite
npm test
```
