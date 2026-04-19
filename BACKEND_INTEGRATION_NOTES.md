# Backend Integration Notes for Cursor

## Overview

This document provides specific guidance for integrating Musikkii's frontend with a real backend. The current app is a fully-functional frontend prototype with typed mock data. Backend integration should replace the mock data layer with real API calls while preserving the UI and UX.

---

## Integration Strategy

### Phase 1: Authentication & Role Context

**Priority**: Critical foundation

**Current State**:
- `src/app/context/RoleContext.tsx` provides mock role switching
- No real auth, sessions, or token management

**Backend Integration**:
1. Implement real authentication (e.g., Supabase Auth, Auth0, custom JWT)
2. Replace mock `currentUser` with authenticated session
3. Fetch user profile with role/roleFamily on login
4. Protect routes based on real permissions
5. Keep RoleContext for role-based UI logic

**API Endpoints Needed**:
```
POST   /auth/login
POST   /auth/logout
POST   /auth/signup
GET    /auth/session
GET    /users/me
```

**Frontend Changes**:
- Update `RoleContext` to use real auth state
- Add token storage (localStorage/cookies)
- Add token refresh logic
- Add protected route wrapper

---

### Phase 2: Dashboard Data

**Priority**: High (first visible page)

**Current State**:
- Each role family has a dashboard pulling from `mockData.ts`
- Dashboards show: upcoming lessons, assignments, practice stats, billing summaries

**Backend Integration**:
1. Create dashboard API endpoint that returns role-specific data
2. Replace mock imports with API calls using React Query or similar
3. Handle loading/error states
4. Cache dashboard data with reasonable TTL

**API Endpoints Needed**:
```
GET    /dashboard?roleFamily={family}
  Returns:
  - upcomingLessons: Lesson[]
  - recentActivity: Activity[]
  - assignments?: Assignment[]
  - practiceStats?: PracticeStats
  - billingSummary?: BillingSummary
  - teacherInsights?: TeacherStats
  - orgMetrics?: OrgMetrics
```

**Frontend Changes**:
- Create `src/app/api/dashboard.ts` repository
- Update dashboard components to use API data
- Add loading skeletons
- Add error boundaries

---

### Phase 3: Calendar & Lessons

**Priority**: High (core scheduling)

**Current State**:
- `mockLessons` array with static data
- Lesson actions (confirm, reschedule, NML) are stubbed
- No real availability or booking logic

**Backend Integration**:
1. Implement lesson CRUD operations
2. Add lesson action endpoints (confirm, reschedule, cancel, NML)
3. Handle lesson state transitions (scheduled → confirmed → completed)
4. Store lesson recordings and notes
5. Implement availability/booking logic

**API Endpoints Needed**:
```
GET    /lessons?userId={id}&startDate={date}&endDate={date}
GET    /lessons/{id}
POST   /lessons
PATCH  /lessons/{id}
DELETE /lessons/{id}
POST   /lessons/{id}/confirm
POST   /lessons/{id}/reschedule
POST   /lessons/{id}/cancel
POST   /lessons/{id}/request-nml
GET    /lessons/{id}/recording
GET    /lessons/{id}/notes
PUT    /lessons/{id}/notes
```

**Frontend Changes**:
- Create `src/app/api/lessons.ts` repository
- Update calendar components to fetch real lessons
- Implement action handlers with API calls
- Add optimistic updates for better UX
- Handle action availability based on server response

**Key Types to Align**:
- Lesson
- LessonStatus
- AttendanceState
- LessonActionAvailability

---

### Phase 4: Practice & Assignments

**Priority**: High (core product differentiator)

**Current State**:
- `mockAssignments` array
- Practice timer creates mock sessions
- Assignment state changes are local only
- NoteCheck and recording submission are simulated

**Backend Integration**:
1. Implement assignment CRUD (teacher creates, student views)
2. Add assignment state update endpoint
3. Implement practice session logging
4. Build NoteCheck backend (audio analysis or teacher grading queue)
5. Implement recording upload and storage
6. Track XP and stars server-side

**API Endpoints Needed**:
```
GET    /assignments?studentId={id}
GET    /assignments/{id}
POST   /assignments
PATCH  /assignments/{id}
PATCH  /assignments/{id}/state
POST   /assignments/{id}/notecheck
POST   /assignments/{id}/recording
GET    /practice-sessions?studentId={id}
POST   /practice-sessions
PATCH  /practice-sessions/{id}
```

**Frontend Changes**:
- Create `src/app/api/assignments.ts` and `src/app/api/practice.ts`
- Update Practice page to log sessions via API
- Update assignment modals to submit to backend
- Handle NoteCheck async results (if processing takes time)
- Stream or poll for NoteCheck feedback

**Key Types to Align**:
- Assignment
- AssignmentState
- AssignmentProgress
- PracticeSession
- NoteCheckAttempt

