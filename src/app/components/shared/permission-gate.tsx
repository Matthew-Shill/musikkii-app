import { ReactNode } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { Permission } from '../../config/permissions';

interface PermissionGateProps {
  /** Single permission to check */
  permission?: Permission;

  /** Multiple permissions - user must have ANY of these */
  anyOf?: Permission[];

  /** Multiple permissions - user must have ALL of these */
  allOf?: Permission[];

  /** Content to render if user has permission */
  children: ReactNode;

  /** Optional fallback to render if user lacks permission */
  fallback?: ReactNode;
}

/**
 * Component that conditionally renders children based on user permissions
 *
 * @example
 * // Single permission
 * <PermissionGate permission="billing:view">
 *   <BillingSection />
 * </PermissionGate>
 *
 * @example
 * // Any of multiple permissions
 * <PermissionGate anyOf={['users:manage', 'users:view']}>
 *   <UserList />
 * </PermissionGate>
 *
 * @example
 * // All of multiple permissions
 * <PermissionGate allOf={['billing:view', 'billing:manage']}>
 *   <BillingManagement />
 * </PermissionGate>
 *
 * @example
 * // With fallback
 * <PermissionGate permission="reports:view" fallback={<AccessDenied />}>
 *   <ReportsPage />
 * </PermissionGate>
 */
export function PermissionGate({
  permission,
  anyOf,
  allOf,
  children,
  fallback = null
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  // Check permissions based on provided props
  let hasAccess = false;

  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyOf) {
    hasAccess = hasAnyPermission(anyOf);
  } else if (allOf) {
    hasAccess = hasAllPermissions(allOf);
  } else {
    // No permission specified - default to showing content
    // This allows using PermissionGate as a conditional wrapper
    hasAccess = true;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}
