/** Stored in `public.lessons.outcome` (snake_case values match DB check constraint). */
export type LessonCompletionOutcome =
  | 'completed'
  | 'completed_makeup'
  | 'nml_completed'
  | 'student_missed'
  | 'teacher_cancelled';

const OUTCOME_LIST = [
  'completed',
  'completed_makeup',
  'nml_completed',
  'student_missed',
  'teacher_cancelled',
] as const satisfies readonly LessonCompletionOutcome[];

export const LESSON_OUTCOME_VALUES = new Set<string>(OUTCOME_LIST);

export function parseLessonOutcome(raw: unknown): LessonCompletionOutcome | null {
  if (typeof raw !== 'string' || !LESSON_OUTCOME_VALUES.has(raw)) return null;
  return raw as LessonCompletionOutcome;
}

export const LESSON_OUTCOME_OPTIONS: { value: LessonCompletionOutcome; label: string }[] = [
  { value: 'completed', label: 'Completed' },
  { value: 'completed_makeup', label: 'Completed (Make-up)' },
  { value: 'nml_completed', label: 'NML Completed' },
  { value: 'student_missed', label: 'Student Missed' },
  { value: 'teacher_cancelled', label: 'Teacher Cancelled' },
];

/** Teacher attendance UI: maps to `LessonCompletionOutcome` in the database. */
export const ATTENDANCE_UI_OPTIONS: {
  value: LessonCompletionOutcome;
  label: string;
  dotClass: string;
  rowHoverClass: string;
}[] = [
  { value: 'completed', label: 'Attended', dotClass: 'bg-emerald-500', rowHoverClass: 'hover:bg-emerald-50/90' },
  {
    value: 'completed_makeup',
    label: 'Attended (Make-up)',
    dotClass: 'bg-amber-400',
    rowHoverClass: 'hover:bg-amber-50/90',
  },
  { value: 'nml_completed', label: 'NML Completed', dotClass: 'bg-violet-500', rowHoverClass: 'hover:bg-violet-50/90' },
  { value: 'student_missed', label: 'Student Missed', dotClass: 'bg-red-500', rowHoverClass: 'hover:bg-red-50/90' },
  {
    value: 'teacher_cancelled',
    label: 'Teacher Cancelled',
    dotClass: 'bg-orange-500',
    rowHoverClass: 'hover:bg-orange-50/90',
  },
];

export type AssignmentType =
  | 'warmup'
  | 'technique'
  | 'scale'
  | 'chord_theory'
  | 'sight_reading'
  | 'ear_training'
  | 'repertoire'
  | 'full_song';

export const ASSIGNMENT_TYPE_OPTIONS: { value: AssignmentType; label: string }[] = [
  { value: 'warmup', label: 'Warmup' },
  { value: 'technique', label: 'Technique' },
  { value: 'scale', label: 'Scale' },
  { value: 'chord_theory', label: 'Chord / Theory' },
  { value: 'sight_reading', label: 'Sight Reading' },
  { value: 'ear_training', label: 'Ear Training' },
  { value: 'repertoire', label: 'Repertoire' },
  { value: 'full_song', label: 'Full Song' },
];

const ASSIGNMENT_BASE_XP: Record<AssignmentType, number> = {
  warmup: 5,
  technique: 5,
  scale: 10,
  chord_theory: 10,
  sight_reading: 10,
  ear_training: 10,
  repertoire: 15,
  full_song: 20,
};

const DIFFICULTY_MULTIPLIERS: Record<1 | 2 | 3 | 4 | 5, number> = {
  1: 1.0,
  2: 1.1,
  3: 1.2,
  4: 1.3,
  5: 1.5,
};

export function normalizeDifficulty(raw: unknown): 1 | 2 | 3 | 4 | 5 {
  const n = typeof raw === 'number' ? raw : Number(raw);
  if (n <= 1) return 1;
  if (n >= 5) return 5;
  if (n < 1.5) return 1;
  if (n < 2.5) return 2;
  if (n < 3.5) return 3;
  if (n < 4.5) return 4;
  return 5;
}

