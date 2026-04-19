import { useRole } from '../../context/role-context';
import { AdultStudentBillingView } from './billing/adult-student-billing-view';
import { ParentBillingView } from './billing/parent-billing-view';
import { FamilyBillingView } from './billing/family-billing-view';
import { AdminBillingView } from './billing/admin-billing-view';
import { RestrictedAccess } from '../restricted-access';

export function BillingPage() {
  const { role, roleFamily } = useRole();

  switch (roleFamily) {
    case 'learner':
      return <AdultStudentBillingView />;
    case 'household':
      return role === 'parent' ? <ParentBillingView /> : <FamilyBillingView />;
    case 'operations':
    case 'leadership':
      return <AdminBillingView />;
    default:
      return <RestrictedAccess pageName="Billing" allowedRoles="students, families, admins" />;
  }
}