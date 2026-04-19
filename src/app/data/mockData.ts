/**
 * Musikkii Mock Data Layer
 *
 * Centralized mock data for the frontend prototype.
 * This will be replaced with real backend API calls later in Cursor.
 */

import type {
  UserProfile,
  Student,
  Teacher,
  Lesson,
  Assignment,
  PracticeSession,
  StreakState,
  Achievement,
  MessageThread,
  Message,
  Invoice,
  Payout,
  LeagueStanding,
  UserRole
} from '../types/domain';

// ============================================================================
// MOCK USERS
// ============================================================================

export const mockUsers: Record<string, UserProfile> = {
  'student-1': {
    id: 'student-1',
    name: 'Emma Wilson',
    email: 'emma@example.com',
    role: 'adult-student',
    roleFamily: 'learner',
    avatar: 'EW',
    createdAt: new Date('2026-01-05')
  },
  'parent-1': {
    id: 'parent-1',
    name: 'Sarah Williams',
    email: 'sarah@example.com',
    role: 'parent',
    roleFamily: 'household',
    householdId: 'household-1',
    createdAt: new Date('2025-12-01')
  },
  'teacher-1': {
    id: 'teacher-1',
    name: 'Ms. Rodriguez',
    email: 'rodriguez@musikkii.com',
    role: 'teacher',
    roleFamily: 'instructor',
    createdAt: new Date('2024-08-15')
  },
  'admin-1': {
    id: 'admin-1',
    name: 'David Chen',
    email: 'dchen@musikkii.com',
    role: 'admin',
    roleFamily: 'operations',
    createdAt: new Date('2024-03-10')
  },
  'executive-1': {
    id: 'executive-1',
    name: 'Lisa Martinez',
    email: 'lmartinez@musikkii.com',
    role: 'executive',
    roleFamily: 'leadership',
    createdAt: new Date('2023-11-01')
  }
};

// Helper to get mock user for current role
export function getMockUserForRole(role: UserRole): UserProfile {
  const roleMap: Record<UserRole, string> = {
    'adult-student': 'student-1',
    'child-student': 'student-1',
    'parent': 'parent-1',
    'family': 'parent-1',
    'teacher': 'teacher-1',
    'teacher-manager': 'teacher-1',
    'admin': 'admin-1',
    'executive': 'executive-1'
  };

  const userId = roleMap[role] || 'student-1';
  return mockUsers[userId];
}

// ============================================================================
// MOCK LESSONS
// ============================================================================

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Piano Lesson',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    date: new Date('2026-04-21T14:00:00'),
    duration: 60,
    modality: 'virtual',
    status: 'scheduled',
    participants: [
      { userId: 'student-1', role: 'student', attendanceState: 'pending' },
      { userId: 'teacher-1', role: 'teacher', attendanceState: 'pending' }
    ],
    focus: 'Chord progressions and improvisation',
    createdAt: new Date('2026-04-14')
  },
  {
    id: 'lesson-2',
    title: 'Piano Lesson',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    date: new Date('2026-04-15T14:00:00'),
    duration: 60,
    modality: 'virtual',
    status: 'completed',
    participants: [
      { userId: 'student-1', role: 'student', attendanceState: 'attended' },
      { userId: 'teacher-1', role: 'teacher', attendanceState: 'attended' }
    ],
    notes: 'Great progress on scales. Focus on thumb technique next time.',
    focus: 'C Major scale technique',
    recordingUrl: 'https://example.com/recording/lesson-2',
    createdAt: new Date('2026-04-08')
  }
];

// ============================================================================
// MOCK ASSIGNMENTS
// ============================================================================

export const mockAssignments: Assignment[] = [
  {
    id: 'assignment-1',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    title: 'Moonlight Sonata - First 8 bars',
    type: 'piece',
    difficulty: 4,
    currentStars: 1,
    maxStars: 3,
    state: 'practiced',
    xpAvailable: 20,
    hasAutoCheck: false,
    teacherNotes: 'Focus on dynamics and phrasing',
    dueDate: new Date('2026-05-01'),
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-17')
  },
  {
    id: 'assignment-2',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    title: 'C Major Scale - Hands together',
    type: 'scale',
    difficulty: 2,
    currentStars: 2,
    maxStars: 3,
    state: 'ready-for-review',
    xpAvailable: 10,
    hasAutoCheck: true,
    teacherNotes: 'Watch thumb crossing technique',
    createdAt: new Date('2026-04-05'),
    updatedAt: new Date('2026-04-16')
  },
  {
    id: 'assignment-3',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    title: 'Hanon Exercise #1',
    type: 'exercise',
    difficulty: 3,
    currentStars: 0,
    maxStars: 3,
    state: 'not-started',
    xpAvailable: 15,
    hasAutoCheck: true,
    createdAt: new Date('2026-04-10'),
    updatedAt: new Date('2026-04-10')
  },
  {
    id: 'assignment-4',
    studentId: 'student-1',
    teacherId: 'teacher-1',
    title: 'Chord Progressions: I-IV-V-I',
    type: 'theory',
    difficulty: 2,
    currentStars: 3,
    maxStars: 3,
    state: 'practiced',
    xpAvailable: 0,
    hasAutoCheck: false,
    createdAt: new Date('2026-03-28'),
    updatedAt: new Date('2026-04-12')
  }
];

// ============================================================================
// MOCK PRACTICE SESSIONS
// ============================================================================

