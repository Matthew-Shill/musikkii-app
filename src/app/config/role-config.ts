import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  MessageSquare,
  FolderOpen,
  CreditCard,
  Settings,
  Target,
  Users,
  BarChart3,
  DollarSign,
  Building2,
  Activity,
  type LucideIcon
} from 'lucide-react';
import type { UserRole } from '../context/role-context';
import type { Permission } from './permissions';

// Role family types
export type RoleFamily = 'learner' | 'household' | 'instructor' | 'operations' | 'leadership';

// Navigation item type
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
}

// Role family configuration
export interface RoleFamilyConfig {
  id: RoleFamily;
  name: string;
  description: string;
  roles: UserRole[];
  navigation: NavigationItem[];
}

/**
 * Role Family Configurations
 * Defines the 5 core role families and their navigation structures
 */
export const ROLE_FAMILIES: Record<RoleFamily, RoleFamilyConfig> = {
  learner: {
    id: 'learner',
    name: 'Learner',
    description: 'Individual learning experience for students',
    roles: ['adult-student', 'child-student'],
    navigation: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Practice', href: '/practice', icon: Target },
      { name: 'Progress', href: '/progress', icon: TrendingUp },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Resources', href: '/resources', icon: FolderOpen },
      { name: 'Teachers', href: '/teachers', icon: Users, permission: 'teachers:browse' },
      { name: 'Billing', href: '/billing', icon: CreditCard, permission: 'billing:view' },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },

  household: {
    id: 'household',
    name: 'Household',
    description: 'Multi-student family account management',
    roles: ['parent', 'family'],
    navigation: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Practice Insights', href: '/practice-insights', icon: Activity },
      { name: 'Progress', href: '/progress', icon: TrendingUp },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Resources', href: '/resources', icon: FolderOpen },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Billing', href: '/billing', icon: CreditCard },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },

  instructor: {
    id: 'instructor',
    name: 'Instructor',
    description: 'Teaching and student management',
    roles: ['teacher', 'teacher-manager'],
    navigation: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Students', href: '/students', icon: Users },
      { name: 'Practice Insights', href: '/practice-insights', icon: Activity },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Resources', href: '/resources', icon: FolderOpen },
      { name: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports:view' },
      { name: 'Payouts', href: '/payouts', icon: DollarSign },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },

  operations: {
    id: 'operations',
    name: 'Operations',
    description: 'Platform operations and management',
    roles: ['admin'],
    navigation: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Operations', href: '/operations', icon: Settings },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Billing', href: '/billing', icon: CreditCard },
      { name: 'Payouts', href: '/payouts', icon: DollarSign },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  },

  leadership: {
    id: 'leadership',
    name: 'Leadership',
    description: 'Strategic oversight and business intelligence',
    roles: ['executive'],
    navigation: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Calendar', href: '/calendar', icon: Calendar },
      { name: 'Users', href: '/users', icon: Users },
      { name: 'Teachers', href: '/teachers', icon: Users },
      { name: 'Org Overview', href: '/operations', icon: Building2 },
      { name: 'Reports', href: '/reports', icon: BarChart3 },
      { name: 'Messages', href: '/messages', icon: MessageSquare },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
};

/**
 * Get role family for a given user role
 */
export function getRoleFamily(role: UserRole): RoleFamily {
  // Check each family to see if it contains this role
  for (const [familyId, family] of Object.entries(ROLE_FAMILIES)) {
    if (family.roles.includes(role)) {
      return familyId as RoleFamily;
    }
  }

  // Default fallback (should never happen with proper types)
  return 'learner';
}

/**
 * Get role family configuration for a given role
 */
export function getRoleFamilyConfig(role: UserRole): RoleFamilyConfig {
  const family = getRoleFamily(role);
  return ROLE_FAMILIES[family];
}

/**
 * Get navigation items for a given role
 * Note: This returns all navigation items, including permission-gated ones
 * Use with permission checking to filter what should be displayed
 */
export function getNavigationForRole(role: UserRole): NavigationItem[] {
  const config = getRoleFamilyConfig(role);
  return config.navigation;
}
