import { UnifiedMessagesView } from './unified-messages-view';

export function FamilyMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'emma', label: 'Emma' },
    { id: 'oliver', label: 'Oliver' },
    { id: 'sophia', label: 'Sophia' },
    { id: 'household', label: 'Household' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Emma\'s excellent progress this week',
      preview: 'Emma had a wonderful lesson today. Her Chopin piece is coming along beautifully...',
      time: '1 hour ago',
      unread: true,
      category: 'emma'
    },
    {
      id: 2,
      from: 'Michael Davis',
      avatar: 'MD',
      role: 'Guitar Teacher',
      subject: 'Oliver needs new guitar strings',
      preview: 'Hi! Oliver\'s guitar strings are getting worn. I recommend replacing them before next week...',
      time: '3 hours ago',
      unread: true,
      category: 'oliver'
    },
    {
      id: 3,
      from: 'Katie Wilson',
      avatar: 'KW',
      role: 'Violin Teacher',
      subject: 'Sophia\'s recital preparation',
      preview: 'Sophia is doing great preparing for the spring recital. Here\'s what we\'re focusing on...',
      time: '5 hours ago',
      unread: false,
      category: 'sophia',
      hasAttachment: true
    },
    {
      id: 4,
      from: 'Musikkii Support',
      avatar: 'MS',
      role: 'Support Team',
      subject: 'Household billing summary - March',
      preview: 'Your monthly billing summary is ready. Total for 3 students: $370.00...',
      time: '1 day ago',
      unread: false,
      category: 'household',
      hasAttachment: true
    },
    {
      id: 5,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Practice assignment for Emma',
      preview: 'Here are Emma\'s practice goals for this week...',
      time: '2 days ago',
      unread: false,
      category: 'emma',
      hasAttachment: true
    },
    {
      id: 6,
      from: 'Michael Davis',
      avatar: 'MD',
      role: 'Guitar Teacher',
      subject: 'Great lesson with Oliver!',
      preview: 'Oliver did fantastic today learning the new chord progression...',
      time: '3 days ago',
      unread: false,
      category: 'oliver'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
