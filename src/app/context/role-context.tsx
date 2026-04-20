import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getRoleFamily, getRoleFamilyConfig, type RoleFamily } from '../config/role-config';
import { useAuthSession } from './auth-session-context';
import {
  clearDevRoleOverrideStorage,
  readDevRoleOverrideFromStorage,
  writeDevRoleOverrideToStorage,
} from '@/lib/dev-role-override';

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
  /** Effective role: DB profile when signed in (unless dev override), else preview role for anonymous/local UI */
  role: UserRole;
  /**
   * When signed in with Supabase: sets a **session dev override** (persisted in `sessionStorage`).
   * When anonymous / not configured: updates **preview role** only (in-memory for UI demos).
   */
  setRole: (role: UserRole) => void;
  /** Clear session dev override; effective role reverts to `resolvedAppRole` from the database */
  clearDevRoleOverride: () => void;
  /** True when signed in and a dev override is active (not the database `app_role`) */
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

  /** Anonymous / offline UI preview role (also temporary fallback while profile loads) */
  const [previewRole, setPreviewRole] = useState<UserRole>('adult-student');
  /** Mirrors sessionStorage while authenticated */
  const [devOverride, setDevOverride] = useState<UserRole | null>(null);

  const signedIn = Boolean(isConfigured && session);

  useEffect(() => {
    if (!signedIn) {
      setDevOverride(null);
      clearDevRoleOverrideStorage();
      return;
    }
    setDevOverride(readDevRoleOverrideFromStorage());
  }, [signedIn, session?.user?.id]);

  const setRole = useCallback(
    (next: UserRole) => {
      if (signedIn) {
        if (resolvedAppRole !== null && next === resolvedAppRole) {
          clearDevRoleOverrideStorage();
          setDevOverride(null);
          return;
        }
        setDevOverride(next);
        writeDevRoleOverrideToStorage(next);
        return;
      }
      setPreviewRole(next);
    },
    [signedIn, resolvedAppRole]
  );

  const clearDevRoleOverride = useCallback(() => {
    clearDevRoleOverrideStorage();
    setDevOverride(null);
  }, []);

  const role = useMemo<UserRole>(() => {
    if (signedIn) {
      if (devOverride !== null) return devOverride;
      if (resolvedAppRole) return resolvedAppRole;
      return previewRole;
    }
    return previewRole;
  }, [signedIn, devOverride, resolvedAppRole, previewRole]);

  const isDevRoleOverrideActive = signedIn && devOverride !== null;

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
