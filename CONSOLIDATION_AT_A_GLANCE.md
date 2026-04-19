# Consolidation Strategy at a Glance

**Quick reference for Phase 1 architecture decisions**

---

## Role Family Mapping

```
8 CURRENT ROLES              →         5 ROLE FAMILIES

Adult Student          ──┐
Child Student          ──┼──────────→  LEARNER
                         
Parent / Guardian      ──┐
Family / Multi-Student ──┼──────────→  HOUSEHOLD

Teacher                ──┐
Teacher Manager        ──┼──────────→  INSTRUCTOR

Admin                  ───────────────→ OPERATIONS

Executive              ───────────────→ LEADERSHIP
```

---

## Page Consolidation

### 🔥 HIGH CONSOLIDATION (80%+ reduction)

**Dashboards:** 8 files → 5 files + 6 widgets
```
Before:
- adult-student-dashboard.tsx
- child-dashboard.tsx
- parent-dashboard.tsx
- family-dashboard.tsx
- teacher-dashboard.tsx
- teacher-manager-dashboard.tsx
- general-admin-dashboard.tsx
- organization-dashboard.tsx

After:
- learner-dashboard.tsx          (uses widgets)
- household-dashboard.tsx        (uses widgets)
- instructor-dashboard.tsx       (uses widgets)
- operations-dashboard.tsx       (uses widgets)
- leadership-dashboard.tsx       (uses widgets)
+ widgets/
  - upcoming-lessons-widget.tsx
  - practice-streak-widget.tsx
  - quick-actions-widget.tsx
  - student-overview-widget.tsx
  - billing-summary-widget.tsx
  - metrics-card-widget.tsx
```

**Messages:** 8 views → 1 unified view
```
Before: 8 separate message view files
After:  unified-messages-view.tsx (role-aware filtering)
```

**Calendar:** 6 views → 1 unified view
```
Before: 6 separate calendar view files
After:  unified-calendar-view.tsx (permission-based actions)
```

**Resources:** 5 views → 1 unified view
```
Before: 5 separate resource view files
After:  unified-resources-view.tsx (audience filtering)
```

---

### 🟡 MODERATE CONSOLIDATION (50% reduction)

**Progress:** 4 views → 2 views
```
Before:
- adult-student-progress-view.tsx
- child-student-progress-view.tsx
- parent-progress-view.tsx
- multi-student-progress-view.tsx

After:
- learner-progress-view.tsx      (Adult + Child)
- household-progress-view.tsx    (Parent + Family)
```

**Billing:** 4 views → 2 views
```
Before:
- adult-student-billing-view.tsx
- parent-billing-view.tsx
- family-billing-view.tsx
- admin-billing-view.tsx

After:
- customer-billing-view.tsx      (Learner + Household)
- operations-billing-view.tsx    (Admin)
```

**Payouts:** 3 views → 2 views
```
Before:
- teacher-payouts-view.tsx
- teacher-manager-payouts-view.tsx
- admin-payouts-view.tsx

After:
- instructor-payouts-view.tsx    (Teacher + Manager)
- operations-payouts-view.tsx    (Admin)
```

---

### ✅ KEEP AS-IS (Already well-designed)

**Teachers:** 1 view (already unified)
```
Keep: unified-teacher-directory-view.tsx
```

**Users:** 2 views (legitimately different purposes)
```
Keep:
- operations-users-view.tsx      (CRUD operations)
- leadership-users-view.tsx      (Strategic insights)
```

**Operations:** 2 views (operational vs strategic)
```
Keep:
- operations-control-view.tsx    (Admin hands-on)
- leadership-operations-view.tsx (Executive overview)
```

**Reports:** 3 views (three distinct perspectives)
```
Keep:
- instructor-reports-view.tsx    (Team coaching)
- operations-reports-view.tsx    (Efficiency)
- leadership-reports-view.tsx    (Strategic)
```

**Settings:** 1 view (naturally role-aware)
```
Keep: unified-settings-view.tsx
```

---

### ➕ NEW ADDITIONS

**Students:** Add household view
```
Current: instructor-students-view.tsx (teacher roster)
Add:     household-students-view.tsx  (children roster)
```

---

## Navigation Changes

### Learner Family
```
SHARED (Adult + Child):
✓ Dashboard
✓ Calendar
✓ Practice
✓ Progress
✓ Messages
✓ Resources
✓ Settings

PERMISSION-GATED:
✓ Teachers     (Adult only - teachers:browse)
✓ Billing      (Adult only - billing:view)
```

### Household Family
```
ALL VISIBLE (Parent + Family):
✓ Dashboard
✓ Students     ← NEW
✓ Calendar
✓ Practice
✓ Progress
✓ Messages
✓ Resources
✓ Teachers
✓ Billing
✓ Settings

NO DIFFERENCES between Parent and Family
(UI adapts to household.studentCount)
```

### Instructor Family
```
SHARED (Teacher + Manager):
✓ Dashboard
✓ Calendar
✓ Students
✓ Practice Insights
✓ Messages
✓ Resources
✓ Payouts
✓ Settings

PERMISSION-GATED:
✓ Team         (Manager only - team:manage)
✓ Reports      (Manager only - reports:view)
```

