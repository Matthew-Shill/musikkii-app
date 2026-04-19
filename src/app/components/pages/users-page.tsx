import { useRole } from '../../context/role-context';
import { AdminUsersView } from './users/admin-users-view';
import { ExecutiveUsersView } from './users/executive-users-view';
import { RestrictedAccess } from '../restricted-access';

export function UsersPage() {
  const { roleFamily } = useRole();

  switch (roleFamily) {
    case 'operations':
      return <AdminUsersView />;
    case 'leadership':
      return <ExecutiveUsersView />;
    default:
      return <RestrictedAccess pageName="Users" allowedRoles="admins, executives" />;
  }
}
