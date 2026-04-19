# Role Migration Guide: 8 Roles → 5 Role Families

This document shows exactly what happens to each of your current 8 roles in the V2 architecture.

---

## Adult Student → LEARNER Family

### What Changes
- **Dashboard:** Uses `learner-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Learner family navigation
- **Billing Access:** Retains full billing access via `billing:view` permission

### What Stays the Same
- All existing pages remain accessible
- Practice, Progress, Calendar, Messages work identically
- Same "Next Lesson" cards and practice tracking

### Technical Changes
```typescript
// BEFORE
role: 'adult-student'

// AFTER
role: 'adult-student'
roleFamily: 'learner'
permissions: [
  'billing:view',
  'billing:manage',
  'messages:send_teacher',
  'lessons:view_own',
  'practice:track',
  'progress:view_own'
]
```

### UI Differences
- ✅ **Dashboard:** Simplified with reusable widgets (looks better, same functionality)
- ✅ **Messages:** Unified interface (filters show only teachers, same UX)
- ✅ **Calendar:** Same calendar, cleaner code
- ✅ **Billing:** Keeps adult-only billing access (child students don't see this)

---

## Child Student → LEARNER Family

### What Changes
- **Dashboard:** Uses `learner-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Learner family navigation
- **Billing Access:** REMOVED (child students shouldn't manage billing)

### What Stays the Same
- Simplified UI appropriate for children
- Practice gamification with XP/streaks
- View-only access to lessons and progress

### Technical Changes
```typescript
// BEFORE
role: 'child-student'

// AFTER
role: 'child-student'
roleFamily: 'learner'
permissions: [
  'messages:send_teacher',
  'lessons:view_own',
  'practice:track',
  'progress:view_own'
  // NO billing permissions
]
```

### UI Differences
- ✅ **Dashboard:** Same simplified, fun interface
- ✅ **Navigation:** Billing tab hidden automatically (permission gate)
- ✅ **Teachers Tab:** Hidden (not in current child navigation, stays that way)
- ✅ **Messages:** Simplified contacts (only assigned teacher)

### Parent Visibility
Child account can still be managed by parent through Household family view.

---

## Parent / Guardian → HOUSEHOLD Family

### What Changes
- **Dashboard:** Uses `household-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Household family navigation
- **Single Child Focus:** No functional difference from Family role anymore

### What Stays the Same
- View all child's lessons on calendar
- Manage child's practice and progress
- Pay bills for household
- Message child's teachers

### Technical Changes
```typescript
// BEFORE
role: 'parent'

// AFTER
role: 'parent'
roleFamily: 'household'
permissions: [
  'billing:view',
  'billing:manage',
  'students:view_household',
  'lessons:view_household',
  'lessons:schedule',
  'messages:send_teacher',
  'practice:view_household',
  'progress:view_household'
]
```

### UI Differences
- ✅ **Dashboard:** Shows all children's upcoming lessons (even if only 1 child)
- ✅ **Students Tab:** NEW - Lists children in household (easier than navigating)
- ✅ **Progress:** Can switch between children (if more are added later)
- ✅ **Calendar:** View all household lessons in one place

### Why This Is Better
Previously, Parent and Family roles had duplicate code for identical functionality. Now they share the same UI, and the backend query determines "how many children" to show.

---

## Family / Multi-Student → HOUSEHOLD Family

### What Changes
- **Dashboard:** Uses `household-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Household family navigation
- **Multi-Child UI:** Same as Parent role (but optimized for multiple students)

### What Stays the Same
- Multi-student selector in Progress, Practice views
- Aggregated billing for all children
- View all children's schedules in unified calendar

### Technical Changes
```typescript
// BEFORE
role: 'family'

// AFTER
role: 'family'
roleFamily: 'household'
permissions: [
  // IDENTICAL to 'parent' permissions
  'billing:view',
  'billing:manage',
  'students:view_household',
  'lessons:view_household',
  'lessons:schedule',
  'messages:send_teacher',
  'practice:view_household',
  'progress:view_household'
]
```

### UI Differences
- ✅ **Dashboard:** Shows all children's lessons (same as before, cleaner code)
- ✅ **Students Tab:** NEW - Quick selector for each child
- ✅ **Progress:** Multi-child selector (same as before)
- ✅ **Billing:** Aggregated household billing (same as before)

### Why This Is Better
Your current `parent-dashboard.tsx` and `family-dashboard.tsx` had 90% duplicate code. Now they use the same component, and the UI automatically adapts based on how many students are in the household.

---

## Teacher → INSTRUCTOR Family

### What Changes
- **Dashboard:** Uses `instructor-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Instructor family navigation
- **Team/Reports Tabs:** Hidden (Teacher Manager only)

### What Stays the Same
- Calendar with teaching schedule
- Student roster
- Lesson notes and practice assignment
- Payout tracking

### Technical Changes
```typescript
// BEFORE
role: 'teacher'

// AFTER
role: 'teacher'
roleFamily: 'instructor'
permissions: [
  'students:view_assigned',
  'lessons:view_assigned',
  'lessons:mark_complete',
  'assignments:create',
  'assignments:grade',
  'messages:send_student',
  'messages:send_parent',
  'payouts:view_own',
  'practice:view_assigned'
]
```

### UI Differences
- ✅ **Dashboard:** Same layout, better widgets
- ✅ **Navigation:** Team & Reports tabs automatically hidden (permission gates)
- ✅ **Students:** View only assigned students (same as before)
- ✅ **Calendar:** Schedule + Requests tabs (same as before)

### Upgrade Path
If a teacher is promoted to Teacher Manager, simply change their role to `teacher-manager` and they automatically get Team/Reports tabs without UI changes.

---

## Teacher Manager → INSTRUCTOR Family

### What Changes
- **Dashboard:** Uses `instructor-dashboard.tsx` (new consolidated version)
- **Navigation:** Inherits from Instructor family navigation
- **Team/Reports Tabs:** VISIBLE (permission-gated)

### What Stays the Same
- Everything a regular teacher has
- PLUS: Team management, reports, coverage oversight

### Technical Changes
```typescript
// BEFORE
role: 'teacher-manager'

// AFTER
role: 'teacher-manager'
roleFamily: 'instructor'
permissions: [
  // All teacher permissions
  'students:view_assigned',
  'lessons:view_assigned',
  'lessons:mark_complete',
  'assignments:create',
  'assignments:grade',
  'messages:send_student',
  'messages:send_parent',
  'payouts:view_own',
  'practice:view_assigned',
  // PLUS manager permissions
  'team:manage',
  'team:view_all',
  'reports:view',
  'lessons:view_team',
  'coverage:manage'
]
```

### UI Differences
- ✅ **Dashboard:** Same as teacher, plus team performance widgets
- ✅ **Navigation:** Team & Reports tabs visible (permission-gated)
- ✅ **Calendar:** Team Schedules tab visible (additional tab)
- ✅ **Students:** Can view team's students (not just own)

### Why This Is Better
Instead of two completely separate dashboards, Teacher and Teacher Manager now share the same foundation with additional modules added for managers. This means:
- Less code duplication
- Easier to add features (add once, benefits both)
- Consistent UX when promoted

---

## Admin → OPERATIONS Family

### What Changes
- **Dashboard:** Uses `operations-dashboard.tsx` (renamed from `general-admin-dashboard.tsx`)
- **Navigation:** Inherits from Operations family navigation
- **Focus:** Operational control center (no change in functionality)

### What Stays the Same
- All current admin features
- User management, scheduling, billing ops, support
- Full system access

### Technical Changes
```typescript
// BEFORE
role: 'admin'

// AFTER
role: 'admin'
roleFamily: 'operations'
permissions: [
  // Full operational permissions
  'users:manage',
  'users:create',
  'users:delete',
  'billing:view_all',
  'billing:manage_all',
  'lessons:view_all',
  'lessons:schedule_any',
  'lessons:approve',
  'payouts:manage_all',
  'messages:broadcast',
  'operations:configure',
  'reports:view',
  'support:manage'
]
```

### UI Differences
- ✅ **Dashboard:** Same operational metrics, better widget organization
- ✅ **Users Tab:** Operational user management (same as current AdminUsersView)
- ✅ **Operations Tab:** Mission control configuration (same as current)
- ✅ **Reports Tab:** Operational efficiency focus (same as current)

### Why This Is Better
Admin role is already well-defined. The main improvements are:
- Better organized dashboard widgets
- Clearer permission definitions
- Easier to delegate specific admin tasks with granular permissions

---

## Executive → LEADERSHIP Family

### What Changes
- **Dashboard:** Uses `leadership-dashboard.tsx` (renamed from `organization-dashboard.tsx`)
- **Navigation:** Inherits from Leadership family navigation
- **Focus:** Strategic oversight (no change in functionality)

### What Stays the Same
- High-level KPIs and growth metrics
- Organization-wide visibility
- Strategic reporting

### Technical Changes
```typescript
// BEFORE
role: 'executive'

// AFTER
role: 'executive'
roleFamily: 'leadership'
permissions: [
  // Strategic permissions (read-heavy, not operational)
  'users:view_all',
  'billing:view_all',
  'lessons:view_all',
  'payouts:view_all',
  'payouts:approve',
  'messages:broadcast',
  'operations:view',
  'reports:view',
  'reports:export',
  'analytics:view_all',
  'team:view_all'
  // NOTE: No users:manage, operations:configure (that's Admin's job)
]
```

### UI Differences
- ✅ **Dashboard:** Strategic KPIs, cleaner metric cards
- ✅ **Users Tab:** Strategic user insights (different from Admin's operational view)
- ✅ **Operations Tab:** Strategic oversight (different from Admin's configuration view)
- ✅ **Reports Tab:** Strategic performance focus (different from Admin/TM reports)

### Why This Is Better
Executive role is already well-separated. The improvements:
- Clearer distinction between Operations (Admin) and Leadership (Executive)
- Admin = operational control, Executive = strategic insight
- Both can see the same data, but different views/actions

---

## Summary Table

| Current Role | V2 Role Family | Dashboard File | Key Permissions | Navigation Changes |
|--------------|----------------|----------------|-----------------|-------------------|
| Adult Student | LEARNER | `learner-dashboard.tsx` | billing:view | None (same tabs) |
| Child Student | LEARNER | `learner-dashboard.tsx` | (no billing) | Billing tab hidden |
| Parent | HOUSEHOLD | `household-dashboard.tsx` | students:view_household | Students tab added |
| Family | HOUSEHOLD | `household-dashboard.tsx` | students:view_household | Students tab added |
| Teacher | INSTRUCTOR | `instructor-dashboard.tsx` | students:view_assigned | Team/Reports hidden |
| Teacher Manager | INSTRUCTOR | `instructor-dashboard.tsx` | +team:manage | Team/Reports visible |
| Admin | OPERATIONS | `operations-dashboard.tsx` | users:manage | None (same tabs) |
| Executive | LEADERSHIP | `leadership-dashboard.tsx` | (read-only oversight) | None (same tabs) |

---

## Migration Checklist

### For Each Role:

#### ✅ Adult Student
- [ ] Test Practice page gamification
- [ ] Verify billing access works
- [ ] Check teacher messaging
- [ ] Validate progress tracking

#### ✅ Child Student
- [ ] Test simplified dashboard
- [ ] Verify billing is hidden
- [ ] Check parental controls
- [ ] Validate practice fun UI

#### ✅ Parent
- [ ] Test single-child view
- [ ] Verify household billing
- [ ] Check child progress tracking
- [ ] Test new Students tab

#### ✅ Family
- [ ] Test multi-child selector
- [ ] Verify aggregated billing
- [ ] Check all children's schedules
- [ ] Test new Students tab

#### ✅ Teacher
- [ ] Test student roster
- [ ] Verify lesson notes
- [ ] Check practice assignments
- [ ] Validate payout tracking
- [ ] Confirm Team/Reports hidden

#### ✅ Teacher Manager
- [ ] Test all teacher features
- [ ] Verify Team tab visible
- [ ] Check Reports access
- [ ] Test team schedules view

#### ✅ Admin
- [ ] Test user management
- [ ] Verify operations config
- [ ] Check billing oversight
- [ ] Test payout management

#### ✅ Executive
- [ ] Test strategic dashboard
- [ ] Verify KPI metrics
- [ ] Check reports access
- [ ] Validate org overview

---

## Rollback Plan

If issues arise during migration:

1. **Feature Flag:** Toggle `useV2Architecture` to false
2. **Reverts to:** Original 8-role system
3. **Data Safe:** All data compatible with both systems
4. **Zero Downtime:** Seamless switch

---

## Questions?

**Q: Will my Adult Student users see any difference?**  
A: Minimal visual differences, same functionality. Cleaner, more consistent UI.

**Q: What happens to existing user data?**  
A: No data migration needed. Role names stay the same, only internal routing changes.

**Q: Can we roll this out role-by-role?**  
A: Yes! Use feature flags to enable V2 for one role family at a time.

**Q: What if we want to add a 9th role later?**  
A: Much easier! Map it to a role family, assign permissions, done. No need to duplicate components.

**Q: Will this break our existing users?**  
A: No. Role names unchanged, navigation unchanged, functionality unchanged. Just cleaner code behind the scenes.
