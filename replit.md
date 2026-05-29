# Ecole Saint Hannibal — School Website & CMS

A complete bilingual (French/English) school website and admin CMS for Ecole Saint Hannibal, a nursery & primary school in Kigali, Rwanda.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, served at /api)
- `pnpm --filter @workspace/school-website run dev` — run the frontend (auto-port, served at /)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — reseed the database

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind v4 + Wouter (routing)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Auth: JWT (bcryptjs) — localStorage key `esh_admin_token`
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/school-website/src/` — React frontend
  - `pages/` — public pages (Home, News, Events, Gallery, Contact, Admissions, Resources, About, Academics)
  - `pages/admin/` — admin CMS pages (Dashboard, News, Events, Slides, Gallery, Staff, Classes, Downloads, Messages, Settings, Users, Activity)
  - `components/` — Navbar, Footer, PublicLayout, AdminLayout, LanguageToggle
  - `contexts/` — LanguageContext (FR/EN), AdminAuthContext
- `artifacts/api-server/src/routes/` — all API routes
- `lib/db/src/schema.ts` — Drizzle DB schema (source of truth)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for codegen)
- `lib/api-client-react/src/generated/api.ts` — generated hooks (DO NOT hand-edit)
- `scripts/src/seed.ts` — database seed script

## Architecture decisions

- Contract-first API: OpenAPI spec → Orval codegen → typed React Query hooks
- Bilingual content: all user-facing text stored as FR + EN columns; `useLang()` picks at render time
- Admin JWT stored in localStorage (`esh_admin_token`); auto-injected by `custom-fetch.ts`
- News routes use unusual paths: `PATCH /news/:id/update` and `DELETE /news/:id/delete` (to avoid OpenAPI collision with `GET /news/:slug`)
- Announcement banner controlled by `announcementBanner` + `announcementActive` settings keys

## Product

**Public site (bilingual FR/EN):**
- Home: hero slider, animated stats, director message, news cards, events calendar, gallery teaser, testimonials, admissions CTA, map
- About: overview, values, → Mission/Vision, History (timeline), Staff directory
- Academics: Nursery section (N1–N3), Primary section (P1–P6), Curriculum, Timetables, Class detail pages
- News: listing with category filter, article detail (HTML body)
- Events: listing with type/status, event detail
- Gallery: albums grid, album lightbox
- Admissions: enrollment process, required docs, fee table
- Resources: downloadable documents with category filter
- Contact: form (saves to DB), WhatsApp link, Google Maps embed

**Admin CMS (`/admin`):**
- Dashboard with stats, recent activity log
- Full CRUD for: Slides, News articles, Events, Gallery albums+photos, Staff, Classes, Downloads
- Contact messages inbox (mark read/unread, reply by email)
- Site settings (school info, contact, social, admissions toggle, announcement banner)
- Admin user management (create/edit/delete, roles: super/editor/viewer)

## Default admin credentials

- Email: `admin@ecolesainthannibal.rw`
- Password: `ESH@Admin2025!`

## User preferences

- Royal Blue `#1A5276` + Gold `#F4D03F` — school brand colors
- Fonts: Playfair Display (headings) + Inter (body)
- Always bilingual: French primary, English secondary

## Gotchas

- News PATCH/DELETE use `/news/:id/update` and `/news/:id/delete` — not the standard REST paths
- `pnpm run dev` at workspace root is disabled by design — use workflows or per-package commands
- `bcryptjs` is added as a direct dep in `scripts/package.json` (not in catalog)
- DB schema: 12 tables — slides, news_articles, events, gallery_albums, gallery_items, staff_members, classes, downloads, contact_messages, admin_users, activity_log, site_settings

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
