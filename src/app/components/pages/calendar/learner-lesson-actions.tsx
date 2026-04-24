import { MoreHorizontal, PlayCircle, Calendar, Undo2 } from 'lucide-react';
import { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useLessonIntentEvents } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { resolveParticipantIdForStudentIntent } from '@/app/dashboard/lessonIntentParticipant';
import {
  summarizeNmlPipeline,
  formatMakeupCreditRpcError,
} from '@/app/dashboard/lessonIntentSummary';
import { getLearnerLessonActionPolicy, LEARNER_SLOT_POLICY_NOTE } from '@/app/dashboard/learnerLessonActionPolicy';
import type { LessonParticipantJoin } from '@/app/dashboard/lessonJoinParsing';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import { calendarLessonDbStatusToUi } from '@/app/dashboard/calendarLessonAdapters';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { NmlGuaranteeInfoTrigger } from '@/app/components/shared/nml-guarantee-info-trigger';
import { LearnerLessonCancelDialog } from './learner-lesson-cancel-dialog';

type Props = {
  lessonId: string;
  lessonDbStatus: string;
  startsAtIso: string;
  endsAtIso: string;
  participants: LessonParticipantJoin[];
  actorProfileId: string;
  /** When set (e.g. calendar batch query), avoids per-card duplicate intent fetches. */
  intentConnection?: LessonIntentEventsConnection;
  onStatusChange: (lessonId: string, status: CalendarEventUiStatus) => void;
  onLessonDbStatusUpdated: (lessonId: string, dbStatus?: string) => void;
  onLessonsReload: () => Promise<void>;
};