**Special Considerations**:
- **NoteCheck**: May require separate microservice for audio analysis
- **Recording uploads**: Use presigned URLs or direct cloud storage upload
- **Practice validation**: Backend should validate practice time isn't inflated

---

### Phase 5: Gamification & Progress

**Priority**: Medium-High (drives engagement)

**Current State**:
- XP, stars, streaks, leagues all calculated client-side
- Mock league standings
- No actual progression logic

**Backend Integration**:
1. Implement XP event logging and aggregation
2. Build streak tracking with freeze logic
3. Implement weekly league system with promotion/demotion
4. Calculate and store star totals
5. Award achievements server-side
6. Create progress/growth analytics endpoints

**API Endpoints Needed**:
```
GET    /gamification/xp?userId={id}
GET    /gamification/streak?userId={id}
POST   /gamification/streak/freeze
GET    /gamification/league?userId={id}
GET    /gamification/league/{leagueName}/standings
GET    /gamification/achievements?userId={id}
POST   /gamification/achievements/{id}/claim
GET    /progress/growth?studentId={id}
```

**Frontend Changes**:
- Create `src/app/api/gamification.ts`
- Fetch real streak/XP data on Progress page load
- Show real league standings
- Handle weekly league resets gracefully
- Display unlocked achievements

**Key Types to Align**:
- XPEvent
- StreakState
- LeagueStanding
- Achievement

**Special Considerations**:
- **Weekly league reset**: Needs cron job, handle timezone correctly
- **Streak freeze**: Only allow if user has freezes available
- **XP validation**: Backend must prevent XP inflation exploits
- **League promotion**: Top 10 promote, bottom 10 demote each week

---

### Phase 6: Messages

**Priority**: Medium (already unified across roles)

**Current State**:
- `mockMessageThreads` and `mockMessages`
- Unified messaging UI works across all roles
- Category filtering implemented

**Backend Integration**:
1. Implement thread and message CRUD
2. Add real-time message delivery (WebSocket/polling)
3. Handle read/unread state
4. Implement category-based filtering
5. Add message notifications

**API Endpoints Needed**:
```
GET    /messages/threads?userId={id}&category={category}
GET    /messages/threads/{id}
POST   /messages/threads
POST   /messages/threads/{id}/messages
PATCH  /messages/{id}/read
```

**Frontend Changes**:
- Create `src/app/api/messages.ts`
- Add WebSocket connection or polling for new messages
- Update unread counts in real-time
- Handle message send with optimistic updates

**Key Types to Align**:
- MessageThread
- Message
- MessageCategory

---

### Phase 7: Billing & Payouts

**Priority**: Medium (business operations)

**Current State**:
- `mockInvoices` and `mockPayouts`
- Static billing summaries
- No real payment processing

**Backend Integration**:
1. Integrate payment processor (Stripe, etc.)
2. Implement invoice generation
3. Add payment method management
4. Build payout calculation and distribution
5. Handle failed payments and retries

**API Endpoints Needed**:
```
GET    /billing/account?userId={id}
GET    /billing/invoices?accountId={id}
GET    /billing/invoices/{id}/download
POST   /billing/payment-method
PATCH  /billing/payment-method
GET    /payouts?teacherId={id}
GET    /payouts/{id}
```

**Frontend Changes**:
- Create `src/app/api/billing.ts` and `src/app/api/payouts.ts`
- Integrate Stripe Elements or similar for payment input
- Show real invoice history
- Display payout schedule and history

**Key Types to Align**:
- BillingAccount
- Invoice
- Subscription
- Payout

---

### Phase 8: Students & Teachers Management

**Priority**: Medium (household/instructor/ops use)

**Current State**:
- Limited student/teacher list views
- No real relationship management

**Backend Integration**:
1. Implement student roster endpoints
2. Add teacher directory
3. Build student-teacher assignment logic
4. Handle household student management
5. Create admin user management tools

**API Endpoints Needed**:
```
GET    /students?householdId={id}
GET    /students?teacherId={id}
GET    /students/{id}
PATCH  /students/{id}
GET    /teachers
GET    /teachers/{id}
POST   /teachers/{id}/students/{studentId}
DELETE /teachers/{id}/students/{studentId}
```

**Frontend Changes**:
- Create `src/app/api/students.ts` and `src/app/api/teachers.ts`
- Update Students page with real data
- Implement student-teacher relationship management
- Add household student addition/removal

**Key Types to Align**:
- Student
- Teacher
- Household

---

### Phase 9: Resources

**Priority**: Low (supportive feature)

**Current State**:
- Placeholder resource library
- No real file management

**Backend Integration**:
1. Implement file upload and storage
2. Add resource metadata and tagging
3. Build resource search/filter
4. Handle permissions (role-based resource access)

**API Endpoints Needed**:
```
GET    /resources?category={cat}&tags={tags}
GET    /resources/{id}
POST   /resources
DELETE /resources/{id}
POST   /resources/{id}/upload-url
```

