import type { UserRole } from '@/app/types/domain';
import { parseAppRoleFromProfile } from '@/lib/resolve-app-role';

/**
 * Session-only storage for a deliberate local/dev role override while signed in.
 * Never used for production behavior decisions outside the browser.
 */
export const DEV_ROLE_OVERRIDE_STORAGE_KEY = 'musikkii_dev_role_override';

export function readDevRoleOverrideFromStorage(): UserRole | null {
  if (typeof sessionStorage === 'undefined') return null;
  return parseAppRoleFromProfile(sessionStorage.getItem(DEV_ROLE_OVERRIDE_STORAGE_KEY));
}

export function writeDevRoleOverrideToStorage(role: UserRole): void {
  sessionStorage.setItem(DEV_ROLE_OVERRIDE_STORAGE_KEY, role);
}

export function clearDevRoleOverrideStorage(): void {
  sessionStorage.removeItem(DEV_ROLE_OVERRIDE_STORAGE_KEY);
}
