import { useAuthSession } from '../context/auth-session-context';

/**
 * Server-backed profile + parsed `app_role` for the signed-in user.
 * UI role switching (`useRole`) remains separate until product wiring replaces mocks.
 */
export function useProfileRoleResolution() {
  const { profile, resolvedAppRole, profileLoading, profileError, refreshProfile } = useAuthSession();

  return {
    profile,
    /** Canonical role from `public.profiles.app_role` when valid */
    appRoleFromProfile: resolvedAppRole,
    profileLoading,
    profileError,
    refreshProfile,
  };
}
