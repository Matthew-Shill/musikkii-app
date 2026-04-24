import type { NmlPipelineSummary } from './lessonIntentSummary';

/**
 * Time relative to a single lesson occurrence (start/end instants).
 * - `ge24h`: at least 24 hours before **start**
 * - `lt24h_before_start`: under 24h before start, still before start
 * - `after_start`: start has passed, **end** not yet passed
 * - `after_end`: lesson window ended (or treat post-lesson read-only)
 */
export type LearnerLessonTimingSegment = 'ge24h' | 'lt24h_before_start' | 'after_start' | 'after_end';

export function getLearnerLessonTimingSegment(
  startsAtIso: string,
  endsAtIso: string,
  nowMs: number = Date.now()
): LearnerLessonTimingSegment {
  const start = new Date(startsAtIso).getTime();
  const end = new Date(endsAtIso).getTime();
  if (nowMs >= end) return 'after_end';
  if (nowMs >= start) return 'after_start';
  const hours = (start - nowMs) / (1000 * 60 * 60);
  if (hours >= 24) return 'ge24h';
  return 'lt24h_before_start';
}

export const LEARNER_SLOT_POLICY_NOTE =
  'When you reschedule, cancel, request make-up credit, or use NML, the original lesson time stays reserved in the schedule so that slot is not reopened for accidental double-booking.';

export type LearnerLessonActionPolicyInput = {
  startsAtIso: string;
  endsAtIso: string;
  lessonDbStatus: string;
  nmlSummary: NmlPipelineSummary;
  nowMs?: number;
};

export type LearnerLessonActionPolicy = {
  timing: LearnerLessonTimingSegment;
  /** DB terminal states — no learner actions except none. */
  lessonTerminal: boolean;
  /** No actions (ended lesson window or terminal). */
  allActionsClosed: boolean;
  nmlRequested: boolean;
  canRequestNml: boolean;
  canUndoNml: boolean;
  canReschedule: boolean;
  canRequestMakeupCredit: boolean;
  canCancelLesson: boolean;
  hints: {
    nml?: string;
    reschedule?: string;
    makeup?: string;
    cancel?: string;
    undoNml?: string;
  };
};

/**
 * Single source of truth for learner/household lesson CTAs (matches product timing matrix).
 */
export function getLearnerLessonActionPolicy(input: LearnerLessonActionPolicyInput): LearnerLessonActionPolicy {
  const nowMs = input.nowMs ?? Date.now();
  const timing = getLearnerLessonTimingSegment(input.startsAtIso, input.endsAtIso, nowMs);
  const lessonTerminal = input.lessonDbStatus === 'completed' || input.lessonDbStatus === 'cancelled';
  const allActionsClosed = lessonTerminal || timing === 'after_end';

  const nmlRequested = input.nmlSummary.status === 'pending';
  const beforeStart = timing === 'ge24h' || timing === 'lt24h_before_start';
  const ge24 = timing === 'ge24h';

  const hints: LearnerLessonActionPolicy['hints'] = {};

  // A / B / C — NML request only before start; undo only before start while pending
  const canRequestNml = !allActionsClosed && beforeStart && !nmlRequested;
  if (!allActionsClosed && beforeStart && nmlRequested) {
    hints.nml = 'You already have an NML request on this lesson.';
  }
  if (!allActionsClosed && !beforeStart) {
    hints.nml = 'NML is only available before lesson start.';
  }

  const canUndoNml = !lessonTerminal && nmlRequested && beforeStart;
  if (nmlRequested && !beforeStart) {
    hints.undoNml = 'Undo NML is only available before lesson start.';
  }

  // Reschedule & make-up: ≥24h before start only (B disables; C disables)
  let canReschedule = !allActionsClosed && beforeStart && ge24;
  let canRequestMakeupCredit = canReschedule;
  if (!allActionsClosed && beforeStart && !ge24) {
    hints.reschedule = 'Reschedule is available until 24 hours before start.';
    hints.makeup = 'Make-up credit is available until 24 hours before start.';
    canReschedule = false;
    canRequestMakeupCredit = false;
  }
  if (!allActionsClosed && !beforeStart) {
    hints.reschedule = 'Reschedule is only available before lesson start.';
    hints.makeup = 'Make-up credit is only available before lesson start.';
    canReschedule = false;
    canRequestMakeupCredit = false;
  }

  // Cancel: only before lesson start (not after start); not if terminal
  const canCancelLesson = !lessonTerminal && beforeStart;
  if (timing === 'after_end' && !lessonTerminal) {
    hints.cancel = 'This lesson has ended; cancellation is no longer available here.';
  } else if (timing === 'after_start' && !lessonTerminal) {
    hints.cancel = 'Cancellation is only available before lesson start.';
  }

  return {
    timing,
    lessonTerminal,
    allActionsClosed,
    nmlRequested,
    canRequestNml,
    canUndoNml,
    canReschedule,
    canRequestMakeupCredit,
    canCancelLesson,
    hints,
  };
}
