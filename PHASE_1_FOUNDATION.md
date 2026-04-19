# Phase 1 Foundation: Role Family Consolidation & Information Architecture

**Purpose:** Strategic product architecture before visual redesign  
**Focus:** Structure, consolidation, navigation, buildability  
**Date:** April 11, 2026

---

## 1. ROLE-TO-FAMILY MAPPING

### Family 1: LEARNER
**Philosophy:** Individual learning experience, self-directed or guardian-supervised

```
┌─────────────────────────────────────────────────────────┐
│ LEARNER FAMILY                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Adult Student                                           │
│  ├─ Full autonomy                                        │
│  ├─ Direct billing access                                │
│  ├─ Teacher directory access                             │
│  └─ Self-managed schedule                                │
│                                                          │
│  Child Student                                           │
│  ├─ Simplified UI                                        │
│  ├─ No billing access                                    │
│  ├─ No teacher directory                                 │
│  ├─ Gamified practice emphasis                           │
│  └─ Parent-managed schedule                              │
│                                                          │
└─────────────────────────────────────────────────────────┘

Core principle: Same learning journey, different autonomy levels
Difference mechanism: Permission flags, not separate apps
```

**Shared Experience:**
- Dashboard (welcome, next lesson, practice streak)
- Calendar (view lessons)
- Practice (XP, streaks, assignments)
- Progress (personal journey tracking)
- Messages (teacher communication)
- Resources (learning materials)
- Settings

**Permission Differentiators:**
- `billing:view` → Adult only
- `billing:manage` → Adult only
- `teachers:browse` → Adult only
- `ui:simplified` → Child only

---

### Family 2: HOUSEHOLD
**Philosophy:** Multi-student oversight, family account management

```
┌─────────────────────────────────────────────────────────┐
│ HOUSEHOLD FAMILY                                         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Parent / Guardian                                       │
│  ├─ Manages 1+ children                                  │
│  ├─ Household billing authority                          │
│  ├─ Schedule management                                  │
│  └─ Teacher communication                                │
│                                                          │
│  Family / Multi-Student                                  │
│  ├─ Manages 2+ children                                  │
│  ├─ Household billing authority                          │
│  ├─ Schedule management                                  │
│  └─ Teacher communication                                │
│                                                          │
└─────────────────────────────────────────────────────────┘

Core principle: Identical functionality, different household size
Difference mechanism: Data query scope (1 vs many students), not UI
```

