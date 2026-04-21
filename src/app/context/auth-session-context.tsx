import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { SupabaseProfileRow } from '@/app/types/supabase-profile';
import type { UserRole } from '@/app/types/domain';
import { parseAppRoleFromProfile } from '@/lib/resolve-app-role';

export interface AuthSessionContextValue {
  /** Supabase env vars are set */
  isConfigured: boolean;
  session: Session | null;
  user: User | null;
  /** Current row from `public.profiles` for `user.id`, when signed in */
  profile: SupabaseProfileRow | null;
  /** Initial `getSession` + first auth event not yet settled */
  loading: boolean;
  /** In-flight `profiles` select */
  profileLoading: boolean;
  profileError: string | null;
  /** `profiles.app_role` parsed to `UserRole`; null if missing/invalid */
  resolvedAppRole: UserRole | null;
  /**
   * Signed-in + Supabase configured, profile fetch finished, and `resolvedAppRole` is set.
   * Used to avoid treating the anonymous preview role as real for nav/RBAC.
   */
  accountRoleReady: boolean;
  /** Signed in, profile fetch finished, but no usable `app_role` (missing row, RLS block, or invalid value). */
  accountRoleInvalid: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const isConfigured = isSupabaseConfigured();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<SupabaseProfileRow | null>(null);
  const [loading, setLoading] = useState(isConfigured);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const loadProfile = useCallback(async (uid: string) => {
    setProfile((prev) => (prev && prev.id !== uid ? null : prev));
    setProfileLoading(true);
    setProfileError(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, app_role, full_name, avatar_url, is_active, created_at, updated_at')
      .eq('id', uid)
      .maybeSingle();

    setProfileLoading(false);

    if (error) {
      console.warn('[auth-session] profile fetch failed', error);
      setProfileError(error.message);
      setProfile(null);
      return;
    }

    if (!data) {
      setProfile(null);
      return;
    }

    setProfile(data as SupabaseProfileRow);
  }, []);

  const refreshProfile = useCallback(async () => {
    const uid = user?.id;
    if (!uid || !isConfigured) return;
    await loadProfile(uid);
  }, [user?.id, isConfigured, loadProfile]);

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    void supabase.auth.getSession().then(({ data: { session: next } }) => {
      if (cancelled) return;
      setSession(next ?? null);
      setUser(next?.user ?? null);
      setLoading(false);
      if (next?.user?.id) void loadProfile(next.user.id);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (cancelled) return;
      setSession(next);
      setUser(next?.user ?? null);
      if (next?.user?.id) void loadProfile(next.user.id);
      else {
        setProfile(null);
        setProfileLoading(false);
        setProfileError(null);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [isConfigured, loadProfile]);

  const signOut = useCallback(async () => {
    if (!isConfigured) return;
    await supabase.auth.signOut();
    setProfile(null);
    setProfileError(null);
  }, [isConfigured]);

  const resolvedAppRole = useMemo(
    () => parseAppRoleFromProfile(profile?.app_role),
    [profile?.app_role]
  );

  const accountRoleReady = useMemo(() => {
    if (!isConfigured || !session) return true;
    if (profileLoading && profile !== null) return true;
    if (profileLoading) return false;
    return resolvedAppRole !== null;
  }, [isConfigured, session, profileLoading, profile, resolvedAppRole]);

  const accountRoleInvalid = useMemo(() => {
    if (!isConfigured || !session) return false;
    if (profileLoading) return false;
    return resolvedAppRole === null;
  }, [isConfigured, session, profileLoading, resolvedAppRole]);

  const value = useMemo<AuthSessionContextValue>(
    () => ({
      isConfigured,
      session,
      user,
      profile,
      loading,
      profileLoading,
      profileError,
      resolvedAppRole,
      accountRoleReady,
      accountRoleInvalid,
      signOut,
      refreshProfile,
    }),
    [
      isConfigured,
      session,
      user,
      profile,
      loading,
      profileLoading,
      profileError,
      resolvedAppRole,
      accountRoleReady,
      accountRoleInvalid,
      signOut,
      refreshProfile,
    ]
  );

  return <AuthSessionContext.Provider value={value}>{children}</AuthSessionContext.Provider>;
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = useContext(AuthSessionContext);
  if (ctx === undefined) {
    throw new Error('useAuthSession must be used within an AuthSessionProvider');
  }
  return ctx;
}
