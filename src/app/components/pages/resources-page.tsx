import { useRole } from '../../context/role-context';
import { AdultStudentResourcesView } from './resources/adult-student-resources-view';
import { ChildStudentResourcesView } from './resources/child-student-resources-view';
import { ParentResourcesView } from './resources/parent-resources-view';
import { FamilyResourcesView } from './resources/family-resources-view';
import { TeacherResourcesView } from './resources/teacher-resources-view';

export function ResourcesPage() {
  const { role, roleFamily } = useRole();

  switch (roleFamily) {
    case 'learner':
      return role === 'child-student' ? <ChildStudentResourcesView /> : <AdultStudentResourcesView />;
    case 'household':
      return role === 'parent' ? <ParentResourcesView /> : <FamilyResourcesView />;
    case 'instructor':
    case 'operations':
    case 'leadership':
      return <TeacherResourcesView />;
  }
}
