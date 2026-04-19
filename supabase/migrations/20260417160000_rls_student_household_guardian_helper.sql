-- Infinite recursion on `students`: `students_select_household` joined `public.students schild`
-- inside a policy on `students`, so evaluating RLS on the child row re-entered `students`
-- policies (e.g. guardian loading a co-household learner while resolving profiles/lessons).

create or replace function public.student_visible_via_household_guardian(
  viewer_profile_id uuid,
  target_student_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if viewer_profile_id is null or target_student_id is null then
    return false;
  end if;

  set local row_security = off;

  return exists (
    select 1
    from public.household_members guardian
    join public.household_members child on child.household_id = guardian.household_id
    join public.students schild on schild.profile_id = child.profile_id
    where guardian.profile_id = viewer_profile_id
      and guardian.member_role in ('parent', 'guardian', 'family')
      and child.member_role = 'student'
      and schild.id = target_student_id
  );
end;
$$;
comment on function public.student_visible_via_household_guardian(uuid, uuid) is
  'True if viewer is parent/guardian/family in the same household as the student row; inner read on students uses SET LOCAL row_security=off to avoid students RLS recursion.';
revoke all on function public.student_visible_via_household_guardian(uuid, uuid) from public;
grant execute on function public.student_visible_via_household_guardian(uuid, uuid) to anon;
grant execute on function public.student_visible_via_household_guardian(uuid, uuid) to authenticated;
grant execute on function public.student_visible_via_household_guardian(uuid, uuid) to service_role;
drop policy if exists "students_select_household" on public.students;
create policy "students_select_household"
  on public.students for select
  using (public.student_visible_via_household_guardian(auth.uid(), students.id));
