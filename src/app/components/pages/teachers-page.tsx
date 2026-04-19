import { useRole } from '../../context/role-context';
import { UnifiedTeacherDirectoryView } from './teachers/unified-teacher-directory-view';

export function TeachersPage() {
  const { role } = useRole();

  // Use the same unified teacher directory view for all roles
  return <UnifiedTeacherDirectoryView />;
}