**Shared Experience:**
- Dashboard (household overview, all children's lessons)
- Students (children roster with quick-switch)
- Calendar (all household lessons)
- Practice (view children's practice)
- Progress (track children's progress)
- Messages (teacher communication)
- Resources (family materials)
- Teachers (view children's teachers)
- Billing (household subscription)
- Settings

**NO Differentiators:**
- Parent and Family are functionally identical
- UI adapts based on `household.studentCount`
- Multi-student selector appears when count > 1

---

### Family 3: INSTRUCTOR
**Philosophy:** Teaching excellence and student management

```
┌─────────────────────────────────────────────────────────┐
│ INSTRUCTOR FAMILY                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Teacher                                                 │
│  ├─ Individual contributor                               │
│  ├─ Own students only                                    │
│  ├─ Own schedule                                         │
│  ├─ Own payouts                                          │
│  └─ No team oversight                                    │
│                                                          │
│  Teacher Manager                                         │
│  ├─ Teacher + team lead                                  │
│  ├─ Own students + team visibility                       │
│  ├─ Team schedule coordination                           │
│  ├─ Team performance reports                             │
│  └─ Coverage management                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

Core principle: Same core teaching app, additive management modules
Difference mechanism: Permission-based tab visibility
```

**Shared Experience:**
- Dashboard (today's lessons, student snapshots)
- Calendar (teaching schedule)
- Students (student roster, notes, assignments)
- Practice Insights (student practice tracking)
- Messages (student/parent communication)
- Resources (teaching materials)
- Payouts (earnings)
- Settings

**Permission-Gated Additions:**
- `team:manage` → Teacher Manager only
  - Team tab (team roster, performance)
  - Reports tab (team analytics)
  - Calendar: Team Schedules view
  - Coverage management tools

---

### Family 4: OPERATIONS
**Philosophy:** Platform operations and day-to-day management

```
┌─────────────────────────────────────────────────────────┐
│ OPERATIONS FAMILY                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Admin                                                   │
│  ├─ Operational authority                                │
│  ├─ User management (CRUD)                               │
│  ├─ Billing operations                                   │
│  ├─ Scheduling control                                   │
│  ├─ Support management                                   │
│  ├─ System configuration                                 │
│  └─ Operational reports                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘

Core principle: Hands-on operational control center
Focus: Execution, configuration, problem-solving
```

**Full Experience:**
- Dashboard (operational metrics, alerts)
- Users (create, edit, delete, manage)
- Teachers (directory, assignments, performance)
- Calendar (system-wide scheduling)
- Operations (mission control, config)
- Messages (platform communication)
- Billing (payment issues, subscriptions)
- Payouts (teacher payment processing)
- Reports (operational efficiency)
- Settings

**Operational vs Strategic:**
- Admin = doing the work
- Executive = monitoring the results
- Admin CAN edit, Executive VIEWS

---

### Family 5: LEADERSHIP
**Philosophy:** Strategic oversight and business intelligence

```
┌─────────────────────────────────────────────────────────┐
│ LEADERSHIP FAMILY                                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Executive                                               │
│  ├─ Strategic oversight                                  │
│  ├─ KPI monitoring                                       │
│  ├─ Growth metrics                                       │
│  ├─ Financial health                                     │
│  ├─ Teacher utilization                                  │
│  ├─ Student retention                                    │
│  └─ Read-mostly access                                   │
│                                                          │
└─────────────────────────────────────────────────────────┘

Core principle: High-level view, strategic decisions
Focus: Metrics, trends, business health
```

**Full Experience:**
- Dashboard (KPIs, growth, health)
- Users (strategic user insights)
- Teachers (utilization, retention)
- Calendar (lesson volume trends)
- Operations (strategic oversight)
- Reports (business performance)
- Messages (leadership announcements)
- Settings

**Strategic vs Operational:**
- Executive VIEWS data, rarely edits
- Admin MANAGES data actively
- Same data, different perspectives

---

## 2. NAVIGATION MATRIX

### Learner Family Navigation

```
┌──────────────────────────────────────────────────────────────┐
│ LEARNER NAVIGATION                                           │
├─────────────────┬────────────┬────────────┬──────────────────┤
│ Page            │ Adult      │ Child      │ Permission Gate  │
├─────────────────┼────────────┼────────────┼──────────────────┤
│ Dashboard       │ ✓ Always   │ ✓ Always   │ -                │
│ Calendar        │ ✓ Always   │ ✓ Always   │ -                │
│ Practice        │ ✓ Always   │ ✓ Always   │ -                │
│ Progress        │ ✓ Always   │ ✓ Always   │ -                │
│ Messages        │ ✓ Always   │ ✓ Always   │ -                │
│ Resources       │ ✓ Always   │ ✓ Always   │ -                │
│ Teachers        │ ✓ Yes      │ ✗ No       │ teachers:browse  │
│ Billing         │ ✓ Yes      │ ✗ No       │ billing:view     │
│ Settings        │ ✓ Always   │ ✓ Always   │ -                │
└─────────────────┴────────────┴────────────┴──────────────────┘

PRIMARY NAVIGATION (Always visible):
- Dashboard
- Calendar
- Practice
- Progress
- Messages
- Resources
- Settings

CONDITIONAL NAVIGATION (Permission-based):
- Teachers (adult only)
- Billing (adult only)

SHARED PATTERNS:
- Same layout structure
- Same page templates
- Same component library
- Different data scopes
```

---

### Household Family Navigation

```
┌──────────────────────────────────────────────────────────────┐
│ HOUSEHOLD NAVIGATION                                         │
├─────────────────┬────────────┬────────────┬──────────────────┤
│ Page            │ Parent     │ Family     │ Permission Gate  │
├─────────────────┼────────────┼────────────┼──────────────────┤
│ Dashboard       │ ✓ Always   │ ✓ Always   │ -                │
│ Students        │ ✓ Always   │ ✓ Always   │ -                │
│ Calendar        │ ✓ Always   │ ✓ Always   │ -                │
│ Practice        │ ✓ Always   │ ✓ Always   │ -                │
│ Progress        │ ✓ Always   │ ✓ Always   │ -                │
│ Messages        │ ✓ Always   │ ✓ Always   │ -                │
│ Resources       │ ✓ Always   │ ✓ Always   │ -                │
│ Teachers        │ ✓ Always   │ ✓ Always   │ -                │
│ Billing         │ ✓ Always   │ ✓ Always   │ -                │
│ Settings        │ ✓ Always   │ ✓ Always   │ -                │
└─────────────────┴────────────┴────────────┴──────────────────┘

PRIMARY NAVIGATION (All visible):
- Dashboard
- Students (NEW - child roster)
- Calendar
- Practice
- Progress
- Messages
- Resources
- Teachers
- Billing
- Settings

NO DIFFERENTIATORS:
- Parent and Family see identical navigation
- UI adapts to student count automatically
- No permission differences

SHARED PATTERNS:
- Child selector (if > 1 student)
- Aggregated household views
- Parent-teacher messaging
- Household billing
```

---

### Instructor Family Navigation

```
┌──────────────────────────────────────────────────────────────────────┐
│ INSTRUCTOR NAVIGATION                                                │
├─────────────────┬────────────┬──────────────┬────────────────────────┤
│ Page            │ Teacher    │ Teacher Mgr  │ Permission Gate        │
├─────────────────┼────────────┼──────────────┼────────────────────────┤
│ Dashboard       │ ✓ Always   │ ✓ Always     │ -                      │
│ Calendar        │ ✓ Always   │ ✓ Enhanced   │ team:view (for TM)     │
│ Students        │ ✓ Own      │ ✓ Own+Team   │ students:view_team     │
│ Practice        │ ✓ Always   │ ✓ Always     │ -                      │
│ Messages        │ ✓ Always   │ ✓ Always     │ -                      │
│ Resources       │ ✓ Always   │ ✓ Always     │ -                      │
│ Team            │ ✗ No       │ ✓ Yes        │ team:manage            │
│ Reports         │ ✗ No       │ ✓ Yes        │ reports:view           │
│ Payouts         │ ✓ Always   │ ✓ Always     │ -                      │
│ Settings        │ ✓ Always   │ ✓ Always     │ -                      │
└─────────────────┴────────────┴──────────────┴────────────────────────┘

PRIMARY NAVIGATION (Teacher):
- Dashboard
- Calendar
- Students
- Practice Insights
- Messages
- Resources
- Payouts
- Settings

MANAGER ADDITIONS (Teacher Manager only):
- Team (NEW tab)
- Reports (NEW tab)
- Calendar: Team Schedules tab
- Students: Team visibility

SHARED PATTERNS:
- Same teaching workflow
- Same student management
- Same lesson tools
- Additive permissions for managers
```

---

### Operations Family Navigation

```
┌──────────────────────────────────────────────────────────────┐
│ OPERATIONS NAVIGATION                                        │
├─────────────────┬──────────────────────────────────────────┤
│ Page            │ Admin                                     │
├─────────────────┼──────────────────────────────────────────┤
│ Dashboard       │ ✓ Operational metrics                     │
│ Users           │ ✓ CRUD operations                         │
│ Teachers        │ ✓ Assignment & management                 │
│ Calendar        │ ✓ System scheduling                       │
│ Operations      │ ✓ Mission control                         │
│ Messages        │ ✓ Platform communication                  │
│ Billing         │ ✓ Payment operations                      │
│ Payouts         │ ✓ Teacher payment processing              │
│ Reports         │ ✓ Operational efficiency                  │
│ Settings        │ ✓ System configuration                    │
└─────────────────┴──────────────────────────────────────────┘

ALL NAVIGATION VISIBLE:
- Full platform access
- Operational control
- Active management

FOCUS AREAS:
- User management (create, edit, deactivate)
- Billing operations (resolve issues, process payments)
- Scheduling control (assign teachers, approve requests)
- Support queue (handle customer issues)
- System configuration (settings, automations)
```

---

### Leadership Family Navigation

```
┌──────────────────────────────────────────────────────────────┐
│ LEADERSHIP NAVIGATION                                        │
├─────────────────┬──────────────────────────────────────────┤
│ Page            │ Executive                                 │
├─────────────────┼──────────────────────────────────────────┤
│ Dashboard       │ ✓ Strategic KPIs                          │
│ Users           │ ✓ Strategic insights (read-only)          │
│ Teachers        │ ✓ Utilization & retention                 │
│ Calendar        │ ✓ Lesson volume trends                    │
│ Operations      │ ✓ Strategic oversight (read-only)         │
│ Reports         │ ✓ Business performance                    │
│ Messages        │ ✓ Leadership announcements                │
│ Settings        │ ✓ Preferences                             │
└─────────────────┴──────────────────────────────────────────┘

ALL NAVIGATION VISIBLE:
- Full visibility
- Strategic perspective
- Mostly read-only

FOCUS AREAS:
- KPI monitoring (growth, retention, revenue)
- Teacher utilization (capacity, performance)
- Financial health (MRR, churn, ARPU)
- Student retention (cohort analysis)
- Lesson volume (trends, seasonality)
```

---

## 3. PAGE INVENTORY & CONSOLIDATION STRATEGY

### 3.1 Dashboard Pages

#### Current State (8 files)
```
components/dashboards/
├── adult-student-dashboard.tsx          [320 lines]
├── child-dashboard.tsx                  [280 lines]
├── parent-dashboard.tsx                 [340 lines]
├── family-dashboard.tsx                 [350 lines]
├── teacher-dashboard.tsx                [380 lines]
├── teacher-manager-dashboard.tsx        [400 lines]
├── general-admin-dashboard.tsx          [420 lines]
└── organization-dashboard.tsx           [450 lines]

TOTAL: 2,940 lines across 8 files
CODE DUPLICATION: ~75%
```

#### Proposed V2 (5 files + widgets)
```
components/dashboards/
├── learner-dashboard.tsx                [200 lines - uses widgets]
├── household-dashboard.tsx              [220 lines - uses widgets]
├── instructor-dashboard.tsx             [240 lines - uses widgets]
├── operations-dashboard.tsx             [280 lines - uses widgets]
├── leadership-dashboard.tsx             [260 lines - uses widgets]
└── widgets/
    ├── upcoming-lessons-widget.tsx      [80 lines - reusable]
    ├── practice-streak-widget.tsx       [60 lines - reusable]
    ├── quick-actions-widget.tsx         [70 lines - reusable]
    ├── student-overview-widget.tsx      [90 lines - reusable]
    ├── billing-summary-widget.tsx       [85 lines - reusable]
    └── metrics-card-widget.tsx          [50 lines - reusable]

TOTAL: 1,635 lines across 11 files
CODE DUPLICATION: <10%
REDUCTION: 44% fewer lines, 85% less duplication
```

**Action:** MERGE & EXTRACT WIDGETS

---

### 3.2 Calendar Pages

#### Current State (7 files)
```
components/pages/calendar/
├── calendar-page.tsx                    [Master page with role switching]
├── student-calendar-view.tsx            [180 lines]
├── family-calendar-view.tsx             [220 lines]
├── teacher-calendar-view.tsx            [260 lines]
├── teacher-manager-calendar-view.tsx    [280 lines]
├── admin-calendar-view.tsx              [240 lines]
└── executive-calendar-view.tsx          [200 lines]

TOTAL: 1,380 lines across 6 view files
CODE DUPLICATION: ~80%
```

#### Proposed V2 (1 unified view)
```
components/pages/calendar/
├── calendar-page.tsx                    [Master page]
└── unified-calendar-view.tsx            [350 lines - handles all roles]
    ├── useCalendarData(roleFamily)      [Data fetching hook]
    ├── useCalendarPermissions(role)     [Permission hook]
    └── CalendarGrid component           [Reusable layout]

TOTAL: 350 lines
CODE DUPLICATION: 0%
REDUCTION: 75% fewer lines
```

**Action:** UNIFY TO SINGLE COMPONENT

---

### 3.3 Messages Pages

#### Current State (9 files)
```
components/pages/messages/
├── messages-page.tsx                     [Master router]
├── adult-student-messages-view.tsx       [240 lines]
├── child-student-messages-view.tsx       [180 lines]
├── parent-messages-view.tsx              [260 lines]
├── family-messages-view.tsx              [270 lines]
├── teacher-messages-view.tsx             [280 lines]
├── teacher-manager-messages-view.tsx     [290 lines]
├── admin-messages-view.tsx               [310 lines]
└── executive-messages-view.tsx           [250 lines]

TOTAL: 2,080 lines across 8 view files
CODE DUPLICATION: ~85%
```

#### Proposed V2 (1 unified view)
```
components/pages/messages/
├── messages-page.tsx                     [Master page]
└── unified-messages-view.tsx             [400 lines - handles all roles]
    ├── useMessageThreads(roleFamily)     [Data hook]
    ├── useMessageContacts(roleFamily)    [Contacts hook]
    ├── MessageList component             [Reusable]
    ├── MessageThread component           [Reusable]
    └── MessageComposer component         [Reusable]

TOTAL: 400 lines
CODE DUPLICATION: 0%
REDUCTION: 81% fewer lines
```

**Action:** UNIFY TO SINGLE COMPONENT

---

### 3.4 Practice Pages

#### Current State (1 file)
```
components/pages/
└── practice-page.tsx                     [450 lines - role switching logic]
```

#### Proposed V2 (Role-aware views)
```
components/pages/practice/
├── practice-page.tsx                     [Master router]
├── learner-practice-view.tsx             [250 lines - gamification focus]
└── household-practice-view.tsx           [200 lines - multi-student view]
    └── shared/
        ├── practice-item-card.tsx        [Reusable]
        ├── streak-display.tsx            [Reusable]
        └── xp-progress-bar.tsx           [Reusable]

INSTRUCTOR VIEW: Uses Practice Insights (different page entirely)
```

**Action:** SPLIT INTO 2 ROLE-FAMILY VIEWS (Learner vs Household)

---

### 3.5 Progress Pages

#### Current State (5 files)
```
components/pages/progress/
├── progress-page.tsx                     [Master router]
├── adult-student-progress-view.tsx       [320 lines]
├── child-student-progress-view.tsx       [280 lines]
├── parent-progress-view.tsx              [340 lines]
└── multi-student-progress-view.tsx       [360 lines]

TOTAL: 1,300 lines across 4 view files
CODE DUPLICATION: ~70%
```

#### Proposed V2 (2 consolidated views)
```
components/pages/progress/
├── progress-page.tsx                     [Master router]
├── learner-progress-view.tsx             [280 lines - personal journey]
└── household-progress-view.tsx           [300 lines - multi-student tracking]
    └── shared/
        ├── skill-radar-chart.tsx         [Reusable]
        ├── achievement-badge.tsx         [Reusable]
        ├── progress-timeline.tsx         [Reusable]
        └── student-selector.tsx          [Reusable]

TOTAL: 580 lines across 2 views
CODE DUPLICATION: <15%
REDUCTION: 55% fewer lines
```

**Action:** MERGE TO 2 VIEWS (Learner vs Household)

---

### 3.6 Resources Pages

#### Current State (6 files)
```
components/pages/resources/
├── resources-page.tsx                    [Master router]
├── adult-student-resources-view.tsx      [200 lines]
├── child-student-resources-view.tsx      [160 lines]
├── parent-resources-view.tsx             [210 lines]
├── family-resources-view.tsx             [220 lines]
└── teacher-resources-view.tsx            [230 lines]

TOTAL: 1,020 lines across 5 view files
CODE DUPLICATION: ~80%
```

#### Proposed V2 (1 unified view)
```
components/pages/resources/
├── resources-page.tsx                    [Master page]
└── unified-resources-view.tsx            [300 lines - all roles]
    ├── useResources(roleFamily)          [Filtered data hook]
    ├── ResourceGrid component            [Reusable]
    ├── ResourceFilters component         [Reusable]
    └── ResourceCard component            [Reusable]

TOTAL: 300 lines
CODE DUPLICATION: 0%
REDUCTION: 71% fewer lines
```

**Action:** UNIFY TO SINGLE COMPONENT

---

### 3.7 Billing Pages

#### Current State (5 files)
```
components/pages/billing/
├── billing-page.tsx                      [Master router]
├── adult-student-billing-view.tsx        [280 lines]
├── parent-billing-view.tsx               [300 lines]
├── family-billing-view.tsx               [310 lines]
└── admin-billing-view.tsx                [380 lines]

TOTAL: 1,270 lines across 4 view files
CODE DUPLICATION: ~65% (adult/parent/family very similar)
```

#### Proposed V2 (2 views)
```
components/pages/billing/
├── billing-page.tsx                      [Master router]
├── customer-billing-view.tsx             [320 lines - Learner + Household]
└── operations-billing-view.tsx           [350 lines - Admin oversight]
    └── shared/
        ├── subscription-card.tsx         [Reusable]
        ├── invoice-table.tsx             [Reusable]
        ├── payment-method-card.tsx       [Reusable]
        └── billing-history.tsx           [Reusable]

TOTAL: 670 lines across 2 views
CODE DUPLICATION: <10%
REDUCTION: 47% fewer lines
```

**Action:** MERGE TO 2 VIEWS (Customer vs Operations)

---

### 3.8 Payouts Pages

#### Current State (4 files)
```
components/pages/payouts/
├── payouts-page.tsx                      [Master router]
├── teacher-payouts-view.tsx              [260 lines]
├── teacher-manager-payouts-view.tsx      [270 lines]
└── admin-payouts-view.tsx                [320 lines]

TOTAL: 850 lines across 3 view files
CODE DUPLICATION: ~60% (teacher/manager similar)
```

#### Proposed V2 (2 views)
```
components/pages/payouts/
├── payouts-page.tsx                      [Master router]
├── instructor-payouts-view.tsx           [280 lines - Teacher + Manager]
└── operations-payouts-view.tsx           [300 lines - Admin management]
    └── shared/
        ├── payout-summary-card.tsx       [Reusable]
        ├── earnings-chart.tsx            [Reusable]
        └── payout-history-table.tsx      [Reusable]

TOTAL: 580 lines across 2 views
CODE DUPLICATION: <10%
REDUCTION: 32% fewer lines
```

**Action:** MERGE TO 2 VIEWS (Instructor vs Operations)

---

### 3.9 Students Pages

#### Current State (2 files)
```
components/pages/students/
├── students-page.tsx                     [Master router]
└── teacher-students-view.tsx             [420 lines - teacher roster]

Note: Household "Students" tab doesn't exist yet
```

#### Proposed V2 (2 views)
```
components/pages/students/
├── students-page.tsx                     [Master router]
├── household-students-view.tsx           [NEW - 200 lines - children roster]
└── instructor-students-view.tsx          [420 lines - teaching roster]
    └── shared/
        ├── student-card.tsx              [Reusable]
        ├── student-detail-panel.tsx      [Reusable]
        └── student-progress-summary.tsx  [Reusable]
```

**Action:** ADD household-students-view, RENAME teacher view

---

### 3.10 Teachers Pages

#### Current State (2 files)
```
components/pages/teachers/
├── teachers-page.tsx                     [Master router]
└── unified-teacher-directory-view.tsx    [380 lines - already unified!]

Note: Already serves Learner + Household + Operations + Leadership
```

#### Proposed V2 (Keep as-is)
```
components/pages/teachers/
├── teachers-page.tsx                     [Master router]
└── unified-teacher-directory-view.tsx    [380 lines - keep]
    └── shared/
        ├── teacher-card.tsx              [Reusable]
        ├── teacher-filters.tsx           [Reusable]
        └── teacher-detail-modal.tsx      [Reusable]
```

**Action:** KEEP (already well-structured)

---

### 3.11 Users Pages

#### Current State (3 files)
```
components/pages/users/
├── users-page.tsx                        [Master router]
├── admin-users-view.tsx                  [360 lines - operational CRUD]
└── executive-users-view.tsx              [320 lines - strategic insights]

CODE DUPLICATION: ~40% (different enough to warrant separation)
```

#### Proposed V2 (Keep 2 views)
```
components/pages/users/
├── users-page.tsx                        [Master router]
├── operations-users-view.tsx             [RENAME from admin - 360 lines]
└── leadership-users-view.tsx             [RENAME from executive - 320 lines]
    └── shared/
        ├── user-table.tsx                [Reusable]
        ├── user-filters.tsx              [Reusable]
        ├── user-detail-panel.tsx         [Reusable]
        └── user-metrics-card.tsx         [Reusable]
```

**Action:** KEEP 2 VIEWS (legitimately different purposes)

---

### 3.12 Operations Pages

#### Current State (3 files)
```
components/pages/operations/
├── operations-page.tsx                   [Master router]
├── admin-operations-view.tsx             [420 lines - mission control]
└── executive-operations-view.tsx         [360 lines - strategic overview]

CODE DUPLICATION: ~30% (different perspectives)
```

#### Proposed V2 (Keep 2 views)
```
components/pages/operations/
├── operations-page.tsx                   [Master router]
├── operations-control-view.tsx           [RENAME from admin - 420 lines]
└── leadership-operations-view.tsx        [RENAME from exec - 360 lines]
    └── shared/
        ├── system-health-card.tsx        [Reusable]
        ├── operations-metrics.tsx        [Reusable]
        └── alert-feed.tsx                [Reusable]
```

**Action:** KEEP 2 VIEWS (operational vs strategic different)

---

### 3.13 Reports Pages

#### Current State (4 files)
```
components/pages/reports/
├── reports-page.tsx                      [Master router]
├── teacher-manager-reports-view.tsx      [380 lines - coaching focus]
├── admin-reports-view.tsx                [420 lines - operational focus]
└── executive-reports-view.tsx            [440 lines - strategic focus]

CODE DUPLICATION: ~50% (shared chart components)
```

#### Proposed V2 (Keep 3 views)
```
components/pages/reports/
├── reports-page.tsx                      [Master router]
├── instructor-reports-view.tsx           [RENAME from TM - 380 lines]
├── operations-reports-view.tsx           [RENAME from admin - 420 lines]
└── leadership-reports-view.tsx           [RENAME from exec - 440 lines]
    └── shared/
        ├── report-builder.tsx            [Reusable]
        ├── chart-container.tsx           [Reusable]
        ├── export-menu.tsx               [Reusable]
        └── date-range-selector.tsx       [Reusable]
```

**Action:** KEEP 3 VIEWS (three distinct perspectives on data)

---

### 3.14 Settings Pages

#### Current State (1 file)
```
components/pages/
└── settings-page.tsx                     [280 lines - role switching]
```

#### Proposed V2 (Keep unified)
```
components/pages/settings/
├── settings-page.tsx                     [Master page]
└── unified-settings-view.tsx             [320 lines - role-aware sections]
    └── sections/
        ├── profile-section.tsx           [All roles]
        ├── notifications-section.tsx     [All roles]
        ├── billing-section.tsx           [Household + Learner only]
        ├── teaching-section.tsx          [Instructor only]
        └── system-section.tsx            [Operations only]
```

**Action:** KEEP UNIFIED (settings naturally role-aware)

---

## PAGE INVENTORY SUMMARY

```
┌──────────────────────┬─────────┬─────────┬─────────────────────────────┐
│ Page Type            │ Current │ V2      │ Action                      │
├──────────────────────┼─────────┼─────────┼─────────────────────────────┤
│ Dashboards           │ 8 files │ 5 files │ MERGE + extract widgets     │
│ Calendar             │ 6 views │ 1 view  │ UNIFY                       │
│ Messages             │ 8 views │ 1 view  │ UNIFY                       │
│ Practice             │ 1 file  │ 2 views │ SPLIT (Learner/Household)   │
│ Progress             │ 4 views │ 2 views │ MERGE (Learner/Household)   │
│ Resources            │ 5 views │ 1 view  │ UNIFY                       │
│ Billing              │ 4 views │ 2 views │ MERGE (Customer/Operations) │
│ Payouts              │ 3 views │ 2 views │ MERGE (Instructor/Ops)      │
│ Students             │ 1 view  │ 2 views │ ADD Household view          │
│ Teachers             │ 1 view  │ 1 view  │ KEEP (already unified)      │
│ Users                │ 2 views │ 2 views │ KEEP (different purposes)   │
│ Operations           │ 2 views │ 2 views │ KEEP (different purposes)   │
│ Reports              │ 3 views │ 3 views │ KEEP (three perspectives)   │
│ Settings             │ 1 file  │ 1 view  │ KEEP (already unified)      │
├──────────────────────┼─────────┼─────────┼─────────────────────────────┤
│ TOTAL VIEW FILES     │ 49      │ 26      │ 47% reduction               │
└──────────────────────┴─────────┴─────────┴─────────────────────────────┘

CONSOLIDATION IMPACT:
- High consolidation: Dashboard, Calendar, Messages, Resources
- Moderate consolidation: Progress, Billing, Payouts
- Minimal consolidation: Users, Operations, Reports (legitimately different)
- Keep as-is: Teachers, Settings
- New additions: Household Students view
```

---

## 4. PAGE → BACKEND OBJECT MAPPING

### 4.1 Dashboard Page

**Primary Objects:**
- `User` - Current user context, role, permissions
- `Lesson` - Upcoming lessons, next lesson
- `Progress` - Practice streak, XP, achievements
- `Assignment` - Pending practice items
- `Invoice` - Billing status (Household)
- `Payout` - Earnings summary (Instructor)
- `Metric` - KPIs (Operations/Leadership)

**Secondary Objects:**
- `Student` - For Household/Instructor dashboards
- `Teacher` - For Learner/Household dashboards
- `Notification` - System alerts

**Data Queries by Role Family:**

```typescript
// Learner Dashboard
const dashboardData = {
  user: await userService.getCurrentUser(),
  nextLesson: await lessonService.getNextLesson(user.id),
  progress: await progressService.getProgress(user.id),
  assignments: await assignmentService.getPending(user.id),
  teacher: await teacherService.getAssigned(user.id),
  streak: await progressService.getCurrentStreak(user.id)
};

// Household Dashboard
const dashboardData = {
  household: await householdService.getHousehold(user.householdId),
  students: await studentService.getHouseholdStudents(user.householdId),
  upcomingLessons: await lessonService.getHouseholdLessons(user.householdId),
  practiceProgress: await progressService.getHouseholdProgress(user.householdId),
  billing: await billingService.getHouseholdBilling(user.householdId)
};

// Instructor Dashboard
const dashboardData = {
  todayLessons: await lessonService.getTodayLessons(user.id),
  students: await studentService.getAssignedStudents(user.id),
  pendingNotes: await lessonService.getPendingNotes(user.id),
  payoutSummary: await payoutService.getCurrentPeriod(user.id),
  // Manager only
  teamMetrics: hasPermission('team:manage') 
    ? await teamService.getMetrics(user.teamId) 
    : null
};

// Operations Dashboard
const dashboardData = {
  metrics: await metricsService.getOperationalMetrics(),
  lessonVolume: await lessonService.getVolumeMetrics(),
  supportItems: await supportService.getOpenItems(),
  paymentIssues: await billingService.getIssues(),
  teacherCoverage: await teacherService.getCoverageStatus()
};

// Leadership Dashboard
const dashboardData = {
  kpis: await metricsService.getKPIs(),
  growth: await metricsService.getGrowthMetrics(),
  revenue: await billingService.getRevenueMetrics(),
  retention: await metricsService.getRetentionMetrics(),
  teacherUtilization: await teacherService.getUtilization()
};
```

---

### 4.2 Calendar Page

**Primary Objects:**
- `Lesson` - All lesson records
- `User` - Current user for scoping
- `Student` - For Household/Instructor views
- `Teacher` - For Learner/Household views
- `Availability` - For scheduling

**Secondary Objects:**
- `LessonRequest` - Pending lesson requests
- `Household` - For Household scoping

**Data Queries by Role Family:**

```typescript
// Learner Calendar
const calendarData = {
  lessons: await lessonService.getStudentLessons(user.id, dateRange),
  teacher: await teacherService.getAssigned(user.id)
};

// Household Calendar
const calendarData = {
  lessons: await lessonService.getHouseholdLessons(user.householdId, dateRange),
  students: await studentService.getHouseholdStudents(user.householdId),
  teachers: await teacherService.getHouseholdTeachers(user.householdId)
};

// Instructor Calendar
const calendarData = {
  lessons: await lessonService.getTeacherLessons(user.id, dateRange),
  requests: await lessonService.getPendingRequests(user.id),
  availability: await teacherService.getAvailability(user.id),
  // Manager only
  teamSchedules: hasPermission('team:view')
    ? await lessonService.getTeamLessons(user.teamId, dateRange)
    : null
};

// Operations Calendar
const calendarData = {
  lessons: await lessonService.getAllLessons(dateRange),
  unassignedRequests: await lessonService.getUnassignedRequests(),
  teacherAvailability: await teacherService.getAllAvailability()
};

// Leadership Calendar
const calendarData = {
  lessonVolume: await lessonService.getVolumeByDate(dateRange),
  utilizationTrends: await metricsService.getUtilizationTrends(dateRange)
};
```

---

### 4.3 Practice Page

**Primary Objects:**
- `Assignment` - Practice items
- `Progress` - XP, streaks, levels
- `Student` - For Household views
- `Achievement` - Unlocked achievements

**Secondary Objects:**
- `Lesson` - Assignment source
- `Resource` - Practice materials

**Data Queries by Role Family:**

```typescript
// Learner Practice
const practiceData = {
  assignments: await assignmentService.getActive(user.id),
  progress: await progressService.getProgress(user.id),
  streak: await progressService.getCurrentStreak(user.id),
  achievements: await progressService.getAchievements(user.id),
  weeklyGoal: await progressService.getWeeklyGoal(user.id)
};

// Household Practice
const practiceData = {
  students: await studentService.getHouseholdStudents(user.householdId),
  assignmentsByStudent: await assignmentService.getHouseholdAssignments(user.householdId),
  progressByStudent: await progressService.getHouseholdProgress(user.householdId)
};

// Instructor Practice Insights (different page)
const practiceData = {
  students: await studentService.getAssignedStudents(user.id),
  practiceActivity: await progressService.getStudentActivity(studentIds),
  assignmentCompletion: await assignmentService.getCompletionRates(studentIds)
};
```

---

### 4.4 Progress Page

**Primary Objects:**
- `Progress` - Progress record
- `Achievement` - Unlocked achievements
- `Student` - For Household views
- `Assignment` - Completed assignments

**Secondary Objects:**
- `Lesson` - Lesson history
- `SkillMetric` - Skill level tracking

**Data Queries by Role Family:**

```typescript
// Learner Progress
const progressData = {
  progress: await progressService.getProgress(user.id),
  achievements: await progressService.getAchievements(user.id),
  skillMetrics: await progressService.getSkillMetrics(user.id),
  lessonHistory: await lessonService.getCompletedLessons(user.id),
  timeline: await progressService.getTimeline(user.id)
};

// Household Progress
const progressData = {
  students: await studentService.getHouseholdStudents(user.householdId),
  progressByStudent: await progressService.getHouseholdProgress(user.householdId),
  achievementsByStudent: await progressService.getHouseholdAchievements(user.householdId)
};
```

---

### 4.5 Messages Page

**Primary Objects:**
- `Message` - Message records
- `MessageThread` - Conversation threads
- `User` - Participants

**Secondary Objects:**
- `Student` - For context
- `Teacher` - For context
- `Lesson` - For lesson-related messages

**Data Queries by Role Family:**

```typescript
// Learner Messages
const messagesData = {
  threads: await messageService.getThreads(user.id),
  contacts: await messageService.getContacts(user.id), // Teachers only
  unreadCount: await messageService.getUnreadCount(user.id)
};

// Household Messages
const messagesData = {
  threads: await messageService.getHouseholdThreads(user.householdId),
  contacts: await messageService.getHouseholdContacts(user.householdId), // Teachers
  students: await studentService.getHouseholdStudents(user.householdId)
};

// Instructor Messages
const messagesData = {
  threads: await messageService.getThreads(user.id),
  contacts: await messageService.getContacts(user.id), // Students + Parents
  students: await studentService.getAssignedStudents(user.id)
};

// Operations/Leadership Messages
const messagesData = {
  threads: await messageService.getAllThreads(),
  broadcastCapability: hasPermission('messages:broadcast'),
  systemMessages: await messageService.getSystemMessages()
};
```

---

### 4.6 Resources Page

**Primary Objects:**
- `Resource` - File/link resources
- `User` - For upload/access tracking

**Secondary Objects:**
- `Student` - For audience targeting
- `Teacher` - For creator context

**Data Queries by Role Family:**

```typescript
// Learner Resources
const resourcesData = {
  resources: await resourceService.getResources({
    audienceIncludes: 'student',
    visibleTo: user.id
  })
};

// Household Resources
const resourcesData = {
  resources: await resourceService.getResources({
    audienceIncludes: 'household',
    householdId: user.householdId
  }),
  students: await studentService.getHouseholdStudents(user.householdId)
};

// Instructor Resources
const resourcesData = {
  resources: await resourceService.getResources({
    audienceIncludes: 'teacher',
    uploadedBy: user.id
  }),
  uploadCapability: true
};

// Operations/Leadership Resources
const resourcesData = {
  resources: await resourceService.getAllResources(),
  uploadCapability: true,
  managementCapability: true
};
```

---

### 4.7 Billing Page

**Primary Objects:**
- `Subscription` - Subscription plan
- `Invoice` - Billing records
- `PaymentMethod` - Payment info
- `Household` - For household billing

**Data Queries:**

```typescript
// Customer Billing (Learner + Household)
const billingData = {
  subscription: await billingService.getSubscription(user.householdId || user.id),
  invoices: await billingService.getInvoices(user.householdId || user.id),
  paymentMethod: await billingService.getPaymentMethod(user.householdId || user.id),
  upcomingCharges: await billingService.getUpcomingCharges(user.householdId || user.id)
};

// Operations Billing
const billingData = {
  subscriptions: await billingService.getAllSubscriptions(filters),
  issues: await billingService.getIssues(),
  revenueMetrics: await billingService.getRevenueMetrics(),
  failedPayments: await billingService.getFailedPayments()
};
```

---

### 4.8 Payouts Page

**Primary Objects:**
- `Payout` - Payout records
- `Lesson` - Lessons included in payout
- `Teacher` - Teacher record

**Data Queries:**

```typescript
// Instructor Payouts
const payoutsData = {
  payouts: await payoutService.getPayouts(user.id),
  currentPeriod: await payoutService.getCurrentPeriod(user.id),
  lessons: await lessonService.getCompletedLessons(user.id, dateRange),
  earnings: await payoutService.getEarnings(user.id)
};

// Operations Payouts
const payoutsData = {
  payouts: await payoutService.getAllPayouts(filters),
  pendingPayouts: await payoutService.getPendingPayouts(),
  payoutSchedule: await payoutService.getSchedule(),
  teacherEarnings: await payoutService.getTeacherEarnings()
};
```

---

### 4.9 Students Page

**Primary Objects:**
- `Student` - Student records
- `Lesson` - Student lesson history
- `Progress` - Student progress
- `Assignment` - Student assignments

**Data Queries:**

```typescript
// Household Students
const studentsData = {
  students: await studentService.getHouseholdStudents(user.householdId),
  lessonsByStudent: await lessonService.getStudentLessons(studentIds),
  progressByStudent: await progressService.getStudentProgress(studentIds)
};

// Instructor Students
const studentsData = {
  students: await studentService.getAssignedStudents(user.id),
  lessonHistory: await lessonService.getStudentLessons(studentIds),
  progress: await progressService.getStudentProgress(studentIds),
  assignments: await assignmentService.getStudentAssignments(studentIds),
  notes: await lessonService.getStudentNotes(studentIds)
};
```

---

### 4.10 Teachers Page

**Primary Objects:**
- `Teacher` - Teacher records
- `User` - Teacher user profiles
- `Lesson` - Teaching history

**Data Queries:**

```typescript
// Learner/Household Teachers
const teachersData = {
  assignedTeachers: await teacherService.getAssigned(studentIds),
  allTeachers: await teacherService.getDirectory(filters)
};

// Operations/Leadership Teachers
const teachersData = {
  teachers: await teacherService.getAllTeachers(filters),
  performance: await teacherService.getPerformanceMetrics(),
  utilization: await teacherService.getUtilization(),
  availability: await teacherService.getAvailability()
};
```

---

### 4.11 Users Page

**Primary Objects:**
- `User` - User records
- `Household` - Household groupings
- `Student` - Student associations
- `Teacher` - Teacher associations

**Data Queries:**

```typescript
// Operations Users
const usersData = {
  users: await userService.getAllUsers(filters),
  households: await householdService.getAllHouseholds(),
  recentActivity: await userService.getRecentActivity(),
  userMetrics: await userService.getMetrics()
};

// Leadership Users
const usersData = {
  userMetrics: await userService.getStrategicMetrics(),
  growth: await userService.getGrowthMetrics(),
  cohortAnalysis: await userService.getCohortAnalysis(),
  retention: await userService.getRetentionMetrics()
};
```

---

### 4.12 Operations Page

**Primary Objects:**
- `SystemConfig` - Configuration settings
- `Metric` - Operational metrics
- `Alert` - System alerts

**Data Queries:**

```typescript
// Operations Control
const operationsData = {
  systemHealth: await systemService.getHealth(),
  activeAlerts: await alertService.getActive(),
  configuration: await configService.getSettings(),
  automations: await automationService.getStatus()
};

// Leadership Operations
const operationsData = {
  systemHealth: await systemService.getHealthOverview(),
  platformMetrics: await metricsService.getPlatformMetrics(),
  operationalTrends: await metricsService.getOperationalTrends()
};
```

---

### 4.13 Reports Page

**Primary Objects:**
- `Report` - Report definitions
- `Metric` - Metric data
- `Chart` - Visualization configs

**Data Queries:**

```typescript
// Instructor Reports (Teacher Manager)
const reportsData = {
  teamMetrics: await reportService.getTeamMetrics(user.teamId),
  teacherPerformance: await reportService.getTeacherPerformance(teamIds),
  studentProgress: await reportService.getTeamStudentProgress(user.teamId)
};

// Operations Reports
const reportsData = {
  operationalMetrics: await reportService.getOperationalMetrics(),
  efficiency: await reportService.getEfficiencyMetrics(),
  support: await reportService.getSupportMetrics()
};

// Leadership Reports
const reportsData = {
  businessMetrics: await reportService.getBusinessMetrics(),
  growth: await reportService.getGrowthMetrics(),
  financial: await reportService.getFinancialMetrics(),
  retention: await reportService.getRetentionMetrics()
};
```

---

## 5. V2 PRODUCT STRUCTURE

### 5.1 Shared App Shell

**Component:** `Layout.tsx`

**Elements:**
- Left sidebar navigation (desktop)
- Top header with notifications, profile
- Mobile menu overlay
- Role switcher (demo mode)
- Logo
- Main content area

**Shared Across:** All 5 role families

**Customization Points:**
- Navigation items (role-family specific)
- Quick actions (role-family specific)
- Profile dropdown options (role-family specific)

---

### 5.2 Shared Page Patterns

#### Pattern 1: List/Table View
**Used by:** Calendar, Messages, Resources, Students, Teachers, Users

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Page Header                                         │
│ - Title                                             │
│ - Description                                       │
│ - Primary action button                             │
├─────────────────────────────────────────────────────┤
│ Filters & Tabs                                      │
│ - Tab navigation (role-specific)                    │
│ - Search bar                                        │
│ - Filter dropdowns                                  │
├─────────────────────────────────────────────────────┤
│ Content Area                                        │
│ - List view / Table view / Grid view                │
│ - Pagination or infinite scroll                     │
│ - Empty state (if no results)                       │
└─────────────────────────────────────────────────────┘
```

**Reusable Components:**
- `PageHeader`
- `TabNavigation`
- `SearchBar`
- `FilterPanel`
- `DataTable`
- `EmptyState`

---

#### Pattern 2: Dashboard View
**Used by:** All 5 role family dashboards

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Welcome Header                                      │
│ - Personalized greeting                             │
│ - Quick stats                                       │
├─────────────────────────────────────────────────────┤
│ Quick Actions                                       │
│ - 2-4 primary action cards                          │
├─────────────────────────────────────────────────────┤
│ Widget Grid (2 columns)                             │
│ ┌──────────────────┐  ┌──────────────────┐         │
│ │ Widget 1         │  │ Widget 2         │         │
│ └──────────────────┘  └──────────────────┘         │
│ ┌──────────────────┐  ┌──────────────────┐         │
│ │ Widget 3         │  │ Widget 4         │         │
│ └──────────────────┘  └──────────────────┘         │
└─────────────────────────────────────────────────────┘
```

**Reusable Widgets:**
- `UpcomingLessonsWidget`
- `PracticeStreakWidget`
- `QuickActionsWidget`
- `StudentOverviewWidget`
- `BillingSummaryWidget`
- `MetricsCardWidget`

---

#### Pattern 3: Detail View with Sidebar
**Used by:** Student detail, Teacher profile, Lesson detail

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Back Button | Title                                  │
├──────────────┬──────────────────────────────────────┤
│ Info Card    │ Main Content Area                    │
│ - Avatar     │ - Tabs                               │
│ - Name       │   - Overview                         │
│ - Status     │   - History                          │
│ - Quick      │   - Notes                            │
│   Actions    │   - Files                            │
│              │                                      │
│ Related      │ Tab Content                          │
│ Items        │ - Forms, tables, charts              │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

**Reusable Components:**
- `DetailSidebar`
- `DetailHeader`
- `DetailTabs`
- `InfoCard`

---

#### Pattern 4: Gamification View
**Used by:** Practice page (Learner)

**Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Progress Bar (XP, Level, Streak)                    │
├─────────────────────────────────────────────────────┤
│ Daily Checklist                                     │
│ ☑ Warm-up exercises    ☑ Practice song            │
│ ☑ Scales               ☐ Theory work               │
├─────────────────────────────────────────────────────┤
│ Active Assignments                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│ │Assignment│ │Assignment│ │Assignment│            │
│ │  Card 1  │ │  Card 2  │ │  Card 3  │            │
│ └──────────┘ └──────────┘ └──────────┘            │
├─────────────────────────────────────────────────────┤
│ Achievements                                        │
│ 🏆 🏆 🔒 🔒 🔒                                      │
└─────────────────────────────────────────────────────┘
```

**Reusable Components:**
- `StreakDisplay`
- `XPProgressBar`
- `DailyChecklist`
- `AssignmentCard`
- `AchievementBadge`

---

### 5.3 Role Family Differences (Permission-Based)

```
┌─────────────────┬──────────────────────────────────────────────────┐
│ Role Family     │ Unique Characteristics                           │
├─────────────────┼──────────────────────────────────────────────────┤
│ LEARNER         │ • Child: Simplified UI, gamification emphasis    │
│                 │ • Adult: Full billing access, teacher directory  │
│                 │ • Focus: Personal learning journey               │
├─────────────────┼──────────────────────────────────────────────────┤
│ HOUSEHOLD       │ • Multi-student selector (if > 1 child)          │
│                 │ • Aggregated household views                     │
│                 │ • Parent-teacher communication                   │
│                 │ • Focus: Family oversight                        │
├─────────────────┼──────────────────────────────────────────────────┤
│ INSTRUCTOR      │ • Teacher: Own students only                     │
│                 │ • Manager: +Team tab, +Reports tab               │
│                 │ • Focus: Teaching effectiveness                  │
├─────────────────┼──────────────────────────────────────────────────┤
│ OPERATIONS      │ • Full CRUD operations                           │
│                 │ • System configuration                           │
│                 │ • Active management                              │
│                 │ • Focus: Execution                               │
├─────────────────┼──────────────────────────────────────────────────┤
│ LEADERSHIP      │ • Read-mostly access                             │
│                 │ • Strategic metrics                              │
│                 │ • High-level KPIs                                │
│                 │ • Focus: Business intelligence                   │
└─────────────────┴──────────────────────────────────────────────────┘
```

---

### 5.4 Permission-Based Modules

**Module 1: Billing**
- **Visible to:** Learner (Adult), Household, Operations
- **Hidden from:** Learner (Child), Instructor, Leadership
- **Permission:** `billing:view`

**Module 2: Teacher Directory**
- **Visible to:** Learner (Adult), Household
- **Hidden from:** Learner (Child), Instructor, Operations, Leadership
- **Permission:** `teachers:browse`

**Module 3: Team Management**
- **Visible to:** Instructor (Manager), Operations, Leadership
- **Hidden from:** Instructor (Teacher), Learner, Household
- **Permission:** `team:manage`

**Module 4: Reports**
- **Visible to:** Instructor (Manager), Operations, Leadership
- **Hidden from:** Instructor (Teacher), Learner, Household
- **Permission:** `reports:view`

**Module 5: Users Management**
- **Visible to:** Operations, Leadership
- **Hidden from:** Learner, Household, Instructor
- **Permission:** `users:view`

**Module 6: Operations Control**
- **Visible to:** Operations, Leadership (read-only)
- **Hidden from:** Learner, Household, Instructor
- **Permission:** `operations:view`

---

### 5.5 Recommended Build Order

#### Week 1-2: Foundation
1. ✅ Create `config/role-config.ts` with role family definitions
2. ✅ Add `getRoleFamily()` helper
3. ✅ Update RoleContext to include `roleFamily`
4. ✅ Create `config/permissions.ts` with permission matrix
5. ✅ Create `usePermissions()` hook
6. ✅ Create `<PermissionGate>` component
7. ✅ Update Layout navigation to use role family config

#### Week 3-4: Dashboard Consolidation
1. ✅ Create widget library (6 widgets)
2. ✅ Build `learner-dashboard.tsx`
3. ✅ Build `household-dashboard.tsx`
4. ✅ Build `instructor-dashboard.tsx`
5. ✅ Build `operations-dashboard.tsx`
6. ✅ Build `leadership-dashboard.tsx`
7. ✅ Update `dashboard-page.tsx` router
8. 🔥 Delete old dashboard files

#### Week 5: High-Impact Unification
1. ✅ Unify Messages (8 → 1)
2. ✅ Unify Calendar (6 → 1)
3. ✅ Unify Resources (5 → 1)

#### Week 6: Moderate Consolidation
1. ✅ Consolidate Progress (4 → 2)
2. ✅ Consolidate Billing (4 → 2)
3. ✅ Consolidate Payouts (3 → 2)

#### Week 7: Data Layer
1. ✅ Create TypeScript interfaces (12 objects)
2. ✅ Create service layer (8 services)
3. ✅ Create mock data generators
4. ✅ Refactor components to use services

#### Week 8: Polish
1. ✅ Mobile optimization review
2. ✅ Accessibility audit
3. ✅ Loading/error/empty states
4. ✅ Documentation
5. ✅ Final cleanup

---

## NEXT STEPS

1. **Review this Phase 1 foundation document**
2. **Approve the consolidation strategy**
3. **Begin Week 1-2: Foundation implementation**
   - Build role-config.ts
   - Build permissions system
   - Update navigation

This foundation document provides the strategic architecture without diving into full visual redesign. Once approved, we can proceed with implementation.

---

**END OF PHASE 1 FOUNDATION DOCUMENT**