export const mockPracticeSessions: PracticeSession[] = [
  {
    id: 'session-1',
    studentId: 'student-1',
    startTime: new Date('2026-04-17T16:30:00'),
    endTime: new Date('2026-04-17T17:15:00'),
    duration: 45,
    notes: 'Worked on Moonlight Sonata and scales',
    assignmentIds: ['assignment-1', 'assignment-2'],
    toolsUsed: ['metronome', 'tuner'],
    xpEarned: 25,
    validated: true
  },
  {
    id: 'session-2',
    studentId: 'student-1',
    startTime: new Date('2026-04-16T15:00:00'),
    endTime: new Date('2026-04-16T15:32:00'),
    duration: 32,
    notes: 'Focused on technique exercises',
    assignmentIds: ['assignment-3'],
    toolsUsed: ['metronome'],
    xpEarned: 15,
    validated: true
  }
];

// ============================================================================
// MOCK STREAK STATE
// ============================================================================

export const mockStreakState: StreakState = {
  userId: 'student-1',
  currentStreak: 12,
  longestStreak: 18,
  lastPracticeDate: new Date('2026-04-18'),
  streakFreezes: 1,
  daysThisWeek: [true, false, true, true, true, true, false] // Sun-Sat, Monday is freeze day
};

// ============================================================================
// MOCK ACHIEVEMENTS
// ============================================================================

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    name: 'Week Warrior',
    description: 'Practice 7 days in a row',
    iconName: 'Trophy',
    colorGradient: 'from-yellow-400 to-orange-500',
    unlockCondition: 'streak >= 7',
    xpReward: 50
  },
  {
    id: 'ach-2',
    name: 'Perfect Practice',
    description: 'Complete all weekly assignments',
    iconName: 'Star',
    colorGradient: 'from-blue-400 to-blue-600',
    unlockCondition: 'weekly_assignments_complete',
    xpReward: 75
  },
  {
    id: 'ach-3',
    name: '100 Stars',
    description: 'Earn 100 total stars',
    iconName: 'Zap',
    colorGradient: 'from-purple-400 to-purple-600',
    unlockCondition: 'total_stars >= 100',
    xpReward: 100
  }
];

// ============================================================================
// MOCK MESSAGES
// ============================================================================

export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread-1',
    participantIds: ['student-1', 'teacher-1'],
    subject: 'Question about next lesson',
    category: 'teacher',
    unreadCount: 0,
    createdAt: new Date('2026-04-15'),
    updatedAt: new Date('2026-04-15T14:30:00')
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    threadId: 'thread-1',
    senderId: 'student-1',
    senderName: 'Emma Wilson',
    senderRole: 'adult-student',
    content: 'Hi Ms. Rodriguez, should I focus more on scales or the piece for next lesson?',
    timestamp: new Date('2026-04-15T12:00:00'),
    read: true
  },
  {
    id: 'msg-2',
    threadId: 'thread-1',
    senderId: 'teacher-1',
    senderName: 'Ms. Rodriguez',
    senderRole: 'teacher',
    content: 'Great question! Let\'s spend 60% on the piece and 40% on scales. Your technique is improving nicely.',
    timestamp: new Date('2026-04-15T14:30:00'),
    read: true
  }
];

// ============================================================================
// MOCK BILLING
// ============================================================================

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    billingAccountId: 'billing-1',
    amount: 150.00,
    status: 'paid',
    dueDate: new Date('2026-04-01'),
    paidDate: new Date('2026-04-01'),
    description: 'April 2026 - Piano Lessons (4 lessons)',
    invoiceUrl: 'https://example.com/invoice/inv-1'
  },
  {
    id: 'inv-2',
    billingAccountId: 'billing-1',
    amount: 150.00,
    status: 'pending',
    dueDate: new Date('2026-05-01'),
    description: 'May 2026 - Piano Lessons',
  }
];

// ============================================================================
// MOCK PAYOUTS
// ============================================================================

export const mockPayouts: Payout[] = [
  {
    id: 'payout-1',
    teacherId: 'teacher-1',
    amount: 480.00,
    status: 'paid',
    periodStart: new Date('2026-03-01'),
    periodEnd: new Date('2026-03-31'),
    lessonCount: 16,
    payoutDate: new Date('2026-04-05'),
    description: 'March 2026 teaching payout'
  },
  {
    id: 'payout-2',
    teacherId: 'teacher-1',
    amount: 420.00,
    status: 'pending',
    periodStart: new Date('2026-04-01'),
    periodEnd: new Date('2026-04-30'),
    lessonCount: 14,
    description: 'April 2026 teaching payout'
  }
];

// ============================================================================
// MOCK LEAGUE STANDINGS
// ============================================================================

export const mockLeagueStandings: LeagueStanding[] = [
  { userId: '1', userName: 'MusicMaster', weeklyXP: 312, rank: 1, league: 'Silver' },
  { userId: 'student-1', userName: 'You', weeklyXP: 234, rank: 2, league: 'Silver' },
  { userId: '3', userName: 'PianoQueen', weeklyXP: 228, rank: 3, league: 'Silver' },
  { userId: '4', userName: 'ScalePro', weeklyXP: 220, rank: 4, league: 'Silver' },
  { userId: '5', userName: 'RhythmKing', weeklyXP: 215, rank: 5, league: 'Silver' },
  { userId: '6', userName: 'JazzFan99', weeklyXP: 208, rank: 6, league: 'Silver' },
  { userId: '7', userName: 'ClassicalKid', weeklyXP: 198, rank: 7, league: 'Silver' },
  { userId: '8', userName: 'BachLover', weeklyXP: 192, rank: 8, league: 'Silver' },
  { userId: '9', userName: 'StringMaster', weeklyXP: 188, rank: 9, league: 'Silver' },
  { userId: '10', userName: 'DrummerBoy', weeklyXP: 180, rank: 10, league: 'Silver' }
];
