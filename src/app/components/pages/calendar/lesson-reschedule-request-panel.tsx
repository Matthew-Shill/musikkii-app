import { useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import type { LessonParticipantJoin } from '@/app/dashboard/lessonJoinParsing';
import { resolveParticipantIdForStudentIntent } from '@/app/dashboard/lessonIntentParticipant';
import {
  formatStudentIntentInsertError,
  hoursUntilLessonStart,
  intentRequestMessageFromPayload,
  rescheduleRequestAllowedByLeadTime,
  summarizeReschedulePipeline,
} from '@/app/dashboard/lessonIntentSummary';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';

type Props = {
  participants: LessonParticipantJoin[];
  lessonDbStatus: string;
  endsAtIso: string;
  startsAtIso: string;
  intent: LessonIntentEventsConnection;
};

export function LessonRescheduleRequestPanel({ participants, lessonDbStatus, endsAtIso, startsAtIso, intent }: Props) {
  const { session, accountRoleReady } = useAuthSession();
  const actorId = session?.user?.id ?? '';
  const participantIds = useMemo(() => participants.map((p) => p.lessonParticipantId), [participants]);
  const { events, loading, error, reload } = intent;

  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitOk, setSubmitOk] = useState(false);

  const lpId = useMemo(
    () => resolveParticipantIdForStudentIntent(participants, actorId),
    [participants, actorId]
  );

  const terminalLesson = lessonDbStatus === 'completed' || lessonDbStatus === 'cancelled';
  const endedByClock = new Date(endsAtIso).getTime() < Date.now();
  const blocked = terminalLesson || endedByClock;

  const leadTimeOk = rescheduleRequestAllowedByLeadTime(startsAtIso);
  const hoursLeft = hoursUntilLessonStart(startsAtIso);

  const rescheduleSummary = useMemo(
    () => summarizeReschedulePipeline(events, participantIds),
    [events, participantIds]
  );

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitOk(false);
    if (!isSupabaseConfigured() || !session || !accountRoleReady || !lpId) {
      setSubmitError('Sign in is required to submit a request.');
      return;
    }
    if (!leadTimeOk) {
      setSubmitError(formatStudentIntentInsertError('RESCHEDULE_TOO_LATE'));
      return;
    }
    const trimmed = message.trim();
    setSubmitting(true);
    const { error: insErr } = await supabase.from('lesson_intent_events').insert({
      lesson_participant_id: lpId,
      actor_profile_id: actorId,
      type: 'student.reschedule_requested',
      payload: trimmed ? { message: trimmed } : {},
    });
    setSubmitting(false);
    if (insErr) {
      console.warn('[LessonRescheduleRequestPanel] insert', insErr);
      setSubmitError(formatStudentIntentInsertError(insErr.message));
      return;
    }
    setSubmitOk(true);
    setMessage('');
    await reload();
  };

  if (!session) {
    return null;
  }

  const noteFromLast = rescheduleSummary.lastRequest
    ? intentRequestMessageFromPayload(rescheduleSummary.lastRequest.payload)
    : null;

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-sky-950">Teacher-assisted reschedule (message)</p>
        <p className="text-xs text-sky-900 mt-1">
          Optional: saves <code className="text-[0.65rem]">student.reschedule_requested</code> to{' '}
          <code className="text-[0.65rem]">lesson_intent_events</code> for a human workflow. Use{' '}
          <span className="font-medium">Reschedule now</span> above when you already have an open slot — that moves
          this lesson immediately.
        </p>
        <p className="text-xs text-sky-900 mt-1">
          Policy: at least <span className="font-semibold">24 hours</span> before lesson start (matches the database
          trigger).
        </p>
      </div>

      {loading ? <p className="text-xs text-gray-600">Loading request history…</p> : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {!blocked && !leadTimeOk ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          <span className="font-medium">Too close to start for a reschedule request.</span> This lesson is about{' '}
          {hoursLeft > 0 ? (
            <>
              <span className="whitespace-nowrap">{hoursLeft.toFixed(1)} hours</span> away
            </>
          ) : (
            'in the past or starting now'
          )}
          . Use the <span className="font-medium">NML request</span> panel above so your teacher can help without
          relying on the 24-hour reschedule rule.
        </div>
      ) : null}

      {!blocked && leadTimeOk && rescheduleSummary.status === 'pending' && rescheduleSummary.lastRequest ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="font-medium">Pending reschedule request</span> — submitted{' '}
          {formatLessonDate(rescheduleSummary.lastRequest.recorded_at)} at{' '}
          {formatLessonTime(rescheduleSummary.lastRequest.recorded_at)}
          {noteFromLast ? (
            <span className="block mt-1 text-amber-900/90">
              Note: {noteFromLast}
            </span>
          ) : null}
        </div>
      ) : null}

      {!blocked && leadTimeOk && rescheduleSummary.status === 'addressed' ? (
        <p className="text-xs text-gray-700">
          Your latest reschedule request was marked handled in the database. You can submit another if you still need
          a change.
        </p>
      ) : null}

      {!blocked && leadTimeOk && rescheduleSummary.status === 'none' && !submitOk ? (
        <p className="text-xs text-gray-600">No reschedule requests on file yet for this lesson.</p>
      ) : null}

      {blocked ? (
        <p className="text-xs text-gray-600">Requests are closed for completed, cancelled, or past lessons.</p>
      ) : !lpId ? (
        <p className="text-xs text-amber-800">
          Could not resolve a participant row for your profile on this lesson. Check household membership, lesson
          participants, and RLS.
        </p>
      ) : (
        <>
          {submitOk ? (
            <p className="text-sm font-medium text-green-800" role="status">
              Request saved. Your teacher can see it on this lesson&apos;s intent stream.
            </p>
          ) : null}
          {submitError ? (
            <p className="text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}
          <label className="block text-xs font-medium text-gray-700" htmlFor="reschedule-message">
            Message for your teacher (optional)
          </label>
          <textarea
            id="reschedule-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={2000}
            disabled={!leadTimeOk}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:bg-gray-100 disabled:text-gray-500"
            placeholder="Preferred dates/times or anything else helpful."
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting || !leadTimeOk}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit reschedule request'}
          </button>
        </>
      )}

    </div>
  );
}
