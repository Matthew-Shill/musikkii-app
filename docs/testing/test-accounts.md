# Local / dev test accounts

These accounts exist **only** for local Supabase (`supabase start`) or a **dedicated non-production** project you control. They use fake `@musikkii.test` emails and a single shared **LOCAL DEV ONLY** password.

## Password (LOCAL DEV ONLY)

```
LocalDev-ONLY-2026-Musikkii!
```

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

## Developer role override (UI)

When signed in, the header role switcher writes a **session-only** override (`sessionStorage`, key `musikkii_dev_role_override`) so you can preview another role without changing the database. Choosing the same role as your database `app_role` again clears the override. **Settings → Account** shows when an override is active and offers **Clear override** to restore the database `app_role` as the effective role.
