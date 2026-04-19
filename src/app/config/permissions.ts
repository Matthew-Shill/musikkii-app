import type { UserRole } from '../context/role-context';

/**
 * Permission types
 * Defines all available permissions in the system
 */
export type Permission =
  // Billing permissions
  | 'billing:view'
  | 'billing:manage'
  | 'billing:view_all'
  | 'billing:manage_all'

  // Student/Children permissions
  | 'students:view_own'
  | 'students:view_household'
  | 'students:view_assigned'
  | 'students:view_all'
  | 'students:manage'

  // Teacher permissions
  | 'teachers:browse'
  | 'teachers:view_all'
  | 'teachers:manage'

  // Lesson permissions
  | 'lessons:view_own'
  | 'lessons:view_household'
  | 'lessons:view_assigned'
  | 'lessons:view_all'
  | 'lessons:schedule'
  | 'lessons:approve'
  | 'lessons:mark_complete'

  // Assignment/Practice permissions
  | 'assignments:view_own'
  | 'assignments:view_household'
  | 'assignments:create'
  | 'assignments:grade'

  // Progress permissions
  | 'progress:view_own'
  | 'progress:view_household'
  | 'progress:view_assigned'

  // Message permissions
  | 'messages:send_teacher'
  | 'messages:send_student'
  | 'messages:send_parent'
  | 'messages:broadcast'

  // Payout permissions
  | 'payouts:view_own'
  | 'payouts:view_all'
  | 'payouts:manage_all'
  | 'payouts:approve'

  // Team permissions
  | 'team:view'
  | 'team:manage'
  | 'team:view_all'

  // Reports permissions
  | 'reports:view'
  | 'reports:export'

  // User management permissions
  | 'users:view'
  | 'users:view_all'
  | 'users:manage'
  | 'users:create'
  | 'users:delete'

  // Operations permissions
  | 'operations:view'
  | 'operations:configure'

  // Resource permissions
  | 'resources:upload'
  | 'resources:manage';

/**
 * Permission Matrix
 * Defines which roles have which permissions
 */
export const PERMISSION_MATRIX: Record<Permission, UserRole[]> = {
  // Billing permissions
  'billing:view': ['adult-student', 'parent', 'family', 'admin', 'executive'],
  'billing:manage': ['adult-student', 'parent', 'family', 'admin'],
  'billing:view_all': ['admin', 'executive'],
  'billing:manage_all': ['admin'],

  // Student/Children permissions
  'students:view_own': ['adult-student', 'child-student'],
  'students:view_household': ['parent', 'family'],
  'students:view_assigned': ['teacher', 'teacher-manager'],
  'students:view_all': ['admin', 'executive'],
  'students:manage': ['admin'],

  // Teacher permissions
  'teachers:browse': ['adult-student', 'parent', 'family'],
  'teachers:view_all': ['admin', 'executive'],
  'teachers:manage': ['admin'],

  // Lesson permissions
  'lessons:view_own': ['adult-student', 'child-student'],
  'lessons:view_household': ['parent', 'family'],
  'lessons:view_assigned': ['teacher', 'teacher-manager'],
  'lessons:view_all': ['admin', 'executive'],
  'lessons:schedule': ['parent', 'family', 'admin'],
  'lessons:approve': ['admin'],
  'lessons:mark_complete': ['teacher', 'teacher-manager'],

  // Assignment/Practice permissions
  'assignments:view_own': ['adult-student', 'child-student'],
  'assignments:view_household': ['parent', 'family'],
  'assignments:create': ['teacher', 'teacher-manager'],
  'assignments:grade': ['teacher', 'teacher-manager'],

  // Progress permissions
  'progress:view_own': ['adult-student', 'child-student'],
  'progress:view_household': ['parent', 'family'],
  'progress:view_assigned': ['teacher', 'teacher-manager'],

  // Message permissions
  'messages:send_teacher': ['adult-student', 'child-student', 'parent', 'family'],
  'messages:send_student': ['teacher', 'teacher-manager'],
  'messages:send_parent': ['teacher', 'teacher-manager'],
  'messages:broadcast': ['admin', 'executive'],

  // Payout permissions
  'payouts:view_own': ['teacher', 'teacher-manager'],
  'payouts:view_all': ['admin', 'executive'],
  'payouts:manage_all': ['admin'],
  'payouts:approve': ['admin', 'executive'],

  // Team permissions
  'team:view': ['teacher-manager'],
  'team:manage': ['teacher-manager', 'admin', 'executive'],
  'team:view_all': ['admin', 'executive'],

  // Reports permissions
  'reports:view': ['teacher-manager', 'admin', 'executive'],
  'reports:export': ['admin', 'executive'],

  // User management permissions
  'users:view': ['admin', 'executive'],
  'users:view_all': ['admin', 'executive'],
  'users:manage': ['admin'],
  'users:create': ['admin'],
  'users:delete': ['admin'],

  // Operations permissions
  'operations:view': ['admin', 'executive'],
  'operations:configure': ['admin'],

  // Resource permissions
  'resources:upload': ['teacher', 'teacher-manager', 'admin'],
  'resources:manage': ['admin']
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const allowedRoles = PERMISSION_MATRIX[permission];
  return allowedRoles.includes(role);
}

/**
 * Get all permissions for a given role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  const permissions: Permission[] = [];

  for (const [permission, allowedRoles] of Object.entries(PERMISSION_MATRIX)) {
    if (allowedRoles.includes(role)) {
      permissions.push(permission as Permission);
    }
  }

  return permissions;
}

/**
 * Check if a role has any of the given permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Check if a role has all of the given permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}
