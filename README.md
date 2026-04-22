# Musikkii App

Web-first Vite + React dashboard for Musikkii.

## Scripts

- `npm install` — install dependencies
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run typecheck` — TypeScript (`tsc --noEmit`)
- `npm run seed:sync-env` — write **`.env.seeding.local`** from `supabase status` (run after `supabase start`; avoids copy/paste errors)
- `npm run seed:dev-users` — create/update **local/dev** test users **and** scheduling/credits fixtures (see [docs/testing/test-accounts.md](./docs/testing/test-accounts.md))

## Environment

Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project (Settings → API), or from `supabase status` when running the stack locally.

## Supabase

Database migrations and CLI config live in [`supabase/`](./supabase/README.md). The browser client is [`src/lib/supabase.ts`](./src/lib/supabase.ts); session and profile loading live in `AuthSessionProvider`.

## Documentation

Planning and architecture notes are under [`docs/`](./docs/README.md).
