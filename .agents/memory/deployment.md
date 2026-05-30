---
name: Deployment (Vercel + Railway)
description: How this monorepo is split-deployed (frontend on Vercel, API on Railway) and the non-obvious gotchas.
---

# Deployment: Vercel (frontend) + Railway (API) + PostgreSQL

The monorepo is deployed split: the Vite frontend on Vercel, the Express API on
Railway, PostgreSQL on Railway/Neon. Config lives in root `vercel.json`,
`railway.json`, `.nvmrc`.

## Why this split
**Why:** The API (`@workspace/api-server`) is a persistent Express server that
uses pino worker threads — unsuitable for Vercel serverless. It belongs on a
persistent-Node host (Railway). Vercel only serves the static frontend build.

## Vercel gotcha — Root Directory must be repo root (blank)
The single biggest repeated failure: Vercel's project **Root Directory** was set
to `artifacts/api-server`, so Vercel kept building the API (and failing on its
own auto-typecheck of `pino-http`) instead of the frontend.
**How to apply:** Keep Vercel Root Directory = repo root (blank) so the root
`vercel.json` is authoritative. Frontend build output is nested at
`artifacts/school-website/dist/public` (must be set as `outputDirectory`, not
just `public`/`dist`). SPA catch-all rewrite `/(.*) -> /index.html` is required
or deep links 404 on refresh.

## Railway — esbuild bundle dodges the tsc error
Railway builds via `pnpm --filter @workspace/api-server run build` which is
esbuild only (no `tsc`), so it does NOT hit the Vercel-style type errors. The
bundle (`artifacts/api-server/dist/index.mjs`) is self-contained, so runtime
works even if node_modules is pruned.

## Required production env vars (API on Railway)
`DATABASE_URL`, `JWT_SECRET` (API throws at boot in production without it),
`FRONTEND_URL` (CORS origin-locks to it; falls back to permissive `origin:true`
if missing), `PORT` (Railway provides), `NODE_ENV=production`.
DB client (`lib/db/src/index.ts`) does not force SSL — for Neon append
`?sslmode=require` to `DATABASE_URL`; Railway internal Postgres needs no SSL.

## Frontend ↔ API wiring
Frontend reads `VITE_API_BASE_URL` at **build time** (`src/main.tsx` →
`setBaseUrl`), prepended to relative `/api` paths in `custom-fetch.ts`. Set it
in Vercel to the Railway API URL, then redeploy (build-time, so a rebuild is
required for changes to take effect).
