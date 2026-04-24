-- Avoid parameter/column name ambiguity in PL/pgSQL helper used by lessons/students RLS.
-- Keep existing arg names/signature and use positional references in SQL predicates.

create or replace function public.profile_matches_teacher(profile_id uuid, teacher_id uuid)
returns boolean
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  if $1 is null or $2 is null then
    return false;
  end if;

  set local row_security = off;

  return exists (
    select 1
    from public.teachers t
    where t.id = $2
      and t.profile_id = $1
  );
end;
$$;
