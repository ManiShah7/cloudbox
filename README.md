# CloudBox

A modern cloud storage app I'm building to learn full-stack development with Next.js 15, Hono, and Prisma.

## What's Working So Far

- **Auth**: Register/login with JWT tokens (access + refresh).
- **File Upload**: Drag & drop or click to upload. Files go to MinIO (S3-compatible storage). Works smoothly!
- **Folders**: Create folders, navigate into them, breadcrumb navigation. Delete stuff with confirmation dialogs.
- **UI**: Went for a glassmorphism look with blue/indigo gradients. Framer Motion for animations.

## TODO

- AI stuff for organizing files
- File previews
- Version control for files
- Sharing and collaboration features
- Search functionality

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

```bash
# Install deps
pnpm install

# Start docker services
docker-compose up -d

# Run migrations
cd apps/api
pnpm db:push

# Start backend
pnpm dev

# Start frontend (new terminal)
cd apps/web
pnpm dev
```

Backend: http://localhost:3000
Frontend: http://localhost:3001

## Project Structure

```
cloudbox/
├── apps/
│   ├── api/          # Hono backend
│   └── web/          # Next.js frontend
├── packages/
│   └── shared/       # Shared types from Prisma
└── docker-compose.yml
```
