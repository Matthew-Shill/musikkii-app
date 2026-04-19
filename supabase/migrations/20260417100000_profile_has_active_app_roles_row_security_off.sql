-- Ensure profile_has_active_app_roles can read profiles without re-entering profiles RLS.
-- Some Postgres/Supabase setups still evaluated RLS on the inner SELECT of the prior SQL-bodied
-- SECURITY DEFINER function, which could preserve "infinite recursion" on profiles policies.

create or replace function public.profile_has_active_app_roles(target_profile_id uuid, allowed_roles text[])
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  set local row_security = off;
  return exists (
    select 1
    from public.profiles p
    where p.id = target_profile_id
      and p.is_active = true
      and p.app_role = any (allowed_roles)
  );
end;
$$;
comment on function public.profile_has_active_app_roles(uuid, text[]) is
  'True if profile row is active and app_role is in allowed_roles; inner read uses SET LOCAL row_security=off to avoid profiles RLS recursion.';
