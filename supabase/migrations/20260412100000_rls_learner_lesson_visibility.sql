-- Learner lesson reads were blocked by circular RLS:
-- lesson_participants required a visible lesson, while lessons_select_participant_student
-- required visible lesson_participants → no rows for students.
--
-- Also, lessons embedded select teachers(profiles) needs students to read teacher + teacher profile rows.

-- ---------------------------------------------------------------------------
-- lesson_participants: student can read their own rows without going through lessons first
-- ---------------------------------------------------------------------------
drop policy if exists "lp_select_student_own" on public.lesson_participants;
create policy "lp_select_student_own"
  on public.lesson_participants for select
  using (
    exists (
      select 1
      from public.students s
      where s.id = lesson_participants.student_id
        and s.profile_id = auth.uid()
    )
  );
-- ---------------------------------------------------------------------------
-- teachers: student may read a teacher row when they share a non-deleted lesson
-- ---------------------------------------------------------------------------
drop policy if exists "teachers_select_for_student_lesson" on public.teachers;
create policy "teachers_select_for_student_lesson"
  on public.teachers for select
  using (
    exists (
      select 1
      from public.lessons l
      join public.lesson_participants lp on lp.lesson_id = l.id
      join public.students s on s.id = lp.student_id
      where l.teacher_id = teachers.id
        and l.deleted_at is null
        and s.profile_id = auth.uid()
    )
  );
-- ---------------------------------------------------------------------------
-- profiles: student may read a teacher's profile when they share a lesson (for embeds)
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_for_student_teacher" on public.profiles;
create policy "profiles_select_for_student_teacher"
  on public.profiles for select
  using (
    exists (
      select 1
      from public.teachers t
      join public.lessons l on l.teacher_id = t.id and l.deleted_at is null
      join public.lesson_participants lp on lp.lesson_id = l.id
      join public.students s on s.id = lp.student_id
      where t.profile_id = profiles.id
        and s.profile_id = auth.uid()
    )
  );
