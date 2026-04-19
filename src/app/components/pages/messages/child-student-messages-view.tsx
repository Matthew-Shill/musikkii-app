import { UnifiedMessagesView } from './unified-messages-view';

export function ChildStudentMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'teacher', label: 'From Teacher' }
  ];

  const messages = [
    {
      id: 1,
      from: 'Ms. Sarah',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Amazing job today! ⭐',
      preview: 'You did such a great job on your scales today! I loved hearing you play...',
      time: 'Today',
      unread: true,
      category: 'teacher',
      content: `Hi Emma!

You did such a great job on your scales today! I loved hearing you play them so smoothly.

Your practice is really paying off! Keep practicing your new song this week, and I know you'll do amazing at our next lesson.

⭐ You're doing awesome! ⭐
Keep up the great work!

See you at our next lesson!
Ms. Sarah`
    },
    {
      id: 2,
      from: 'Ms. Sarah',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Practice reminder for this week',
      preview: 'Remember to practice your new song 3 times this week. You can do it!',
      time: 'Yesterday',
      unread: false,
      category: 'teacher'
    },
    {
      id: 3,
      from: 'Ms. Sarah',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'You earned a gold star! 🌟',
      preview: 'Congratulations! You earned a gold star for completing all your practice goals...',
      time: '3 days ago',
      unread: false,
      category: 'teacher',
      content: `🌟 Gold Star Award! 🌟

Congratulations Emma!

You earned a gold star for completing all your practice goals this week! That's amazing!

🏆 Practice Champion! 🏆
You practiced every day this week!

I'm so proud of you! Keep being awesome!
Ms. Sarah`
    },
    {
      id: 4,
      from: 'Ms. Sarah',
      avatar: 'SJ',
      role: 'Piano Teacher',
      subject: 'Great progress! 🎹',
      preview: 'Your left hand is getting so much stronger! Keep up the awesome work...',
      time: '5 days ago',
      unread: false,
      category: 'teacher'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
