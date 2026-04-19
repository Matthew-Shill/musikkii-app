# Musikkii Portal V2 Architecture Audit & Redesign Plan

**Date:** April 11, 2026  
**Purpose:** Consolidate 8-role fragmented system into 5 role-family architecture with shared backend-minded design

---

## 1. CURRENT STATE ANALYSIS

### Current Role Structure (8 Roles)
- Adult Student
- Child Student
- Parent / Guardian
- Family / Multi-Student
- Teacher
- Teacher Manager
- Admin
- Executive

### Current Architecture Pattern
The system currently uses:
- **8 separate dashboard components** (one per role)
- **Role-switching via context** (RoleContext with manual role selection)
- **Shared page routing** with role-based view rendering
- **Per-role view components** for most pages (8 message views, 6 calendar views, etc.)
- **Hardcoded navigation arrays** per role in layout.tsx

---

## 2. ROLE FAMILY MAPPING

### Proposed 5 Role Families → Current 8 Roles

#### **Family 1: LEARNER**
**Current roles it consolidates:**
- Adult Student
- Child Student

**Key differences:**
- Child Student has simpler UI, fewer financial controls
- Adult Student has direct billing access

**Consolidation strategy:**
- Single "Learner" app with `isMinor` permission flag
- Hide billing/payment sections for minors
- Same core experience: Dashboard, Calendar, Practice, Progress, Messages, Resources

---

#### **Family 2: HOUSEHOLD**
**Current roles it consolidates:**
- Parent / Guardian
- Family / Multi-Student
- *(Note: Child Student may also use this when part of a household account)*

**Key differences:**
- Parent manages 1 child
- Family manages multiple children
- Both have identical feature needs

**Consolidation strategy:**
- Single "Household" app
- Multi-student selector (if household has >1 student)
- Same dashboard structure showing all children's upcoming lessons
- Unified billing for household

---

#### **Family 3: INSTRUCTOR**
**Current roles it consolidates:**
- Teacher
- Teacher Manager

**Key differences:**
- Teacher Manager has team oversight, reports, coverage management
- Regular Teacher focuses on own students and lessons

**Consolidation strategy:**
- Single "Instructor" app
- Teacher Manager sees additional modules: Team, Reports, Coverage
- Use permission-based tabs rather than separate apps
- Core shared: Dashboard, Calendar, Students, Practice Insights, Messages, Payouts

---

#### **Family 4: OPERATIONS**
**Current roles it consolidates:**
- Admin

**Remains as-is:**
- Single operational control center
- User management, scheduling, billing operations, support, automations

---

#### **Family 5: LEADERSHIP**
**Current roles it consolidates:**
- Executive

**Remains as-is:**
- Strategic oversight dashboard
- High-level KPIs, growth metrics, financial overview

---

## 3. FRAGMENTATION & DUPLICATION ANALYSIS

### 🔴 HIGH FRAGMENTATION (Immediate consolidation needed)

#### **3.1 Dashboard Components**
**Current state:**
- 8 separate dashboard files:
  - `adult-student-dashboard.tsx`
  - `child-dashboard.tsx`
  - `parent-dashboard.tsx`
  - `family-dashboard.tsx`
  - `teacher-dashboard.tsx`
  - `teacher-manager-dashboard.tsx`
  - `general-admin-dashboard.tsx`
  - `organization-dashboard.tsx`

**Problem:**
- Massive code duplication
- 90% of UI patterns are identical (cards, stats, upcoming lessons)
- Different roles show same data types differently
- No shared component library for dashboard widgets

**Recommendation:**
→ Create **5 role-family dashboards** with shared widget components:
- `learner-dashboard.tsx` (replaces adult + child)
- `household-dashboard.tsx` (replaces parent + family)
- `instructor-dashboard.tsx` (replaces teacher + teacher-manager)
- `operations-dashboard.tsx` (keeps admin)
- `leadership-dashboard.tsx` (keeps executive)

