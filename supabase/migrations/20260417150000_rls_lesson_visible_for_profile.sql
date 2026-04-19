-- Infinite recursion on `lessons`: policies such as `lessons_select_participant_student`
-- read `lesson_participants`, while `lp_select_via_visible_lesson` did
-- `exists (select 1 from public.lessons ...)` under the same session RLS → re-entered
-- `lessons` policies. Mirror current lesson SELECT rules inside one SECURITY DEFINER
-- helper with `SET LOCAL row_security = off`, then use it from `lesson_participants`
-- (and lesson_intent_events read path) instead of subqueries that respect lessons RLS.

create or replace function public.lesson_visible_for_profile(p_lesson_id uuid, p_profile_id uuid)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  l_teacher_id uuid;
  l_deleted_at timestamptz;
begin
  if p_lesson_id is null or p_profile_id is null then
    return false;
  end if;

  set local row_security = off;

  select l.teacher_id, l.deleted_at
    into l_teacher_id, l_deleted_at
  from public.lessons l
  where l.id = p_lesson_id;

  if not found or l_deleted_at is not null then
    return false;
  end if;

  if public.profile_has_active_app_roles(p_profile_id, array['admin', 'executive']::text[]) then
    return true;
  end if;

  if public.profile_matches_teacher(p_profile_id, l_teacher_id) then
    return true;
  end if;

  if public.profile_has_active_app_roles(p_profile_id, array['teacher-manager']::text[])
    and exists (
      select 1
      from public.teacher_manager_teacher_scopes tmts
      where tmts.teacher_id = l_teacher_id
        and tmts.manager_profile_id = p_profile_id
        and tmts.status = 'active'
    ) then
    return true;
  end if;

  if exists (
    select 1
    from public.lesson_participants lp
    join public.students s on s.id = lp.student_id
    where lp.lesson_id = p_lesson_id
      and s.profile_id = p_profile_id
  ) then
    return true;
  end if;

  if exists (
    select 1
    from public.lesson_participants lp
    join public.students s on s.id = lp.student_id
    join public.household_members hm_child on hm_child.profile_id = s.profile_id
    join public.household_members hm_guardian
      on hm_guardian.household_id = hm_child.household_id
    where lp.lesson_id = p_lesson_id
      and hm_guardian.profile_id = p_profile_id
      and hm_guardian.member_role in ('parent', 'guardian', 'family')
      and hm_child.member_role = 'student'
  ) then
    return true;
  end if;

  return false;
end;
$$;
comment on function public.lesson_visible_for_profile(uuid, uuid) is
  'Whether p_profile_id may read lesson p_lesson_id per current product rules; uses SET LOCAL row_security=off to avoid lessons↔lesson_participants RLS recursion. Keep aligned with lessons SELECT policies.';
revoke all on function public.lesson_visible_for_profile(uuid, uuid) from public;
grant execute on function public.lesson_visible_for_profile(uuid, uuid) to anon;
grant execute on function public.lesson_visible_for_profile(uuid, uuid) to authenticated;
grant execute on function public.lesson_visible_for_profile(uuid, uuid) to service_role;
drop policy if exists "lp_select_via_visible_lesson" on public.lesson_participants;
create policy "lp_select_via_visible_lesson"
  on public.lesson_participants for select
  using (public.lesson_visible_for_profile(lesson_participants.lesson_id, auth.uid()));
drop policy if exists "lie_select_via_visible_lesson" on public.lesson_intent_events;
create policy "lie_select_via_visible_lesson"
  on public.lesson_intent_events for select
  using (
    exists (
      select 1
      from public.lesson_participants lp
      where lp.id = lesson_intent_events.lesson_participant_id
        and public.lesson_visible_for_profile(lp.lesson_id, auth.uid())
    )
  );
