import { useRole } from '../../context/role-context';
import { TeacherPayoutsView } from './payouts/teacher-payouts-view';
import { TeacherManagerPayoutsView } from './payouts/teacher-manager-payouts-view';
import { AdminPayoutsView } from './payouts/admin-payouts-view';
import { RestrictedAccess } from '../restricted-access';

export function PayoutsPage() {
  const { role, roleFamily } = useRole();

  switch (roleFamily) {
    case 'instructor':
      return role === 'teacher-manager' ? <TeacherManagerPayoutsView /> : <TeacherPayoutsView />;
    case 'operations':
    case 'leadership':
      return <AdminPayoutsView />;
    default:
      return <RestrictedAccess pageName="Payouts" allowedRoles="teachers, admins" />;
  }
}