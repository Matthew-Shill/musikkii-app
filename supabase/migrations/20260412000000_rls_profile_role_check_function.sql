-- RLS policies that referenced public.profiles inside EXISTS subqueries caused
-- "infinite recursion detected in policy for relation \"profiles\"" when selecting
-- one's own row: evaluating admin/exec policy re-entered profiles RLS.
--
-- This helper runs as SECURITY DEFINER (table owner) so it can read profiles
-- without RLS and break the cycle. Policies call it instead of inlining SELECTs.

create or replace function public.profile_has_active_app_roles(target_profile_id uuid, allowed_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = target_profile_id
      and p.is_active = true
      and p.app_role = any (allowed_roles)
  );
$$;
comment on function public.profile_has_active_app_roles(uuid, text[]) is
  'True if the profile row is active and app_role is in allowed_roles; bypasses profiles RLS for policy checks.';
revoke all on function public.profile_has_active_app_roles(uuid, text[]) from public;
grant execute on function public.profile_has_active_app_roles(uuid, text[]) to anon;
grant execute on function public.profile_has_active_app_roles(uuid, text[]) to authenticated;
grant execute on function public.profile_has_active_app_roles(uuid, text[]) to service_role;
-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_admin_exec" on public.profiles;
create policy "profiles_select_admin_exec"
  on public.profiles for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- households + members
-- ---------------------------------------------------------------------------
drop policy if exists "household_members_select_admin_exec" on public.household_members;
create policy "household_members_select_admin_exec"
  on public.household_members for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
drop policy if exists "households_select_admin_exec" on public.households;
create policy "households_select_admin_exec"
  on public.households for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- students
-- ---------------------------------------------------------------------------
drop policy if exists "students_select_admin_exec" on public.students;
create policy "students_select_admin_exec"
  on public.students for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- teacher_manager_teacher_scopes (from 20260411000000)
-- ---------------------------------------------------------------------------
drop policy if exists "tmts_select_admin_exec" on public.teacher_manager_teacher_scopes;
create policy "tmts_select_admin_exec"
  on public.teacher_manager_teacher_scopes for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- teachers (post–teacher-manager migration)
-- ---------------------------------------------------------------------------
drop policy if exists "teachers_select_admin_exec" on public.teachers;
create policy "teachers_select_admin_exec"
  on public.teachers for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- teacher_student_assignments
-- ---------------------------------------------------------------------------
drop policy if exists "tsa_select_admin_exec" on public.teacher_student_assignments;
create policy "tsa_select_admin_exec"
  on public.teacher_student_assignments for select
  using (public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[]));
-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
drop policy if exists "lessons_select_admin_exec" on public.lessons;
create policy "lessons_select_admin_exec"
  on public.lessons for select
  using (
    deleted_at is null
    and public.profile_has_active_app_roles(auth.uid(), array['admin', 'executive']::text[])
  );
