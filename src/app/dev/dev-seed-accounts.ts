import type { UserRole } from '../context/role-context';

/** Mirrors `ACCOUNTS` in `scripts/seed-dev-test-users.ts` — dev UI only. */
export type DevSeedAccount = {
  id: string;
  label: string;
  email: string;
  role: UserRole;
};

export const DEV_SEED_ACCOUNTS: readonly DevSeedAccount[] = [
  { id: 'adult-student', label: 'Adult student', email: 'adult-student.dev@musikkii.test', role: 'adult-student' },
  { id: 'parent', label: 'Parent', email: 'parent.dev@musikkii.test', role: 'parent' },
  { id: 'teacher', label: 'Teacher', email: 'teacher.dev@musikkii.test', role: 'teacher' },
  { id: 'teacher-manager', label: 'Teacher manager', email: 'teacher-manager.dev@musikkii.test', role: 'teacher-manager' },
  { id: 'admin', label: 'Admin', email: 'admin.dev@musikkii.test', role: 'admin' },
  { id: 'executive', label: 'Executive', email: 'executive.dev@musikkii.test', role: 'executive' },
  { id: 'child-student', label: 'Child student', email: 'child-student.dev@musikkii.test', role: 'child-student' },
  { id: 'family', label: 'Family', email: 'family.dev@musikkii.test', role: 'family' },
] as const;
