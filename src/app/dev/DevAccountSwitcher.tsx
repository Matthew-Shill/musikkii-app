import { useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { useAuthSession } from '../context/auth-session-context';
import { DEV_SEED_ACCOUNTS } from './dev-seed-accounts';

function getDevSeedPassword(): string {
  const fromVite = import.meta.env.VITE_DEV_SEED_PASSWORD?.trim() ?? '';
  if (fromVite) return fromVite;
  if (import.meta.env.DEV) return (__APP_DEV_SEED_PASSWORD__ ?? '').trim();
  return '';
}

/** Dev-only; mounted from `DevAccountSwitcherGate` on `/sign-in` only. */
export default function DevAccountSwitcher() {
  const navigate = useNavigate();
  const { session } = useAuthSession();
  const password = getDevSeedPassword();

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentEmail = session?.user?.email?.toLowerCase() ?? null;

  if (!import.meta.env.DEV) {
    return null;
  }

  async function switchToAccount(email: string, accountId: string) {
    setError(null);
    setLoadingId(accountId);
    try {
      await supabase.auth.signOut();
      const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signErr) {
        setError(signErr.message);
        return;
      }
      navigate('/', { replace: true });
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div
      className="mt-6 rounded-lg border border-amber-200 bg-amber-50/90 p-4 text-xs"
      data-testid="dev-account-switcher"
    >
      <p className="font-semibold uppercase tracking-wide text-amber-900">Dev only — test accounts</p>
      <p className="mt-1 text-amber-800/90">
        Uses real <code className="rounded bg-amber-100 px-0.5">signInWithPassword</code>. Same password as seeding (
        <code className="rounded bg-amber-100 px-0.5">VITE_DEV_SEED_PASSWORD</code> in <code className="rounded bg-amber-100 px-0.5">.env.local</code>
        ).
      </p>

      {!password ? (
        <p className="mt-2 font-medium text-red-800">
          Set <code className="rounded bg-red-50 px-0.5">VITE_DEV_SEED_PASSWORD</code> or{' '}
          <code className="rounded bg-red-50 px-0.5">DEV_SEED_PASSWORD</code> in <code className="rounded bg-red-50 px-0.5">.env.local</code> at the
          project root (same value as seeding), <strong>save the file to disk</strong> (an unsaved buffer is empty to Node), then{' '}
          <strong>restart</strong> <code className="rounded bg-red-50 px-0.5">npm run dev</code>.
        </p>
      ) : null}

      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}

      <div className="mt-3 flex flex-col flex-wrap gap-2 sm:flex-row">
        {DEV_SEED_ACCOUNTS.map((a) => {
          const active = currentEmail === a.email.toLowerCase();
          const busy = loadingId === a.id;
          return (
            <button
              key={a.id}
              type="button"
              disabled={!password || busy}
              onClick={() => void switchToAccount(a.email, a.id)}
              className={`rounded-md border px-2.5 py-1.5 text-left text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                active
                  ? 'border-amber-600 bg-amber-200 text-amber-950'
                  : 'border-amber-400/80 bg-white text-amber-950 hover:bg-amber-100'
              } w-full sm:w-auto sm:min-w-[8.5rem]`}
            >
              {busy ? 'Signing in…' : a.label}
              <span className="mt-0.5 block font-normal text-[0.65rem] leading-tight text-amber-800/80">{a.role}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
