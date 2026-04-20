/**
 * Writes `.env.seeding.local` from `supabase status --output json` (local stack only).
 * Uses SERVICE_ROLE_KEY (JWT) — the value the JS admin client expects.
 *
 * Prereq: `supabase start` in this repo, Supabase CLI on PATH.
 *
 *   npm run seed:sync-env
 *   npm run seed:dev-users
 */
import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outPath = resolve(repoRoot, '.env.seeding.local');

interface StatusJson {
  API_URL?: string;
  SERVICE_ROLE_KEY?: string;
}

let raw: string;
try {
  raw = execSync('supabase status --output json', {
    encoding: 'utf8',
    cwd: repoRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });
} catch (e) {
  console.error(
    '`supabase status` failed. From the repo root, run:\n' +
      '  supabase start\n' +
      'Then retry:\n' +
      '  npm run seed:sync-env\n\n' +
      'If the CLI is not installed: https://supabase.com/docs/guides/cli'
  );
  console.error(e);
  process.exit(1);
}

let json: StatusJson;
try {
  json = JSON.parse(raw) as StatusJson;
} catch {
  console.error('Could not parse `supabase status --output json` as JSON. Raw output (first 500 chars):\n', raw.slice(0, 500));
  process.exit(1);
}

const url = json.API_URL?.trim();
const serviceRole = json.SERVICE_ROLE_KEY?.trim();

if (!url || !serviceRole) {
  console.error('Status JSON missing API_URL or SERVICE_ROLE_KEY. Keys present:', Object.keys(json).sort().join(', '));
  process.exit(1);
}

const content =
  [
    '# AUTO-GENERATED — `npm run seed:sync-env` (local Supabase only). Do not commit.',
    '# Regenerate after `supabase db reset` if you rotate local keys.',
    '',
    `SUPABASE_URL=${url}`,
    `SUPABASE_SERVICE_ROLE_KEY=${serviceRole}`,
    '',
  ].join('\n') + '\n';

writeFileSync(outPath, content, 'utf8');
console.log(`Wrote ${outPath} (${content.length} bytes)`);
console.log('Run: npm run seed:dev-users');
