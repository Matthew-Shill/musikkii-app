/**
 * Creates or updates LOCAL/DEV-only test users in Supabase Auth + public.profiles.
 *
 * Usage (from repo root):
 *   1. `.env` or `.env.local` — VITE_SUPABASE_URL or SUPABASE_URL (same as the app).
 *   2. `.env.seeding.local` — SUPABASE_SERVICE_ROLE_KEY from `supabase status` (see .env.seeding.example).
 *   3. npm run seed:dev-users
 *
 * Never run against production with real user data. Password: `DEV_SEED_PASSWORD` / `VITE_DEV_SEED_PASSWORD` or default in docs/testing/test-accounts.md
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

/** Repo root (parent of `scripts/`), not `process.cwd()` — fixes wrong cwd from some runners. */
const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Merge env vars from a file into `process.env` (later files overwrite).
 * Strips UTF-8 BOM — without this, `dotenv.config()` can miss the first variable on macOS editors.
 */
function mergeEnvFile(filePath: string) {
  if (!existsSync(filePath)) return;
  let raw = readFileSync(filePath, 'utf8');
  raw = raw.replace(/^\uFEFF/, '');
  const parsed = parse(raw);
  for (const [k, v] of Object.entries(parsed)) {
    if (v === undefined) continue;
    const t = String(v).trim();
    if (t === '') continue;
    process.env[k] = t;
  }
}

mergeEnvFile(resolve(repoRoot, '.env'));
mergeEnvFile(resolve(repoRoot, '.env.local'));
mergeEnvFile(resolve(repoRoot, '.env.seeding.local'));

function pickEnv(...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = process.env[k]?.trim();
    if (v) return v;
  }
  return undefined;
}

/** Strip wrapping quotes from .env values */
function unquoteEnv(s: string | undefined): string | undefined {
  if (!s) return undefined;
  let t = s.trim();
  if ((t.startsWith('"') && t.endsWith('"')) || (t.startsWith("'") && t.endsWith("'"))) {
    t = t.slice(1, -1).trim();
  }
  return t || undefined;
}

const SUPABASE_URL = unquoteEnv(pickEnv('SUPABASE_URL', 'VITE_SUPABASE_URL'));
/** `SERVICE_ROLE_KEY` matches the JSON field name from `supabase status` — some people copy it as the env name. */
const SERVICE_KEY = unquoteEnv(pickEnv('SUPABASE_SERVICE_ROLE_KEY', 'SERVICE_ROLE_KEY'));

/**
 * Supabase **service_role** can be either:
 * - Legacy JWT (`eyJ…` with three dot-separated segments), or
 * - New secret format (`sb_secret_…` from recent CLI / dashboard).
 */
function assertPlausibleServiceRoleKey(secret: string) {
  const s = secret.trim();
  if (!s) {
    console.error('\nSUPABASE_SERVICE_ROLE_KEY is empty after trimming.');
    process.exit(1);
  }

  if (s === 'PASTE_LOCAL_SECRET_HERE' || s.includes('PASTE_LOCAL_SECRET')) {
    console.error(
      '\n`.env.seeding.local` on disk still contains the **placeholder** text, not your real secret.\n' +
        'Your editor may show a different value until you **save** (Cmd+S / Ctrl+S).\n\n' +
        'Replace the value after `=` with the **service_role** line from `supabase status`:\n' +
        '  • `sb_secret_…` (newer CLI), or\n' +
        '  • a JWT with three dot-separated parts (`eyJ…`).\n\n' +
        'Check file size: `wc -c .env.seeding.local` — it should be much larger than a placeholder line.\n'
    );
    process.exit(1);
  }

  if (s.startsWith('sb_publishable_')) {
    console.error(
      '\nThat value is a **publishable (anon) key**, not the service role secret.\n' +
        'Use **service_role** / **Secret** from `supabase status` or Dashboard → API.'
    );
    process.exit(1);
  }

  if (s.startsWith('sb_secret_') && s.length >= 32) {
    return;
  }

  const parts = s.split('.');
  if (parts.length === 3 && parts.every((p) => p.length > 0)) {
    return;
  }

  if (
    s === 'PASTE_LOCAL_SECRET_HERE' ||
    /^PASTE|PLACEHOLDER|changeme$/i.test(s) ||
    /^your-secret-here$/i.test(s) ||
    s.length < 24
  ) {
    console.error(
      '\nSUPABASE_SERVICE_ROLE_KEY does not look like a real service role secret.\n' +
        'Use the **service_role** value from `supabase status` or the project API settings:\n' +
        '  • `sb_secret_…` (newer CLI), or\n' +
        '  • a JWT with three dot-separated parts (often starts with `eyJ`).'
    );
    process.exit(1);
  }

  console.error(
    '\nSUPABASE_SERVICE_ROLE_KEY is not a recognized shape.\n' +
      'Expected `sb_secret_…` (32+ chars) or a JWT with three dot-separated segments.\n'
  );
  process.exit(1);
}