### Operations Family
```
ALL VISIBLE (Admin):
✓ Dashboard
✓ Users
✓ Teachers
✓ Calendar
✓ Operations
✓ Messages
✓ Billing
✓ Payouts
✓ Reports
✓ Settings

Focus: Active management & configuration
```

### Leadership Family
```
ALL VISIBLE (Executive):
✓ Dashboard
✓ Users
✓ Teachers
✓ Calendar
✓ Operations
✓ Reports
✓ Messages
✓ Settings

Focus: Strategic oversight (read-heavy)
```

---

## Backend Object Priority

### Tier 1: Core Foundation
```
1. User          - Authentication, roles, permissions
2. Household     - Family grouping, billing aggregation
3. Student       - Enrollment, instrument, level
4. Teacher       - Certifications, availability
5. Lesson        - Scheduled sessions, the heart of the platform
```

### Tier 2: Learning & Communication
```
6. Assignment    - Practice items, homework
7. Progress      - XP, streaks, achievements
8. Message       - Platform communication
```

### Tier 3: Financial & Operations
```
9. Subscription  - Billing, payments
10. Payout       - Teacher earnings
11. Team         - Teacher groups
12. Report       - Analytics, metrics
```

---

## Permission Matrix (Quick Reference)

```
Permission           Learner  Household  Instructor  Operations  Leadership
─────────────────────────────────────────────────────────────────────────
billing:view         Adult    ✓          ✗           ✓           ✓
billing:manage       Adult    ✓          ✗           ✓           ✗
teachers:browse      Adult    ✓          ✗           ✗           ✗
students:view_all    ✗        Household  Assigned    ✓           ✓
lessons:schedule     ✗        ✓          ✗           ✓           ✗
team:manage          ✗        ✗          Manager     ✓           ✓
reports:view         ✗        ✗          Manager     ✓           ✓
users:manage         ✗        ✗          ✗           ✓           ✗
messages:broadcast   ✗        ✗          ✗           ✓           ✓
operations:configure ✗        ✗          ✗           ✓           ✗
```

---

## Impact Summary

### File Count Reduction
```
Current:  49 view files
V2:       26 view files
Reduction: 47%
```

### Code Duplication Reduction
```
Dashboards:  75% duplication → <10% duplication
Messages:    85% duplication → 0% duplication
Calendar:    80% duplication → 0% duplication
Resources:   80% duplication → 0% duplication
Progress:    70% duplication → <15% duplication
Billing:     65% duplication → <10% duplication
```

### Maintainability Gains
```
✓ Single source of truth for navigation
✓ Permission-based rendering
✓ Reusable widget library
✓ Clear data object boundaries
✓ Backend-ready service layer
```

---

## Build Order (8 Weeks)

```
WEEK 1-2: FOUNDATION
├─ Role family config
├─ Permission system
├─ Navigation update
└─ usePermissions hook

WEEK 3-4: DASHBOARD CONSOLIDATION
├─ 6 reusable widgets
├─ 5 role-family dashboards
└─ Delete old dashboards

WEEK 5: HIGH-IMPACT UNIFICATION
├─ Unify Messages (8→1)
├─ Unify Calendar (6→1)
└─ Unify Resources (5→1)

WEEK 6: MODERATE CONSOLIDATION
├─ Consolidate Progress (4→2)
├─ Consolidate Billing (4→2)
└─ Consolidate Payouts (3→2)

WEEK 7: DATA LAYER
├─ TypeScript interfaces (12 objects)
├─ Service layer (8 services)
├─ Mock data generators
└─ Refactor to use services

WEEK 8: POLISH
├─ Mobile optimization
├─ Accessibility audit
├─ Loading/error/empty states
└─ Documentation
```

---

## Key Principles

1. **Shared First, Permission Second**
   - Default: all roles share same components
   - Permission gates hide what's not applicable
   - No duplicate code for identical UX

2. **Data Scope, Not UI Duplication**
   - Parent vs Family: same UI, different data query
   - Teacher vs Manager: same foundation, additive modules
   - Adult vs Child: same pages, permission-gated sections

3. **Backend-Minded Design**
   - Every screen built around data objects
   - Service layer abstracts data fetching
   - TypeScript types match backend schema
   - Easy to swap mock data for real API

4. **Permission Over Role Checks**
   - `hasPermission('billing:view')` not `role === 'admin'`
   - Single permission matrix
   - Role changes don't require code changes

---

## Decision Framework

**When to consolidate pages?**
→ If 70%+ of the UI is identical, consolidate with role-aware data fetching

**When to keep separate pages?**
→ If perspectives are fundamentally different (Operations vs Leadership Users view)

**When to use permission gates?**
→ For additive modules (Team tab for Teacher Manager, Billing for Adult Students)

**When to use role families?**
→ For navigation structure and dashboard selection

---

**READY TO PROCEED?**

✅ Review PHASE_1_FOUNDATION.md for detailed architecture  
✅ Review this summary for quick consolidation reference  
✅ Approve strategy and move to implementation

Next step: Begin Week 1-2 Foundation implementation
