-- Optional seed data for local development (runs after migrations on `supabase db reset`).
-- Add INSERT statements here when you want repeatable local fixtures.

-- Broad bookable window for every teacher row so `list_lesson_self_reschedule_candidates` can return slots
-- after you create matching `lessons` + `teachers` data (seed users alone do not insert teachers).
insert into public.teacher_availability_segments (teacher_id, starts_at, ends_at)
select t.id, now() + interval '1 day', now() + interval '30 days'
from public.teachers t
where not exists (
  select 1 from public.teacher_availability_segments x where x.teacher_id = t.id
);