export function LearnerLessonActions({
  lessonId,
  lessonDbStatus,
  startsAtIso,
  endsAtIso,
  participants,
  actorProfileId,
  intentConnection,
  onStatusChange,
  onLessonDbStatusUpdated,
  onLessonsReload,
}: Props) {
  const navigate = useNavigate();
  const { session, accountRoleReady } = useAuthSession();
  const menuRef = useRef<HTMLDivElement>(null);

  const [nmlSaving, setNmlSaving] = useState(false);
  const [undoSaving, setUndoSaving] = useState(false);
  const [nmlError, setNmlError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [secondaryBusy, setSecondaryBusy] = useState<null | 'makeup' | 'cancel'>(null);
  const [secondaryError, setSecondaryError] = useState<string | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const participantIds = useMemo(() => participants.map((p) => p.lessonParticipantId), [participants]);
  const lpId = useMemo(
    () => resolveParticipantIdForStudentIntent(participants, actorProfileId),
    [participants, actorProfileId]
  );
  const internalIntent = useLessonIntentEvents(intentConnection ? [] : participantIds);
  const intent = intentConnection ?? internalIntent;
  const nmlSummary = useMemo(() => summarizeNmlPipeline(intent.events, participantIds), [intent.events, participantIds]);

  const policy = useMemo(
    () =>
      getLearnerLessonActionPolicy({
        startsAtIso,
        endsAtIso,
        lessonDbStatus,
        nmlSummary,
      }),
    [startsAtIso, endsAtIso, lessonDbStatus, nmlSummary]
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = menuRef.current;
      if (el && !el.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  const handleNml = async () => {
    setNmlError(null);
    if (!policy.canRequestNml) return;
    if (!isSupabaseConfigured() || !session || !accountRoleReady || !lpId) {
      setNmlError('Sign in is required to request NML.');
      return;
    }
    setNmlSaving(true);
    const { error } = await supabase.from('lesson_intent_events').insert({
      lesson_participant_id: lpId,
      actor_profile_id: actorProfileId,
      type: 'student.nml_requested',
      payload: {},
    });
    setNmlSaving(false);
    if (error) {
      setNmlError(error.message);
      return;
    }
    await intent.reload();
    onStatusChange(lessonId, 'NML Requested');
  };

  const handleUndoNml = async () => {
    setNmlError(null);
    if (!policy.canUndoNml || !nmlSummary.lastRequest) return;
    if (!isSupabaseConfigured() || !session || !accountRoleReady || !lpId) {
      setNmlError('Sign in is required.');
      return;
    }
    setUndoSaving(true);
    const { error } = await supabase.from('lesson_intent_events').insert({
      lesson_participant_id: lpId,
      actor_profile_id: actorProfileId,
      type: 'student.intent_cleared',
      payload: { targetStudentEventId: nmlSummary.lastRequest.id },
    });
    setUndoSaving(false);
    if (error) {
      setNmlError(error.message);
      return;
    }
    await intent.reload();
    onStatusChange(lessonId, calendarLessonDbStatusToUi(lessonDbStatus));
  };

  const handleReschedule = () => {
    if (!policy.canReschedule) return;
    navigate(`/calendar/lessons/${lessonId}/reschedule`);
  };

  const handleMakeupCredit = async () => {
    setSecondaryError(null);
    if (!policy.canRequestMakeupCredit) return;
    if (
      !window.confirm(
        'Request make-up credit? This cannot be undone. The lesson will be cancelled and you will receive one make-up credit.'
      )
    ) {
      return;
    }
    if (!isSupabaseConfigured() || !session || !accountRoleReady) {
      setSecondaryError('Sign in is required.');
      return;
    }
    setSecondaryBusy('makeup');
    const { data, error } = await supabase.rpc('commit_student_lesson_to_makeup_credit', { p_lesson_id: lessonId });
    setSecondaryBusy(null);
    if (error) {
      setSecondaryError(formatMakeupCreditRpcError(error.message));
      return;
    }
    const payload = data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
    const status = payload?.lesson_status;
    if (typeof status === 'string') {
      onLessonDbStatusUpdated(lessonId, status);
    }
    onStatusChange(lessonId, 'Cancelled');
    setMenuOpen(false);
    await onLessonsReload();
  };

  const performCancel = async () => {
    setSecondaryError(null);
    if (!policy.canCancelLesson) return;
    if (!isSupabaseConfigured() || !session || !accountRoleReady) {
      setSecondaryError('Sign in is required.');
      return;
    }
    setSecondaryBusy('cancel');
    const { error } = await supabase
      .from('lessons')
      .update({ status: 'cancelled' })
      .eq('id', lessonId)
      .eq('status', lessonDbStatus)
      .select('id, status')
      .single();
    setSecondaryBusy(null);
    setCancelDialogOpen(false);
    if (error) {
      setSecondaryError('Lesson cancellation is not available for this account yet.');
      return;
    }
    onLessonDbStatusUpdated(lessonId, 'cancelled');
    onStatusChange(lessonId, 'Cancelled');
    setMenuOpen(false);
    await onLessonsReload();
  };

  if (policy.allActionsClosed) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Lesson actions</p>
        <p className="text-xs text-gray-600">
          {policy.lessonTerminal
            ? 'This lesson is completed or cancelled.'
            : 'This lesson has ended. No further changes are available here.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <LearnerLessonCancelDialog
        open={cancelDialogOpen}
        onClose={() => setCancelDialogOpen(false)}
        onConfirmCancel={() => void performCancel()}
        confirming={secondaryBusy === 'cancel'}
      />
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Lesson actions</p>
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="More lesson actions"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-11 w-56 rounded-xl border border-gray-200 bg-white shadow-xl p-1 z-20">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setCancelDialogOpen(true);
                  }}
                  disabled={secondaryBusy !== null || !policy.canCancelLesson}
                  title={policy.hints.cancel}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel lesson
                </button>
                <button
                  type="button"
                  onClick={() => void handleMakeupCredit()}
                  disabled={secondaryBusy !== null || !policy.canRequestMakeupCredit}
                  title={policy.hints.makeup}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {secondaryBusy === 'makeup' ? 'Saving…' : 'Request make-up credit'}
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="flex min-w-0 overflow-hidden rounded-lg bg-purple-700 text-white shadow-sm transition-colors hover:bg-purple-800">
            <button
              type="button"
              disabled={!policy.canRequestNml || nmlSaving || secondaryBusy !== null}
              title={policy.hints.nml}
              onClick={() => void handleNml()}
              className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 border-r border-white/20 bg-transparent px-3 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-55"
            >
              <PlayCircle className="h-4 w-4 shrink-0" aria-hidden />
              <span className="truncate">
                {policy.nmlRequested ? 'NML requested' : nmlSaving ? 'Saving…' : 'Request NML Video'}
              </span>
            </button>
            <div className="flex shrink-0 items-stretch">
              <NmlGuaranteeInfoTrigger variant="inPrimary" />
            </div>
          </div>
          <button
            type="button"
            disabled={!policy.canReschedule || secondaryBusy !== null}
            title={policy.hints.reschedule}
            onClick={handleReschedule}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-gray-800 border border-gray-300 hover:bg-gray-100 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Reschedule
          </button>
        </div>

        {policy.canUndoNml ? (
          <button
            type="button"
            disabled={undoSaving || secondaryBusy !== null}
            title={policy.hints.undoNml}
            onClick={() => void handleUndoNml()}
            className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-purple-200 bg-white text-purple-900 hover:bg-purple-50 disabled:opacity-60"
          >
            <Undo2 className="w-3.5 h-3.5" />
            {undoSaving ? 'Updating…' : 'Undo NML (back to scheduled)'}
          </button>
        ) : null}

        {policy.timing === 'lt24h_before_start' ? (
          <p className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            Reschedule and make-up credit are available until <span className="font-semibold">24 hours</span> before
            start. NML and cancel stay available until the lesson begins.
          </p>
        ) : null}
        {policy.timing === 'after_start' && !policy.lessonTerminal ? (
          <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-3 py-2">
            This lesson has started. Lesson changes (including cancellation) are only available before start time.
          </p>
        ) : null}

        {policy.nmlRequested ? (
          <div className="rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-xs text-purple-900">
            NML requested — your teacher sees this as a record-video task. You can undo before lesson start if you change
            your mind.
          </div>
        ) : null}

        {nmlError ? (
          <p className="text-xs text-red-700" role="alert">
            {nmlError}
          </p>
        ) : null}
        {secondaryError ? (
          <p className="text-xs text-red-700" role="alert">
            {secondaryError}
          </p>
        ) : null}

        <p className="text-[0.65rem] leading-snug text-gray-500 border-t border-gray-200 pt-2">{LEARNER_SLOT_POLICY_NOTE}</p>
      </div>
    </>
  );
}
