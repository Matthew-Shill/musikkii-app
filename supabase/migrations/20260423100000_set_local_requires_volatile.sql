-- PostgreSQL only allows SET / SET LOCAL in VOLATILE functions.
-- These SECURITY DEFINER RLS helpers call `set local row_security = off`,
-- so force volatility explicitly in case an earlier migration created them as STABLE.

alter function public.profile_has_active_app_roles(uuid, text[]) volatile;
alter function public.profile_matches_teacher(uuid, uuid) volatile;
alter function public.lesson_visible_for_profile(uuid, uuid) volatile;
alter function public.student_visible_via_household_guardian(uuid, uuid) volatile;
alter function public.student_profile_id_for_student(uuid) volatile;
