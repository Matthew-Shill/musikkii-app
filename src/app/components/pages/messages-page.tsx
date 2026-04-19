import { useRole } from '../../context/role-context';
import { AdultStudentMessagesView } from './messages/adult-student-messages-view';
import { ChildStudentMessagesView } from './messages/child-student-messages-view';
import { ParentMessagesView } from './messages/parent-messages-view';
import { FamilyMessagesView } from './messages/family-messages-view';
import { TeacherMessagesView } from './messages/teacher-messages-view';
import { TeacherManagerMessagesView } from './messages/teacher-manager-messages-view';
import { AdminMessagesView } from './messages/admin-messages-view';
import { ExecutiveMessagesView } from './messages/executive-messages-view';

export function MessagesPage() {
  const { role, roleFamily } = useRole();

  switch (roleFamily) {
    case 'learner':
      return role === 'child-student' ? <ChildStudentMessagesView /> : <AdultStudentMessagesView />;
    case 'household':
      return role === 'parent' ? <ParentMessagesView /> : <FamilyMessagesView />;
    case 'instructor':
      return role === 'teacher-manager' ? <TeacherManagerMessagesView /> : <TeacherMessagesView />;
    case 'operations':
      return <AdminMessagesView />;
    case 'leadership':
      return <ExecutiveMessagesView />;
  }
}