/** LOCAL DEV ONLY — override with `DEV_SEED_PASSWORD` or `VITE_DEV_SEED_PASSWORD` in `.env` / `.env.local`. */
const DEFAULT_DEV_PASSWORD = 'LocalDev-ONLY-2026-Musikkii!';
const DEV_PASSWORD =
  pickEnv('DEV_SEED_PASSWORD', 'VITE_DEV_SEED_PASSWORD') ?? DEFAULT_DEV_PASSWORD;

const ACCOUNTS = [
  { email: 'adult-student.dev@musikkii.test', app_role: 'adult-student', full_name: 'Dev Adult Student' },
  { email: 'parent.dev@musikkii.test', app_role: 'parent', full_name: 'Dev Parent' },
  { email: 'teacher.dev@musikkii.test', app_role: 'teacher', full_name: 'Dev Teacher' },
  { email: 'teacher-manager.dev@musikkii.test', app_role: 'teacher-manager', full_name: 'Dev Teacher Manager' },
  { email: 'admin.dev@musikkii.test', app_role: 'admin', full_name: 'Dev Admin' },
  { email: 'executive.dev@musikkii.test', app_role: 'executive', full_name: 'Dev Executive' },
  { email: 'child-student.dev@musikkii.test', app_role: 'child-student', full_name: 'Dev Child Student' },
  { email: 'family.dev@musikkii.test', app_role: 'family', full_name: 'Dev Family Account' },
] as const;

async function findUserIdByEmail(
  admin: ReturnType<typeof createClient>,
  email: string
): Promise<string | null> {
  let page = 1;
  const perPage = 1000;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found.id;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function ensureUser(
  admin: ReturnType<typeof createClient>,
  acc: (typeof ACCOUNTS)[number]
): Promise<string> {
  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email: acc.email,
    password: DEV_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: acc.full_name },
  });

  if (!createErr && created.user) {
    return created.user.id;
  }

  const msg = createErr?.message?.toLowerCase() ?? '';
  const duplicate =
    msg.includes('already') ||
    msg.includes('registered') ||
    (createErr as { code?: string } | undefined)?.code === 'email_exists';

  if (duplicate) {
    const id = await findUserIdByEmail(admin, acc.email);
    if (id) return id;
    throw new Error(`User exists but could not be listed: ${acc.email}`);
  }

  throw createErr ?? new Error(`createUser failed for ${acc.email}`);
}

async function upsertProfile(
  admin: ReturnType<typeof createClient>,
  userId: string,
  acc: (typeof ACCOUNTS)[number]
) {
  for (let i = 0; i < 8; i++) {
    const { error } = await admin.from('profiles').upsert(
      {
        id: userId,
        app_role: acc.app_role,
        full_name: acc.full_name,
        is_active: true,
      },
      { onConflict: 'id' }
    );
    if (!error) return;
    if (i === 7) throw error;
    await new Promise((r) => setTimeout(r, 200));
  }
}

