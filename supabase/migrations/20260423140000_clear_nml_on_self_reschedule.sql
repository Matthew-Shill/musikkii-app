-- Product rule: self-reschedule overrides an open NML request (append-only clear).

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
  part record;
  ev record;
  open_nml uuid;
  tgt text;
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

  for part in
    select lp.id as lp_id
    from public.lesson_participants lp
    where lp.lesson_id = p_lesson_id
  loop
    open_nml := null;
    for ev in
      select lie.id, lie.type, lie.payload
      from public.lesson_intent_events lie
      where lie.lesson_participant_id = part.lp_id
      order by lie.recorded_at asc, lie.id asc
    loop
      if ev.type = 'student.nml_requested' then
        open_nml := ev.id;
      end if;
      if open_nml is not null and ev.type = 'teacher.nml_handled' then
        tgt := ev.payload->>'targetStudentEventId';
        if tgt is not null and tgt = open_nml::text then
          open_nml := null;
        end if;
      end if;
      if open_nml is not null and ev.type = 'student.intent_cleared' then
        tgt := ev.payload->>'targetStudentEventId';
        if tgt is not null and tgt = open_nml::text then
          open_nml := null;
        end if;
      end if;
    end loop;

    if open_nml is not null then
      insert into public.lesson_intent_events (
        lesson_participant_id,
        actor_profile_id,
        type,
        payload
      )
      values (
        part.lp_id,
        v_actor,
        'student.intent_cleared',
        jsonb_build_object('targetStudentEventId', open_nml)
      );
    end if;
  end loop;

  return jsonb_build_object(
    'lesson_id', p_lesson_id,
    'starts_at', p_new_starts_at,
    'ends_at', v_new_end
  );
end;
$$;

comment on function public.commit_student_lesson_self_reschedule(uuid, timestamptz) is
  'Student/household self-reschedule: updates lesson window, audits, and appends student.intent_cleared for any open student.nml_requested (reschedule overrides NML).';
