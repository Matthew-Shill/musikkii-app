import type { UserRole } from '@/app/types/domain';

const USER_ROLES: readonly UserRole[] = [
  'adult-student',
  'child-student',
  'parent',
  'family',
  'teacher',
  'teacher-manager',
  'admin',
  'executive',
] as const;

/**
 * Maps `profiles.app_role` text from the database to `UserRole`, or null if unknown.
 */
export function parseAppRoleFromProfile(value: string | null | undefined): UserRole | null {
  if (!value) return null;
  return (USER_ROLES as readonly string[]).includes(value) ? (value as UserRole) : null;
}
