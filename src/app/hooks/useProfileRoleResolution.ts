import { useAuthSession } from '../context/auth-session-context';
import { useRole } from '../context/role-context';

/**
 * Combines database profile data with the **effective** `useRole().role`
 * (database `app_role` when signed in, unless a session dev override is active).
 */
export function useProfileRoleResolution() {
  const auth = useAuthSession();
  const { role: effectiveRole, isDevRoleOverrideActive } = useRole();

  return {
    profile: auth.profile,
    appRoleFromProfile: auth.resolvedAppRole,
    effectiveRole,
    isDevRoleOverrideActive,
    profileLoading: auth.profileLoading,
    profileError: auth.profileError,
    refreshProfile: auth.refreshProfile,
  };
}
