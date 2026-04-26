/**
 * Deterministic relational fixtures for local scheduling / credits E2E.
 * Run after Auth users + profiles exist (`npm run seed:dev-users`).
 *
 * Uses fixed UUID primary keys so re-runs are idempotent (delete by id, then insert).
 * Lesson times are computed from **run time** so the >24h and <24h scenarios stay valid.
 */
import type { SupabaseClient } from '@supabase/supabase-js';

/** RFC-4122 v4-shaped fixed ids (version nibble 4, variant 8–b). */
export const DEV_SCHEDULE_SEED_IDS = {
  household: 'cafe1000-0000-4000-8000-000000000001',
  teacher: 'cafe1000-0000-4000-8000-000000000002',
  studentChild: 'cafe1000-0000-4000-8000-000000000003',
  studentAdultInHousehold: 'cafe1000-0000-4000-8000-000000000004',
  segmentMain: 'cafe1000-0000-4000-8000-000000000010',
  exceptionBlock: 'cafe1000-0000-4000-8000-000000000011',
  lessonSelfRescheduleOk: 'cafe1000-0000-4000-8000-000000000101',
  lessonUnder24hNml: 'cafe1000-0000-4000-8000-000000000102',
  lessonBlockedOverlap: 'cafe1000-0000-4000-8000-000000000103',
  lessonTerminalCancelled: 'cafe1000-0000-4000-8000-000000000104',
  lessonMakeupSource: 'cafe1000-0000-4000-8000-000000000105',
  lessonPastCompleted: 'cafe1000-0000-4000-8000-000000000106',
  lessonAdultSolo: 'cafe1000-0000-4000-8000-000000000107',
  lessonTodayUpcoming: 'cafe1000-0000-4000-8000-000000000108',
  lessonTodayCompletedA: 'cafe1000-0000-4000-8000-000000000109',
  lessonTodayCompletedB: 'cafe1000-0000-4000-8000-000000000110',
  lpSelfRescheduleOk: 'cafe1000-0000-4000-8000-000000000201',
  lpUnder24hNml: 'cafe1000-0000-4000-8000-000000000202',
  lpBlockedOverlap: 'cafe1000-0000-4000-8000-000000000203',
  lpTerminal: 'cafe1000-0000-4000-8000-000000000204',
  lpMakeup: 'cafe1000-0000-4000-8000-000000000205',
  lpPast: 'cafe1000-0000-4000-8000-000000000206',
  lpAdultSolo: 'cafe1000-0000-4000-8000-000000000207',
  lpTodayUpcoming: 'cafe1000-0000-4000-8000-000000000208',
  lpTodayCompletedA: 'cafe1000-0000-4000-8000-000000000209',
  lpTodayCompletedB: 'cafe1000-0000-4000-8000-000000000210',
  intentNmlOpen: 'cafe1000-0000-4000-8000-000000000301',
  intentRescheduleOpen: 'cafe1000-0000-4000-8000-000000000302',
  makeupCreditFrom105: 'cafe1000-0000-4000-8000-000000000401',
} as const;

const LESSON_IDS: readonly string[] = [
  DEV_SCHEDULE_SEED_IDS.lessonSelfRescheduleOk,
  DEV_SCHEDULE_SEED_IDS.lessonUnder24hNml,
  DEV_SCHEDULE_SEED_IDS.lessonBlockedOverlap,
  DEV_SCHEDULE_SEED_IDS.lessonTerminalCancelled,
  DEV_SCHEDULE_SEED_IDS.lessonMakeupSource,
  DEV_SCHEDULE_SEED_IDS.lessonPastCompleted,
  DEV_SCHEDULE_SEED_IDS.lessonAdultSolo,
  DEV_SCHEDULE_SEED_IDS.lessonTodayUpcoming,
  DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedA,
  DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedB,
];

function floorToUtcQuarterHour(d: Date): Date {
  const ms = 15 * 60 * 1000;
  return new Date(Math.floor(d.getTime() / ms) * ms);
}

function addHours(d: Date, hours: number): Date {
  return new Date(d.getTime() + hours * 60 * 60 * 1000);
}

export type DevActorProfileIds = {
  parent: string;
  childStudent: string;
  adultStudent: string;
  teacher: string;
};

