-- Musikkii initial vertical slice: profiles, households, students, teachers, lessons
-- Idempotent-ish: use IF NOT EXISTS where practical for local replays.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto";
-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  app_role text not null check (
    app_role in (
      'adult-student',
      'child-student',
      'parent',
      'family',
      'teacher',
      'teacher-manager',
      'admin',
      'executive'
    )
  ),
  full_name text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_app_role_idx on public.profiles (app_role) where is_active = true;
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();
-- ---------------------------------------------------------------------------
-- Households
-- ---------------------------------------------------------------------------
create table if not exists public.households (
  id uuid primary key default gen_random_uuid(),
  name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
drop trigger if exists households_set_updated_at on public.households;
create trigger households_set_updated_at
before update on public.households
for each row execute function public.set_updated_at();
-- ---------------------------------------------------------------------------
-- Household members (profiles belonging to a household)
-- ---------------------------------------------------------------------------
create table if not exists public.household_members (
  id uuid primary key default gen_random_uuid(),
  household_id uuid not null references public.households (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  member_role text not null default 'other' check (
    member_role in ('parent', 'guardian', 'family', 'student', 'other')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (household_id, profile_id)
);
create index if not exists household_members_household_id_idx on public.household_members (household_id);
create index if not exists household_members_profile_id_idx on public.household_members (profile_id);
drop trigger if exists household_members_set_updated_at on public.household_members;
create trigger household_members_set_updated_at
before update on public.household_members
for each row execute function public.set_updated_at();
-- ---------------------------------------------------------------------------
-- Students / teachers (operational rows keyed off profiles)
-- ---------------------------------------------------------------------------
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists students_profile_id_idx on public.students (profile_id);
drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
before update on public.students
for each row execute function public.set_updated_at();
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists teachers_profile_id_idx on public.teachers (profile_id);
drop trigger if exists teachers_set_updated_at on public.teachers;
create trigger teachers_set_updated_at
before update on public.teachers
for each row execute function public.set_updated_at();
-- ---------------------------------------------------------------------------
-- Teacher ↔ student assignments
-- ---------------------------------------------------------------------------
create table if not exists public.teacher_student_assignments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  status text not null default 'active' check (status in ('active', 'ended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (teacher_id, student_id)
);
create index if not exists tsa_teacher_id_idx on public.teacher_student_assignments (teacher_id);
create index if not exists tsa_student_id_idx on public.teacher_student_assignments (student_id);
drop trigger if exists teacher_student_assignments_set_updated_at on public.teacher_student_assignments;
create trigger teacher_student_assignments_set_updated_at
before update on public.teacher_student_assignments
for each row execute function public.set_updated_at();
-- ---------------------------------------------------------------------------
-- Lessons + participants
-- ---------------------------------------------------------------------------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete restrict,
  household_id uuid references public.households (id) on delete set null,
  subject text,
  modality text not null default 'virtual' check (modality in ('virtual', 'in_person')),
  status text not null default 'scheduled' check (
    status in ('draft', 'scheduled', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show')
  ),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  location text,
  notes text,
  focus text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint lessons_time_order_chk check (ends_at > starts_at)
);
create index if not exists lessons_teacher_id_idx on public.lessons (teacher_id) where deleted_at is null;
create index if not exists lessons_household_id_idx on public.lessons (household_id) where deleted_at is null;
create index if not exists lessons_starts_at_idx on public.lessons (starts_at) where deleted_at is null;
drop trigger if exists lessons_set_updated_at on public.lessons;
create trigger lessons_set_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();
create table if not exists public.lesson_participants (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  student_id uuid not null references public.students (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (lesson_id, student_id)
);
create index if not exists lesson_participants_lesson_id_idx on public.lesson_participants (lesson_id);
create index if not exists lesson_participants_student_id_idx on public.lesson_participants (student_id);
-- ---------------------------------------------------------------------------
-- New user bootstrap: optional trigger to create profile row (adjust later)
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, app_role, full_name)
  values (new.id, 'adult-student', coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_user_profile();
comment on table public.profiles is 'Application profile linked 1:1 with auth.users; drives RLS scope.';
comment on table public.lesson_participants is 'Students attached to a scheduled lesson (M:N via join table).';
