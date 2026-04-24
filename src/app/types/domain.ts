/**
 * Musikkii Domain Model
 *
 * Central type definitions for the frontend application.
 * These are mock/frontend types designed to be replaced with backend types later.
 */

// ============================================================================
// ROLE & USER TYPES
// ============================================================================

export type AppRoleFamily = 'learner' | 'household' | 'instructor' | 'operations' | 'leadership';

export type UserRole =
  | 'adult-student'
  | 'child-student'
  | 'parent'
  | 'family'
  | 'teacher'
  | 'teacher-manager'
  | 'admin'
  | 'executive';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleFamily: AppRoleFamily;
  avatar?: string;
  householdId?: string; // For household members
  createdAt: Date;
}

export interface Household {
  id: string;
  name: string;
  primaryContactId: string;
  studentIds: string[];
  createdAt: Date;
}

// ============================================================================
// LESSON TYPES
// ============================================================================

export type LessonStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
export type LessonModality = 'in-person' | 'virtual';
export type AttendanceState = 'pending' | 'attended' | 'absent' | 'nml-requested' | 'no-show';

export interface LessonParticipant {
  userId: string;
  role: 'student' | 'teacher';
  attendanceState: AttendanceState;
}

/** Join-link timing + URL sources when built from `DashboardLessonRow` (calendar list). */
export interface LessonCalendarJoinMeta {
  startsAtIso: string;
  endsAtIso: string;
  lessonMeetingUrl: string | null;
  teacherMeetingUrl: string | null;
}

export interface Lesson {
  id: string;
  title: string;
  studentId: string;
  teacherId: string;
  date: Date;
  duration: number; // minutes
  modality: LessonModality;
  location?: string;
  status: LessonStatus;
  participants: LessonParticipant[];
  notes?: string;
  recordingUrl?: string;
  focus?: string;
  createdAt: Date;
  /** From `lessons → teachers → profiles` when RLS allows (calendar / lists). */
  teacherDisplayName?: string;
  /** From `lesson_participants → students → profiles` when RLS allows. */
  studentDisplayName?: string;
  /** Populated by dashboard row adapters for virtual join UI. */
  calendarJoin?: LessonCalendarJoinMeta;
}

export interface LessonActionAvailability {
  canConfirm: boolean;
  canReschedule: boolean;
  canCancel: boolean;
  canRequestNML: boolean;
  canViewRecording: boolean;
  canViewNotes: boolean;
}

// ============================================================================
// ASSIGNMENT & PRACTICE TYPES
// ============================================================================

export type AssignmentState = 'not-started' | 'practiced' | 'needs-help' | 'ready-for-review';
export type ResourceType = 'piece' | 'scale' | 'exercise' | 'theory' | 'rhythm' | 'technique';

export interface Assignment {
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  description?: string;
  type: ResourceType;
  difficulty: number; // 1-5
  currentStars: number; // 0-3
  maxStars: number; // typically 3
  state: AssignmentState;
  xpAvailable: number;
  hasAutoCheck: boolean; // NoteCheck available
  teacherNotes?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignmentProgress {
  assignmentId: string;
  studentId: string;
  starsEarned: number;
  lastPracticed?: Date;
  totalPracticeTime: number; // minutes
  noteCheckAttempts: number;
  bestNoteCheckScore?: number;
}

export interface PracticeSession {
  id: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  notes?: string;
  assignmentIds: string[];
  toolsUsed: string[];
  xpEarned: number;
  validated: boolean; // Whether it counts for streak/XP
}

export interface PracticeEvent {
  id: string;
  studentId: string;
  type: 'timer' | 'tool-use' | 'assignment-update' | 'notecheck';
  timestamp: Date;
  metadata: Record<string, any>;
}

export interface XPEvent {
  id: string;
  userId: string;
  amount: number;
  source: 'lesson' | 'practice' | 'tool' | 'assignment' | 'notecheck';
  description: string;
  timestamp: Date;
  weekOf: Date; // Which week this XP applies to
}

export interface StreakState {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: Date;
  streakFreezes: number;
  daysThisWeek: boolean[]; // Sun-Sat
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  colorGradient: string;
  unlockCondition: string;
  xpReward: number;
}

export interface NoteCheckAttempt {
  id: string;
  assignmentId: string;
  studentId: string;
  score: number; // 0-100
  timestamp: Date;
  feedback?: string;
  starsAwarded: number;
  xpAwarded: number;
}

// ============================================================================
// MESSAGES TYPES
// ============================================================================

export type MessageCategory = 'all' | 'teacher' | 'support' | 'billing' | 'family' | 'students' | 'admin';

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface MessageThread {
  id: string;
  participantIds: string[];
  subject: string;
  category: MessageCategory;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// RESOURCE TYPES
// ============================================================================

export interface Resource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'audio' | 'link' | 'document';
  url: string;
  description?: string;
  category: string;
  tags: string[];
  uploadedBy?: string;
  createdAt: Date;
}

// ============================================================================
// BILLING TYPES
// ============================================================================

export type SubscriptionStatus = 'active' | 'past_due' | 'cancelled' | 'trial';
export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

export interface BillingAccount {
  id: string;
  userId: string;
  householdId?: string;
  paymentMethodLast4?: string;
  paymentMethodType?: 'card' | 'bank';
  billingEmail: string;
  nextBillingDate?: Date;
}

export interface Subscription {
  id: string;
  billingAccountId: string;
  planName: string;
  pricePerMonth: number;
  status: SubscriptionStatus;
  startDate: Date;
  nextBillingDate?: Date;
  cancelAt?: Date;
}

export interface Invoice {
  id: string;
  billingAccountId: string;
  amount: number;
  status: PaymentStatus;
  dueDate: Date;
  paidDate?: Date;
  description: string;
  invoiceUrl?: string;
}

// ============================================================================
// PAYOUT TYPES
// ============================================================================

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface Payout {
  id: string;
  teacherId: string;
  amount: number;
  status: PayoutStatus;
  periodStart: Date;
  periodEnd: Date;
  lessonCount: number;
  payoutDate?: Date;
  description: string;
}

// ============================================================================
// NOTIFICATION TYPES
// ============================================================================

export type NotificationType = 'lesson' | 'practice' | 'message' | 'billing' | 'achievement' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// ============================================================================
// STUDENT & TEACHER TYPES
// ============================================================================

export interface Student extends UserProfile {
  role: 'adult-student' | 'child-student';
  instrument: string;
  level: number;
  totalStars: number;
  totalXP: number;
  currentStreak: number;
  teacherIds: string[];
}

export interface Teacher extends UserProfile {
  role: 'teacher' | 'teacher-manager';
  instrument: string;
  bio?: string;
  studentIds: string[];
  availability?: string; // Could be structured later
}

// ============================================================================
// GAMIFICATION TYPES
// ============================================================================

export type LeagueName =
  | 'Iron'
  | 'Bronze'
  | 'Silver'
  | 'Gold'
  | 'Platinum'
  | 'Emerald'
  | 'Diamond'
  | 'Virtuoso'
  | 'Maestro'
  | 'Legend';

export interface LeagueStanding {
  userId: string;
  userName: string;
  weeklyXP: number;
  rank: number;
  league: LeagueName;
}

export interface MusicalGrowthCategory {
  name: string;
  level: number;
  maxLevel: number;
  starsEarned: number;
  color: string;
}
