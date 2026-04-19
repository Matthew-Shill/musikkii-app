# Musikkii Domain Model Overview

## Purpose

This document describes the frontend domain model that serves as the foundation for Musikkii's type system. These types are currently used with mock data but are designed to align with future backend entities.

## Core Entities

### Users & Roles

**AppRoleFamily**: `'learner' | 'household' | 'instructor' | 'operations' | 'leadership'`
- The fundamental grouping that determines UI variant and permissions
- Maps multiple specific roles to broader product experiences

**UserRole**: Specific role types
- `'adult-student'`, `'child-student'` → learner family
- `'parent'`, `'family'` → household family  
- `'teacher'`, `'teacher-manager'` → instructor family
- `'admin'` → operations family
- `'executive'` → leadership family

**UserProfile**: Base user entity
```typescript
{
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleFamily: AppRoleFamily;
  avatar?: string;
  householdId?: string;
  createdAt: Date;
}
```

**Student**: Extended user profile with learning progress
- Includes: instrument, level, totalStars, totalXP, currentStreak, teacherIds

**Teacher**: Extended user profile with teaching context
- Includes: instrument, bio, studentIds, availability

**Household**: Family/parent account entity
- Groups multiple students under one billing/management unit

---

## Learning & Scheduling

### Lessons

**Lesson**: Core scheduling entity
```typescript
{
  id: string;
  title: string;
  studentId: string;
  teacherId: string;
  date: Date;
  duration: number; // minutes
  modality: 'in-person' | 'virtual';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  participants: LessonParticipant[];
  notes?: string;
  recordingUrl?: string;
  focus?: string;
}
```

**LessonParticipant**: Attendance tracking per participant
- Supports multi-party lessons (student + teacher + observer)
- AttendanceState: `'pending' | 'attended' | 'absent' | 'nml-requested' | 'no-show'`

**LessonActionAvailability**: Permission model for lesson actions
- Controls: confirm, reschedule, cancel, request NML, view recording/notes

---

## Practice & Gamification

### Assignments

**Assignment**: Core practice content
```typescript
{
  id: string;
  studentId: string;
  teacherId: string;
  title: string;
  type: ResourceType; // piece, scale, exercise, theory, rhythm, technique
  difficulty: number; // 1-5
  currentStars: number; // 0-3
  maxStars: number;
  state: AssignmentState; // not-started, practiced, needs-help, ready-for-review
  xpAvailable: number;
  hasAutoCheck: boolean; // NoteCheck capability
  teacherNotes?: string;
  dueDate?: Date;
}
```

**AssignmentProgress**: Tracking per assignment
- Stars earned, practice time, NoteCheck attempts, best score

**AssignmentState**: Student workflow state
- `'not-started'` → Initial state
- `'practiced'` → Student has worked on it
- `'needs-help'` → Student requests teacher attention
- `'ready-for-review'` → Student submits for feedback

### Practice Sessions

**PracticeSession**: Time-based practice record
```typescript
{
  id: string;
  studentId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  notes?: string;
  assignmentIds: string[];
  toolsUsed: string[]; // metronome, tuner, etc.
  xpEarned: number;
  validated: boolean; // Counts for streak/XP
}
```

**PracticeEvent**: Fine-grained activity tracking
- Types: timer, tool-use, assignment-update, notecheck
- Allows backend to reconstruct detailed student engagement

### Gamification Systems

**XPEvent**: Experience point transaction
```typescript
{
  id: string;
  userId: string;
  amount: number;
  source: 'lesson' | 'practice' | 'tool' | 'assignment' | 'notecheck';
  description: string;
  timestamp: Date;
  weekOf: Date; // Weekly reset basis
}
```

**StreakState**: Daily practice tracking
```typescript
{
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate?: Date;
  streakFreezes: number;
  daysThisWeek: boolean[]; // Sun-Sat
}
```

