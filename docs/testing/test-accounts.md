# Local / dev test accounts

These accounts exist **only** for local Supabase (`supabase start`) or a **dedicated non-production** project you control. They use fake `@musikkii.test` emails and a single shared **LOCAL DEV ONLY** password.

## Password (LOCAL DEV ONLY)

**Seeding (Node)** reads, in order:

1. `DEV_SEED_PASSWORD` or `VITE_DEV_SEED_PASSWORD` from `.env` / `.env.local` (loaded by the seed script), or  
2. this built-in default (LOCAL ONLY):

```
LocalDev-ONLY-2026-Musikkii!
```

**Dev account switcher (Vite app)** needs the same password in **`VITE_DEV_SEED_PASSWORD`** inside **`.env.local`** (or `.env` if you accept it is not gitignored in your workflow). Vite only exposes variables prefixed with `VITE_` to the browser. Set it to the same value you use for seeding so one-line sign-in works.

Do not reuse this password anywhere real. Do not point the seed script at production.

## Service role key (required for `npm run seed:dev-users`)

The value of **`SUPABASE_SERVICE_ROLE_KEY` must be the real service role secret**, not placeholder text.

- After `supabase start`, run **`supabase status`** in the same project directory.
- Copy **Secret** / **service_role** from the output. It may look like either:
  - **`sb_secret_…`** (newer Supabase CLI), or
  - a **JWT** (three dot-separated segments, often starting with `eyJ`).
- Put **one line** in `.env.seeding.local`:

  `SUPABASE_SERVICE_ROLE_KEY=…`

- Do **not** use placeholder text or the **anon** / **publishable** key (`sb_publishable_…`).

If the seed script prints `bad_jwt` or `invalid number of segments`, you likely pasted the wrong key (e.g. anon) or a truncated JWT.

## Accounts

| Email | `profiles.app_role` | Notes |
|-------|----------------------|--------|
| `adult-student.dev@musikkii.test` | `adult-student` | Default learner-style |
| `parent.dev@musikkii.test` | `parent` | Household / guardian |
| `teacher.dev@musikkii.test` | `teacher` | Instructor |
| `teacher-manager.dev@musikkii.test` | `teacher-manager` | Manager scope (see migrations) |
| `admin.dev@musikkii.test` | `admin` | Operations-style |
| `executive.dev@musikkii.test` | `executive` | Leadership-style |
| `child-student.dev@musikkii.test` | `child-student` | Learner (child) |
| `family.dev@musikkii.test` | `family` | Multi-student household |

## Recreate after `supabase db reset`

### Easiest (recommended): generate `.env.seeding.local` from the CLI

From the repo root, with **`supabase start`** already running:

```bash
npm run seed:sync-env
npm run seed:dev-users
```

`seed:sync-env` runs `supabase status --output json` and writes **`SUPABASE_URL`** and **`SUPABASE_SERVICE_ROLE_KEY`** (the `SERVICE_ROLE_KEY` JWT from the JSON) into `.env.seeding.local`, so you avoid copy/paste mistakes and editor-vs-disk drift.

### Manual alternative

1. Ensure **`.env`** or **`.env.local`** has `VITE_SUPABASE_URL=…` (or `SUPABASE_URL=…`).
2. Put **`SUPABASE_SERVICE_ROLE_KEY=`** in **`.env.seeding.local`** with the **service_role** JWT from `supabase status` or the dashboard (`sb_secret_…` or `eyJ…` three-part JWT). Save the file before running `npm run seed:dev-users`.
3. Sign in at `/sign-in` with any account row below and the password above.

The seed script loads **`.env` first**, then **`.env.seeding.local`** (so the URL can live next to the Vite app; the service role stays separate).

The script is idempotent: existing users get their `profiles.app_role` refreshed.

## Role preview (signed-out / no Supabase only)

When **not** signed in with a configured Supabase client, the shell header may show **Preview as** so you can click through the UI with different role families. **After sign-in, navigation and permissions use only `profiles.app_role`** — there is no header role switcher and no `sessionStorage` role override for authenticated sessions (legacy key is cleared on login).

## Dev account switcher (Vite dev server only)

When `import.meta.env.DEV` is true (`npm run dev`), the app shows a **Dev only — test accounts** panel on **`/sign-in`** only. It calls `signOut` then `signInWithPassword` for the selected `@musikkii.test` user so auth, `profiles`, and protected routes behave like a real login. While signed in, use the **Sign out** control in the header (amber outline, dev-only) to return to **`/sign-in`**.

Production builds (`npm run build`) set `import.meta.env.DEV` to false, so this UI is not rendered and the lazy-loaded dev chunk is never requested.

Requires the same password you used when seeding: set **`VITE_DEV_SEED_PASSWORD`** or **`DEV_SEED_PASSWORD`** in **`.env.local` at the repo root** (next to `vite.config.ts`). **`DEV_SEED_PASSWORD` alone is enough in dev** — Vite merges it for the switcher via `vite.config.ts`. **Save `.env.local` to disk** (Vite only reads what is written to the file — an unsaved editor tab looks fine in the IDE but is still empty on disk). **Restart `npm run dev`** after any change to env files (Vite reads them at startup).

Account list lives in `src/app/dev/dev-seed-accounts.ts` and must stay aligned with `scripts/seed-dev-test-users.ts`.

For role-by-role verification of auth, nav, and dashboards, see **`docs/testing/role-smoke-checklist.md`**.

## Students page (signed-in, real vs mock)

With Supabase configured, **`/students`** loads a **real roster** per role family (see checklist §8): household uses visible **`students`** rows; instructors use active **`teacher_student_assignments`**; admin/executive use a capped **`students`** list. **Still mock / placeholder:** per-row email, phone, location, lesson cadence, attendance %, makeup credit numbers, upcoming lesson text, notes, and the Message / View Attendance / etc. buttons (UI only). **Signed-out preview** does not exercise this path; use a seeded account and the dev switcher on **`/sign-in`**.

## Calendar page (signed-in, real vs mock)

**`/calendar`** uses the same **`useDashboardLessons`** hook as the dashboards (checklist §9): real **upcoming / schedule / completed** lists from RLS-visible rows; week and month grids are driven by those rows. **List row** (click the main block), **week**, and **month** open the same **read-only detail** built from that hook: **teacher / student** (— if RLS hides **`profiles`**), **exact start–end**, **database `status`**, **modality** + raw value, **focus**, **notes**, **lesson id**; **local preview** status only after non-persisting modal actions. **Learner / household:** **Reschedule now** uses self-reschedule RPCs (segments, exceptions, lessons); **Save as make-up credit** uses **`commit_student_lesson_to_makeup_credit`** → **`makeup_credits`** + lesson **`cancelled`** (24h+ only); **`useLessonIntentEvents`** powers **NML** and teacher message reschedule. Under **24h**, self-reschedule + make-up conversion RPCs reject; use **NML**. **`/teacher-availability`:** teachers / admins edit availability (checklist §10). **Settings:** read-only **make-up credits** list. **Placeholder:** redeem credit to a new lesson; **Requests** / **Operations** tabs; list-row **LessonActions**; modal footer confirm/cancel; **Watch recording** disabled.
