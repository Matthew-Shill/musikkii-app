import { UnifiedMessagesView } from './unified-messages-view';

export function AdminMessagesView() {
  const categories = [
    { id: 'all', label: 'All Issues' },
    { id: 'support', label: 'Support' },
    { id: 'billing', label: 'Billing' },
    { id: 'escalation', label: 'Escalations' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Sarah Williams',
      avatar: 'SW',
      role: 'Parent',
      subject: 'Billing issue - duplicate charge',
      preview: 'I was charged twice for my daughter\'s March lessons. Can you please help resolve this?',
      time: '30 min ago',
      unread: true,
      category: 'billing'
    },
    {
      id: 2,
      from: 'Katie Wilson',
      avatar: 'KW',
      role: 'Teacher',
      subject: 'Student attendance concern',
      preview: 'I have a student who has missed 3 consecutive lessons without notice. Need guidance...',
      time: '1 hour ago',
      unread: true,
      category: 'escalation'
    },
    {
      id: 3,
      from: 'Michael Chen',
      avatar: 'MC',
      role: 'Adult Student',
      subject: 'Account access issue',
      preview: 'I\'m unable to log into my account. I\'ve tried resetting my password but...',
      time: '2 hours ago',
      unread: true,
      category: 'support'
    },
    {
      id: 4,
      from: 'Jennifer Smith',
      avatar: 'JS',
      role: 'Parent',
      subject: 'Question about family discount',
      preview: 'I\'m enrolling my second child. How do I ensure the family discount is applied?',
      time: '4 hours ago',
      unread: false,
      category: 'billing'
    },
    {
      id: 5,
      from: 'Jessica Miller',
      avatar: 'JM',
      role: 'Teacher',
      subject: 'Lesson room scheduling conflict',
      preview: 'There appears to be a double-booking in Room B for next Thursday...',
      time: '1 day ago',
      unread: false,
      category: 'support'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
