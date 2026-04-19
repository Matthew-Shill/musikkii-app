-- Minimal teacher-manager scope: which teachers a manager profile may oversee.
-- Managers without rows here (and without their own teachers row) see no roster via RLS.

create table if not exists public.teacher_manager_teacher_scopes (
  id uuid primary key default gen_random_uuid(),
  manager_profile_id uuid not null references public.profiles (id) on delete cascade,
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (manager_profile_id, teacher_id)
);
create index if not exists tmts_manager_profile_id_idx
  on public.teacher_manager_teacher_scopes (manager_profile_id)
  where status = 'active';
create index if not exists tmts_teacher_id_idx
  on public.teacher_manager_teacher_scopes (teacher_id)
  where status = 'active';
drop trigger if exists teacher_manager_teacher_scopes_set_updated_at on public.teacher_manager_teacher_scopes;
create trigger teacher_manager_teacher_scopes_set_updated_at
before update on public.teacher_manager_teacher_scopes
for each row execute function public.set_updated_at();
comment on table public.teacher_manager_teacher_scopes is
  'Links a teacher-manager profile to teachers they may view (roster, assignments, lessons).';
alter table public.teacher_manager_teacher_scopes enable row level security;
drop policy if exists "tmts_select_manager_self" on public.teacher_manager_teacher_scopes;
create policy "tmts_select_manager_self"
  on public.teacher_manager_teacher_scopes for select
  using (manager_profile_id = auth.uid());
drop policy if exists "tmts_select_admin_exec" on public.teacher_manager_teacher_scopes;
create policy "tmts_select_admin_exec"
  on public.teacher_manager_teacher_scopes for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
-- ---------------------------------------------------------------------------
-- Tighten teacher-manager visibility (replace broad role checks)
-- ---------------------------------------------------------------------------

drop policy if exists "students_select_teacher_manager" on public.students;
create policy "students_select_teacher_manager_scoped"
  on public.students for select
  using (
    exists (
      select 1
      from public.teacher_manager_teacher_scopes tmts
      join public.teacher_student_assignments tsa
        on tsa.teacher_id = tmts.teacher_id and tsa.status = 'active'
      where tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
        and tsa.student_id = students.id
    )
  );
drop policy if exists "teachers_select_admin_exec" on public.teachers;
create policy "teachers_select_admin_exec"
  on public.teachers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
drop policy if exists "teachers_select_via_manager_scope" on public.teachers;
create policy "teachers_select_via_manager_scope"
  on public.teachers for select
  using (
    exists (
      select 1 from public.teacher_manager_teacher_scopes tmts
      where tmts.teacher_id = teachers.id
        and tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
    )
  );
drop policy if exists "tsa_select_admin_exec" on public.teacher_student_assignments;
create policy "tsa_select_admin_exec"
  on public.teacher_student_assignments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );
drop policy if exists "tsa_select_manager_scoped" on public.teacher_student_assignments;
create policy "tsa_select_manager_scoped"
  on public.teacher_student_assignments for select
  using (
    exists (
      select 1 from public.teacher_manager_teacher_scopes tmts
      where tmts.teacher_id = teacher_student_assignments.teacher_id
        and tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
    )
  );
drop policy if exists "lessons_select_teacher_manager" on public.lessons;
create policy "lessons_select_teacher_manager_scoped"
  on public.lessons for select
  using (
    deleted_at is null
    and exists (
      select 1 from public.teacher_manager_teacher_scopes tmts
      where tmts.teacher_id = lessons.teacher_id
        and tmts.manager_profile_id = auth.uid()
        and tmts.status = 'active'
    )
  );
