import { createContext, useContext, useState, ReactNode } from 'react';
import { getRoleFamily, getRoleFamilyConfig, type RoleFamily } from '../config/role-config';

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
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleLabel: string;
  roleFamily: RoleFamily;
  roleFamilyLabel: string;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const roleLabels: Record<UserRole, string> = {
  'adult-student': 'Adult Student',
  'child-student': 'Child Student',
  'parent': 'Parent / Guardian',
  'family': 'Family / Multi-Student',
  'teacher': 'Teacher',
  'teacher-manager': 'Teacher Manager',
  'admin': 'Admin',
  'executive': 'Executive'
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>('adult-student');

  // Compute role family based on current role
  const roleFamily = getRoleFamily(role);
  const roleFamilyConfig = getRoleFamilyConfig(role);

  const value = {
    role,
    setRole,
    roleLabel: roleLabels[role],
    roleFamily,
    roleFamilyLabel: roleFamilyConfig.name
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
