-- Self-reschedule foundation: explicit teacher availability segments + SECURITY DEFINER RPCs
-- that move an existing lesson in place (no second lesson row). Audit trail in lesson_self_reschedule_audit.

-- ---------------------------------------------------------------------------
-- Teacher bookable windows (truthful availability source for v1 slot listing)
-- ---------------------------------------------------------------------------
create table if not exists public.teacher_availability_segments (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  created_at timestamptz not null default now(),
  constraint teacher_availability_segments_time_chk check (ends_at > starts_at)
);
create index if not exists teacher_availability_segments_teacher_time_idx
  on public.teacher_availability_segments (teacher_id, starts_at);

comment on table public.teacher_availability_segments is
  'Explicit bookable intervals for a teacher. Self-reschedule candidates are intersections of these windows minus existing lessons (server-side only).';

alter table public.teacher_availability_segments enable row level security;

drop policy if exists "tas_select_own_teacher" on public.teacher_availability_segments;
create policy "tas_select_own_teacher"
  on public.teacher_availability_segments for select
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_segments.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tas_insert_own_teacher" on public.teacher_availability_segments;
create policy "tas_insert_own_teacher"
  on public.teacher_availability_segments for insert
  with check (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_segments.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tas_update_own_teacher" on public.teacher_availability_segments;
create policy "tas_update_own_teacher"
  on public.teacher_availability_segments for update
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_segments.teacher_id
        and t.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_segments.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tas_delete_own_teacher" on public.teacher_availability_segments;
create policy "tas_delete_own_teacher"
  on public.teacher_availability_segments for delete
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_segments.teacher_id
        and t.profile_id = auth.uid()
    )
  );

grant select, insert, update, delete on table public.teacher_availability_segments to authenticated;

-- ---------------------------------------------------------------------------
-- Audit (append-only; inserts from RPC as table owner bypass student RLS)
-- ---------------------------------------------------------------------------
create table if not exists public.lesson_self_reschedule_audit (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  actor_profile_id uuid not null references public.profiles (id) on delete restrict,
  previous_starts_at timestamptz not null,
  previous_ends_at timestamptz not null,
  new_starts_at timestamptz not null,
  new_ends_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index if not exists lesson_self_reschedule_audit_lesson_idx
  on public.lesson_self_reschedule_audit (lesson_id, created_at desc);

comment on table public.lesson_self_reschedule_audit is
  'One row per successful in-place self-reschedule commit (previous vs new window).';

alter table public.lesson_self_reschedule_audit enable row level security;

drop policy if exists "lsra_select_via_visible_lesson" on public.lesson_self_reschedule_audit;
create policy "lsra_select_via_visible_lesson"
  on public.lesson_self_reschedule_audit for select
  using (
    exists (
      select 1 from public.lessons l where l.id = lesson_self_reschedule_audit.lesson_id
    )
  );

grant select on table public.lesson_self_reschedule_audit to authenticated;

-- ---------------------------------------------------------------------------
-- Visibility (session user must match student or household guardian rules)
-- ---------------------------------------------------------------------------
create or replace function public.lesson_visible_for_student_reschedule(p_lesson_id uuid)
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1
    from public.lessons l
    join public.lesson_participants lp on lp.lesson_id = l.id
    join public.students s on s.id = lp.student_id
    where l.id = p_lesson_id
      and l.deleted_at is null
      and s.profile_id = auth.uid()
  )
  or exists (
    select 1
    from public.lessons l
    join public.lesson_participants lp on lp.lesson_id = l.id
    join public.students s on s.id = lp.student_id
    join public.household_members hm_child on hm_child.profile_id = s.profile_id
    join public.household_members hm_guardian
      on hm_guardian.household_id = hm_child.household_id
    where l.id = p_lesson_id
      and l.deleted_at is null
      and hm_guardian.profile_id = auth.uid()
      and hm_guardian.member_role in ('parent', 'guardian', 'family')
      and hm_child.member_role = 'student'
  );
$$;

comment on function public.lesson_visible_for_student_reschedule(uuid) is
  'True when auth.uid() may act for a participant on this lesson (student or guardian); used by self-reschedule RPCs.';

