import { useMemo } from 'react';
import type { LessonParticipantJoin } from '@/app/dashboard/lessonJoinParsing';
import { useLessonIntentEvents } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';
import { LessonNmlRequestPanel } from './lesson-nml-request-panel';
import { LessonRescheduleRequestPanel } from './lesson-reschedule-request-panel';
import { LessonSelfReschedulePanel } from './lesson-self-reschedule-panel';

type Props = {
  lessonId: string;
  participants: LessonParticipantJoin[];
  lessonDbStatus: string;
  endsAtIso: string;
  startsAtIso: string;
  onLessonTimeUpdated: (startsAtIso: string, endsAtIso: string) => void;
  onLessonsReload: () => Promise<void>;
  onLessonDbStatusUpdated?: (lessonId: string, dbStatus: string) => void;
};

/**
 * One `lesson_intent_events` query for NML + teacher reschedule message (same participant scope).
 * Immediate self-reschedule uses RPCs + `teacher_availability_segments` (separate read path).
 */
export function LessonStudentIntentPanels({
  lessonId,
  participants,
  lessonDbStatus,
  endsAtIso,
  startsAtIso,
  onLessonTimeUpdated,
  onLessonsReload,
  onLessonDbStatusUpdated,
}: Props) {
  const participantIds = useMemo(() => participants.map((p) => p.lessonParticipantId), [participants]);
  const intent = useLessonIntentEvents(participantIds);

  return (
    <div className="space-y-4">
      <LessonSelfReschedulePanel
        lessonId={lessonId}
        lessonDbStatus={lessonDbStatus}
        endsAtIso={endsAtIso}
        startsAtIso={startsAtIso}
        onLessonTimeUpdated={onLessonTimeUpdated}
        onLessonsReload={onLessonsReload}
        onLessonDbStatusUpdated={onLessonDbStatusUpdated}
      />
      <LessonNmlRequestPanel
        participants={participants}
        lessonDbStatus={lessonDbStatus}
        endsAtIso={endsAtIso}
        intent={intent}
      />
      <LessonRescheduleRequestPanel
        participants={participants}
        lessonDbStatus={lessonDbStatus}
        endsAtIso={endsAtIso}
        startsAtIso={startsAtIso}
        intent={intent}
      />

      {intent.events.length > 0 ? (
        <details className="text-xs text-gray-700 rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2">
          <summary className="cursor-pointer font-medium text-gray-800">Recent intent events (this lesson)</summary>
          <ul className="mt-2 space-y-1 list-disc pl-4 max-h-32 overflow-y-auto">
            {intent.events.slice(0, 16).map((e) => (
              <li key={e.id}>
                {formatLessonDate(e.recorded_at)} {formatLessonTime(e.recorded_at)} — {e.type}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
