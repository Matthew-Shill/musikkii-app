# Supabase (Musikkii)

CLI-managed Supabase project files: local config, migrations, and optional seed data.

| Path | Purpose |
|------|---------|
| `config.toml` | Local dev stack (ports, auth, DB major version, etc.) |
| `migrations/` | Versioned SQL migrations (source of truth for schema) |
| `seed.sql` | Optional data loaded after migrations on `supabase db reset` |

## Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (for `supabase start` / `supabase db reset`)

## Common commands (from repo root)

```bash
# Start local Supabase (Postgres, Studio, Auth, …)
supabase start

# Stop local stack
supabase stop

# Link this repo to your hosted project (stores ref in .supabase or project config — do not commit secrets)
supabase link --project-ref <YOUR_PROJECT_REF>

# Generate migration files from the linked remote schema
supabase db pull

# Apply migrations to local DB only (no new migration files)
supabase migration up

# Reset local DB: migrations + seed.sql
supabase db reset
```

The Vite app reads **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** from `.env` (see `.env.example` in the repo root). Those point at hosted or local API depending on how you develop.
