# ONE TAKE OS

Full-stack SaaS dashboard for a marketing & audiovisual studio: project management, kanban tasks, calendar, mini-CRM, performance metrics, Instagram analytics, integrations and an AI assistant.

## Stack

| App | Tech |
| --- | --- |
| `frontend/` | Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Recharts, Lucide |
| `backend/` | NestJS 10, Prisma (PostgreSQL), JWT auth (passport-jwt + bcrypt), class-validator, helmet, @nestjs/throttler |

## Prerequisites

- Node.js 18+ (the backend uses the global `fetch` API)
- npm 9+
- PostgreSQL 14+ (for the backend)

## Setup

Install all workspace dependencies from the repo root:

```bash
npm install
```

### Backend

1. Create the env file and adjust values:

   ```bash
   cd backend
   cp .env.example .env
   ```

   | Variable | Description |
   | --- | --- |
   | `DATABASE_URL` | PostgreSQL connection string |
   | `JWT_SECRET` / `JWT_EXPIRES_IN` | JWT signing secret and lifetime |
   | `OPENAI_API_KEY` | Optional — enables real OpenAI summaries; mocked responses are used when empty |
   | `ENCRYPTION_KEY` | 64-hex-char key used to AES-encrypt integration tokens |
   | `PORT` | API port (default `3001`) |

2. Create the database schema and seed it with demo data:

   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

   The seed creates 10 users, 7 clients, 6 projects, tasks, deadlines, Instagram metrics, notifications and integrations. Every seeded user has the password `onetake123` — log in with `ana@onetake.studio` (ADMIN).

3. Run the API:

   ```bash
   npm run start:dev    # http://localhost:3001
   ```

### Frontend

```bash
cd frontend
npm run dev            # http://localhost:3000
```

The UI currently renders from rich mock data in `frontend/src/data/` and is ready to be wired to the API.

### Run both at once

From the repo root:

```bash
npm run dev
```

## API overview

All routes require a `Bearer` token except `POST /auth/register` and `POST /auth/login`.

- `auth` — register, login, logout, `GET /auth/me`
- `users` — CRUD (mutations are ADMIN-only)
- `clients` — CRUD with pipeline statuses (NEW_LEAD … FINISHED)
- `projects` — CRUD plus `/:id/tasks`, `/:id/comments`, `/:id/files`, `/:id/activity`; status changes are logged
- `tasks` — CRUD plus `PATCH /tasks/:id/status` and `PATCH /tasks/:id/assign`; completing a task sets `completedAt`
- `deadlines`, `calendar/events` — CRUD
- `comments` — create/update/delete; creating notifies project participants
- `files` — metadata upload, fetch, delete
- `notifications` — list current user's, mark one/all read
- `metrics` — `/overview`, `/projects`, `/tasks`, `/instagram`, `/team` aggregations
- `instagram` — `/metrics`, `/sync` (placeholder), `/top-performing`, `/needs-improvement`
- `ai` — `project-summary`, `weekly-summary`, `task-priority`, `instagram-analysis`, `generate-report`, `GET /ai/summaries`
- `integrations` — list, `/:provider/connect|disconnect|sync|status` with AES-encrypted tokens
- `activity` — global feed and `/activity/project/:projectId`

## Project structure

```
frontend/src/app/          dashboard, projects(+detail), tasks, calendar,
                           clients, metrics, integrations, ai-assistant, settings
frontend/src/components/   layout (Sidebar, Topbar) and ui (cards, badges, modal, charts...)
frontend/src/data/         mock data powering the UI
backend/src/modules/       auth, users, clients, projects, tasks, deadlines, calendar,
                           comments, files, notifications, metrics, instagram, ai,
                           integrations, activity
backend/prisma/            schema.prisma + seed.ts
```
