import { useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import type { LessonParticipantJoin } from '@/app/dashboard/lessonJoinParsing';
import { resolveParticipantIdForStudentIntent } from '@/app/dashboard/lessonIntentParticipant';
import { intentRequestMessageFromPayload, summarizeNmlPipeline } from '@/app/dashboard/lessonIntentSummary';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';

type Props = {
  participants: LessonParticipantJoin[];
  lessonDbStatus: string;
  /** Lesson end ISO — used with DB status to block intents on terminal lessons (mirrors server guard). */
  endsAtIso: string;
  intent: LessonIntentEventsConnection;
};

export function LessonNmlRequestPanel({ participants, lessonDbStatus, endsAtIso, intent }: Props) {
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

  const nmlSummary = useMemo(
    () => summarizeNmlPipeline(events, participantIds),
    [events, participantIds]
  );

  const handleSubmit = async () => {
    setSubmitError(null);
    setSubmitOk(false);
    if (!isSupabaseConfigured() || !session || !accountRoleReady || !lpId) {
      setSubmitError('Sign in is required to submit a request.');
      return;
    }
    const trimmed = message.trim();
    setSubmitting(true);
    const { error: insErr } = await supabase.from('lesson_intent_events').insert({
      lesson_participant_id: lpId,
      actor_profile_id: actorId,
      type: 'student.nml_requested',
      payload: trimmed ? { message: trimmed } : {},
    });
    setSubmitting(false);
    if (insErr) {
      console.warn('[LessonNmlRequestPanel] insert', insErr);
      setSubmitError(insErr.message);
      return;
    }
    setSubmitOk(true);
    setMessage('');
    await reload();
  };

  if (!session) {
    return null;
  }

  return (
    <div className="rounded-xl border border-purple-200 bg-purple-50/60 p-4 space-y-3">
      <div>
        <p className="text-sm font-semibold text-purple-900">Non-meeting lesson (NML) request</p>
        <p className="text-xs text-purple-800 mt-1">
          Submits a real row to <code className="text-[0.65rem]">lesson_intent_events</code> (
          <code className="text-[0.65rem]">student.nml_requested</code>) for this lesson&apos;s participant.
        </p>
      </div>

      {loading ? <p className="text-xs text-gray-600">Loading request history…</p> : null}
      {error ? (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {!blocked && nmlSummary.status === 'pending' && nmlSummary.lastRequest ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          <span className="font-medium">Pending NML request</span> — submitted{' '}
          {formatLessonDate(nmlSummary.lastRequest.recorded_at)} at{' '}
          {formatLessonTime(nmlSummary.lastRequest.recorded_at)}
          {intentRequestMessageFromPayload(nmlSummary.lastRequest.payload) ? (
            <span className="block mt-1 text-amber-800">
              Note: {intentRequestMessageFromPayload(nmlSummary.lastRequest.payload)}
            </span>
          ) : null}
        </div>
      ) : null}

      {!blocked && nmlSummary.status === 'addressed' ? (
        <p className="text-xs text-gray-700">
          Your latest NML request was marked handled by the teacher in the database. You can submit another if needed.
        </p>
      ) : null}

      {!blocked && nmlSummary.status === 'none' && !submitOk ? (
        <p className="text-xs text-gray-600">No NML requests on file yet for this lesson.</p>
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
              Request saved. The teacher will see it on this lesson stream.
            </p>
          ) : null}
          {submitError ? (
            <p className="text-sm text-red-700" role="alert">
              {submitError}
            </p>
          ) : null}
          <label className="block text-xs font-medium text-gray-700" htmlFor="nml-message">
            Message for your teacher (optional)
          </label>
          <textarea
            id="nml-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={2000}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Preferred timing, format, or anything else helpful."
          />
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={submitting}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : 'Submit NML request'}
          </button>
        </>
      )}

    </div>
  );
}
