import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';

export type MakeupCreditRow = {
  id: string;
  original_lesson_id: string;
  duration_minutes: number;
  status: string;
  redeemed_lesson_id: string | null;
  expires_at: string | null;
  created_at: string;
};

/**
 * RLS-scoped `makeup_credits` for the signed-in learner/household (or teacher/admin when policies allow).
 */
export function useMakeupCredits() {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [rows, setRows] = useState<MakeupCreditRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured || !session || !accountRoleReady) {
      setRows([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from('makeup_credits')
      .select('id, original_lesson_id, duration_minutes, status, redeemed_lesson_id, expires_at, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    setLoading(false);
    if (qErr) {
      console.warn('[useMakeupCredits]', qErr);
      setError(qErr.message);
      setRows([]);
      return;
    }

    const mapped = (data ?? []).map((r: Record<string, unknown>) => ({
      id: String(r.id),
      original_lesson_id: String(r.original_lesson_id),
      duration_minutes: Number(r.duration_minutes),
      status: String(r.status),
      redeemed_lesson_id: r.redeemed_lesson_id != null ? String(r.redeemed_lesson_id) : null,
      expires_at: r.expires_at != null ? String(r.expires_at) : null,
      created_at: String(r.created_at),
    }));
    setRows(mapped);
  }, [configured, session, accountRoleReady]);

  useEffect(() => {
    void load();
  }, [load]);

  return { rows, loading, error, reload: load };
}
