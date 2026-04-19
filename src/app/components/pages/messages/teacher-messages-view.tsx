import { UnifiedMessagesView } from './unified-messages-view';

export function TeacherMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'students', label: 'Students' },
    { id: 'parents', label: 'Parents' },
    { id: 'admin', label: 'Admin' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Jennifer Smith',
      avatar: 'JS',
      role: 'Parent',
      subject: 'Question about Emma\'s practice schedule',
      preview: 'Hi Sarah, I wanted to ask about the best way to structure Emma\'s practice time...',
      time: '1 hour ago',
      unread: true,
      category: 'parents'
    },
    {
      id: 2,
      from: 'Michael Chen',
      avatar: 'MC',
      role: 'Adult Student',
      subject: 'Rescheduling next week\'s lesson',
      preview: 'Hi Sarah, I have a work conflict next Tuesday. Could we possibly move my lesson to Wednesday?',
      time: '2 hours ago',
      unread: true,
      category: 'students'
    },
    {
      id: 3,
      from: 'Katie Wilson',
      avatar: 'KW',
      role: 'Teacher Manager',
      subject: 'Monthly check-in scheduled',
      preview: 'Hi Sarah! I\'ve scheduled our monthly check-in for next Thursday at 2 PM...',
      time: '5 hours ago',
      unread: false,
      category: 'admin'
    },
    {
      id: 4,
      from: 'David Park',
      avatar: 'DP',
      role: 'Adult Student',
      subject: 'Thanks for the resource!',
      preview: 'The practice guide you sent has been incredibly helpful. My technique is already improving...',
      time: '1 day ago',
      unread: false,
      category: 'students'
    },
    {
      id: 5,
      from: 'Admin Team',
      avatar: 'AT',
      role: 'Administration',
      subject: 'Spring recital planning meeting',
      preview: 'All teachers are invited to the spring recital planning meeting on March 25th...',
      time: '2 days ago',
      unread: false,
      category: 'admin'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
