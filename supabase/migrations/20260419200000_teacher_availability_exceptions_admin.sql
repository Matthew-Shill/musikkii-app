-- Blocked / time-off intervals subtract from self-reschedule slots; admin/executive may manage any teacher's rows.

-- ---------------------------------------------------------------------------
-- Exceptions (subtract from bookable time inside segments)
-- ---------------------------------------------------------------------------
create table if not exists public.teacher_availability_exceptions (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers (id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  label text,
  created_at timestamptz not null default now(),
  constraint teacher_availability_exceptions_time_chk check (ends_at > starts_at)
);
create index if not exists teacher_availability_exceptions_teacher_time_idx
  on public.teacher_availability_exceptions (teacher_id, starts_at);

comment on table public.teacher_availability_exceptions is
  'Non-bookable intervals (time off, blocks). Self-reschedule RPCs require the full lesson window to avoid overlapping any exception row for the teacher.';

alter table public.teacher_availability_exceptions enable row level security;

drop policy if exists "tae_select_own_teacher" on public.teacher_availability_exceptions;
create policy "tae_select_own_teacher"
  on public.teacher_availability_exceptions for select
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_exceptions.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tae_insert_own_teacher" on public.teacher_availability_exceptions;
create policy "tae_insert_own_teacher"
  on public.teacher_availability_exceptions for insert
  with check (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_exceptions.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tae_update_own_teacher" on public.teacher_availability_exceptions;
create policy "tae_update_own_teacher"
  on public.teacher_availability_exceptions for update
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_exceptions.teacher_id
        and t.profile_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_exceptions.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tae_delete_own_teacher" on public.teacher_availability_exceptions;
create policy "tae_delete_own_teacher"
  on public.teacher_availability_exceptions for delete
  using (
    exists (
      select 1 from public.teachers t
      where t.id = teacher_availability_exceptions.teacher_id
        and t.profile_id = auth.uid()
    )
  );

drop policy if exists "tae_select_admin_exec" on public.teacher_availability_exceptions;
create policy "tae_select_admin_exec"
  on public.teacher_availability_exceptions for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tae_insert_admin_exec" on public.teacher_availability_exceptions;
create policy "tae_insert_admin_exec"
  on public.teacher_availability_exceptions for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tae_update_admin_exec" on public.teacher_availability_exceptions;
create policy "tae_update_admin_exec"
  on public.teacher_availability_exceptions for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tae_delete_admin_exec" on public.teacher_availability_exceptions;
create policy "tae_delete_admin_exec"
  on public.teacher_availability_exceptions for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

grant select, insert, update, delete on table public.teacher_availability_exceptions to authenticated;

-- ---------------------------------------------------------------------------
-- Segments: admin / executive manage any teacher (same ops as self-service teachers)
-- ---------------------------------------------------------------------------
drop policy if exists "tas_select_admin_exec" on public.teacher_availability_segments;
create policy "tas_select_admin_exec"
  on public.teacher_availability_segments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tas_insert_admin_exec" on public.teacher_availability_segments;
create policy "tas_insert_admin_exec"
  on public.teacher_availability_segments for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tas_update_admin_exec" on public.teacher_availability_segments;
create policy "tas_update_admin_exec"
  on public.teacher_availability_segments for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  )
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

drop policy if exists "tas_delete_admin_exec" on public.teacher_availability_segments;
create policy "tas_delete_admin_exec"
  on public.teacher_availability_segments for delete
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.is_active = true and p.app_role in ('admin', 'executive')
    )
  );

-- ---------------------------------------------------------------------------
-- Slot list: subtract exceptions overlapping candidate window
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
  slot_blocked boolean;
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

      select exists (
        select 1
        from public.teacher_availability_exceptions ex
        where ex.teacher_id = l.teacher_id
          and ex.starts_at < cand + v_duration
          and ex.ends_at > cand
      ) into slot_blocked;

      if not busy and not slot_blocked then
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

-- ---------------------------------------------------------------------------
-- Commit: reject target window overlapping an exception
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

  if exists (
    select 1
    from public.teacher_availability_exceptions ex
    where ex.teacher_id = l.teacher_id
      and ex.starts_at < v_new_end
      and ex.ends_at > p_new_starts_at
  ) then
    raise exception 'SLOT_BLOCKED_TIME_OFF' using errcode = 'P0001';
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
