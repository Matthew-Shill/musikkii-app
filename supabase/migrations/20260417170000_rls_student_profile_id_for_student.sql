-- students ↔ teacher_student_assignments ↔ students:
-- `students_select_assigned_teacher` reads `teacher_student_assignments`; `tsa_select_student_side`
-- inlined `select from public.students`, re-entering `students` RLS while still resolving a
-- `students` row (42P17). Other policies used the same pattern (lessons, lp, profiles, intents).

create or replace function public.student_profile_id_for_student(p_student_id uuid)
returns uuid
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_profile_id uuid;
begin
  if p_student_id is null then
    return null;
  end if;

  set local row_security = off;

  select s.profile_id into v_profile_id
  from public.students s
  where s.id = p_student_id;

  return v_profile_id;
end;
$$;
comment on function public.student_profile_id_for_student(uuid) is
  'Learner profile_id for a student row; reads students with SET LOCAL row_security=off so policies on other tables (e.g. tsa) do not recurse into students RLS.';
revoke all on function public.student_profile_id_for_student(uuid) from public;
grant execute on function public.student_profile_id_for_student(uuid) to anon;
grant execute on function public.student_profile_id_for_student(uuid) to authenticated;
grant execute on function public.student_profile_id_for_student(uuid) to service_role;
drop policy if exists "tsa_select_student_side" on public.teacher_student_assignments;
create policy "tsa_select_student_side"
  on public.teacher_student_assignments for select
  using (
    public.student_profile_id_for_student(teacher_student_assignments.student_id) = auth.uid()
  );
drop policy if exists "lp_select_student_own" on public.lesson_participants;
create policy "lp_select_student_own"
  on public.lesson_participants for select
  using (
    public.student_profile_id_for_student(lesson_participants.student_id) = auth.uid()
  );
drop policy if exists "lessons_select_participant_student" on public.lessons;
create policy "lessons_select_participant_student"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.lesson_participants lp
      where lp.lesson_id = lessons.id
        and public.student_profile_id_for_student(lp.student_id) = auth.uid()
    )
  );
drop policy if exists "lessons_select_household_guardian" on public.lessons;
create policy "lessons_select_household_guardian"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.lesson_participants lp
      join public.household_members hm_child
        on hm_child.profile_id = public.student_profile_id_for_student(lp.student_id)
      join public.household_members hm_guardian
        on hm_guardian.household_id = hm_child.household_id
      where lp.lesson_id = lessons.id
        and hm_guardian.profile_id = auth.uid()
        and hm_guardian.member_role in ('parent', 'guardian', 'family')
        and hm_child.member_role = 'student'
    )
  );
drop policy if exists "teachers_select_for_student_lesson" on public.teachers;
create policy "teachers_select_for_student_lesson"
  on public.teachers for select
  using (
    exists (
      select 1
      from public.lessons l
      join public.lesson_participants lp on lp.lesson_id = l.id
      where l.teacher_id = teachers.id
        and l.deleted_at is null
        and public.student_profile_id_for_student(lp.student_id) = auth.uid()
    )
  );
drop policy if exists "profiles_select_for_student_teacher" on public.profiles;
create policy "profiles_select_for_student_teacher"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.teachers t
      join public.lessons l on l.teacher_id = t.id and l.deleted_at is null
      join public.lesson_participants lp on lp.lesson_id = l.id
      where t.profile_id = profiles.id
        and public.student_profile_id_for_student(lp.student_id) = auth.uid()
    )
  );
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
        where lp.id = lesson_intent_events.lesson_participant_id
          and public.student_profile_id_for_student(lp.student_id) = auth.uid()
      )
      or exists (
        select 1
        from public.lesson_participants lp
        join public.household_members hm_child
          on hm_child.profile_id = public.student_profile_id_for_student(lp.student_id)
        join public.household_members hm_guardian
          on hm_guardian.household_id = hm_child.household_id
        where lp.id = lesson_intent_events.lesson_participant_id
          and hm_guardian.profile_id = auth.uid()
          and hm_guardian.member_role in ('parent', 'guardian', 'family')
          and hm_child.member_role = 'student'
      )
    )
  );
