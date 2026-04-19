/**
 * Row shape for `public.profiles` (see Supabase migrations).
 * Kept separate from mock `UserProfile` in domain.ts.
 */
export interface SupabaseProfileRow {
  id: string;
  app_role: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