grant execute on function public.lesson_visible_for_student_reschedule(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- List candidate start times (15-minute grid) inside availability minus conflicts
-- ---------------------------------------------------------------------------
create or replace function public.list_lesson_self_reschedule_candidates(
  p_lesson_id uuid,
  p_limit int default 40
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  l record;
  seg record;
  v_duration interval;
  v_min_start timestamptz;
  cand timestamptz;
  busy boolean;
  j jsonb := '[]'::jsonb;
  n int := 0;
  lim int := coalesce(nullif(p_limit, 0), 40);
begin
  if lim > 200 then
    lim := 200;
  end if;

  if not public.lesson_visible_for_student_reschedule(p_lesson_id) then
    raise exception 'LESSON_NOT_VISIBLE' using errcode = 'P0001';
  end if;

  select ls.id, ls.teacher_id, ls.starts_at, ls.ends_at, ls.status, ls.deleted_at
  into l
  from public.lessons ls
  where ls.id = p_lesson_id;

  if not found then
    raise exception 'LESSON_NOT_FOUND' using errcode = 'P0001';
  end if;

  if l.deleted_at is not null then
    raise exception 'LESSON_DELETED' using errcode = 'P0001';
  end if;

  if l.status in ('completed', 'cancelled') then
    raise exception 'LESSON_TERMINAL' using errcode = 'P0001';
  end if;

  v_min_start := now() + interval '24 hours';
  if l.starts_at < v_min_start then
    raise exception 'RESCHEDULE_TOO_LATE' using errcode = 'P0001';
  end if;

  v_duration := l.ends_at - l.starts_at;

  for seg in
    select tas.starts_at as s, tas.ends_at as e
    from public.teacher_availability_segments tas
    where tas.teacher_id = l.teacher_id
      and tas.ends_at > v_min_start
    order by tas.starts_at
  loop
    cand := greatest(seg.s, v_min_start);
    while cand + v_duration <= seg.e and n < lim loop
      select exists (
        select 1
        from public.lessons o
        where o.teacher_id = l.teacher_id
          and o.deleted_at is null
          and o.id <> l.id
          and o.starts_at < cand + v_duration
          and o.ends_at > cand
      ) into busy;

      if not busy then
        j := j || jsonb_build_array(
          jsonb_build_object('starts_at', cand, 'ends_at', cand + v_duration)
        );
        n := n + 1;
        exit when n >= lim;
      end if;

      cand := cand + interval '15 minutes';
    end loop;
    exit when n >= lim;
  end loop;

  return j;
end;
$$;

comment on function public.list_lesson_self_reschedule_candidates(uuid, int) is
  'Returns JSON array of {starts_at, ends_at} slots for moving p_lesson_id; enforces 24h lead, teacher availability, and no teacher double-booking.';

-- ---------------------------------------------------------------------------
-- Commit: single transaction, FOR UPDATE lesson row, re-check overlap + window
-- ---------------------------------------------------------------------------
create or replace function public.commit_student_lesson_self_reschedule(
  p_lesson_id uuid,
  p_new_starts_at timestamptz
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  l record;
  v_duration interval;
  v_new_end timestamptz;
  v_min_start timestamptz;
  v_actor uuid := auth.uid();
  v_updated uuid;
begin
  if v_actor is null then
    raise exception 'NOT_AUTHENTICATED' using errcode = 'P0001';
  end if;

  if not public.lesson_visible_for_student_reschedule(p_lesson_id) then
    raise exception 'LESSON_NOT_VISIBLE' using errcode = 'P0001';
  end if;

  select ls.id, ls.teacher_id, ls.starts_at, ls.ends_at, ls.status, ls.deleted_at
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

  v_min_start := now() + interval '24 hours';
  if l.starts_at < v_min_start then
    raise exception 'RESCHEDULE_TOO_LATE' using errcode = 'P0001';
  end if;

  if p_new_starts_at < v_min_start then
    raise exception 'TARGET_TOO_SOON' using errcode = 'P0001';
  end if;

  v_duration := l.ends_at - l.starts_at;
  v_new_end := p_new_starts_at + v_duration;

  if not exists (
    select 1
    from public.teacher_availability_segments tas
    where tas.teacher_id = l.teacher_id
      and tas.starts_at <= p_new_starts_at
      and tas.ends_at >= v_new_end
  ) then
    raise exception 'SLOT_OUTSIDE_AVAILABILITY' using errcode = 'P0001';
  end if;

  update public.lessons u
  set starts_at = p_new_starts_at,
      ends_at = v_new_end
  where u.id = p_lesson_id
    and not exists (
      select 1
      from public.lessons o
      where o.teacher_id = u.teacher_id
        and o.deleted_at is null
        and o.id <> u.id
        and o.starts_at < v_new_end
        and o.ends_at > p_new_starts_at
    )
  returning u.id into v_updated;

  if v_updated is null then
    raise exception 'SLOT_CONFLICT' using errcode = 'P0001';
  end if;

  insert into public.lesson_self_reschedule_audit (
    lesson_id,
    actor_profile_id,
    previous_starts_at,
    previous_ends_at,
    new_starts_at,
    new_ends_at
  )
  values (
    p_lesson_id,
    v_actor,
    l.starts_at,
    l.ends_at,
    p_new_starts_at,
    v_new_end
  );

  return jsonb_build_object(
    'lesson_id', p_lesson_id,
    'starts_at', p_new_starts_at,
    'ends_at', v_new_end
  );
end;
$$;

comment on function public.commit_student_lesson_self_reschedule(uuid, timestamptz) is
  'Atomically moves one lesson to a new window inside availability; audits first then updates lessons row.';

grant execute on function public.list_lesson_self_reschedule_candidates(uuid, int) to authenticated;
grant execute on function public.commit_student_lesson_self_reschedule(uuid, timestamptz) to authenticated;
