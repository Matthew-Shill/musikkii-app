-- Cross-table RLS recursion: students / lessons policies that inlined `select from profiles`
-- for teacher-manager role checks re-entered `profiles` RLS when evaluating other policies.
-- Use `profile_has_active_app_roles` (RLS-safe inner read) plus the scoped joins from
-- 20260411000000_teacher_manager_scope.sql.

drop policy if exists "students_select_teacher_manager" on public.students;
drop policy if exists "students_select_teacher_manager_scoped" on public.students;
create policy "students_select_teacher_manager"
  on public.students for select
  using (
    public.profile_has_active_app_roles(auth.uid(), array['teacher-manager']::text[])
    and exists (
      select 1
      from public.teacher_manager_teacher_scopes tmts
      join public.teacher_student_assignments tsa
        on tsa.teacher_id = tmts.teacher_id and tsa.status = 'active'
      where tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
        and tsa.student_id = students.id
    )
  );
drop policy if exists "lessons_select_teacher_manager" on public.lessons;
drop policy if exists "lessons_select_teacher_manager_scoped" on public.lessons;
create policy "lessons_select_teacher_manager"
  on public.lessons for select
  using (
    deleted_at is null
    and public.profile_has_active_app_roles(auth.uid(), array['teacher-manager']::text[])
    and exists (
      select 1
      from public.teacher_manager_teacher_scopes tmts
      where tmts.teacher_id = lessons.teacher_id
        and tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
    )
  );