→ Build **reusable dashboard widgets**:
- `UpcomingLessonsWidget.tsx`
- `PracticeStreakWidget.tsx`
- `QuickActionsWidget.tsx`
- `StudentOverviewWidget.tsx`
- `BillingSummaryWidget.tsx`
- `MetricsCardWidget.tsx`

Each widget accepts role/permission props to adjust its display.

---

#### **3.2 Messages Views**
**Current state:**
- 8 separate message view files
- Each implements own message list, filters, composition

**Problem:**
- Message data structure is identical across roles
- Only differences are:
  - Who you can message (students message teachers, teachers message students+parents)
  - System messages vs direct messages
  - Organizational announcements for admin/executive

**Recommendation:**
→ Create **unified Messages component** with role-aware filtering:
```typescript
<MessagesView 
  role={roleFamily}
  contacts={getContactsForRole(role)}
  canBroadcast={role === 'operations' || role === 'leadership'}
  canMessageParents={role === 'instructor'}
/>
```

This is a **data filtering problem**, not a UI problem.

---

#### **3.3 Calendar Views**
**Current state:**
- 6 separate calendar view files with tabs
- Student, Family, Teacher, Teacher Manager, Admin, Executive versions

**Problem:**
- Calendar grid/layout is identical
- Only differences:
  - Filter scope (my lessons vs my children's vs my students' vs all org lessons)
  - Action permissions (request lesson vs approve lesson vs assign teacher)

**Recommendation:**
→ Unified `CalendarView` component with:
- Shared week/month/list rendering
- Role-based data fetching
- Permission-gated actions

Example:
```typescript
const lessonData = useLessonData(roleFamily); // fetches appropriate scope
const permissions = useCalendarPermissions(roleFamily);
```

---

#### **3.4 Resources Views**
**Current state:**
- 5 separate resource view files (adult, child, parent, family, teacher)

**Problem:**
- Resources are just files/links categorized by type
- Filtering by "who uploaded" or "intended audience" is a query problem
- UI is identical: grid of resources with filters

**Recommendation:**
→ **Single Resources page** with backend filtering:
```typescript
// Backend query based on role
const resources = getResources({
  audienceIncludes: roleFamily,
  uploadedBy: role === 'instructor' ? 'self' : undefined
});
```

---

### 🟡 MODERATE FRAGMENTATION (Can be improved)

#### **3.5 Progress Views**
**Current state:**
- 4 separate progress views (child, adult, parent, multi-student)
- Child/adult are very similar
- Parent/family show aggregated child progress

**Assessment:**
- Some legitimate difference in UX between learner and household views
- Learner progress = personal journey, XP, streaks, achievements
- Household progress = tracking multiple children's progress

**Recommendation:**
→ Keep 2 versions:
- `LearnerProgressView.tsx` (personal progress tracking)
- `HouseholdProgressView.tsx` (multi-child overview with child selector)

---

#### **3.6 Billing/Payouts**
**Current state:**
- Billing: adult-student, parent, family, admin versions
- Payouts: teacher, teacher-manager, admin versions

**Assessment:**
- Billing for students vs parents is fundamentally the same (household pays)
- Payouts for teachers is different from admin payout management

**Recommendation:**
→ Consolidate to:
- `BillingView.tsx` (for Learner + Household, with household aggregation)
- `AdminBillingView.tsx` (for Operations oversight)
- `PayoutsView.tsx` (for Instructor earnings)
- `AdminPayoutsView.tsx` (for Operations payout management)

---

### ✅ WELL-DESIGNED (Keep as-is)

#### **3.7 Unified Page Routing**
**Current strength:**
- Single route definition in `routes.ts`
- Pages render role-appropriate views
- Clean separation between routing and rendering

**Keep this pattern.** It's scalable and maintainable.

---

#### **3.8 Shared UI Component Library**
**Current strength:**
- Comprehensive `/components/ui` library
- Radix UI primitives
- Consistent design tokens

**This is excellent.** No changes needed.