async function main() {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    const missUrl = !SUPABASE_URL;
    const missKey = !SERVICE_KEY;
    console.error(
      missUrl && missKey
        ? 'Missing both API URL and SUPABASE_SERVICE_ROLE_KEY.'
        : missUrl
          ? 'Missing API URL (SUPABASE_URL or VITE_SUPABASE_URL).'
          : 'Missing service role JWT for admin API.\n\n' +
              'Add to `.env.seeding.local` (one line, no spaces around `=`):\n' +
              '  SUPABASE_SERVICE_ROLE_KEY=<full JWT from supabase status>\n' +
              'Or:\n' +
              '  SERVICE_ROLE_KEY=<same JWT>\n' +
              'Run `supabase status` after `supabase start` and copy the **service_role** secret (three dot-separated parts, usually starts with eyJ).'
    );
    console.error('\nReference:\n' +
        '  • API URL: VITE_SUPABASE_URL or SUPABASE_URL in `.env` or `.env.local`.\n' +
        '  • Service role: `SUPABASE_SERVICE_ROLE_KEY` or `SERVICE_ROLE_KEY` in `.env.seeding.local`.\n' +
        '  • Use KEY=value (no spaces around =). No `export ` prefix.\n\n' +
        'Diagnostics (no secret values shown):'
    );
    console.error('  repoRoot (env files loaded from here):', repoRoot);
    console.error('  process.cwd():', process.cwd());
    for (const name of ['.env', '.env.local', '.env.seeding.local'] as const) {
      const p = resolve(repoRoot, name);
      console.error(`  ${name} exists:`, existsSync(p), '→', p);
    }
    console.error('  VITE_SUPABASE_URL set:', Boolean(pickEnv('VITE_SUPABASE_URL')));
    console.error('  SUPABASE_URL set:', Boolean(pickEnv('SUPABASE_URL')));
    console.error('  SUPABASE_SERVICE_ROLE_KEY set:', Boolean(pickEnv('SUPABASE_SERVICE_ROLE_KEY')));
    console.error('  SERVICE_ROLE_KEY set:', Boolean(pickEnv('SERVICE_ROLE_KEY')));
    const seedPath = resolve(repoRoot, '.env.seeding.local');
    if (existsSync(seedPath)) {
      const raw = readFileSync(seedPath, 'utf8').replace(/^\uFEFF/, '');
      const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
      console.error('  .env.seeding.local non-comment lines:', lines.length);
      const keysLeft = lines.map((l) => (l.split('=')[0] ?? '').trim()).filter(Boolean);
      console.error('  keys (left of =):', keysLeft.length ? keysLeft.join(', ') : '(none — file may be empty)');
    }
    console.error('\nSee .env.seeding.example and docs/testing/test-accounts.md');
    process.exit(1);
  }

  assertPlausibleServiceRoleKey(SERVICE_KEY);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const acc of ACCOUNTS) {
    const userId = await ensureUser(admin, acc);
    await upsertProfile(admin, userId, acc);
    console.log(`OK  ${acc.email} → ${acc.app_role}`);
  }

  console.log('\nDone. See docs/testing/test-accounts.md for sign-in details.');
}

main().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : String(e);
  const code = typeof e === 'object' && e !== null && 'code' in e ? String((e as { code: string }).code) : '';
  if (code === 'bad_jwt' || msg.includes('invalid number of segments') || msg.includes('malformed')) {
    console.error(
      '\nSupabase rejected the service_role JWT (bad_jwt / malformed).\n' +
        '• Re-copy the **service_role** value from `supabase status` after `supabase start`.\n' +
        '• Ensure `.env.seeding.local` has one line: SUPABASE_SERVICE_ROLE_KEY=eyJ... (no quotes unless the whole JWT is quoted once).\n' +
        '• Do not use the anon / publishable key or placeholder text.\n'
    );
  }
  console.error(e);
  process.exit(1);
});
