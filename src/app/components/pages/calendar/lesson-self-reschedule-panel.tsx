import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import {
  formatMakeupCreditRpcError,
  formatSelfRescheduleRpcError,
  hoursUntilLessonStart,
  rescheduleRequestAllowedByLeadTime,
} from '@/app/dashboard/lessonIntentSummary';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';

type Slot = { starts_at: string; ends_at: string };

type Props = {
  lessonId: string;
  lessonDbStatus: string;
  endsAtIso: string;
  startsAtIso: string;
  onLessonTimeUpdated: (startsAtIso: string, endsAtIso: string) => void;
  onLessonsReload: () => Promise<void>;
  onLessonDbStatusUpdated?: (lessonId: string, dbStatus: string) => void;
};

export function LessonSelfReschedulePanel({
  lessonId,
  lessonDbStatus,
  endsAtIso,
  startsAtIso,
  onLessonTimeUpdated,
  onLessonsReload,
  onLessonDbStatusUpdated,
}: Props) {
  const { session, accountRoleReady } = useAuthSession();
  const [expanded, setExpanded] = useState(false);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [committingId, setCommittingId] = useState<string | null>(null);
  const [commitError, setCommitError] = useState<string | null>(null);
  const [commitOk, setCommitOk] = useState(false);
  const [makeupSaving, setMakeupSaving] = useState(false);
  const [makeupError, setMakeupError] = useState<string | null>(null);
  const [makeupOk, setMakeupOk] = useState(false);

  const terminalLesson = lessonDbStatus === 'completed' || lessonDbStatus === 'cancelled';
  const endedByClock = new Date(endsAtIso).getTime() < Date.now();
  const blocked = terminalLesson || endedByClock;
  const leadTimeOk = rescheduleRequestAllowedByLeadTime(startsAtIso);
  const hoursLeft = hoursUntilLessonStart(startsAtIso);

  const loadSlots = useCallback(async () => {
    setSlotsError(null);
    setCommitOk(false);
    if (!isSupabaseConfigured() || !session || !accountRoleReady) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    const { data, error } = await supabase.rpc('list_lesson_self_reschedule_candidates', {
      p_lesson_id: lessonId,
      p_limit: 48,
    });
    setLoadingSlots(false);
    if (error) {
      console.warn('[LessonSelfReschedulePanel] list_lesson_self_reschedule_candidates', error);
      setSlots([]);
      setSlotsError(formatSelfRescheduleRpcError(error.message));
      return;
    }
    let arr: unknown[] = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (typeof data === 'string') {
      try {
        const parsed: unknown = JSON.parse(data);
        if (Array.isArray(parsed)) arr = parsed;
      } catch {
        arr = [];
      }
    }
    const parsed: Slot[] = [];
    for (const row of arr) {
      if (!row || typeof row !== 'object') continue;
      const r = row as Record<string, unknown>;
      const s = r.starts_at;
      const e = r.ends_at;
      if (typeof s === 'string' && typeof e === 'string') {
        parsed.push({ starts_at: s, ends_at: e });
      }
    }
    setSlots(parsed);
  }, [session, accountRoleReady, lessonId]);

  useEffect(() => {
    if (expanded && leadTimeOk && !blocked) {
      void loadSlots();
    }
  }, [expanded, leadTimeOk, blocked, loadSlots]);

  const handlePickSlot = async (slot: Slot) => {
    setCommitError(null);
    setCommitOk(false);
    if (!isSupabaseConfigured() || !session || !accountRoleReady) {
      setCommitError('Sign in is required.');
      return;
    }
    setCommittingId(slot.starts_at);
    const { data, error } = await supabase.rpc('commit_student_lesson_self_reschedule', {
      p_lesson_id: lessonId,
      p_new_starts_at: slot.starts_at,
    });
    setCommittingId(null);
    if (error) {
      console.warn('[LessonSelfReschedulePanel] commit_student_lesson_self_reschedule', error);
      setCommitError(formatSelfRescheduleRpcError(error.message));
      return;
    }
    const row = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const ns = row?.starts_at;
    const ne = row?.ends_at;
    if (typeof ns === 'string' && typeof ne === 'string') {
      onLessonTimeUpdated(ns, ne);
    }
    setCommitOk(true);
    setExpanded(false);
    setSlots([]);
    await onLessonsReload();
  };

  const handleMakeupCredit = async () => {
    setMakeupError(null);
    setMakeupOk(false);
    if (!isSupabaseConfigured() || !session || !accountRoleReady) {
      setMakeupError('Sign in is required.');
      return;
    }
    if (!leadTimeOk) {
      setMakeupError(formatMakeupCreditRpcError('MAKEUP_CONVERSION_TOO_LATE'));
      return;
    }
    if (!window.confirm('Convert this lesson to a make-up credit? The lesson will show as cancelled and you will receive one deferred replacement (redemption coming later).')) {
      return;
    }
    setMakeupSaving(true);
    const { data, error } = await supabase.rpc('commit_student_lesson_to_makeup_credit', {
      p_lesson_id: lessonId,
    });
    setMakeupSaving(false);
    if (error) {
      console.warn('[LessonSelfReschedulePanel] commit_student_lesson_to_makeup_credit', error);
      setMakeupError(formatMakeupCreditRpcError(error.message));
      return;
    }
    const payload = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const st = payload?.lesson_status;
    if (typeof st === 'string') {
      onLessonDbStatusUpdated?.(lessonId, st);
    }
    setMakeupOk(true);
    await onLessonsReload();
  };

  if (!session) {
    return null;
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-emerald-950">Reschedule now</p>
        <p className="text-xs text-emerald-900 mt-1">
          Moves this exact lesson in the database to a new time from your teacher&apos;s available hours. Same
          teacher and length; does not create a second lesson row.
        </p>
      </div>

      {blocked ? (
        <p className="text-xs text-gray-600">Self-reschedule is closed for completed, cancelled, or past lessons.</p>
      ) : !leadTimeOk ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          <span className="font-medium">Under 24 hours</span> — self-reschedule is disabled (
          {hoursLeft > 0 ? `about ${hoursLeft.toFixed(1)} hours away` : 'starting very soon'}). Use the{' '}
          <span className="font-medium">NML request</span> panel (next section) to reach your teacher.
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setExpanded((v) => !v);
                setCommitError(null);
                setCommitOk(false);
              }}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800"
            >
              {expanded ? 'Hide available times' : 'Reschedule now'}
            </button>
            <button
              type="button"
              disabled={makeupSaving || Boolean(committingId)}
              onClick={() => void handleMakeupCredit()}
              className="px-4 py-2.5 rounded-lg text-sm font-semibold border border-violet-300 text-violet-900 bg-violet-50 hover:bg-violet-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {makeupSaving ? 'Saving…' : 'Save as make-up credit'}
            </button>
          </div>
          <p className="text-xs text-gray-600">
            Make-up credit cancels this scheduled occurrence and stores one replacement entitlement (see Settings →
            Make-up credits). Redeeming the credit for a new lesson time is not available yet.
          </p>

          {commitOk ? (
            <p className="text-sm font-medium text-green-800" role="status">
              Lesson time updated. Details above reflect the new schedule.
            </p>
          ) : null}
          {commitError ? (
            <p className="text-sm text-red-700" role="alert">
              {commitError}
            </p>
          ) : null}
          {makeupOk ? (
            <p className="text-sm font-medium text-violet-900" role="status">
              Make-up credit saved. This lesson is now cancelled in the database; check Settings for your credit row.
            </p>
          ) : null}
          {makeupError ? (
            <p className="text-sm text-red-700" role="alert">
              {makeupError}
            </p>
          ) : null}

          {expanded ? (
            <div className="space-y-2 border-t border-emerald-100 pt-3">
              {loadingSlots ? <p className="text-xs text-gray-600">Loading open times…</p> : null}
              {slotsError ? (
                <p className="text-xs text-red-600" role="alert">
                  {slotsError}
                </p>
              ) : null}
              {!loadingSlots && !slotsError && slots.length === 0 ? (
                <p className="text-xs text-gray-700">
                  No open slots returned. Your teacher (or admin) must maintain bookable windows in{' '}
                  <code className="text-[0.65rem]">teacher_availability_segments</code> and avoid blocking the same
                  times in <code className="text-[0.65rem]">teacher_availability_exceptions</code>; slots also cannot
                  overlap other lessons. You can still use the teacher message panel below.
                </p>
              ) : null}
              <ul className="max-h-48 overflow-y-auto space-y-1.5">
                {slots.map((slot) => (
                  <li key={slot.starts_at} className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-gray-800">
                      {formatLessonDate(slot.starts_at)} · {formatLessonTime(slot.starts_at)} –{' '}
                      {formatLessonTime(slot.ends_at)}
                    </span>
                    <button
                      type="button"
                      disabled={Boolean(committingId)}
                      onClick={() => void handlePickSlot(slot)}
                      className="shrink-0 px-3 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {committingId === slot.starts_at ? 'Saving…' : 'Choose'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