---

## 4. NAVIGATION CONSOLIDATION

### Current Navigation Structure
**Problem:** 8 hardcoded navigation arrays in `layout.tsx`

### Recommended V2 Navigation Structure

#### **Family 1: LEARNER**
```typescript
{
  name: 'Learner',
  roles: ['adult-student', 'child-student'],
  navigation: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Practice', href: '/practice', icon: Target },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    { name: 'Teachers', href: '/teachers', icon: Users },
    // Conditional
    { name: 'Billing', href: '/billing', icon: CreditCard, permission: 'billing:view' },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
}
```

**Permissions:**
- `billing:view` → false for Child Student, true for Adult Student

---

#### **Family 2: HOUSEHOLD**
```typescript
{
  name: 'Household',
  roles: ['parent', 'family'],
  navigation: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users }, // Children in household
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Practice', href: '/practice', icon: Target },
    { name: 'Progress', href: '/progress', icon: TrendingUp },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    { name: 'Teachers', href: '/teachers', icon: Users },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
}
```

**Notes:**
- "Students" tab lists children in household
- No permission differences between Parent and Family (data query handles 1 vs multiple)

---

#### **Family 3: INSTRUCTOR**
```typescript
{
  name: 'Instructor',
  roles: ['teacher', 'teacher-manager'],
  navigation: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Practice Insights', href: '/practice', icon: Target },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Resources', href: '/resources', icon: FolderOpen },
    // Manager-only
    { name: 'Team', href: '/team', icon: Users, permission: 'team:manage' },
    { name: 'Reports', href: '/reports', icon: BarChart3, permission: 'reports:view' },
    // Shared
    { name: 'Payouts', href: '/payouts', icon: DollarSign },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
}
```

**Permissions:**
- `team:manage` → Teacher Manager only
- `reports:view` → Teacher Manager only

---

#### **Family 4: OPERATIONS**
```typescript
{
  name: 'Operations',
  roles: ['admin'],
  navigation: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Teachers', href: '/teachers', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Operations', href: '/operations', icon: Settings },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Billing', href: '/billing', icon: CreditCard },
    { name: 'Payouts', href: '/payouts', icon: DollarSign },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
}
```

---

#### **Family 5: LEADERSHIP**
```typescript
{
  name: 'Leadership',
  roles: ['executive'],
  navigation: [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Teachers', href: '/teachers', icon: Users },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Operations', href: '/operations', icon: Building2 },
    { name: 'Reports', href: '/reports', icon: BarChart3 },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
    { name: 'Settings', href: '/settings', icon: Settings }
  ]
}
```

---

### Navigation Implementation Pattern

**V2 Approach:**
```typescript
// role-config.ts
export const ROLE_FAMILIES = {
  learner: {
    roles: ['adult-student', 'child-student'],
    navigation: [...],
    permissions: {
      'adult-student': ['billing:view', 'payment:manage'],
      'child-student': []
    }
  },
  // ... other families
};

// In Layout component:
const roleFamily = getRoleFamily(role);
const navigation = getNavigationForRole(roleFamily, role);
```

---

## 5. BACKEND-MINDED DATA ARCHITECTURE

### Problem: Frontend-Only Patterns

Many current screens render hardcoded data without clear backend object models.

### Core Data Objects

