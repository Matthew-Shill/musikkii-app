import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import type { LessonIntentEventRow } from '../lessonIntentTypes';

/** Result shape for sharing one `lesson_intent_events` query across multiple panels. */
export type LessonIntentEventsConnection = {
  events: LessonIntentEventRow[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

/**
 * Append-only `lesson_intent_events` for given participant ids (not a second `lessons` query).
 */
export function useLessonIntentEvents(participantIds: string[]): LessonIntentEventsConnection {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [events, setEvents] = useState<LessonIntentEventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pipeKey = participantIds.join('|');

  const load = useCallback(async () => {
    const ids = pipeKey ? pipeKey.split('|').filter(Boolean) : [];
    if (!configured || !session || !accountRoleReady || ids.length === 0) {
      setEvents([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from('lesson_intent_events')
      .select('id, lesson_participant_id, actor_profile_id, type, payload, recorded_at')
      .in('lesson_participant_id', ids)
      .order('recorded_at', { ascending: false })
      .limit(80);

    setLoading(false);
    if (qErr) {
      console.warn('[useLessonIntentEvents]', qErr);
      setError(qErr.message);
      setEvents([]);
      return;
    }

    const rows = (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row.id),
      lesson_participant_id: String(row.lesson_participant_id),
      actor_profile_id: String(row.actor_profile_id),
      type: String(row.type),
      payload: (row.payload && typeof row.payload === 'object' ? row.payload : {}) as Record<string, unknown>,
      recorded_at: String(row.recorded_at),
    }));
    setEvents(rows);
  }, [configured, session, accountRoleReady, pipeKey]);

  useEffect(() => {
    void load();
  }, [load]);

  return { events, loading, error, reload: load };
}
