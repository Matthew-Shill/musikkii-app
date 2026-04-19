import { useRole } from '../../context/role-context';
import { StudentProgressRefined } from './progress/student-progress-refined';
import { ParentProgressView } from './progress/parent-progress-view';
import { MultiStudentProgressView } from './progress/multi-student-progress-view';

export function ProgressPage() {
  const { role, roleFamily } = useRole();

  // Route based on role family
  switch (roleFamily) {
    case 'learner':
      return <StudentProgressRefined />;
    case 'household':
      // Parent gets single-student view, family gets multi-student view
      return role === 'parent' ? <ParentProgressView /> : <MultiStudentProgressView />;
    default:
      // Other role families should be blocked by ProtectedRoute
      return (
        <div className="p-8 py-24 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Progress View</h2>
            <p className="text-gray-600">
              The Progress tab shows student learning journeys and development over time.
              This view is available to students and families.
            </p>
          </div>
        </div>
      );
  }
}