/** Shared XP helper (single source of truth for assignment XP). */
export function calculateAssignmentXP(input: { assignmentType: AssignmentType; difficulty: 1 | 2 | 3 | 4 | 5 }): number {
  const base = ASSIGNMENT_BASE_XP[input.assignmentType];
  const multiplier = DIFFICULTY_MULTIPLIERS[input.difficulty];
  // TODO(xp-bonuses): add completion/context bonuses (+recording, +NoteCheck) once submission states are persisted.
  return Math.round(base * multiplier);
}

export type LessonResourceDraft = {
  id?: string;
  title: string;
  resource_type: string;
  level: string;
  file_name?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
};

export type LessonResourceSnapshot = {
  id: string;
  title: string;
  resource_type: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
  level?: string;
};

export type LessonAssignmentNote = {
  id: string;
  title: string;
  description: string;
  assignment_type: AssignmentType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  xp: number;
  resource_id: string | null;
  resource_title?: string | null;
  resource_snapshot?: LessonResourceSnapshot | null;
};

/****
 * TODO (future): student profile should host big-picture goals + quarterly review cadence,
 * recordings, assignment status, recent notes, and teacher evaluation context.
 * TODO (future): instrument tooling support (SVGuitar, VexChords) for guitar/ukulele/piano diagrams.
 */

/** Persisted in `public.lessons.lesson_notes` (jsonb). */
export type LessonNotesRecord = {
  /** Legacy key: intentionally retained in DB shape for backward compatibility. */
  goals: string[];
  notes: string;
  assignments: LessonAssignmentNote[];
  reference_resources?: LessonResourceSnapshot[];
  send_to_student?: boolean;
  send_to_parent?: boolean;
  /** Legacy keys still read for compatibility. */
  email_student?: boolean;
  email_parent?: boolean;
  resource_drafts?: LessonResourceDraft[];
};

export const LESSON_RESOURCE_TYPE_OPTIONS = [
  'song',
  'video',
  'lyrics / chords',
  'lead sheet',
  'sheet music',
  'warmup',
  'sight reading',
  'rhythm training',
  'other',
] as const;

export const LESSON_RESOURCE_LEVEL_OPTIONS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

function isAssignmentType(raw: unknown): raw is AssignmentType {
  return typeof raw === 'string' && ASSIGNMENT_TYPE_OPTIONS.some((o) => o.value === raw);
}

export function createEmptyLessonAssignment(seed?: Partial<LessonAssignmentNote>): LessonAssignmentNote {
  const assignment_type: AssignmentType = isAssignmentType(seed?.assignment_type) ? seed.assignment_type : 'technique';
  const difficulty = normalizeDifficulty(seed?.difficulty ?? 2);
  return {
    id: seed?.id && typeof seed.id === 'string' ? seed.id : crypto.randomUUID(),
    title: typeof seed?.title === 'string' ? seed.title : '',
    description: typeof seed?.description === 'string' ? seed.description : '',
    assignment_type,
    difficulty,
    xp: calculateAssignmentXP({ assignmentType: assignment_type, difficulty }),
    resource_id: typeof seed?.resource_id === 'string' ? seed.resource_id : null,
    resource_title: typeof seed?.resource_title === 'string' ? seed.resource_title : null,
  };
}

export function emptyLessonNotesRecord(): LessonNotesRecord {
  return { goals: [], notes: '', assignments: [] };
}

