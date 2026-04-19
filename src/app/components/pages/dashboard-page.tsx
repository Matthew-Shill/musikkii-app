import { useRole } from '../../context/role-context';
import { LearnerDashboard } from '../dashboards/learner-dashboard';
import { HouseholdDashboard } from '../dashboards/household-dashboard';
import { InstructorDashboard } from '../dashboards/instructor-dashboard';
import { OperationsDashboard } from '../dashboards/operations-dashboard';
import { LeadershipDashboard } from '../dashboards/leadership-dashboard';

export function DashboardPage() {
  const { role, roleFamily } = useRole();

  // Route based on role family
  switch (roleFamily) {
    case 'learner':
      return <LearnerDashboard role={role} userName="Emma" />;
    case 'household':
      return <HouseholdDashboard role={role} />;
    case 'instructor':
      return <InstructorDashboard role={role} />;
    case 'operations':
      return <OperationsDashboard />;
    case 'leadership':
      return <LeadershipDashboard />;
    default:
      // Fallback to learner dashboard if roleFamily is unknown
      return <LearnerDashboard role={role} userName="User" />;
  }
}
