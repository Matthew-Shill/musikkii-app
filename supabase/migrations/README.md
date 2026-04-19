# Migrations

This directory holds the ordered SQL migration history for Musikkii. **Do not add placeholder migrations**; only real schema changes from your team or from syncing with Supabase.

## Bring existing remote history into this repo

You need the [Supabase CLI](https://supabase.com/docs/guides/cli) and access to your hosted project.

### Option A — Link and pull (recommended when the remote is the source of truth)

From the repository root:

```bash
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase db pull
```

`db pull` writes new files under `supabase/migrations/` reflecting the current remote schema. Review the generated SQL, then commit.

### Option B — Copy migration files you already have

If migrations already exist elsewhere (another repo or export), copy the `*.sql` files into `supabase/migrations/` preserving timestamped filenames so order stays correct, then verify with:

```bash
supabase db reset
```

(Requires Docker for local Postgres.)

### Align local Postgres version

Edit `supabase/config.toml` → `[db]` → `major_version` so it matches your hosted database major version (check in the Supabase dashboard or with `SHOW server_version;` on the remote).
