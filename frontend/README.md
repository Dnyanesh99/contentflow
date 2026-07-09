# ContentFlow - Frontend UI

This directory contains the user interface for ContentFlow. Designed with a premium "dark mode glassmorphism" aesthetic, it looks and feels like a native, enterprise-grade extension of Contentful.

## ✨ Features

- **Interactive Workflow Canvas:** Built on `reactflow` for buttery-smooth drag-and-drop node connections.
- **Contentful Forma 36 Design System:** Deeply integrates `@contentful/f36-components` and `@contentful/f36-tokens` for a seamless Contentful ecosystem experience.
- **Visual Node Palette:** An intuitive sidebar palette to drag and drop Triggers, Slack notifications, AI Prompts, and Write-back nodes.
- **Real-Time Execution Logs:** A collapsible side-panel that visualizes exactly how a workflow executed in the backend, broken down step-by-step with inputs, outputs, and status badges.
- **Multi-language Support:** Integrated `react-i18next` for seamless localization (EN, DE, FR).

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Styling:** Emotion + Vanilla CSS + Forma 36 Design Tokens
- **State Management:** Zustand + React Query
- **Form Validation:** React Hook Form + Zod

## 🚀 Local Development

```bash
# Install dependencies
npm ci

# Start the Vite development server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

## 🌐 Deployment

This static application is optimized for deployment on Vercel. Because the UI requires no long-lived server connections, it can be hosted entirely on Vercel's global edge network for maximum performance.
