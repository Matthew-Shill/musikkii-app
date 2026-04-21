import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';

/**
 * Count of distinct active `teacher_student_assignments.student_id` rows visible to the
 * signed-in teacher (or manager) per RLS.
 */
export function useInstructorActiveStudentCount() {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured || !session || !accountRoleReady) {
      setCount(null);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from('teacher_student_assignments')
      .select('student_id')
      .eq('status', 'active');

    setLoading(false);
    if (qErr) {
      console.warn('[useInstructorActiveStudentCount]', qErr);
      setError(qErr.message);
      setCount(null);
      return;
    }
    const n = new Set((data ?? []).map((r: { student_id: string }) => r.student_id)).size;
    setCount(n);
  }, [configured, session, accountRoleReady]);

  useEffect(() => {
    void load();
  }, [load]);

  return { activeStudentCount: count, loading, error, reload: load };
}
