import type { AppRoleFamily } from '../types/domain';

/**
 * Route Permission Configuration
 *
 * Defines which role families have access to which routes.
 * Used for route guards and navigation filtering.
 */

export type RoutePath =
  | '/'
  | '/calendar'
  | '/practice'
  | '/practice-insights'
  | '/progress'
  | '/messages'
  | '/resources'
  | '/billing'
  | '/payouts'
  | '/settings'
  | '/students'
  | '/teachers'
  | '/users'
  | '/operations'
  | '/reports'
  | '/teacher-availability';

export interface RoutePermission {
  path: RoutePath;
  allowedFamilies: AppRoleFamily[];
  requiresExact?: boolean; // If true, only these families can access
}

export const ROUTE_PERMISSIONS: RoutePermission[] = [
  {
    path: '/',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
  },
  {
    path: '/calendar',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
  },
  {
    path: '/messages',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
  },
  {
    path: '/resources',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
  },
  {
    path: '/settings',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
  },
  {
    path: '/practice',
    allowedFamilies: ['learner'],
    requiresExact: true,
  },
  {
    path: '/practice-insights',
    allowedFamilies: ['household', 'instructor'],
    requiresExact: true,
  },
  {
    path: '/progress',
    allowedFamilies: ['learner', 'household'],
    requiresExact: true,
  },
  {
    path: '/students',
    allowedFamilies: ['household', 'instructor', 'operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/teachers',
    allowedFamilies: ['learner', 'household', 'instructor', 'operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/billing',
    allowedFamilies: ['learner', 'household', 'operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/payouts',
    allowedFamilies: ['instructor', 'operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/users',
    allowedFamilies: ['operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/operations',
    allowedFamilies: ['operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/reports',
    allowedFamilies: ['instructor', 'operations', 'leadership'],
    requiresExact: true,
  },
  {
    path: '/teacher-availability',
    allowedFamilies: ['instructor', 'operations', 'leadership'],
    requiresExact: true,
  },
];

/** Learner/household self-service reschedule; inherits same families as `/calendar`. */
const CALENDAR_LESSON_RESCHEDULE_PATH = /^\/calendar\/lessons\/[^/]+\/reschedule$/;

/**
 * Check if a role family has access to a specific route
 */
export function hasRouteAccess(roleFamily: AppRoleFamily, path: string): boolean {
  if (CALENDAR_LESSON_RESCHEDULE_PATH.test(path)) {
    const calendar = ROUTE_PERMISSIONS.find((p) => p.path === '/calendar');
    return Boolean(calendar && calendar.allowedFamilies.includes(roleFamily));
  }

  const permission = ROUTE_PERMISSIONS.find((p) => p.path === path);

  // Fail closed: if no permission defined, deny access
  if (!permission) {
    return false;
  }

  return permission.allowedFamilies.includes(roleFamily);
}

/**
 * Get the default redirect path for a role family
 */
export function getDefaultRedirect(roleFamily: AppRoleFamily): string {
  // Everyone can access dashboard
  return '/';
}
