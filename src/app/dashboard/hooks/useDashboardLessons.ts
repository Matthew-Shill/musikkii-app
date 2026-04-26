import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import type { DashboardLessonRow } from '../lessonTypes';
import { parseDashboardLessonJoins } from '../lessonJoinParsing';
import { normalizeLessonNotes, parseLessonOutcome } from '../lessonCompletionTypes';

export type { DashboardLessonRow } from '../lessonTypes';

/**
 * Lessons visible to the current user per RLS (`public.lessons` policies).
 * Shared by all role-family dashboards.
 */
export function useDashboardLessons() {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [lessons, setLessons] = useState<DashboardLessonRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured || !session || !accountRoleReady) {
      setLessons([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const { data, error: qErr } = await supabase
      .from('lessons')
      .select(
        `
        id,
        subject,
        status,
        modality,
        starts_at,
        ends_at,
        location,
        notes,
        focus,
        outcome,
        lesson_notes,
        meeting_url,
        teachers (
          id,
          profile_id,
          meeting_url,
          profiles!teachers_profile_id_fkey ( full_name )
        ),
        lesson_participants (
          id,
          student_id,
          students (
            id,
            profile_id,
            profiles!students_profile_id_fkey ( full_name )
          )
        )
      `
      )
      .is('deleted_at', null)
      .order('starts_at', { ascending: true });

    setLoading(false);
    if (qErr) {
      console.warn('[useDashboardLessons]', qErr);
      setError(qErr.message);
      setLessons([]);
      return;
    }

    const rows = (data ?? []).map((row: Record<string, unknown>) => {
      const joins = parseDashboardLessonJoins(row);
      const lessonMeeting = row.meeting_url;
      const lessonMeetingNorm =
        typeof lessonMeeting === 'string' && lessonMeeting.trim() ? lessonMeeting.trim() : null;
      return {
        id: String(row.id),
        subject: (row.subject as string | null) ?? null,
        status: String(row.status),
        modality: String(row.modality),
        starts_at: String(row.starts_at),
        ends_at: String(row.ends_at),
        location: (row.location as string | null) ?? null,
        notes: (row.notes as string | null) ?? null,
        focus: (row.focus as string | null) ?? null,
        outcome: parseLessonOutcome(row.outcome),
        lesson_notes: normalizeLessonNotes(row.lesson_notes),
        teacher_profile_id: joins.teacher_profile_id,
        meeting_url: lessonMeetingNorm,
        teacher_meeting_url: joins.teacher_meeting_url,
        teacher_display_name: joins.teacher_display_name,
        student_display_name: joins.student_display_name,
        participants: joins.participants,
      };
    });
    setLessons(rows);
  }, [configured, session, accountRoleReady]);

  useEffect(() => {
    void load();
  }, [load]);

  return { lessons, loading, error, reload: load };
}
