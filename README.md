# ContentFlow

ContentFlow is an enterprise-grade workflow automation engine built for Contentful CMS. It empowers developers and editors to visually orchestrate powerful actions—like AI translations, Slack notifications, and Contentful CMA write-backs—whenever content is published.

## 🏗️ Monorepo Architecture

This project is built using a modern, scalable monorepo structure separating the UI from the heavy-lifting backend processes:

- **[Frontend (UI)](./frontend/README.md)**: A stunning, glassmorphism-inspired React application built with Vite and Contentful's Forma 36 design system.
- **[Server (API & Worker)](./server/README.md)**: A robust Node.js backend featuring an Express API and a high-performance BullMQ worker for executing Directed Acyclic Graph (DAG) workflows.

## 🚀 Quickstart (Docker Compose)

The easiest way to spin up the entire ecosystem (Postgres, Redis, API, Worker, and Frontend) locally is using Docker Compose.

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
- **Frontend** is deployed automatically to Vercel's global Edge network.
- **Backend (API & Worker)** is deployed as persistent, zero-downtime Docker containers on Railway/Render.
