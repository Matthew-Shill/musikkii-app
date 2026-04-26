-- Teacher lesson completion: persisted outcome + structured lesson_notes (jsonb).
-- Adds UPDATE policy for the assigned teacher (profile_matches_teacher).

alter table public.lessons
  add column if not exists outcome text;

alter table public.lessons
  drop constraint if exists lessons_outcome_chk;

alter table public.lessons
  add constraint lessons_outcome_chk check (
    outcome is null
    or outcome in (
      'completed',
      'completed_makeup',
      'nml_completed',
      'student_missed',
      'teacher_cancelled'
    )
  );

alter table public.lessons
  add column if not exists lesson_notes jsonb not null default '{"goals":[],"notes":"","assignments":[]}'::jsonb;

comment on column public.lessons.outcome is 'Teacher-reported lesson completion outcome (V1).';
comment on column public.lessons.lesson_notes is 'Structured post-lesson notes: goals[], notes, assignments[]; optional V1 keys (email_student, email_parent, resource_drafts).';

drop policy if exists "lessons_update_teacher_completion" on public.lessons;
create policy "lessons_update_teacher_completion"
  on public.lessons for update
  to authenticated
  using (
    deleted_at is null
    and public.profile_matches_teacher(auth.uid(), teacher_id)
  )
  with check (
    deleted_at is null
    and public.profile_matches_teacher(auth.uid(), teacher_id)
  );
