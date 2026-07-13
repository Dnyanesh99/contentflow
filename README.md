# ContentFlow

**🌍 Live Application:** [https://contentflow-prod.vercel.app/](https://contentflow-prod.vercel.app/)

ContentFlow is an enterprise-grade workflow automation engine built for Contentful CMS. It empowers developers and editors to visually orchestrate powerful actions—like AI translations, Slack notifications, and Contentful CMA write-backs—whenever content is published.

## 🏗️ Monorepo Architecture

This project is built using a modern, scalable monorepo structure separating the UI from the heavy-lifting backend processes:

- **[Frontend (UI)](./frontend/README.md)**: A stunning, glassmorphism-inspired React application built with Vite and Contentful's Forma 36 design system.
- **[Server (API)](./server/README.md)**: A serverless-compatible Express API integrated with Upstash QStash for asynchronous, durable workflow execution.

## 🚀 Quickstart (Docker Compose)

The easiest way to spin up the entire ecosystem (Postgres, API, and Frontend) locally is using Docker Compose.

```bash
# Start the entire infrastructure in detached mode
docker-compose up -d

# View logs to ensure everything is running smoothly
docker-compose logs -f
```

- **Frontend UI:** `http://localhost:80`
- **Backend API:** `http://localhost:3000`

## 🛡️ CI/CD

This project is configured with a strict, automated CI/CD pipeline via GitHub Actions.
- **Frontend** is deployed automatically to Vercel.
- **Backend (API)** is deployed as Vercel Serverless Functions, with background tasks managed by Upstash QStash.
