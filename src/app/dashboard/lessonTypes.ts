import type { LessonParticipantJoin } from './lessonJoinParsing';

/** Row shape for `public.lessons` selects used on dashboards (RLS-scoped). */
export type DashboardLessonRow = {
  id: string;
  subject: string | null;
  status: string;
  modality: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
  focus: string | null;
  /** From embedded `teachers → profiles` when RLS allows. */
  teacher_display_name: string | null;
  /** From embedded `lesson_participants → students → profiles` when RLS allows. */
  student_display_name: string | null;
  /** From embedded `lesson_participants` + `students` (ids for intent inserts). */
  participants: LessonParticipantJoin[];
};
