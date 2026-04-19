import { useRole } from '../context/role-context';
import {
  hasPermission as checkPermission,
  hasAnyPermission as checkAnyPermission,
  hasAllPermissions as checkAllPermissions,
  getPermissionsForRole,
  type Permission
} from '../config/permissions';

/**
 * Hook for checking permissions based on current user role
 *
 * @example
 * const { hasPermission, hasAnyPermission, permissions } = usePermissions();
 *
 * if (hasPermission('billing:view')) {
 *   // Show billing section
 * }
 */
export function usePermissions() {
  const { role } = useRole();

  return {
    /**
     * Check if current role has a specific permission
     */
    hasPermission: (permission: Permission): boolean => {
      return checkPermission(role, permission);
    },

    /**
     * Check if current role has any of the given permissions
     */
    hasAnyPermission: (permissions: Permission[]): boolean => {
      return checkAnyPermission(role, permissions);
    },

    /**
     * Check if current role has all of the given permissions
     */
    hasAllPermissions: (permissions: Permission[]): boolean => {
      return checkAllPermissions(role, permissions);
    },

    /**
     * Get all permissions for current role
     */
    permissions: getPermissionsForRole(role),

    /**
     * Current role (for convenience)
     */
    role
  };
}
