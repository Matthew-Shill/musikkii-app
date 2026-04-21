-- Deferred replacement entitlement: one credit per converted lesson; redemption is a future slice.

create table if not exists public.makeup_credits (
  id uuid primary key default gen_random_uuid(),
  original_lesson_id uuid not null references public.lessons (id) on delete restrict,
  teacher_id uuid not null references public.teachers (id) on delete restrict,
  household_id uuid references public.households (id) on delete set null,
  student_id uuid not null references public.students (id) on delete restrict,
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  duration_minutes int not null check (duration_minutes > 0),
  status text not null default 'available' check (status in ('available', 'redeemed', 'voided')),
  redeemed_lesson_id uuid references public.lessons (id) on delete set null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  constraint makeup_credits_original_lesson_unique unique (original_lesson_id)
);

create index if not exists makeup_credits_student_status_idx
  on public.makeup_credits (student_id, status, created_at desc);
create index if not exists makeup_credits_teacher_idx on public.makeup_credits (teacher_id);

comment on table public.makeup_credits is
  'One row per lesson converted to a deferred replacement; original lesson is cancelled in the same transaction. Redeemed lesson id filled when redemption RPC exists.';

alter table public.makeup_credits enable row level security;

drop policy if exists "mc_select_student_self" on public.makeup_credits;
create policy "mc_select_student_self"
  on public.makeup_credits for select
  using (
    exists (
      select 1 from public.students s
      where s.id = makeup_credits.student_id
        and s.profile_id = auth.uid()
    )
  );

drop policy if exists "mc_select_guardian" on public.makeup_credits;
create policy "mc_select_guardian"
  on public.makeup_credits for select
  using (
    exists (
      select 1
      from public.students s
      join public.household_members hm_child on hm_child.profile_id = s.profile_id
      join public.household_members hm_guardian
        on hm_guardian.household_id = hm_child.household_id
      where s.id = makeup_credits.student_id
        and hm_guardian.profile_id = auth.uid()
        and hm_guardian.member_role in ('parent', 'guardian', 'family')
        and hm_child.member_role = 'student'
    )
  );

drop policy if exists "mc_select_teacher" on public.makeup_credits;
create policy "mc_select_teacher"
  on public.makeup_credits for select
  using (
    exists (
      select 1 from public.teachers t
      where t.id = makeup_credits.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "mc_select_admin_exec" on public.makeup_credits;
create policy "mc_select_admin_exec"
  on public.makeup_credits for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

grant select on table public.makeup_credits to authenticated;

-- ---------------------------------------------------------------------------
-- Convert: visibility + 24h + one credit per original lesson + cancel lesson
-- ---------------------------------------------------------------------------
create or replace function public.commit_student_lesson_to_makeup_credit(p_lesson_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  l record;
  v_actor uuid := auth.uid();
  v_student_id uuid;
  v_duration_mins int;
  v_credit_id uuid;
begin
  if v_actor is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  if not public.lesson_visible_for_student_reschedule(p_lesson_id) then
    raise exception 'LESSON_NOT_VISIBLE' using errcode = 'P0001';
  end if;

  if exists (select 1 from public.makeup_credits mc where mc.original_lesson_id = p_lesson_id) then
    raise exception 'CREDIT_ALREADY_ISSUED' using errcode = 'P0001';
  end if;

  select ls.id, ls.teacher_id, ls.household_id, ls.starts_at, ls.ends_at, ls.status, ls.deleted_at
  into l
  from public.lessons ls
  where ls.id = p_lesson_id
  for update;

  if not found then
    raise exception 'LESSON_NOT_FOUND' using errcode = 'P0001';
  end if;

  if l.deleted_at is not null then
    raise exception 'LESSON_DELETED' using errcode = 'P0001';
  end if;

  if l.status in ('completed', 'cancelled') then
    raise exception 'LESSON_TERMINAL' using errcode = 'P0001';
  end if;

  if l.starts_at < now() + interval '24 hours' then
    raise exception 'MAKEUP_CONVERSION_TOO_LATE' using errcode = 'P0001';
  end if;

  v_duration_mins := greatest(
    1,
    round(extract(epoch from (l.ends_at - l.starts_at)) / 60.0)::int
  );

  select lp.student_id
  into v_student_id
  from public.lesson_participants lp
  join public.students s on s.id = lp.student_id
  where lp.lesson_id = p_lesson_id
    and s.profile_id = v_actor
  order by lp.created_at
  limit 1;

  if v_student_id is null then
    select lp.student_id
    into v_student_id
    from public.lesson_participants lp
    join public.students s on s.id = lp.student_id
    join public.household_members hm_child on hm_child.profile_id = s.profile_id
    join public.household_members hm_guardian
      on hm_guardian.household_id = hm_child.household_id
    where lp.lesson_id = p_lesson_id
      and hm_guardian.profile_id = v_actor
      and hm_guardian.member_role in ('parent', 'guardian', 'family')
      and hm_child.member_role = 'student'
    order by lp.created_at
    limit 1;
  end if;

  if v_student_id is null then
    raise exception 'NOT_PARTICIPANT' using errcode = 'P0001';
  end if;

  insert into public.makeup_credits (
    original_lesson_id,
    teacher_id,
    household_id,
    student_id,
    created_by_profile_id,
    duration_minutes,
    status
  )
  values (
    p_lesson_id,
    l.teacher_id,
    l.household_id,
    v_student_id,
    v_actor,
    v_duration_mins,
    'available'
  )
  returning id into v_credit_id;

  update public.lessons
  set status = 'cancelled'
  where id = p_lesson_id;

  return jsonb_build_object(
    'makeup_credit_id', v_credit_id,
    'lesson_id', p_lesson_id,
    'lesson_status', 'cancelled'
  );
end;
$$;

comment on function public.commit_student_lesson_to_makeup_credit(uuid) is
  'Creates one makeup_credits row and sets the original lesson to cancelled (24h+ only); idempotent per original_lesson_id.';

grant execute on function public.commit_student_lesson_to_makeup_credit(uuid) to authenticated;
