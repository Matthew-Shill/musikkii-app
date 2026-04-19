import { UnifiedMessagesView } from './unified-messages-view';

export function ParentMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'teacher', label: 'Teacher Updates' },
    { id: 'support', label: 'Support' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Emma\'s progress update - Excellent week!',
      preview: 'I wanted to update you on Emma\'s progress. She had an exceptional lesson today and is showing great improvement...',
      time: '2 hours ago',
      unread: true,
      category: 'teacher',
      hasAttachment: false,
      content: `Hi Jennifer,

I wanted to update you on Emma's progress this week. She had an exceptional lesson today and I'm really impressed with how dedicated she's been to her practice.

Emma has been working on the Chopin piece we discussed, and her technique has improved significantly. She's showing great musicality and emotional expression in her playing.

I've noticed that she's been practicing consistently - whatever you're doing to encourage her is working wonderfully! Her confidence at the piano is growing week by week.

This Week's Focus:
• Continue working on the Chopin Nocturne
• Practice scales with both hands, 10 minutes daily
• Review the dynamics in measures 12-24

Please let me know if you have any questions or if there's anything you'd like me to focus on in our next lesson.

Best regards,
Sarah Johnson`
    },
    {
      id: 2,
      from: 'Musikkii Support',
      avatar: 'MS',
      role: 'Support Team',
      subject: 'Please confirm tomorrow\'s lesson',
      preview: 'We noticed that tomorrow\'s lesson hasn\'t been confirmed yet. Please confirm or reschedule...',
      time: '5 hours ago',
      unread: true,
      category: 'support'
    },
    {
      id: 3,
      from: 'Sarah Johnson',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Practice assignments for the week',
      preview: 'Here are Emma\'s practice goals for this week. She should focus on...',
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
      subject: 'March payment confirmation',
      preview: 'Your payment for Emma\'s piano lessons has been processed successfully...',
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
      subject: 'Great lesson today!',
      preview: 'Emma did wonderfully in today\'s lesson. Her technique is improving significantly...',
      time: '5 days ago',
      unread: false,
      category: 'teacher'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
