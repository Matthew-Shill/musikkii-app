import { UnifiedMessagesView } from './unified-messages-view';

export function TeacherManagerMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'teachers', label: 'Teachers' },
    { id: 'admin', label: 'Admin' },
    { id: 'alerts', label: 'Alerts' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Jessica Miller',
      avatar: 'JM',
      role: 'Piano Teacher',
      subject: 'Question about student scheduling conflict',
      preview: 'Hi! I have a scheduling question. Two students requested the same time slot...',
      time: '1 hour ago',
      unread: true,
      category: 'teachers'
    },
    {
      id: 2,
      from: 'System Alert',
      avatar: 'SA',
      role: 'Automated',
      subject: 'Sarah Johnson - Multiple lesson reschedules',
      preview: 'Alert: Sarah Johnson has rescheduled 3 lessons this week. May need support...',
      time: '3 hours ago',
      unread: true,
      category: 'alerts'
    },
    {
      id: 3,
      from: 'Michael Davis',
      avatar: 'MD',
      role: 'Guitar Teacher',
      subject: 'Monthly check-in summary',
      preview: 'Here\'s my monthly summary. Overall great month, 28 lessons completed...',
      time: '5 hours ago',
      unread: false,
      category: 'teachers'
    },
    {
      id: 4,
      from: 'Admin Team',
      avatar: 'AT',
      role: 'Administration',
      subject: 'Q2 Teacher Performance Reviews',
      preview: 'Please complete performance reviews for your team by April 15th...',
      time: '1 day ago',
      unread: false,
      category: 'admin'
    },
    {
      id: 5,
      from: 'Katie Wilson',
      avatar: 'KW',
      role: 'Violin Teacher',
      subject: 'Request for professional development',
      preview: 'I\'d like to attend the Suzuki Method workshop in May. Can we discuss?',
      time: '2 days ago',
      unread: false,
      category: 'teachers'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
