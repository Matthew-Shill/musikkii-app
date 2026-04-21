/** Row from `public.lesson_intent_events` (append-only intent stream). */
export type LessonIntentEventRow = {
  id: string;
  lesson_participant_id: string;
  actor_profile_id: string;
  type: string;
  payload: Record<string, unknown>;
  recorded_at: string;
};
