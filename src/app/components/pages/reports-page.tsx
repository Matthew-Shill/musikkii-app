import { useRole } from '../../context/role-context';
import { TeacherManagerReportsView } from './reports/teacher-manager-reports-view';
import { AdminReportsView } from './reports/admin-reports-view';
import { ExecutiveReportsView } from './reports/executive-reports-view';
import { RestrictedAccess } from '../restricted-access';

export function ReportsPage() {
  const { role, roleFamily } = useRole();

  switch (roleFamily) {
    case 'instructor':
      return role === 'teacher-manager' ? <TeacherManagerReportsView /> : <RestrictedAccess pageName="Reports" allowedRoles="teacher managers, admins, executives" />;
    case 'operations':
      return <AdminReportsView />;
    case 'leadership':
      return <ExecutiveReportsView />;
    default:
      return <RestrictedAccess pageName="Reports" allowedRoles="teacher managers, admins, executives" />;
  }
}
