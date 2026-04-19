-- Cross-table RLS recursion: policies that inlined `select from public.teachers` for
-- "is this row mine as teacher?" re-entered teachers RLS while other policies (e.g.
-- profiles_select_for_student_teacher -> teachers_select_for_student_lesson) read
-- lessons/students/tsa. Use a SECURITY DEFINER helper with row_security off, same
-- spirit as profile_has_active_app_roles.

create or replace function public.profile_matches_teacher(profile_id uuid, teacher_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if profile_id is null or teacher_id is null then
    return false;
  end if;
  set local row_security = off;
  return exists (
    select 1
    from public.teachers t
    where t.id = teacher_id
      and t.profile_id = profile_id
  );
end;
$$;
comment on function public.profile_matches_teacher(uuid, uuid) is
  'True if teachers.id = teacher_id and teachers.profile_id = profile_id; inner read uses SET LOCAL row_security=off to avoid teachers RLS recursion.';
revoke all on function public.profile_matches_teacher(uuid, uuid) from public;
grant execute on function public.profile_matches_teacher(uuid, uuid) to anon;
grant execute on function public.profile_matches_teacher(uuid, uuid) to authenticated;
grant execute on function public.profile_matches_teacher(uuid, uuid) to service_role;
drop policy if exists "lessons_select_teacher" on public.lessons;
create policy "lessons_select_teacher"
  on public.lessons for select
  using (
    deleted_at is null
    and public.profile_matches_teacher(auth.uid(), teacher_id)
  );
drop policy if exists "students_select_assigned_teacher" on public.students;
create policy "students_select_assigned_teacher"
  on public.students for select
  using (
    exists (
      select 1
      from public.teacher_student_assignments tsa
      where tsa.student_id = students.id
        and tsa.status = 'active'
        and public.profile_matches_teacher(auth.uid(), tsa.teacher_id)
    )
  );
drop policy if exists "tsa_select_teacher_side" on public.teacher_student_assignments;
create policy "tsa_select_teacher_side"
  on public.teacher_student_assignments for select
  using (public.profile_matches_teacher(auth.uid(), teacher_id));
