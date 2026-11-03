# Toolspace

Toolspace is a founder-focused place to discover useful business tools, use small utilities on the platform, and request tools that are missing.

The project has two separate applications:

- **Frontend:** Next.js and JavaScript, running at `http://localhost:3000`.
- **Backend:** Express.js and TypeScript, running at `http://localhost:4000` and backed by PostgreSQL through Prisma.

The frontend only talks to the Express API. Database credentials belong in the backend environment file and must never be added to frontend variables.

## What’s included

- Browse tools by search, category, and pricing; open tool details.
- Submit tool requests and follow their status.
- Browse the public roadmap and vote using an anonymous browser-generated key.
- Use the tools available in the Toolspace catalog.

Request ownership and the anonymous voting key are stored in the visitor’s browser. There is no account or authentication system yet.

## Requirements

- Node.js 22.6 or newer
- npm
- A PostgreSQL database for database-backed API routes

## Run locally

Install dependencies separately for the frontend and backend:

```powershell
# From the project root
npm install

# Backend dependencies
cd backend
npm install
cd ..
```

### Configure the frontend

From the project root, create `.env.local` from the example:

```powershell
Copy-Item .env.example .env.local
```

The example points the frontend at the local API:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Change this only if your backend is running at a different address. Do not put the PostgreSQL connection string here.

### Configure the backend

Create `backend/.env` from its example:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set `DATABASE_URL` in `backend/.env` to your PostgreSQL connection string. For Supabase, use the connection string provided by your project’s database settings. Keep the file private; `.env` files are gitignored.

The other backend settings are:

```env
PORT=4000
FRONTEND_ORIGIN=http://localhost:3000
```

`FRONTEND_ORIGIN` controls which browser origin may call the API. Set it to your deployed frontend origin in production.

Generate Prisma Client after configuring the backend:

```powershell
cd backend
npm run prisma:generate
```

If you are connecting a new or empty development database, apply the schema with:

```powershell
npm run db:migrate
```

Skip that migration command when using a database whose schema has already been applied.

### Start the apps

Open two terminals from the project root.

**Terminal 1 — backend:**

```powershell
cd backend
npm run dev
```

**Terminal 2 — frontend:**

```powershell
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The backend health endpoint is [http://localhost:4000/api/health](http://localhost:4000/api/health) and should return a JSON success response.

## API overview

All endpoints are served by the Express backend under `/api`:

| Purpose | Endpoints |
| --- | --- |
| Health | `GET /api/health` |
| Categories | `GET /api/categories`, `GET /api/categories/:slug` |
| Tools | `GET /api/tools`, `GET /api/tools/:slug` |
| Requests | `POST /api/requests`, `GET /api/requests`, `GET /api/requests/:id` |
| Public roadmap | `GET /api/roadmap` |
| Votes | `POST /api/requests/:id/votes`, `DELETE /api/requests/:id/votes`, `GET /api/requests/:id/votes/me?voterKey=...` |

Tool search and request listing support pagination. Roadmap votes use a browser-generated `voterKey`; this is an anonymous prototype mechanism, not strong identity verification.

## Useful commands

Run from the project root for frontend checks:

```powershell
npm run build
npm run lint
```

Run from `backend/` for backend checks and Prisma tools:

```powershell
npm run build
npm run prisma:validate
npm run prisma:generate
npm run db:studio
```
