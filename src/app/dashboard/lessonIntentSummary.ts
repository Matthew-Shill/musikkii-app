import type { LessonIntentEventRow } from './lessonIntentTypes';

export type NmlPipelineSummary = {
  status: 'none' | 'pending' | 'addressed';
  lastRequest?: LessonIntentEventRow;
};

export type ReschedulePipelineSummary = {
  status: 'none' | 'pending' | 'addressed';
  lastRequest?: LessonIntentEventRow;
};

function summarizeStudentTeacherPair(
  events: LessonIntentEventRow[],
  participantIds: string[],
  studentType: string,
  teacherHandledType: string
): { status: 'none' | 'pending' | 'addressed'; lastRequest?: LessonIntentEventRow } {
  const idSet = new Set(participantIds);
  const relevant = events.filter(
    (e) =>
      idSet.has(e.lesson_participant_id) && (e.type === studentType || e.type === teacherHandledType)
  );
  const asc = [...relevant].sort(
    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
  );

  let openStudent: LessonIntentEventRow | null = null;
  for (const e of asc) {
    if (e.type === studentType) {
      openStudent = e;
    }
    if (
      e.type === teacherHandledType &&
      openStudent &&
      String(e.payload?.targetStudentEventId) === openStudent.id
    ) {
      openStudent = null;
    }
  }

  if (openStudent) {
    return { status: 'pending', lastRequest: openStudent };
  }
  const hadStudent = asc.some((e) => e.type === studentType);
  return { status: hadStudent ? 'addressed' : 'none' };
}

/**
 * Derive NML request visibility from append-only events for the lesson's participant row(s).
 * A request is "pending" until a `teacher.nml_handled` row targets that request's id.
 */
export function summarizeNmlPipeline(
  events: LessonIntentEventRow[],
  participantIds: string[]
): NmlPipelineSummary {
  return summarizeStudentTeacherPair(events, participantIds, 'student.nml_requested', 'teacher.nml_handled');
}

/**
 * Reschedule pipeline: `student.reschedule_requested` until matching `teacher.reschedule_handled`.
 */
export function summarizeReschedulePipeline(
  events: LessonIntentEventRow[],
  participantIds: string[]
): ReschedulePipelineSummary {
  return summarizeStudentTeacherPair(
    events,
    participantIds,
    'student.reschedule_requested',
    'teacher.reschedule_handled'
  );
}

/** Optional user note on student intent payloads (`message` or `notes`). */
export function intentRequestMessageFromPayload(payload: Record<string, unknown> | undefined): string | null {
  if (!payload) return null;
  const m = payload.message ?? payload.notes;
  return typeof m === 'string' && m.trim() ? m.trim() : null;
}

export function nmlRequestMessageFromPayload(payload: Record<string, unknown> | undefined): string | null {
  return intentRequestMessageFromPayload(payload);
}

/** Hours from "now" until lesson start (same basis as DB guard: `starts_at - now()`). */
export function hoursUntilLessonStart(startsAtIso: string): number {
  return (new Date(startsAtIso).getTime() - Date.now()) / (1000 * 60 * 60);
}

/** True when server allows `student.reschedule_requested` (trigger uses `hrs < 24` → block). */
export function rescheduleRequestAllowedByLeadTime(startsAtIso: string): boolean {
  return hoursUntilLessonStart(startsAtIso) >= 24;
}

/**
 * Map Postgres trigger / PostgREST errors to readable copy. Preserves unknown messages.
 */
export function formatStudentIntentInsertError(rawMessage: string): string {
  const m = rawMessage.trim();
  if (m.includes('RESCHEDULE_TOO_LATE')) {
    return (
      'Reschedule requests must be at least 24 hours before lesson start. ' +
      'Use a non-meeting lesson (NML) request to reach your teacher when it is closer than that.'
    );
  }
  if (m.includes('LESSON_TERMINAL')) {
    return 'This lesson is completed or cancelled; new student intents are not accepted.';
  }
  return m || 'Request could not be saved.';
}

/** PostgREST / Postgres errors from self-reschedule RPCs (`list_*` / `commit_*`). */
export function formatSelfRescheduleRpcError(rawMessage: string): string {
  const m = rawMessage.trim();
  if (m.includes('RESCHEDULE_TOO_LATE') || m.includes('TARGET_TOO_SOON')) {
    return (
      'Self-reschedule needs at least 24 hours before the original lesson start, ' +
      'and the new time must also be at least 24 hours away. Use an NML request when it is sooner than that.'
    );
  }
  if (m.includes('SLOT_OUTSIDE_AVAILABILITY')) {
    return 'That time is outside your teacher’s published bookable hours. Pick another slot from the list or ask your teacher to add availability.';
  }
  if (m.includes('SLOT_CONFLICT')) {
    return 'That slot was just taken or overlaps another lesson. Refresh the list and try again.';
  }
  if (m.includes('SLOT_BLOCKED_TIME_OFF')) {
    return 'That time overlaps teacher time off or a blocked interval. Choose a different slot or ask an admin to adjust availability.';
  }
  if (m.includes('LESSON_NOT_VISIBLE') || m.includes('LESSON_NOT_FOUND')) {
    return 'You cannot reschedule this lesson with the current account.';
  }
  if (m.includes('LESSON_TERMINAL') || m.includes('LESSON_DELETED')) {
    return 'This lesson is no longer active for rescheduling.';
  }
  if (m.includes('NOT_AUTHENTICATED')) {
    return 'Sign in is required.';
  }
  return m || 'Could not complete reschedule.';
}

/** PostgREST / Postgres errors from `commit_student_lesson_to_makeup_credit`. */
export function formatMakeupCreditRpcError(rawMessage: string): string {
  const m = rawMessage.trim();
  if (m.includes('MAKEUP_CONVERSION_TOO_LATE')) {
    return 'Make-up credits can only be saved when the lesson is at least 24 hours away. Use an NML request when it is sooner than that.';
  }
  if (m.includes('CREDIT_ALREADY_ISSUED') || m.includes('makeup_credits_original_lesson_unique')) {
    return 'This lesson already has a make-up credit on file.';
  }
  if (m.includes('LESSON_NOT_VISIBLE') || m.includes('LESSON_NOT_FOUND')) {
    return 'You cannot convert this lesson with the current account.';
  }
  if (m.includes('LESSON_TERMINAL') || m.includes('LESSON_DELETED')) {
    return 'This lesson is no longer active for conversion.';
  }
  if (m.includes('NOT_PARTICIPANT')) {
    return 'No matching student participant was found for your profile on this lesson.';
  }
  if (m.includes('NOT_AUTHENTICATED')) {
    return 'Sign in is required.';
  }
  return m || 'Could not save make-up credit.';
}
