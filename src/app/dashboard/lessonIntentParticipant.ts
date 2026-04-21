import type { LessonParticipantJoin } from './lessonJoinParsing';

/** Pick a `lesson_participants.id` the signed-in profile may use for `student.*` intent inserts (RLS validates). */
export function resolveParticipantIdForStudentIntent(
  participants: LessonParticipantJoin[],
  actorProfileId: string
): string | null {
  if (!participants.length || !actorProfileId) return null;
  const self = participants.find((p) => p.studentProfileId === actorProfileId);
  if (self) return self.lessonParticipantId;
  const child = participants.find((p) => p.studentProfileId && p.studentProfileId !== actorProfileId);
  if (child) return child.lessonParticipantId;
  return participants[0]?.lessonParticipantId ?? null;
}
