-- Optional per-lesson and per-teacher default URLs for virtual lessons (read by learner calendar/dashboard).
alter table public.lessons add column if not exists meeting_url text;
alter table public.teachers add column if not exists meeting_url text;

comment on column public.lessons.meeting_url is 'Optional override URL for virtual lesson join (e.g. Zoom).';
comment on column public.teachers.meeting_url is 'Optional default virtual room URL for this teacher''s lessons.';
