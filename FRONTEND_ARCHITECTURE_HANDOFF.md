# Musikkii Frontend Architecture Handoff

## Overview

This document describes the frontend architecture of the Musikkii prototype and how it's organized for backend integration in Cursor.

## 5 Role Families

The application is organized around 5 role families, not individual roles:

### 1. **Learner** (adult-student, child-student)
- **Pages**: Dashboard, Calendar, Practice, Progress, Messages, Resources, Billing, Settings
- **Focus**: Individual learning experience, practice tracking, personal progress

### 2. **Household** (parent, family)
- **Pages**: Dashboard, Calendar, Students, Progress, Messages, Resources, Billing, Settings
- **Focus**: Multi-student management, family-wide views, billing oversight

### 3. **Instructor** (teacher, teacher-manager)
- **Pages**: Dashboard, Calendar, Students, Practice Insights, Messages, Resources, Payouts, Settings
- **Focus**: Teaching, student progress tracking, payouts

### 4. **Operations** (admin)
- **Pages**: Dashboard, Calendar, Students, Teachers, Messages, Resources, Billing, Payouts, Settings
- **Focus**: Platform operations, user management, billing/payout oversight

### 5. **Leadership** (executive)
- **Pages**: Dashboard, Calendar, Students, Teachers, Messages, Resources, Billing, Payouts, Analytics, Settings
- **Focus**: Strategic oversight, org-wide metrics, business intelligence

## Route Structure

Routes are family-agnostic. The same route (e.g., `/calendar`) renders different variants based on the user's role family.

### Core Routes
```
/                  → Dashboard (family variant)
/calendar          → Calendar (family variant)
/messages          → Messages (unified across all)
/resources         → Resources (family variant)
/practice          → Practice (learner only)
/practice-insights → Practice Insights (instructor only)
/progress          → Progress (learner & household)
/students          → Students (household & instructor & operations)
/teachers          → Teachers (operations & leadership)
/billing           → Billing (learner & household & operations & leadership)
/payouts           → Payouts (instructor & operations & leadership)
/settings          → Settings (all families)
```

### Route Guards

Pages check role family and either:
1. Render the appropriate variant
2. Show an access-restricted state
3. Redirect to the role's dashboard

**Never silently fall back to unrelated content.**

## Key Directories

```
src/app/
├── components/
│   ├── pages/           # Main page components by route
│   ├── shared/          # Reusable components
│   └── ui/              # Base UI components
├── context/             # React context (role, permissions)
├── types/
│   └── domain.ts        # Central type definitions
├── data/
│   └── mockData.ts      # Mock data layer
├── config/
│   └── role-config.ts   # Role family configuration
└── hooks/               # Custom React hooks
```

## Shared vs. Role-Specific Components

### Shared Components (used across families)
- **Navigation** (`components/layout.tsx`)
- **Messages** (unified messaging system)
- **Calendar event modals**
- **Practice tools** (metronome, tuner, etc.)
- **Streak widgets**
- **Assignment cards**

### Family-Specific Components
- **Dashboard widgets** - configured per family
- **Calendar views** - show different actions/data
- **Progress views** - learner/household only
- **Practice Insights** - instructor only

## Navigation Configuration

Navigation is defined in `src/app/config/role-config.ts` per role family.

Each family has:
- Navigation items
- Icons
- Permissions
- Routes

The layout component filters navigation based on:
1. Role family
2. Permissions
3. Feature availability

## Component Patterns

### Page Components

Each major page should:
1. Check the user's role family
2. Render the appropriate variant or show access-denied
3. Use typed mock data from `src/app/data/mockData.ts`
4. Define clear action handlers (stubs for now)

Example:
```tsx
export function CalendarPage() {
  const { role, roleFamily } = useRole();

  if (roleFamily === 'learner') {
    return <LearnerCalendarView />;
  }
  
  if (roleFamily === 'instructor') {
    return <InstructorCalendarView />;
  }

  // ... other families
}
```

### Data Flow (Current)

```
Mock Data (mockData.ts)
    ↓
Page Component
    ↓
Variant Component
    ↓
UI Components
```

### Data Flow (Future with Backend)

```
Backend API
    ↓
Data Repository/Service Layer
    ↓
Page Component
    ↓
Variant Component
    ↓
UI Components
```

## State Management

Currently using:
- **React Context** for role and permissions
- **Local component state** for UI interactions
- **Mock data imports** for display data

Future backend integration should:
- Keep React Context for auth/role
- Add React Query or similar for server state
- Replace mock imports with API calls in repository layer

## Styling

- **Tailwind CSS** for styling
- **Musikkii brand blue**: `#0331bd`
- Avoid generic Tailwind blue classes where brand identity matters
- Use gradients and shadows for premium feel
- Maintain Apple-like clean aesthetic

## Key Features to Preserve

### Practice & Gamification
- Practice timer
- XP (weekly competition)
- Stars (assignment mastery)
- Levels (long-term growth)
- Streaks (daily consistency)
- NoteCheck (auto-graded assignments)
- Practice tools (metronome, tuner, etc.)

### Calendar
- Lesson scheduling
- Confirm/reschedule actions
- NML (Never Miss a Lesson) requests
- Lesson recordings
- Lesson notes

### Messages
- Unified messaging across all roles
- Category filtering
- Thread-based conversations

## Next Steps for Backend Integration

See `BACKEND_INTEGRATION_NOTES.md` for specific integration guidance.
