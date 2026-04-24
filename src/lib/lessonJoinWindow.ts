/** Fallback when neither lesson nor teacher provides a meeting URL. */
export const DEFAULT_VIRTUAL_MEETING_ROOM_URL = 'https://www.musikkii.com/room1';

const JOIN_WINDOW_LEAD_MS = 5 * 60 * 1000;

export function resolveVirtualMeetingUrl(
  lessonMeetingUrl?: string | null,
  teacherMeetingUrl?: string | null,
): string {
  const fromLesson = lessonMeetingUrl?.trim();
  if (fromLesson) return fromLesson;
  const fromTeacher = teacherMeetingUrl?.trim();
  if (fromTeacher) return fromTeacher;
  return DEFAULT_VIRTUAL_MEETING_ROOM_URL;
}

/**
 * Join is allowed from five minutes before start through lesson end (inclusive of both bounds).
 */
export function isLessonJoinWindow(now: Date, startsAtIso: string, endsAtIso: string): boolean {
  const startMs = new Date(startsAtIso).getTime();
  const endMs = new Date(endsAtIso).getTime();
  const t = now.getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) return false;
  return t >= startMs - JOIN_WINDOW_LEAD_MS && t <= endMs;
}
