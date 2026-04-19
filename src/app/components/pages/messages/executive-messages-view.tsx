import { UnifiedMessagesView } from './unified-messages-view';

export function ExecutiveMessagesView() {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'strategic', label: 'Strategic' },
    { id: 'alerts', label: 'Alerts' }
  ];

  const messages = [
    {
      id: 1,
      from: 'CFO - Finance Team',
      avatar: 'FT',
      role: 'Financial Leadership',
      subject: 'Q1 Financial Summary - Strong Performance',
      preview: 'Q1 results show 18% revenue growth. Student retention at 94.2%. Detailed analysis attached...',
      time: '2 hours ago',
      unread: true,
      category: 'leadership',
      content: `Q1 results show 18% revenue growth. Student retention at 94.2%. Detailed analysis attached.

Key Highlights:
• Revenue Growth: +18% vs Q4
• Student Retention: 94.2%
• New Students: +387
• Teacher satisfaction: 92%

Detailed financial analysis and department breakdowns are available in the attached report. Recommend scheduling a leadership meeting to discuss Q2 growth strategy.`
    },
    {
      id: 2,
      from: 'System Alert',
      avatar: 'SA',
      role: 'Automated Alert',
      subject: 'Student enrollment milestone reached',
      preview: 'Congratulations! Platform has reached 3,000 active students for the first time...',
      time: '5 hours ago',
      unread: true,
      category: 'alerts'
    },
    {
      id: 3,
      from: 'COO - Operations',
      avatar: 'CO',
      role: 'Operations Leadership',
      subject: 'Teacher capacity planning for Q2',
      preview: 'We need to discuss hiring 8-10 new teachers to meet growing demand. Proposed timeline attached...',
      time: '1 day ago',
      unread: false,
      category: 'strategic'
    },
    {
      id: 4,
      from: 'Board of Directors',
      avatar: 'BD',
      role: 'Board',
      subject: 'Next board meeting agenda',
      preview: 'Agenda for April board meeting is ready for review. Key topics: expansion, financials, teacher performance...',
      time: '2 days ago',
      unread: false,
      category: 'leadership'
    },
    {
      id: 5,
      from: 'Head of Marketing',
      avatar: 'HM',
      role: 'Marketing Leadership',
      subject: 'Spring enrollment campaign results',
      preview: 'Campaign exceeded targets by 25%. 156 new student enrollments. Breakdown by instrument and region attached...',
      time: '3 days ago',
      unread: false,
      category: 'leadership'
    }
  ];

  return <UnifiedMessagesView categories={categories} messages={messages} />;
}
