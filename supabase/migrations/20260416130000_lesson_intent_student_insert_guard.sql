-- Server-side guard for student lesson intent rows (mirrors @musikkii/core policy).
-- Teacher rows pass through unchanged.

create or replace function public.lesson_intent_events_student_insert_guard()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  l_start timestamptz;
  l_status text;
  hrs double precision;
begin
  if new.type not like 'student.%' then
    return new;
  end if;

  select ls.starts_at, ls.status
  into l_start, l_status
  from public.lesson_participants lp
  join public.lessons ls on ls.id = lp.lesson_id
  where lp.id = new.lesson_participant_id;

  if l_status in ('completed', 'cancelled') then
    raise exception 'LESSON_TERMINAL' using errcode = 'P0001';
  end if;

  if new.type = 'student.reschedule_requested' then
    hrs := extract(epoch from (l_start - now())) / 3600.0;
    if hrs < 24 then
      raise exception 'RESCHEDULE_TOO_LATE' using errcode = 'P0001';
    end if;
  end if;

  return new;
end;
$$;
comment on function public.lesson_intent_events_student_insert_guard() is
  'Before insert: block student intents on terminal lessons; reschedule requires 24h+ lead time.';
drop trigger if exists lesson_intent_events_student_guard on public.lesson_intent_events;
create trigger lesson_intent_events_student_guard
before insert on public.lesson_intent_events
for each row execute function public.lesson_intent_events_student_insert_guard();
