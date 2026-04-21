import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getRoleFamily, getRoleFamilyConfig, type RoleFamily } from '../config/role-config';
import { useAuthSession } from './auth-session-context';
import { clearDevRoleOverrideStorage } from '@/lib/dev-role-override';

export type UserRole =
  | 'adult-student'
  | 'child-student'
  | 'parent'
  | 'family'
  | 'teacher'
  | 'teacher-manager'
  | 'admin'
  | 'executive';

interface RoleContextType {
  /**
   * When signed in: always matches `profiles.app_role` (parsed). When signed out / Supabase off:
   * in-memory **preview** role for UI demos only.
   */
  role: UserRole;
  /** Updates preview role only when **not** authenticated with Supabase; no-op when signed in. */
  setRole: (role: UserRole) => void;
  /** Clears legacy `sessionStorage` dev override key if present (no-op for effective role). */
  clearDevRoleOverride: () => void;
  /** Always false (dev UI override removed for signed-in flows). */
  isDevRoleOverrideActive: boolean;
  roleLabel: string;
  roleFamily: RoleFamily;
  roleFamilyLabel: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const roleLabels: Record<UserRole, string> = {
  'adult-student': 'Adult Student',
  'child-student': 'Child Student',
  parent: 'Parent / Guardian',
  family: 'Family / Multi-Student',
  teacher: 'Teacher',
  'teacher-manager': 'Teacher Manager',
  admin: 'Admin',
  executive: 'Executive',
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const { isConfigured, session, resolvedAppRole } = useAuthSession();

  /** Preview role for anonymous / unconfigured app shell only. */
  const [previewRole, setPreviewRole] = useState<UserRole>('adult-student');

  const signedIn = Boolean(isConfigured && session);

  useEffect(() => {
    if (signedIn) {
      clearDevRoleOverrideStorage();
    }
  }, [signedIn, session?.user?.id]);

  const setRole = useCallback(
    (next: UserRole) => {
      if (signedIn) return;
      setPreviewRole(next);
    },
    [signedIn]
  );

  const clearDevRoleOverride = useCallback(() => {
    clearDevRoleOverrideStorage();
  }, []);

  const role = useMemo<UserRole>(() => {
    if (signedIn) {
      return resolvedAppRole ?? 'adult-student';
    }
    return previewRole;
  }, [signedIn, resolvedAppRole, previewRole]);

  const isDevRoleOverrideActive = false;

  const roleFamily = getRoleFamily(role);
  const roleFamilyConfig = getRoleFamilyConfig(role);

  const roleLabel = roleLabels[role];

  const value = useMemo(
    () => ({
      role,
      setRole,
      clearDevRoleOverride,
      isDevRoleOverrideActive,
      roleLabel,
      roleFamily,
      roleFamilyLabel: roleFamilyConfig.name,
    }),
    [role, setRole, clearDevRoleOverride, isDevRoleOverrideActive, roleLabel, roleFamily, roleFamilyConfig.name]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