#### **Object 1: User**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  roleFamily: 'learner' | 'household' | 'instructor' | 'operations' | 'leadership';
  permissions: Permission[];
  avatarUrl?: string;
  householdId?: string; // For students and parents
  createdAt: Date;
  lastActiveAt: Date;
}
```

**Used by:**
- User profile display
- Permission checks
- Activity tracking

---

#### **Object 2: Household**
```typescript
interface Household {
  id: string;
  name: string;
  primaryContactId: string; // User.id
  students: Student[];
  subscriptionId: string;
  billingStatus: 'active' | 'past_due' | 'canceled';
  createdAt: Date;
}
```

**Used by:**
- Household dashboard
- Billing aggregation
- Multi-student views

---

#### **Object 3: Student**
```typescript
interface Student {
  id: string;
  userId: string; // Links to User record
  householdId: string;
  dateOfBirth: Date;
  instrument: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  assignedTeacherId?: string;
  enrollmentDate: Date;
  isActive: boolean;
}
```

**Used by:**
- Student roster
- Teacher student lists
- Calendar lesson assignment

---

#### **Object 4: Teacher**
```typescript
interface Teacher {
  id: string;
  userId: string;
  instruments: string[];
  hourlyRate: number;
  availabilitySchedule: AvailabilityBlock[];
  maxStudents: number;
  currentStudentCount: number;
  rating: number;
  totalLessonsCompleted: number;
  bio: string;
  certifications: string[];
  isActive: boolean;
}
```

**Used by:**
- Teacher directory
- Calendar scheduling
- Student-teacher matching
- Payout calculations

---

#### **Object 5: Lesson**
```typescript
interface Lesson {
  id: string;
  studentId: string;
  teacherId: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'canceled' | 'no_show';
  meetingUrl: string;
  recordingUrl?: string;
  notes?: string;
  focusAreas: string[];
  homeworkAssigned: Assignment[];
  createdAt: Date;
  completedAt?: Date;
}
```

**Used by:**
- Calendar views (all roles)
- Lesson history
- Teacher notes
- Student progress tracking

---

#### **Object 6: Assignment (Practice Item)**
```typescript
interface Assignment {
  id: string;
  lessonId: string;
  studentId: string;
  teacherId: string;
  type: 'song' | 'scale' | 'exercise' | 'theory' | 'listening';
  title: string;
  description: string;
  dueDate: Date;
  estimatedMinutes: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  status: 'assigned' | 'in_progress' | 'completed';
  completedAt?: Date;
  practiceLog: PracticeSession[];
  resources: Resource[];
}
```

**Used by:**
- Practice page
- Teacher assignment creation
- Progress tracking
- XP/streak calculations

---

#### **Object 7: Progress**
```typescript
interface Progress {
  studentId: string;
  currentLevel: number;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  totalPracticeMinutes: number;
  lessonsCompleted: number;
  achievements: Achievement[];
  weeklyGoal: {
    targetMinutes: number;
    currentMinutes: number;
    daysCompleted: number;
  };
  skillMetrics: {
    technique: number;
    rhythm: number;
    sightReading: number;
    theory: number;
  };
}
```

**Used by:**
- Progress page
- Dashboard widgets
- Practice gamification
- Achievement system

---

#### **Object 8: Message**
```typescript
interface Message {
  id: string;
  threadId: string;
  senderId: string;
  recipientIds: string[];
  subject: string;
  body: string;
  attachments: Attachment[];
  sentAt: Date;
  readBy: { userId: string; readAt: Date }[];
  isSystemMessage: boolean;
  isBroadcast: boolean;
  relatedLessonId?: string;
}
```

**Used by:**
- Messages page (all roles)
- Notification system
- Lesson communication

---

#### **Object 9: Billing / Subscription**
```typescript
interface Subscription {
  id: string;
  householdId: string;
  planType: 'per_lesson' | 'monthly_unlimited' | 'package';
  status: 'active' | 'past_due' | 'canceled' | 'paused';
  pricePerLesson?: number;
  monthlyPrice?: number;
  packageLessonsRemaining?: number;
  nextBillingDate: Date;
  paymentMethodId: string;
  invoices: Invoice[];
}

interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  dueDate: Date;
  paidAt?: Date;
  lineItems: LineItem[];
}
```

**Used by:**
- Billing page (household view)
- Billing page (operations view)
- Payment processing

---

#### **Object 10: Payout**
```typescript
interface Payout {
  id: string;
  teacherId: string;
  periodStart: Date;
  periodEnd: Date;
  lessonsIncluded: Lesson[];
  totalLessons: number;
  totalHours: number;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt?: Date;
  paymentMethod: 'bank_transfer' | 'paypal';
}
```

**Used by:**
- Payouts page (instructor view)
- Payouts page (operations view)
- Teacher earnings tracking

---

#### **Object 11: Team**
```typescript
interface Team {
  id: string;
  name: string;
  managerId: string; // Teacher Manager User.id
  teacherIds: string[];
  focusInstruments: string[];
  performanceMetrics: {
    avgLessonRating: number;
    totalLessonsThisMonth: number;
    studentRetentionRate: number;
  };
}
```

**Used by:**
- Teacher Manager team view
- Reports
- Operations oversight

---

#### **Object 12: Report**
```typescript
interface Report {
  id: string;
  type: 'teacher_performance' | 'student_retention' | 'revenue' | 'lesson_volume';
  generatedBy: string;
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  filters: ReportFilters;
  data: ReportData;
  visualizations: ChartConfig[];
}
```

**Used by:**
- Reports page (all roles)
- Dashboard KPI widgets
- Executive metrics

---

### Screens → Data Object Mapping

| Screen | Primary Objects | Secondary Objects |
|--------|----------------|-------------------|
| Dashboard | User, Progress, Lesson | Student, Teacher, Invoice |
| Calendar | Lesson, User | Student, Teacher, Availability |
| Practice | Assignment, Progress | Lesson, Achievement |
| Progress | Progress, Achievement | Assignment, Lesson |
| Messages | Message, User | Lesson |
| Resources | Resource | User |
| Billing | Subscription, Invoice | Household, Student, Lesson |
| Payouts | Payout, Lesson | Teacher |
| Students | Student, Lesson, Progress | Teacher, Assignment |
| Teachers | Teacher, Lesson | Student, Rating |
| Users | User, Household | Student, Subscription |
| Operations | All system objects | - |
| Reports | Report, Metrics | Contextual based on report type |

---

## 6. V2 REDESIGN PLAN

### Phase 1: Role Family Consolidation

**Goal:** Reduce 8 roles to 5 role families without breaking existing functionality

**Tasks:**
1. Create `role-config.ts` with role family definitions
2. Add `getRoleFamily()` helper function
3. Update RoleContext to include `roleFamily` property
4. Migrate navigation arrays to role-family structure
5. Add permission system

**Deliverables:**
- ✅ Role family configuration
- ✅ Permission system
- ✅ Unified navigation logic

---

### Phase 2: Dashboard Consolidation

**Goal:** Replace 8 dashboards with 5 role-family dashboards + shared widgets

**Tasks:**
1. Create shared dashboard widget library:
   - `UpcomingLessonsWidget.tsx`
   - `PracticeStreakWidget.tsx`
   - `QuickActionsWidget.tsx`
   - `StudentOverviewWidget.tsx`
   - `BillingSummaryWidget.tsx`
   - `MetricsCardWidget.tsx`
2. Build 5 role-family dashboard pages
3. Migrate existing dashboards to use new widgets
4. Delete old dashboard files

**Deliverables:**
- ✅ Widget component library
- ✅ 5 role-family dashboards
- 🔥 Delete 8 old dashboards

---

### Phase 3: Unified Page Views

**Goal:** Consolidate duplicate page views

**Priority 1 (High Impact):**
- Messages: 8 views → 1 unified
- Calendar: 6 views → 1 unified
- Resources: 5 views → 1 unified

**Priority 2 (Moderate Impact):**
- Progress: 4 views → 2 (Learner, Household)
- Billing: 4 views → 2 (Household, Operations)
- Payouts: 3 views → 2 (Instructor, Operations)

**Deliverables:**
- ✅ Unified Messages component
- ✅ Unified Calendar component
- ✅ Unified Resources component
- ✅ Consolidated Progress views
- ✅ Consolidated Billing views

---

### Phase 4: Data Model Integration

**Goal:** Replace hardcoded data with backend-ready data structures

**Tasks:**
1. Create TypeScript interfaces for all 12 core objects
2. Create mock data generators for each object type
3. Build data access layer (services):
   - `userService.ts`
   - `lessonService.ts`
   - `assignmentService.ts`
   - `progressService.ts`
   - `messageService.ts`
   - `billingService.ts`
   - `payoutService.ts`
   - `reportService.ts`
4. Refactor components to use service layer
5. Add loading states, error states, empty states

**Deliverables:**
- ✅ Complete TypeScript type definitions
- ✅ Service layer architecture
- ✅ Mock data system
- ✅ State management integration

---

### Phase 5: Permission System

**Goal:** Replace role-specific views with permission-based rendering

**Tasks:**
1. Define permission matrix:
   ```
   Permission              | Learner | Household | Instructor | Operations | Leadership
   --------------------------------------------------------------------------------------
   billing:view            |  Adult  |    Yes    |     No     |    Yes     |    Yes
   billing:manage          |  Adult  |    Yes    |     No     |    Yes     |    No
   students:view_all       |   No    |  Household|  Assigned  |    Yes     |    Yes
   lessons:schedule        |   No    |    Yes    |     No     |    Yes     |    No
   lessons:approve         |   No    |     No    |     No     |    Yes     |    No
   payouts:view_own        |   No    |     No    |    Yes     |     No     |    No
   payouts:manage_all      |   No    |     No    |     No     |    Yes     |    Yes
   team:manage             |   No    |     No    |  Manager   |    Yes     |    Yes
   reports:view            |   No    |     No    |  Manager   |    Yes     |    Yes
   users:manage            |   No    |     No    |     No     |    Yes     |    No
   messages:broadcast      |   No    |     No    |     No     |    Yes     |    Yes
   ```

2. Create `usePermissions()` hook
3. Create `<PermissionGate>` component
4. Refactor conditional rendering to use permissions

**Deliverables:**
- ✅ Permission matrix
- ✅ Permission hooks
- ✅ Permission-gated components

---

### Phase 6: Polish & Optimization

**Goal:** Ensure system feels cohesive and production-ready

**Tasks:**
1. Consistent loading states
2. Consistent empty states
3. Consistent error handling
4. Mobile responsiveness audit
5. Accessibility audit
6. Performance optimization

**Deliverables:**
- ✅ Design system compliance
- ✅ Full mobile optimization
- ✅ Accessibility compliance
- ✅ Performance benchmarks

---

## 7. FILE STRUCTURE REORGANIZATION

### Current Structure (Fragmented)
```
components/
  dashboards/
    adult-student-dashboard.tsx
    child-dashboard.tsx
    parent-dashboard.tsx
    family-dashboard.tsx
    teacher-dashboard.tsx
    teacher-manager-dashboard.tsx
    general-admin-dashboard.tsx
    organization-dashboard.tsx
  pages/
    messages/
      adult-student-messages-view.tsx
      child-student-messages-view.tsx
      ...8 total files
    calendar/
      student-calendar-view.tsx
      family-calendar-view.tsx
      ...6 total files
