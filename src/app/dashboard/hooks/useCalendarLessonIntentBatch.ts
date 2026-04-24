import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import type { DashboardLessonRow } from '../lessonTypes';
import { resolveParticipantIdForStudentIntent } from '../lessonIntentParticipant';
import { summarizeNmlPipeline } from '../lessonIntentSummary';
import type { LessonIntentEventRow } from '../lessonIntentTypes';
import type { LessonIntentEventsConnection } from './useLessonIntentEvents';

/**
 * One `lesson_intent_events` query for all visible lesson participants (learner/household),
 * then derive per-lesson NML pending state without N hooks on the calendar.
 */
export function useCalendarLessonIntentBatch(rows: DashboardLessonRow[], actorProfileId: string | undefined) {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [events, setEvents] = useState<LessonIntentEventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const participantIds = useMemo(() => {
    const aid = actorProfileId?.trim();
    if (!aid) return [] as string[];
    const uniq = new Set<string>();
    for (const row of rows) {
      const lp = resolveParticipantIdForStudentIntent(row.participants, aid);
      if (lp) uniq.add(lp);
    }
    return [...uniq];
  }, [rows, actorProfileId]);

  const pipeKey = participantIds.slice().sort().join('|');

  const reload = useCallback(async () => {
    if (!configured || !session || !accountRoleReady || participantIds.length === 0) {
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
      .in('lesson_participant_id', participantIds)
      .order('recorded_at', { ascending: false })
      .limit(500);

    setLoading(false);
    if (qErr) {
      console.warn('[useCalendarLessonIntentBatch]', qErr);
      setError(qErr.message);
      setEvents([]);
      return;
    }

    const mapped = (data ?? []).map((row: Record<string, unknown>) => ({
      id: String(row.id),
      lesson_participant_id: String(row.lesson_participant_id),
      actor_profile_id: String(row.actor_profile_id),
      type: String(row.type),
      payload: (row.payload && typeof row.payload === 'object' ? row.payload : {}) as Record<string, unknown>,
      recorded_at: String(row.recorded_at),
    }));
    setEvents(mapped);
  }, [configured, session, accountRoleReady, pipeKey, participantIds]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const nmlPendingByLessonId = useMemo(() => {
    const out: Record<string, boolean> = {};
    const aid = actorProfileId?.trim();
    if (!aid) return out;
    for (const row of rows) {
      const pIds = row.participants.map((p) => p.lessonParticipantId);
      const summary = summarizeNmlPipeline(events, pIds);
      if (summary.status === 'pending') out[row.id] = true;
    }
    return out;
  }, [rows, events, actorProfileId]);

  const intentConnectionByLessonId = useMemo(() => {
    const m: Record<string, LessonIntentEventsConnection> = {};
    for (const row of rows) {
      const idSet = new Set(row.participants.map((p) => p.lessonParticipantId));
      m[row.id] = {
        events: events.filter((e) => idSet.has(e.lesson_participant_id)),
        loading,
        error,
        reload,
      };
    }
    return m;
  }, [rows, events, loading, error, reload]);

  return {
    events,
    loading,
    error,
    reload,
    nmlPendingByLessonId,
    intentConnectionByLessonId,
  };
}