function normalizeResourceDrafts(raw: unknown): LessonResourceDraft[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const drafts: LessonResourceDraft[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    const title = typeof r.title === 'string' ? r.title.trim() : '';
    const resource_type = typeof r.resource_type === 'string' ? r.resource_type.trim() : '';
    const level = typeof r.level === 'string' ? r.level.trim() : '';
    const file_name = typeof r.file_name === 'string' ? r.file_name : undefined;
    const id = typeof r.id === 'string' ? r.id : undefined;
    const difficulty = r.difficulty != null ? normalizeDifficulty(r.difficulty) : undefined;
    if (!title && !resource_type) continue;
    drafts.push({ title, resource_type, level, file_name, id, difficulty });
  }
  return drafts.length > 0 ? drafts : undefined;
}

function normalizeAssignments(raw: unknown): LessonAssignmentNote[] {
  if (!Array.isArray(raw)) return [];
  const normalized: LessonAssignmentNote[] = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      const title = item.trim();
      if (!title) continue;
      normalized.push(createEmptyLessonAssignment({ title }));
      continue;
    }
    if (!item || typeof item !== 'object') continue;
    const r = item as Record<string, unknown>;
    const assignment_type =
      r.assignment_type === 'sight_reading_ear_training'
        ? 'sight_reading'
        : isAssignmentType(r.assignment_type)
          ? r.assignment_type
          : 'technique';
    const difficulty = normalizeDifficulty(r.difficulty ?? 2);
    const xp =
      typeof r.xp === 'number' && Number.isFinite(r.xp)
        ? Math.round(r.xp)
        : calculateAssignmentXP({ assignmentType: assignment_type, difficulty });
    const title = typeof r.title === 'string' ? r.title : '';
    const description = typeof r.description === 'string' ? r.description : '';
    const id = typeof r.id === 'string' ? r.id : crypto.randomUUID();
    const resource_id = typeof r.resource_id === 'string' ? r.resource_id : null;
    const resource_title = typeof r.resource_title === 'string' ? r.resource_title : null;
    const resource_snapshot =
      r.resource_snapshot && typeof r.resource_snapshot === 'object'
        ? (r.resource_snapshot as LessonResourceSnapshot)
        : null;
    normalized.push({
      id,
      title,
      description,
      assignment_type,
      difficulty,
      xp,
      resource_id,
      resource_title,
      resource_snapshot,
    });
  }
  return normalized;
}

export function normalizeLessonNotes(raw: unknown): LessonNotesRecord {
  const base = emptyLessonNotesRecord();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  const goals = Array.isArray(o.goals) ? o.goals.filter((g): g is string => typeof g === 'string') : [];
  const notes = typeof o.notes === 'string' ? o.notes : '';
  const assignments = normalizeAssignments(o.assignments);

  const send_to_student =
    typeof o.send_to_student === 'boolean'
      ? o.send_to_student
      : typeof o.email_student === 'boolean'
        ? o.email_student
        : undefined;
  const send_to_parent =
    typeof o.send_to_parent === 'boolean'
      ? o.send_to_parent
      : typeof o.email_parent === 'boolean'
        ? o.email_parent
        : undefined;

  const resource_drafts = normalizeResourceDrafts(o.resource_drafts);
  const reference_resources = Array.isArray(o.reference_resources)
    ? (o.reference_resources.filter((item): item is LessonResourceSnapshot => {
        if (!item || typeof item !== 'object') return false;
        const resource = item as Record<string, unknown>;
        return typeof resource.id === 'string' && typeof resource.title === 'string';
      }) as LessonResourceSnapshot[])
    : undefined;

  return {
    goals,
    notes,
    assignments,
    ...(send_to_student !== undefined ? { send_to_student } : {}),
    ...(send_to_parent !== undefined ? { send_to_parent } : {}),
    ...(resource_drafts ? { resource_drafts } : {}),
    ...(reference_resources ? { reference_resources } : {}),
  };
}

export function dbLessonStatusForOutcome(outcome: LessonCompletionOutcome): string {
  switch (outcome) {
    case 'student_missed':
      return 'no_show';
    case 'teacher_cancelled':
      return 'cancelled';
    default:
      return 'completed';
  }
}