```

### Proposed V2 Structure (Consolidated)
```
components/
  dashboards/
    learner-dashboard.tsx
    household-dashboard.tsx
    instructor-dashboard.tsx
    operations-dashboard.tsx
    leadership-dashboard.tsx
    widgets/
      upcoming-lessons-widget.tsx
      practice-streak-widget.tsx
      quick-actions-widget.tsx
      student-overview-widget.tsx
      billing-summary-widget.tsx
      metrics-card-widget.tsx
  
  pages/
    unified/
      messages-view.tsx          # Single unified component
      calendar-view.tsx          # Single unified component
      resources-view.tsx         # Single unified component
    
    learner/
      progress-view.tsx
    
    household/
      progress-view.tsx
      students-view.tsx          # Children in household
    
    instructor/
      students-view.tsx          # Teacher's students
      team-view.tsx              # Teacher Manager only
    
    operations/
      users-view.tsx
      operations-view.tsx
      billing-view.tsx
      payouts-view.tsx
    
    leadership/
      users-view.tsx
      operations-view.tsx
    
    shared/
      billing-view.tsx           # Used by Learner + Household
      payouts-view.tsx           # Used by Instructor
      reports-view.tsx           # Used by Instructor + Operations + Leadership
      practice-view.tsx          # Used by Learner + Household
      settings-view.tsx
      teachers-directory-view.tsx

  shared/
    lesson-actions.tsx
    student-selector.tsx
    date-range-picker.tsx
    empty-state.tsx
    loading-state.tsx
    permission-gate.tsx