**LeagueStanding**: Competitive weekly ranking
```typescript
{
  userId: string;
  userName: string;
  weeklyXP: number;
  rank: number;
  league: LeagueName; // Iron → Legend (10 tiers)
}
```

**Achievement**: Unlockable milestones
- Rewards for streaks, total stars, assignment completion, etc.
- Each has XP reward and visual theming

**NoteCheckAttempt**: Auto-graded assignment submission
```typescript
{
  id: string;
  assignmentId: string;
  studentId: string;
  score: number; // 0-100
  timestamp: Date;
  feedback?: string;
  starsAwarded: number;
  xpAwarded: number;
}
```

---

## Communication

### Messages

**MessageThread**: Conversation container
```typescript
{
  id: string;
  participantIds: string[];
  subject: string;
  category: MessageCategory; // all, teacher, support, billing, family, students, admin
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

**Message**: Individual message in thread
- Includes sender info, role context, read state

**MessageCategory**: Filter/routing mechanism
- Allows role-specific inbox organization

---

## Business Operations

### Billing

**BillingAccount**: Payment relationship
- Links user/household to payment method
- Tracks next billing date

**Subscription**: Recurring plan
- Status: active, past_due, cancelled, trial
- Monthly pricing model

**Invoice**: Payment record
```typescript
{
  id: string;
  billingAccountId: string;
  amount: number;
  status: PaymentStatus; // paid, pending, failed, refunded
  dueDate: Date;
  paidDate?: Date;
  description: string;
  invoiceUrl?: string;
}
```

### Payouts

**Payout**: Teacher compensation
```typescript
{
  id: string;
  teacherId: string;
  amount: number;
  status: PayoutStatus; // pending, processing, paid, failed
  periodStart: Date;
  periodEnd: Date;
  lessonCount: number;
  payoutDate?: Date;
  description: string;
}
```

---

## Resources & Content

**Resource**: Learning material
```typescript
{
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
```

---

## Notifications

**Notification**: System alert
```typescript
{
  id: string;
  userId: string;
  type: NotificationType; // lesson, practice, message, billing, achievement, system
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}
```

---

## Key Relationships

```
Household
  ├─ has many Students
  └─ has one BillingAccount
      └─ has many Invoices

Student
  ├─ has many Teachers
  ├─ has many Lessons
  ├─ has many Assignments
  ├─ has many PracticeSessions
  ├─ has one StreakState
  └─ has many LeagueStandings (weekly)

Teacher
  ├─ has many Students
  ├─ has many Lessons
  └─ has many Payouts

Lesson
  ├─ belongs to Student
  ├─ belongs to Teacher
  └─ has many LessonParticipants

Assignment
  ├─ belongs to Student
  ├─ belongs to Teacher
  ├─ has one AssignmentProgress
  └─ has many NoteCheckAttempts

MessageThread
  └─ has many Messages
```

---

## Design Principles

1. **Frontend-first, backend-ready**: These types serve the UI now but map cleanly to future database schemas

2. **Rich state modeling**: Assignment states, attendance states, subscription statuses capture real workflow nuance

3. **Timestamped everything**: CreatedAt, updatedAt, timestamps allow temporal queries and audit trails

4. **Typed enums over magic strings**: `AssignmentState`, `LessonStatus`, `PaymentStatus` prevent typos and enable exhaustive checks

5. **Separation of concerns**: 
   - Student vs StudentProfile (rich vs base)
   - Assignment vs AssignmentProgress (spec vs tracking)
   - Lesson vs LessonParticipant (event vs attendance)

6. **Gamification as first-class**: XP, streaks, leagues, achievements are domain entities, not UI decorations

7. **Role-aware from the ground up**: Every entity considers multi-role access patterns

---

## Current State

All types live in `src/app/types/domain.ts`.

Mock data using these types lives in `src/app/data/mockData.ts`.

Components import from domain.ts for type safety.

When backend integration begins, these frontend types should be validated against backend schemas and adjusted as needed. The goal is minimal friction, not perfect prediction.
