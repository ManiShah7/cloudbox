# CloudBox

A modern cloud storage app I'm building to learn full-stack development with Next.js 15, Hono, and Prisma.

## Features

- **Authentication**: Register/login with JWT tokens (access + refresh)
- **File Management**: Drag & drop upload, folder organization, breadcrumb navigation
- **AI Analysis**: Automatic file categorization and tagging with Anthropic Claude
- **File Sharing**: Generate shareable links with expiration and view tracking
- **File Previews**: Image, PDF, and text file preview support
- **Search & Filter**: Search by name, filter by category and tags
- **Analytics**: Storage usage dashboard with charts and breakdowns
- **UI**: Glassmorphism design with blue/indigo gradients and Framer Motion animations

## Tech Stack

### Backend

- Hono.js
- PostgreSQL + Prisma
- MinIO for file storage
- Redis for sessions
- JWT for auth

### Frontend

- Next.js 15 with App Router
- React 19
- TanStack Query (React Query v5)
- Zustand for state
- shadcn/ui components
- Tailwind CSS 4
- Framer Motion

### Infra

- Turborepo monorepo
- Docker for local dev (postgres, redis, minio)
- pnpm

## Running Locally

### Option 1: Docker Development

**Prerequisites:** Docker Desktop

```bash
# Copy environment file
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start all services with hot reload
docker compose -f docker-compose.dev.yml up
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001
- MinIO Console: http://localhost:9001 (minioadmin / minioadmin)

To stop: `docker compose -f docker-compose.dev.yml down`

### Option 2: Local Development

**Prerequisites:** Node.js 20+, pnpm, PostgreSQL, Redis, MinIO

```bash
# Install dependencies
pnpm install

# Start services
docker compose up postgres redis minio -d

# Setup environment
cp .env.example .env
# Edit .env with your keys

# Run migrations
cd apps/api
pnpm prisma migrate deploy

# Start backend
pnpm dev

# Start frontend in new terminal
cd apps/web
pnpm dev
```

- Backend: http://localhost:3000
- Frontend: http://localhost:3001

## Production Deployment

```bash
# Build production images
docker compose build

# Start production stack
docker compose up -d

# Check logs
docker compose logs -f
```

Migrations run automatically on API container startup.

## Project Structure

```
cloudbox/
├── apps/
│   ├── api/                      # Hono backend
│   │   ├── src/
│   │   │   ├── routes/          # API route handlers
│   │   │   ├── lib/             # Utilities (prisma, minio, auth)
│   │   │   ├── middleware/      # Auth middleware
│   │   │   └── index.ts         # Server entrypoint
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── migrations/      # Database migrations
│   │   ├── Dockerfile           # Production API image
│   │   └── docker-entrypoint.sh # Migration runner
│   └── web/                     # Next.js frontend
│       ├── src/
│       │   ├── app/             # App router pages
│       │   ├── components/      # React components
│       │   ├── lib/             # API client, queries, stores
│       │   └── styles/          # Global styles
│       ├── Dockerfile           # Production web image
│       └── next.config.ts       # Next.js configuration
├── packages/
│   └── shared/                  # Shared TypeScript types
│       └── src/
│           ├── types/           # Prisma-generated types
│           ├── schemas/         # Zod validation schemas
│           └── utils/           # Shared utilities
├── docker-compose.yml           # Production deployment
├── docker-compose.dev.yml       # Development environment
├── .env.example                 # Environment variables template
└── pnpm-workspace.yaml          # Monorepo configuration
```
