-- Align privileges with typical Supabase / PostgREST setups so RLS is the gate,
-- not missing GRANTs, when applying migrations to a fresh database or new branch.

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.households to authenticated;
grant select, insert, update, delete on table public.household_members to authenticated;
grant select, insert, update, delete on table public.students to authenticated;
grant select, insert, update, delete on table public.teachers to authenticated;
grant select, insert, update, delete on table public.teacher_student_assignments to authenticated;
grant select, insert, update, delete on table public.lessons to authenticated;
grant select, insert, update, delete on table public.lesson_participants to authenticated;
grant select, insert, update, delete on table public.teacher_manager_teacher_scopes to authenticated;
