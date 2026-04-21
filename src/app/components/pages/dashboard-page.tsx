import { useRole } from '../../context/role-context';
import { useAuthSession } from '../../context/auth-session-context';
import { LearnerDashboard } from '../dashboards/learner-dashboard';
import { HouseholdDashboard } from '../dashboards/household-dashboard';
import { InstructorDashboard } from '../dashboards/instructor-dashboard';
import { OperationsDashboard } from '../dashboards/operations-dashboard';
import { LeadershipDashboard } from '../dashboards/leadership-dashboard';

export function DashboardPage() {
  const { role, roleFamily } = useRole();
  const { profile, user } = useAuthSession();
  const metaName =
    typeof user?.user_metadata?.full_name === 'string' ? user.user_metadata.full_name.trim() : '';
  const displayName =
    profile?.full_name?.trim() || metaName || user?.email?.split('@')[0] || 'there';

  // Route based on role family
  switch (roleFamily) {
    case 'learner':
      return <LearnerDashboard role={role} userName={displayName} />;
    case 'household':
      return <HouseholdDashboard role={role} />;
    case 'instructor':
      return <InstructorDashboard role={role} />;
    case 'operations':
      return <OperationsDashboard />;
    case 'leadership':
      return <LeadershipDashboard />;
    default:
      return <LearnerDashboard role={role} userName={displayName} />;
  }
}