**Frontend Changes**:
- Create `src/app/api/resources.ts`
- Add file upload UI
- Implement resource browser with filters

---

### Phase 10: Settings & Preferences

**Priority**: Low (nice-to-have)

**Current State**:
- Mock settings pages per role family
- No persistence

**Backend Integration**:
1. Add user preferences storage
2. Implement notification preferences
3. Handle profile updates
4. Store lesson preferences per user

**API Endpoints Needed**:
```
GET    /users/{id}/preferences
PATCH  /users/{id}/preferences
PATCH  /users/{id}/profile
PATCH  /users/{id}/password
```

---

## Technical Recommendations

### State Management
- Use **React Query** or **SWR** for server state
- Keep role/auth in React Context
- Use local state for UI-only concerns
- Avoid Redux unless needed for complex cross-component flows

### API Layer Organization
```
src/app/api/
├── client.ts          # Axios/fetch wrapper with auth headers
├── auth.ts            # Auth endpoints
├── dashboard.ts       # Dashboard data
├── lessons.ts         # Lesson CRUD and actions
├── assignments.ts     # Assignment CRUD
├── practice.ts        # Practice sessions
├── gamification.ts    # XP, streaks, leagues, achievements
├── messages.ts        # Messaging
├── billing.ts         # Billing and invoices
├── payouts.ts         # Teacher payouts
├── students.ts        # Student management
├── teachers.ts        # Teacher directory
└── resources.ts       # Resource library
```

### Error Handling
- Use consistent error response format from backend
- Show user-friendly error messages in UI
- Log errors to monitoring service (Sentry, LogRocket, etc.)
- Implement retry logic for transient failures

### Loading States
- Add skeleton loaders for data-heavy pages
- Use optimistic updates for fast perceived performance
- Show inline loading for actions (confirm lesson, submit assignment)

### Caching Strategy
- Cache dashboard data: 1-5 minutes
- Cache user profile: 30 minutes
- Invalidate on mutations (new lesson → refetch calendar)
- Use React Query's background refetch for fresh data

### Real-Time Features
- **Messages**: WebSocket or long polling for new messages
- **Lesson updates**: Polling or SSE for lesson confirmations
- **Streak countdown**: Client-side only, no real-time needed
- **League standings**: Update every 15-30 minutes, not real-time

---

## Migration Path

### Step 1: Set up API client
Create `src/app/api/client.ts` with auth token injection.

### Step 2: Add React Query
Install and configure React Query with proper defaults.

### Step 3: Replace one page at a time
Start with Dashboard, then Calendar, then Practice/Progress, etc.

### Step 4: Remove mock data imports
Once a page uses real API, delete its mock data imports.

### Step 5: Clean up mockData.ts
Eventually remove `mockData.ts` entirely when all pages are integrated.

---

## Testing During Integration

### Keep Mock Mode
Add environment flag to toggle between mock and real API:
```typescript
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

export function getLessons() {
  if (USE_MOCK_DATA) return Promise.resolve(mockLessons);
  return apiClient.get('/lessons');
}
```

### Gradual Rollout
- Develop against mock data locally
- Switch to real API in dev environment
- Test thoroughly before production

---

## Data Validation

### Frontend Validation
Current UI has basic form validation. Strengthen this during integration:
- Validate all user inputs before API calls
- Use zod or yup for schema validation matching backend

### Backend Validation
Backend must validate:
- XP amounts (prevent inflation)
- Practice session durations (prevent fake data)
- Assignment state transitions (enforce workflow)
- Lesson action permissions (who can confirm/reschedule)

---

## Key Integration Points Summary

| Area | Current Mock | Backend Priority | Complexity |
|------|--------------|------------------|------------|
| Auth & Roles | RoleContext mock | P0 (Critical) | Medium |
| Dashboard | mockData.ts | P0 (High visibility) | Low |
| Calendar/Lessons | mockLessons | P1 (Core feature) | Medium |
| Practice/Assignments | mockAssignments | P1 (Core feature) | High |
| Gamification | Client-side calc | P1 (Differentiator) | High |
| Messages | mockMessages | P2 (Important) | Medium |
| Billing | mockInvoices | P2 (Business) | Medium |
| Payouts | mockPayouts | P2 (Business) | Medium |
| Students/Teachers | Limited mocks | P2 (Management) | Low |
| Resources | Placeholder | P3 (Supportive) | Low |
| Settings | No persistence | P3 (Nice-to-have) | Low |

---

## Final Notes

- The frontend is intentionally over-typed and structured for easy backend integration
- Mock data in `mockData.ts` serves as API response examples
- Domain types in `domain.ts` should guide backend schema design
- Route guards and permission checks exist but need real auth backing
- Focus on Dashboard → Lessons → Practice for initial backend integration
- Gamification backend is complex; consider it a separate workstream

Musikkii's frontend is ready. The integration path is clear. Start with auth, then dashboard, then core scheduling and practice flows.