services/
  user-service.ts
  lesson-service.ts
  assignment-service.ts
  progress-service.ts
  message-service.ts
  billing-service.ts
  payout-service.ts
  report-service.ts

types/
  user.ts
  lesson.ts
  assignment.ts
  progress.ts
  message.ts
  billing.ts
  payout.ts
  report.ts
  permissions.ts

config/
  role-config.ts
  permissions.ts
  navigation.ts
```

---

## 8. MIGRATION STRATEGY

### Step 1: Parallel System (2 weeks)
- Keep existing 8-role system functional
- Build new role-family system alongside
- Feature flag to toggle between old/new

### Step 2: Component Migration (2 weeks)
- Migrate one page at a time to new system
- Start with lowest-risk pages (Resources, Settings)
- Move to higher-risk pages (Dashboard, Calendar)

### Step 3: Data Layer (1 week)
- Implement service layer
- Replace hardcoded data with service calls
- Add loading/error states

### Step 4: Permission System (1 week)
- Implement permission matrix
- Replace role checks with permission checks
- Add permission gates

### Step 5: Cleanup (1 week)
- Remove old components
- Remove feature flags
- Documentation
- Final polish

**Total estimated time: 7 weeks**

---

## 9. SUCCESS METRICS

### Code Health
- ✅ Reduce dashboard files from 8 to 5 (-37.5%)
- ✅ Reduce message views from 8 to 1 (-87.5%)
- ✅ Reduce calendar views from 6 to 1 (-83%)
- ✅ Overall component count reduction: ~40%

### Maintainability
- ✅ Single source of truth for navigation
- ✅ Permission-based rendering (not role-based conditionals)
- ✅ Reusable widget library
- ✅ Clear data object boundaries

### Developer Experience
- ✅ Add new feature once, works for all applicable roles
- ✅ Clear separation: data layer → service layer → UI layer
- ✅ TypeScript types match backend schema
- ✅ Easy to add new permissions without touching components

### User Experience
- ✅ Consistent design across all role families
- ✅ No jarring UI differences when switching roles
- ✅ Faster load times (less code to bundle)
- ✅ Better mobile experience (unified responsive patterns)

---

## 10. RISKS & MITIGATIONS

### Risk 1: Breaking existing functionality during migration
**Mitigation:** 
- Feature flag system
- Parallel systems during transition
- Comprehensive testing checklist

### Risk 2: Over-consolidation loses role-specific UX benefits
**Mitigation:**
- Permission-based customization still allows tailored experiences
- Widget system allows role-specific dashboard layouts
- User testing at each migration milestone

### Risk 3: Backend integration complexity
**Mitigation:**
- Service layer abstracts backend details
- Mock data system allows frontend progress without backend
- Clear API contracts defined upfront

---

## CONCLUSION

The current implementation is **well-structured at the routing level** but **fragmented at the component level**. The V2 architecture will:

1. **Reduce complexity** by consolidating 8 roles → 5 role families
2. **Eliminate duplication** by creating unified, permission-aware components
3. **Improve maintainability** by using data-driven rendering instead of role-specific files
4. **Prepare for backend integration** by defining clear data objects and service layers
5. **Maintain design quality** while making the system more scalable

**Next Step:** Review this audit, approve the V2 plan, and proceed with Phase 1 implementation.
