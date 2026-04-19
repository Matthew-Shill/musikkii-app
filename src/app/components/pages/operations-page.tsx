import { useRole } from '../../context/role-context';
import { AdminOperationsView } from './operations/admin-operations-view';
import { ExecutiveOperationsView } from './operations/executive-operations-view';
import { RestrictedAccess } from '../restricted-access';

export function OperationsPage() {
  const { roleFamily } = useRole();

  switch (roleFamily) {
    case 'operations':
      return <AdminOperationsView />;
    case 'leadership':
      return <ExecutiveOperationsView />;
    default:
      return <RestrictedAccess pageName="Operations" allowedRoles="admins, executives" />;
  }
}
