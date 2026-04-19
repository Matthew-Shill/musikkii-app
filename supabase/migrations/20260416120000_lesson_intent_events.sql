-- Append-only student/teacher lesson intent workflow (confirm, reschedule, NML, clear, handled).
-- Application derives active intent via @musikkii/core reducers over this stream.

create table if not exists public.lesson_intent_events (
  id uuid primary key default gen_random_uuid(),
  lesson_participant_id uuid not null references public.lesson_participants (id) on delete cascade,
  actor_profile_id uuid not null references public.profiles (id) on delete restrict,
  type text not null,
  payload jsonb not null default '{}'::jsonb,
  recorded_at timestamptz not null default now(),
  constraint lesson_intent_events_type_chk check (
    type in (
      'student.attendance_confirmed',
      'student.reschedule_requested',
      'student.nml_requested',
      'student.intent_cleared',
      'teacher.reschedule_handled',
      'teacher.nml_handled'
    )
  )
);
create index if not exists lesson_intent_events_lp_recorded_idx
  on public.lesson_intent_events (lesson_participant_id, recorded_at desc);
comment on table public.lesson_intent_events is
  'Append-only intent events per lesson participant; UI state is projected in app code (@musikkii/core).';
alter table public.lesson_intent_events enable row level security;
-- Read: any role that can see the parent lesson (subquery respects lessons RLS).
drop policy if exists "lie_select_via_visible_lesson" on public.lesson_intent_events;
create policy "lie_select_via_visible_lesson"
  on public.lesson_intent_events for select
  using (
    exists (
      select 1
      from public.lesson_participants lp
      where lp.id = lesson_intent_events.lesson_participant_id
        and exists (select 1 from public.lessons l where l.id = lp.lesson_id)
    )
  );
-- Student (or household guardian acting for a child learner) records student.* intents.
drop policy if exists "lie_insert_student_intents" on public.lesson_intent_events;
create policy "lie_insert_student_intents"
  on public.lesson_intent_events for insert
  with check (
    actor_profile_id = auth.uid()
    and type in (
      'student.attendance_confirmed',
      'student.reschedule_requested',
      'student.nml_requested',
      'student.intent_cleared'
    )
    and (
      exists (
        select 1
        from public.lesson_participants lp
        join public.students s on s.id = lp.student_id
        where lp.id = lesson_intent_events.lesson_participant_id
          and s.profile_id = auth.uid()
      )
      or exists (
        select 1
        from public.lesson_participants lp
        join public.students s on s.id = lp.student_id
        join public.household_members hm_child on hm_child.profile_id = s.profile_id
        join public.household_members hm_guardian
          on hm_guardian.household_id = hm_child.household_id
        where lp.id = lesson_intent_events.lesson_participant_id
          and hm_guardian.profile_id = auth.uid()
          and hm_guardian.member_role in ('parent', 'guardian', 'family')
          and hm_child.member_role = 'student'
      )
    )
  );
-- Teacher for this lesson records teacher.* handling events.
drop policy if exists "lie_insert_teacher_handled" on public.lesson_intent_events;
create policy "lie_insert_teacher_handled"
  on public.lesson_intent_events for insert
  with check (
    actor_profile_id = auth.uid()
    and type in ('teacher.reschedule_handled', 'teacher.nml_handled')
    and exists (
      select 1
      from public.lesson_participants lp
      join public.lessons l on l.id = lp.lesson_id
      join public.teachers t on t.id = l.teacher_id
      where lp.id = lesson_intent_events.lesson_participant_id
        and t.profile_id = auth.uid()
    )
  );
grant select, insert on table public.lesson_intent_events to authenticated;
