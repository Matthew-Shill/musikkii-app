-- Starter RLS for the first vertical slice. Tune edge cases as product rules solidify.

alter table public.profiles enable row level security;
alter table public.households enable row level security;
alter table public.household_members enable row level security;
alter table public.students enable row level security;
alter table public.teachers enable row level security;
alter table public.teacher_student_assignments enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_participants enable row level security;
-- Helper: active profile for current user
-- Policies reference auth.uid() directly below.

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
drop policy if exists "profiles_select_self" on public.profiles;
create policy "profiles_select_self"
  on public.profiles for select
  using (id = auth.uid());
drop policy if exists "profiles_update_self" on public.profiles;
create policy "profiles_update_self"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());
drop policy if exists "profiles_select_admin_exec" on public.profiles;
create policy "profiles_select_admin_exec"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_active = true
        and p.app_role in ('admin', 'executive')
    )
  );
-- ---------------------------------------------------------------------------
-- households + members: household users see their household rows
-- ---------------------------------------------------------------------------
drop policy if exists "household_members_select_self" on public.household_members;
create policy "household_members_select_self"
  on public.household_members for select
  using (profile_id = auth.uid());
drop policy if exists "household_members_select_admin_exec" on public.household_members;
create policy "household_members_select_admin_exec"
  on public.household_members for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
drop policy if exists "households_select_via_membership" on public.households;
create policy "households_select_via_membership"
  on public.households for select
  using (
    exists (
      select 1 from public.household_members hm
      where hm.household_id = households.id
        and hm.profile_id = auth.uid()
    )
  );
drop policy if exists "households_select_admin_exec" on public.households;
create policy "households_select_admin_exec"
  on public.households for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
-- ---------------------------------------------------------------------------
-- students
-- ---------------------------------------------------------------------------
drop policy if exists "students_select_self" on public.students;
create policy "students_select_self"
  on public.students for select
  using (profile_id = auth.uid());
drop policy if exists "students_select_household" on public.students;
create policy "students_select_household"
  on public.students for select
  using (
    exists (
      select 1
      from public.household_members guardian
      join public.household_members child on child.household_id = guardian.household_id
      join public.students schild on schild.profile_id = child.profile_id
      where guardian.profile_id = auth.uid()
        and guardian.member_role in ('parent', 'guardian', 'family')
        and child.member_role = 'student'
        and schild.id = students.id
    )
  );
drop policy if exists "students_select_assigned_teacher" on public.students;
create policy "students_select_assigned_teacher"
  on public.students for select
  using (
    exists (
      select 1
      from public.teachers t
      join public.teacher_student_assignments tsa on tsa.teacher_id = t.id
      where t.profile_id = auth.uid()
        and tsa.student_id = students.id
        and tsa.status = 'active'
    )
  );
drop policy if exists "students_select_teacher_manager" on public.students;
create policy "students_select_teacher_manager"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role = 'teacher-manager'
    )
  );
drop policy if exists "students_select_admin_exec" on public.students;
create policy "students_select_admin_exec"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
-- ---------------------------------------------------------------------------
-- teachers
-- ---------------------------------------------------------------------------
drop policy if exists "teachers_select_self" on public.teachers;
create policy "teachers_select_self"
  on public.teachers for select
  using (profile_id = auth.uid());
drop policy if exists "teachers_select_admin_exec" on public.teachers;
create policy "teachers_select_admin_exec"
  on public.teachers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive', 'teacher-manager')
    )
  );
-- ---------------------------------------------------------------------------
-- teacher_student_assignments
-- ---------------------------------------------------------------------------
drop policy if exists "tsa_select_teacher_side" on public.teacher_student_assignments;
create policy "tsa_select_teacher_side"
  on public.teacher_student_assignments for select
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_student_assignments.teacher_id
        and t.profile_id = auth.uid()
    )
  );
drop policy if exists "tsa_select_student_side" on public.teacher_student_assignments;
create policy "tsa_select_student_side"
  on public.teacher_student_assignments for select
  using (
    exists (
      select 1 from public.students s
      where s.id = teacher_student_assignments.student_id
        and s.profile_id = auth.uid()
    )
  );
drop policy if exists "tsa_select_admin_exec" on public.teacher_student_assignments;
create policy "tsa_select_admin_exec"
  on public.teacher_student_assignments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive', 'teacher-manager')
    )
  );
-- ---------------------------------------------------------------------------
-- lessons
-- ---------------------------------------------------------------------------
drop policy if exists "lessons_select_participant_student" on public.lessons;
create policy "lessons_select_participant_student"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1
      from public.lesson_participants lp
      join public.students s on s.id = lp.student_id
      where lp.lesson_id = lessons.id
        and s.profile_id = auth.uid()
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
      join public.students s on s.id = lp.student_id
      join public.household_members hm_child on hm_child.profile_id = s.profile_id
      join public.household_members hm_guardian
        on hm_guardian.household_id = hm_child.household_id
      where lp.lesson_id = lessons.id
        and hm_guardian.profile_id = auth.uid()
        and hm_guardian.member_role in ('parent', 'guardian', 'family')
        and hm_child.member_role = 'student'
    )
  );
drop policy if exists "lessons_select_teacher" on public.lessons;
create policy "lessons_select_teacher"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.teachers t
      where t.id = lessons.teacher_id
        and t.profile_id = auth.uid()
    )
  );
drop policy if exists "lessons_select_teacher_manager" on public.lessons;
create policy "lessons_select_teacher_manager"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role = 'teacher-manager'
    )
  );
drop policy if exists "lessons_select_admin_exec" on public.lessons;
create policy "lessons_select_admin_exec"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
-- ---------------------------------------------------------------------------
-- lesson_participants
-- ---------------------------------------------------------------------------
drop policy if exists "lp_select_via_visible_lesson" on public.lesson_participants;
create policy "lp_select_via_visible_lesson"
  on public.lesson_participants for select
  using (
    exists (
      select 1 from public.lessons l where l.id = lesson_participants.lesson_id
    )
  );
-- The subquery respects RLS on public.lessons, so participants are only visible when the viewer
-- can already read the parent lesson row.;
