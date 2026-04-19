-- Teacher handling rows must reference an existing student intent on the same participant.

create or replace function public.lesson_intent_events_teacher_insert_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_text text;
  target_uuid uuid;
  ref_type text;
  ref_lp uuid;
begin
  if new.type not like 'teacher.%' then
    return new;
  end if;

  target_text := new.payload->>'targetStudentEventId';
  if target_text is null or btrim(target_text) = '' then
    raise exception 'MISSING_TARGET_STUDENT_EVENT_ID' using errcode = 'P0001';
  end if;

  begin
    target_uuid := target_text::uuid;
  exception
    when invalid_text_representation then
      raise exception 'INVALID_TARGET_STUDENT_EVENT_ID' using errcode = 'P0001';
  end;

  select lie.type, lie.lesson_participant_id
  into ref_type, ref_lp
  from public.lesson_intent_events lie
  where lie.id = target_uuid;

  if not found then
    raise exception 'TARGET_EVENT_NOT_FOUND' using errcode = 'P0001';
  end if;

  if ref_lp is distinct from new.lesson_participant_id then
    raise exception 'TARGET_EVENT_WRONG_PARTICIPANT' using errcode = 'P0001';
  end if;

  if new.type = 'teacher.reschedule_handled' and ref_type is distinct from 'student.reschedule_requested' then
    raise exception 'TARGET_TYPE_MISMATCH_RESCHEDULE' using errcode = 'P0001';
  end if;

  if new.type = 'teacher.nml_handled' and ref_type is distinct from 'student.nml_requested' then
    raise exception 'TARGET_TYPE_MISMATCH_NML' using errcode = 'P0001';
  end if;

  return new;
end;
$$;
comment on function public.lesson_intent_events_teacher_insert_guard() is
  'Before insert: teacher.* rows require payload.targetStudentEventId pointing to the matching student.* row on the same lesson_participant_id.';
drop trigger if exists lesson_intent_events_teacher_guard on public.lesson_intent_events;
create trigger lesson_intent_events_teacher_guard
before insert on public.lesson_intent_events
for each row execute function public.lesson_intent_events_teacher_insert_guard();
