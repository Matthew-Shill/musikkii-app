import { UnifiedMessagesView } from './unified-messages-view';

export function AdultStudentMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'teacher', label: 'Teacher' },
    { id: 'support', label: 'Support' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Great progress on your Chopin piece!',
      preview: 'I wanted to reach out and let you know how impressed I am with your dedication to the Nocturne...',
      time: '2 hours ago',
      unread: true,
      category: 'teacher',
      hasAttachment: true,
      content: `Hi Michael,

I wanted to reach out and let you know how impressed I am with your dedication to the Chopin Nocturne in E-flat Major. Your progress over the past few weeks has been remarkable!

The way you're handling the rubato and expressing the emotional depth of the piece shows real musicality. I can tell you've been practicing consistently and thoughtfully.

I've attached a recording of a professional performance that I think you'll find inspiring. Listen to how the pianist handles the dynamics in the middle section - it might give you some ideas for your own interpretation.

Keep up the excellent work! I'm looking forward to our lesson tomorrow.

Best,
Sarah`
    },
    {
      id: 2,
      from: 'Musikkii Support',
      avatar: 'MS',
      role: 'Support Team',
      subject: 'Your lesson reminder for tomorrow',
      preview: 'This is a friendly reminder that you have a piano lesson scheduled for tomorrow at 3:00 PM...',
      time: '5 hours ago',
      unread: false,
      category: 'support'
    },
    {
      id: 3,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Practice assignment for this week',
      preview: 'Here are your practice goals for the week. Focus on the left hand passage in measures 12-16...',
      time: '1 day ago',
      unread: false,
      category: 'teacher',
      hasAttachment: true
    },
    {
      id: 4,
      from: 'Musikkii Billing',
      avatar: 'MB',
      role: 'Billing',
      subject: 'Payment confirmation - March 2026',
      preview: 'Your payment of $180.00 has been successfully processed. Receipt attached...',
      time: '3 days ago',
      unread: false,
      category: 'support',
      hasAttachment: true
    },
    {
      id: 5,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Excellent lesson today!',
      preview: 'Thank you for a wonderful lesson today. Your technique on the arpeggios is really improving...',
      time: '5 days ago',
      unread: false,
      category: 'teacher'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
