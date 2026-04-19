import { useRole } from '../../context/role-context';
import { TeacherStudentsView } from './students/teacher-students-view';
import { RestrictedAccess } from '../restricted-access';

export function StudentsPage() {
  const { roleFamily } = useRole();

  switch (roleFamily) {
    case 'household':
    case 'instructor':
      return <TeacherStudentsView />;
    case 'operations':
    case 'leadership':
      return <TeacherStudentsView />;
    default:
      return <RestrictedAccess pageName="Students" allowedRoles="families, teachers, admins" />;
  }
}
