# ContentFlow - Backend Services

This directory contains the core engine for ContentFlow: a serverless-compatible Express REST API integrated with Upstash QStash for background queueing and PostgreSQL for workflow storage.

## ⚡ Architecture & Features

- **DAG Execution Engine:** Uses a BFS algorithm to traverse the workflow graph and execute steps sequentially.
- **Contentful Secure Webhooks:** Implements cryptographic signature verification (`x-contentful-signature`) to ensure all incoming triggers are authentically from Contentful.
- **QStash Queue & Webhooks:** Replaces traditional persistent queue workers with serverless-friendly QStash webhooks, featuring signature verification for secure callback execution.
- **Built-in Integrations:** 
  - **OpenAI/Anthropic:** AI-powered translations and content generation using the Vercel AI SDK.
  - **Contentful Write-Back:** Automatically updates Contentful entries via the Content Management API (CMA).
  - **Slack Notify:** Webhook-based Slack alerts.
- **Granular Execution Logging:** Every node in the DAG reports its exact start time, end time, inputs, outputs, and errors for crystal-clear observability.

## 🛠️ Tech Stack

- **Runtime:** Node.js v20
- **Database:** PostgreSQL (with `pg` driver)
- **Queue:** Upstash QStash
- **Validation:** Zod
- **Testing:** Jest + Supertest

## 🚀 Local Development

First, ensure your environment variables are configured in `src/.env` (use the provided `.env.example` as a baseline). Ensure PostgreSQL is running (or use `docker-compose up postgres` from the root).

### Additional Environment Variables
For QStash queue integration:
- `QSTASH_TOKEN`: Your Upstash QStash REST token.
- `QSTASH_CURRENT_SIGNING_KEY`: The current signing key used to verify webhook signatures.
- `QSTASH_NEXT_SIGNING_KEY`: The next signing key for key rotation.
- `VERCEL_URL` (or `APP_URL`): The public URL of your server (e.g., ngrok tunnel or Vercel deployment URL) so QStash can send webhook callbacks to your API.

```bash
# Install dependencies
npm ci

# Run the REST API server (runs on port 3000 by default)
npm start

# Run the test suite
npm test
```