export async function seedDevSchedulingFixtures(
  admin: SupabaseClient,
  actors: DevActorProfileIds
): Promise<void> {
  const { data: existingTeachers, error: exTchErr } = await admin
    .from('teachers')
    .select('id')
    .eq('profile_id', actors.teacher);
  if (exTchErr) throw exTchErr;
  const teacherIdsToWipe = new Set<string>([DEV_SCHEDULE_SEED_IDS.teacher]);
  for (const row of existingTeachers ?? []) {
    if (row.id) teacherIdsToWipe.add(String(row.id));
  }

  const wipeLessonIdSet = new Set<string>([...LESSON_IDS]);
  const tidList = [...teacherIdsToWipe];
  for (const col of ['id', 'household_id', 'teacher_id'] as const) {
    let q = admin.from('lessons').select('id');
    if (col === 'id') q = q.in('id', [...LESSON_IDS]);
    else if (col === 'household_id') q = q.eq('household_id', DEV_SCHEDULE_SEED_IDS.household);
    else q = q.in('teacher_id', tidList);
    const { data: rows, error } = await q;
    if (error) throw error;
    for (const r of rows ?? []) wipeLessonIdSet.add(String(r.id));
  }
  const wipeLessonIds = [...wipeLessonIdSet];

  const { data: lpWipe, error: lpWipeErr } =
    wipeLessonIds.length === 0
      ? { data: [] as { id: string }[], error: null }
      : await admin.from('lesson_participants').select('id').in('lesson_id', wipeLessonIds);
  if (lpWipeErr) throw lpWipeErr;
  const wipeLpIds = (lpWipe ?? []).map((r) => String(r.id));

  if (wipeLpIds.length) {
    const { error: lieDel0 } = await admin.from('lesson_intent_events').delete().in('lesson_participant_id', wipeLpIds);
    if (lieDel0) throw lieDel0;
  }

  if (wipeLessonIds.length) {
    const { error: lsraDel0 } = await admin.from('lesson_self_reschedule_audit').delete().in('lesson_id', wipeLessonIds);
    if (lsraDel0) throw lsraDel0;
    const { error: mcDel0 } = await admin.from('makeup_credits').delete().in('original_lesson_id', wipeLessonIds);
    if (mcDel0) throw mcDel0;
    const { error: lpDel0 } = await admin.from('lesson_participants').delete().in('lesson_id', wipeLessonIds);
    if (lpDel0) throw lpDel0;
    const { error: lDel0 } = await admin.from('lessons').delete().in('id', wipeLessonIds);
    if (lDel0) throw lDel0;
  }

  const { error: exDelAll } = await admin
    .from('teacher_availability_exceptions')
    .delete()
    .in('teacher_id', [...teacherIdsToWipe]);
  if (exDelAll) throw exDelAll;

  const { error: segDelAll } = await admin
    .from('teacher_availability_segments')
    .delete()
    .in('teacher_id', [...teacherIdsToWipe]);
  if (segDelAll) throw segDelAll;

  const { error: tsaDelAll } = await admin.from('teacher_student_assignments').delete().in('teacher_id', [...teacherIdsToWipe]);
  if (tsaDelAll) throw tsaDelAll;

  const { error: tchDelAll } = await admin.from('teachers').delete().in('id', [...teacherIdsToWipe]);
  if (tchDelAll) throw tchDelAll;

  const { error: stDelProfiles } = await admin
    .from('students')
    .delete()
    .in('profile_id', [actors.childStudent, actors.adultStudent]);
  if (stDelProfiles) throw stDelProfiles;

  const { error: hmDel } = await admin.from('household_members').delete().eq('household_id', DEV_SCHEDULE_SEED_IDS.household);
  if (hmDel) throw hmDel;

  const { error: hhDel } = await admin.from('households').delete().eq('id', DEV_SCHEDULE_SEED_IDS.household);
  if (hhDel) throw hhDel;

  const now = new Date();
  // Scenario: self-reschedule + reschedule intent + makeup conversion all need starts_at >= now+24h in DB guards.
  const tSelfOk = floorToUtcQuarterHour(addHours(now, 72));
  const tSelfOkEnd = addHours(tSelfOk, 1);
  // Scenario: under 24h → list/commit self-reschedule RPCs fail; NML path is the product escape hatch.
  const tNml = floorToUtcQuarterHour(addHours(now, 3));
  const tNmlEnd = addHours(tNml, 1);
  // Scenario: lesson window sits inside a teacher_availability_exceptions row (>24h out so RPCs still run).
  const tBlockExStart = floorToUtcQuarterHour(addHours(now, 120));
  const tBlockExEnd = addHours(tBlockExStart, 6);
  const tBlockedLessonStart = addHours(tBlockExStart, 1);
  const tBlockedLessonEnd = addHours(tBlockedLessonStart, 1);
  // Scenario: terminal cancelled (no self-serve moves).
  const tTerminalStart = floorToUtcQuarterHour(addHours(now, 200));
  const tTerminalEnd = addHours(tTerminalStart, 1);
  // Scenario: already converted to makeup credit (cancelled lesson + makeup_credits row, as after RPC).
  const tMakeupLessonStart = floorToUtcQuarterHour(addHours(now, 240));
  const tMakeupLessonEnd = addHours(tMakeupLessonStart, 1);
  // Scenario: history / calendar “past” tab.
  const tPastStart = floorToUtcQuarterHour(addHours(now, -240));
  const tPastEnd = addHours(tPastStart, 1);
  // Extra: adult learner solo row (household_id null) for adult-student.dev calendar visibility.
  const tAdultSoloStart = floorToUtcQuarterHour(addHours(now, 96));
  const tAdultSoloEnd = addHours(tAdultSoloStart, 1);
  // Extra: "today" coverage for dashboard testing (upcoming + completed tab rows).
  const tTodayUpcomingStart = floorToUtcQuarterHour(addHours(now, 1));
  const tTodayUpcomingEnd = addHours(tTodayUpcomingStart, 1);
  const tTodayCompletedAStart = floorToUtcQuarterHour(addHours(now, -5));
  const tTodayCompletedAEnd = addHours(tTodayCompletedAStart, 1);
  const tTodayCompletedBStart = floorToUtcQuarterHour(addHours(now, -2));
  const tTodayCompletedBEnd = addHours(tTodayCompletedBStart, 1);

  const teacherId = DEV_SCHEDULE_SEED_IDS.teacher;
  const householdId = DEV_SCHEDULE_SEED_IDS.household;
  const studentChild = DEV_SCHEDULE_SEED_IDS.studentChild;
  const studentAdultHh = DEV_SCHEDULE_SEED_IDS.studentAdultInHousehold;

  const { error: hhIns } = await admin.from('households').insert({
    id: householdId,
    name: 'DEV Seed — Parent + two students',
  });
  if (hhIns) throw hhIns;

  const { error: hmIns } = await admin.from('household_members').insert([
    { household_id: householdId, profile_id: actors.parent, member_role: 'parent' },
    { household_id: householdId, profile_id: actors.childStudent, member_role: 'student' },
    { household_id: householdId, profile_id: actors.adultStudent, member_role: 'student' },
  ]);
  if (hmIns) throw hmIns;

  const { error: tIns } = await admin.from('teachers').insert({
    id: teacherId,
    profile_id: actors.teacher,
  });
  if (tIns) throw tIns;

  const { error: sChildIns } = await admin.from('students').insert({
    id: studentChild,
    profile_id: actors.childStudent,
  });
  if (sChildIns) throw sChildIns;

  const { error: sAdultIns } = await admin.from('students').insert({
    id: studentAdultHh,
    profile_id: actors.adultStudent,
  });
  if (sAdultIns) throw sAdultIns;

  const { error: tsaIns } = await admin.from('teacher_student_assignments').insert([
    { teacher_id: teacherId, student_id: studentChild, status: 'active' },
    { teacher_id: teacherId, student_id: studentAdultHh, status: 'active' },
  ]);
  if (tsaIns) throw tsaIns;

  const segStart = floorToUtcQuarterHour(addHours(now, -2));
  const segEnd = addHours(now, 400);
  const { error: segIns } = await admin.from('teacher_availability_segments').insert({
    id: DEV_SCHEDULE_SEED_IDS.segmentMain,
    teacher_id: teacherId,
    starts_at: segStart.toISOString(),
    ends_at: segEnd.toISOString(),
  });
  if (segIns) throw segIns;

  const { error: exIns } = await admin.from('teacher_availability_exceptions').insert({
    id: DEV_SCHEDULE_SEED_IDS.exceptionBlock,
    teacher_id: teacherId,
    starts_at: tBlockExStart.toISOString(),
    ends_at: tBlockExEnd.toISOString(),
    label: 'DEV blocked window (self-reschedule slots excluded here)',
  });
  if (exIns) throw exIns;

  const lessonsInsert = [
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonSelfRescheduleOk,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Self-reschedule eligible (>24h)',
      status: 'scheduled',
      starts_at: tSelfOk.toISOString(),
      ends_at: tSelfOkEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: try list_lesson_self_reschedule_candidates + commit_student_lesson_self_reschedule as child or parent.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonUnder24hNml,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Under 24h (NML-only for messaging)',
      status: 'scheduled',
      starts_at: tNml.toISOString(),
      ends_at: tNmlEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: self-reschedule RPCs reject; use NML request panel.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonBlockedOverlap,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Lesson time overlaps blocked exception',
      status: 'scheduled',
      starts_at: tBlockedLessonStart.toISOString(),
      ends_at: tBlockedLessonEnd.toISOString(),
      modality: 'virtual',
      notes:
        'Scenario: teacher has time-off exception overlapping this window; candidate slots skip blocked intervals; commit rejects SLOT_BLOCKED_TIME_OFF into overlap.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonTerminalCancelled,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Terminal cancelled lesson',
      status: 'cancelled',
      starts_at: tTerminalStart.toISOString(),
      ends_at: tTerminalEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: calendar / dashboard should show cancelled; intents + self-reschedule blocked.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonMakeupSource,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Cancelled + makeup credit issued',
      status: 'cancelled',
      starts_at: tMakeupLessonStart.toISOString(),
      ends_at: tMakeupLessonEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: mirrors post–commit_student_lesson_to_makeup_credit state (credit row + cancelled lesson).',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonPastCompleted,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Past completed lesson',
      status: 'completed',
      starts_at: tPastStart.toISOString(),
      ends_at: tPastEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: history / completed views.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonAdultSolo,
      teacher_id: teacherId,
      household_id: null,
      subject: 'DEV — Adult learner solo (no household on lesson)',
      status: 'scheduled',
      starts_at: tAdultSoloStart.toISOString(),
      ends_at: tAdultSoloEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: sign in as adult-student.dev; roster is not household-linked but this lesson should appear.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonTodayUpcoming,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Today upcoming lesson',
      status: 'scheduled',
      starts_at: tTodayUpcomingStart.toISOString(),
      ends_at: tTodayUpcomingEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: Today tab Upcoming should include this lesson.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedA,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Today completed lesson A',
      status: 'completed',
      starts_at: tTodayCompletedAStart.toISOString(),
      ends_at: tTodayCompletedAEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: Today tab Completed should include this lesson.',
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedB,
      teacher_id: teacherId,
      household_id: householdId,
      subject: 'DEV — Today completed lesson B',
      status: 'completed',
      starts_at: tTodayCompletedBStart.toISOString(),
      ends_at: tTodayCompletedBEnd.toISOString(),
      modality: 'virtual',
      notes: 'Scenario: Another completed row for today tab testing.',
    },
  ];

  const { error: lIns } = await admin.from('lessons').insert(lessonsInsert);
  if (lIns) throw lIns;

  const { error: lpIns } = await admin.from('lesson_participants').insert([
    {
      id: DEV_SCHEDULE_SEED_IDS.lpSelfRescheduleOk,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonSelfRescheduleOk,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpUnder24hNml,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonUnder24hNml,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpBlockedOverlap,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonBlockedOverlap,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpTerminal,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonTerminalCancelled,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpMakeup,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonMakeupSource,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpPast,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonPastCompleted,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpAdultSolo,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonAdultSolo,
      student_id: studentAdultHh,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpTodayUpcoming,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonTodayUpcoming,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpTodayCompletedA,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedA,
      student_id: studentChild,
    },
    {
      id: DEV_SCHEDULE_SEED_IDS.lpTodayCompletedB,
      lesson_id: DEV_SCHEDULE_SEED_IDS.lessonTodayCompletedB,
      student_id: studentChild,
    },
  ]);
  if (lpIns) throw lpIns;

  const { error: lieNml } = await admin.from('lesson_intent_events').insert({
    id: DEV_SCHEDULE_SEED_IDS.intentNmlOpen,
    lesson_participant_id: DEV_SCHEDULE_SEED_IDS.lpUnder24hNml,
    actor_profile_id: actors.childStudent,
    type: 'student.nml_requested',
    payload: { devSeed: 'open NML on <24h lesson' },
  });
  if (lieNml) throw lieNml;

  const { error: lieRe } = await admin.from('lesson_intent_events').insert({
    id: DEV_SCHEDULE_SEED_IDS.intentRescheduleOpen,
    lesson_participant_id: DEV_SCHEDULE_SEED_IDS.lpSelfRescheduleOk,
    actor_profile_id: actors.childStudent,
    type: 'student.reschedule_requested',
    payload: { devSeed: 'open teacher reschedule thread (>24h)' },
  });
  if (lieRe) throw lieRe;

  const durationMins = Math.max(
    1,
    Math.round((tMakeupLessonEnd.getTime() - tMakeupLessonStart.getTime()) / 60000)
  );

  const { error: mcIns } = await admin.from('makeup_credits').insert({
    id: DEV_SCHEDULE_SEED_IDS.makeupCreditFrom105,
    original_lesson_id: DEV_SCHEDULE_SEED_IDS.lessonMakeupSource,
    teacher_id: teacherId,
    household_id: householdId,
    student_id: studentChild,
    created_by_profile_id: actors.parent,
    duration_minutes: durationMins,
    status: 'available',
  });
  if (mcIns) throw mcIns;
}
