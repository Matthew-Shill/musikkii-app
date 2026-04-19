# Phase 1 Foundation - Testing Plan

**Status:** Ready for Testing  
**Date:** April 11, 2026

---

## Testing Objectives

1. ✅ Verify role family mapping works correctly
2. ✅ Verify permission system functions properly
3. ✅ Verify navigation adapts to role changes
4. ✅ Verify permission-gated tabs appear/disappear correctly
5. ✅ Verify no TypeScript errors or runtime errors
6. ✅ Verify mobile navigation works with new system

---

## Pre-Test Checklist

### Files Created ✅
- [x] `src/app/config/role-config.ts`
- [x] `src/app/config/permissions.ts`
- [x] `src/app/hooks/usePermissions.ts`
- [x] `src/app/components/shared/permission-gate.tsx`

### Files Modified ✅
- [x] `src/app/context/role-context.tsx`
- [x] `src/app/components/layout.tsx`

---

## Test Suite 1: Role Family Mapping

### Test 1.1: Adult Student → Learner Family
**Action:** Switch to Adult Student role  
**Expected:**
- `roleFamily` = 'learner'
- `roleFamilyLabel` = 'Learner'
- Navigation shows 9 tabs
- Teachers tab VISIBLE
- Billing tab VISIBLE

**Verification:**
```typescript
// In browser console:
// Expected output: "learner"
```

---

### Test 1.2: Child Student → Learner Family
**Action:** Switch to Child Student role  
**Expected:**
- `roleFamily` = 'learner'
- `roleFamilyLabel` = 'Learner'
- Navigation shows 7 tabs
- Teachers tab HIDDEN
- Billing tab HIDDEN

**Verification:**
- Count navigation items in sidebar
- Verify Teachers and Billing are not present

---

### Test 1.3: Parent → Household Family
**Action:** Switch to Parent role  
**Expected:**
- `roleFamily` = 'household'
- `roleFamilyLabel` = 'Household'
- Navigation shows 10 tabs
- Students tab VISIBLE (NEW)
- All tabs visible (no gates)

---

### Test 1.4: Family → Household Family
**Action:** Switch to Family role  
**Expected:**
- `roleFamily` = 'household'
- `roleFamilyLabel` = 'Household'
- Navigation shows 10 tabs (IDENTICAL to Parent)
- Students tab VISIBLE (NEW)
- All tabs visible (no gates)

**Critical Test:**
- Navigation between Parent and Family should be 100% identical
- No visual difference between these two roles

---

### Test 1.5: Teacher → Instructor Family
**Action:** Switch to Teacher role  
**Expected:**
- `roleFamily` = 'instructor'
- `roleFamilyLabel` = 'Instructor'
- Navigation shows 8 tabs
- Reports tab HIDDEN

---

### Test 1.6: Teacher Manager → Instructor Family
**Action:** Switch to Teacher Manager role  
**Expected:**
- `roleFamily` = 'instructor'
- `roleFamilyLabel` = 'Instructor'
- Navigation shows 9 tabs
- Reports tab VISIBLE

**Critical Test:**
- Only difference from Teacher should be Reports tab
- Everything else identical

---

### Test 1.7: Admin → Operations Family
**Action:** Switch to Admin role  
**Expected:**
- `roleFamily` = 'operations'
- `roleFamilyLabel` = 'Operations'
- Navigation shows 10 tabs
- All tabs visible (no gates)

---

### Test 1.8: Executive → Leadership Family
**Action:** Switch to Executive role  
**Expected:**
- `roleFamily` = 'leadership'
- `roleFamilyLabel` = 'Leadership'
- Navigation shows 8 tabs
- "Org Overview" instead of "Operations"

---

## Test Suite 2: Permission System

### Test 2.1: Permission Check - Billing (Adult Student)
**Action:** Switch to Adult Student, check permissions  
**Expected Permissions:**
- ✅ `billing:view` = true
- ✅ `billing:manage` = true
- ✅ `teachers:browse` = true
- ❌ `users:manage` = false
- ❌ `operations:configure` = false

**Test Method:**
Use browser console:
```javascript
// Should work if permissions hook is accessible
```

---

### Test 2.2: Permission Check - Billing (Child Student)
**Action:** Switch to Child Student, check permissions  
**Expected Permissions:**
- ❌ `billing:view` = false
- ❌ `billing:manage` = false
- ❌ `teachers:browse` = false
- ✅ `messages:send_teacher` = true
- ✅ `lessons:view_own` = true

---

### Test 2.3: Permission Check - Reports (Teacher vs Manager)
**Action:** Compare Teacher and Teacher Manager permissions  
**Expected:**

**Teacher:**
- ❌ `reports:view` = false
- ❌ `team:manage` = false

**Teacher Manager:**
- ✅ `reports:view` = true
- ✅ `team:manage` = true

---

### Test 2.4: Permission Check - Admin (Full Access)
**Action:** Switch to Admin role  
**Expected Permissions:**
- ✅ `users:manage` = true
- ✅ `users:create` = true
- ✅ `operations:configure` = true
- ✅ `billing:manage_all` = true
- ✅ `payouts:manage_all` = true

---

### Test 2.5: Permission Check - Executive (Read-Mostly)
**Action:** Switch to Executive role  
**Expected Permissions:**
- ✅ `users:view_all` = true
- ✅ `billing:view_all` = true
- ✅ `reports:view` = true
- ❌ `users:manage` = false (Admin only)
- ❌ `operations:configure` = false (Admin only)

---

## Test Suite 3: Navigation Behavior

### Test 3.1: Navigation Item Count by Role
**Action:** Switch between all 8 roles and count visible navigation items

**Expected Counts:**
```
Adult Student:    9 tabs
Child Student:    7 tabs  ← 2 fewer than Adult
Parent:          10 tabs
Family:          10 tabs  ← Same as Parent
Teacher:          8 tabs
Teacher Manager:  9 tabs  ← 1 more than Teacher
Admin:           10 tabs
Executive:        8 tabs
```

**Test Method:**
1. Switch to role
2. Count `<nav>` links in sidebar
3. Verify count matches expected

---

### Test 3.2: Active Navigation Highlighting
**Action:** Click different navigation items  
**Expected:**
- Active tab gets blue background (Musikkii blue)
- Active tab text turns white
- Only one tab active at a time
- Works correctly for all roles

---

### Test 3.3: Navigation Item Order
**Action:** Verify navigation items appear in correct order  
**Expected Order (Learner):**
1. Dashboard
2. Calendar
3. Practice
4. Progress
5. Messages
6. Resources
7. Teachers (if Adult)
8. Billing (if Adult)
9. Settings

---

## Test Suite 4: Permission-Gated Tabs

### Test 4.1: Teachers Tab (Learner Family)
**Action:** Switch between Adult and Child Student  
**Expected:**
- Adult Student: Teachers tab at position 7
- Child Student: Teachers tab NOT present
- No placeholder or disabled state
- Tab simply doesn't render

---

### Test 4.2: Billing Tab (Learner Family)
**Action:** Switch between Adult and Child Student  
**Expected:**
- Adult Student: Billing tab at position 8
- Child Student: Billing tab NOT present
- No console errors when hidden

---

### Test 4.3: Reports Tab (Instructor Family)
**Action:** Switch between Teacher and Teacher Manager  
**Expected:**
- Teacher: Reports tab NOT present
- Teacher Manager: Reports tab at position 7
- Smooth transition when switching roles

---

### Test 4.4: Students Tab (Household Family)
**Action:** Switch to Parent or Family role  
**Expected:**
- Students tab appears at position 2
- This is NEW functionality
- Tab should be present for both Parent and Family
- Clicking should navigate to /students

---

## Test Suite 5: Mobile Navigation

### Test 5.1: Mobile Menu Trigger
**Action:** Resize to mobile, open mobile menu  
**Expected:**
- Hamburger menu button appears
- Clicking opens sidebar overlay
- Navigation items filtered by permissions (same as desktop)
- Close button (X) works

---

### Test 5.2: Mobile Navigation - Child Student
**Action:** Switch to Child Student, open mobile menu  
**Expected:**
- 7 navigation items shown
- Teachers and Billing tabs NOT present
- Mobile menu scrollable if needed

---

### Test 5.3: Mobile Navigation - Adult Student
**Action:** Switch to Adult Student, open mobile menu  
**Expected:**
- 9 navigation items shown
- Teachers and Billing tabs PRESENT
- Same filtering logic as desktop

---

## Test Suite 6: Role Switching

### Test 6.1: Role Dropdown Functionality
**Action:** Click role selector in header  
**Expected:**
- Dropdown shows all 8 roles
- Current role highlighted with blue background
- Checkmark next to current role
- Clicking new role updates immediately

---

### Test 6.2: Navigation Updates on Role Change
**Action:** Switch from Child Student to Adult Student  
**Expected:**
- Navigation updates immediately
- Teachers tab appears
- Billing tab appears
- No page reload
- Smooth transition

---

### Test 6.3: Role Context Updates
**Action:** Switch roles and verify context  
**Expected:**
- `role` updates to new role
- `roleLabel` updates to new label
- `roleFamily` updates to correct family
- `roleFamilyLabel` updates to correct family name

---

## Test Suite 7: Error Handling

### Test 7.1: No Console Errors
**Action:** Open browser console, switch between all roles  
**Expected:**
- No TypeScript errors
- No React errors
- No permission-related errors
- No "undefined" errors

---

### Test 7.2: Invalid Permission Check
**Action:** Attempt to check non-existent permission  
**Expected:**
- TypeScript should prevent this at compile time
- If bypassed, should return false safely
- No runtime crashes

---

### Test 7.3: Missing Navigation Icon
**Action:** Verify all navigation items have icons  
**Expected:**
- Every navigation item renders an icon
- No broken icon references
- Icons imported correctly from lucide-react

---

## Test Suite 8: Integration Tests

### Test 8.1: Navigate Through All Pages
**Action:** For each role, click every navigation item  
**Expected:**
- All pages load without errors
- No 404 errors
- No broken routes
- Page content appropriate for role

---

### Test 8.2: Direct URL Access
**Action:** Navigate to URLs directly while in different roles  
**Expected:**
- `/billing` accessible for Adult Student
- `/billing` accessible for Parent/Family
- All valid routes work for appropriate roles

---

### Test 8.3: Browser Back/Forward
**Action:** Navigate pages, use browser back/forward  
**Expected:**
- Navigation highlights correct active tab
- Back/forward work correctly
- No navigation state issues

---

## Test Suite 9: Visual Regression

### Test 9.1: Desktop Layout - Before vs After
**Action:** Compare layout with old hardcoded navigation  
**Expected:**
- Layout identical
- Spacing identical
- Colors identical
- No visual regressions

---

### Test 9.2: Mobile Layout - Before vs After
**Action:** Compare mobile menu with old version  
**Expected:**
- Mobile menu looks identical
- Overlay behavior same
- Transitions same
- No visual regressions

---

## Test Suite 10: Performance

### Test 10.1: Role Switch Performance
**Action:** Switch roles rapidly  
**Expected:**
- Navigation updates < 100ms
- No lag or delay
- Smooth transitions
- No memory leaks

---

### Test 10.2: Initial Page Load
**Action:** Refresh page, measure load time  
**Expected:**
- Load time similar to before
- No performance regression
- Navigation renders quickly

---

## Critical Path Tests (MUST PASS)

### ✅ Critical Test 1: Child Student Cannot See Billing
**Why Critical:** Security/UX - children shouldn't access billing

**Test:**
1. Switch to Child Student
2. Check sidebar navigation
3. Verify Billing tab is NOT present
4. Try direct navigation to /billing
5. Should work but no navigation link visible

**Pass Criteria:** Billing tab completely absent from navigation

---

### ✅ Critical Test 2: Teacher Cannot See Reports
**Why Critical:** Permission boundary - only managers see reports

**Test:**
1. Switch to Teacher
2. Check sidebar navigation
3. Verify Reports tab is NOT present
4. Switch to Teacher Manager
5. Verify Reports tab IS present

**Pass Criteria:** Reports tab only visible for Teacher Manager

---

### ✅ Critical Test 3: Parent = Family Navigation
**Why Critical:** Code consolidation validation

**Test:**
1. Switch to Parent, screenshot navigation
2. Switch to Family, screenshot navigation
3. Compare screenshots

**Pass Criteria:** Navigation must be pixel-perfect identical

---

### ✅ Critical Test 4: Adult Student Shows All Learner Tabs
**Why Critical:** Baseline for learner family

**Test:**
1. Switch to Adult Student
2. Verify 9 tabs total
3. Verify Teachers tab present
4. Verify Billing tab present

**Pass Criteria:** All 9 tabs visible and functional

---

### ✅ Critical Test 5: No Console Errors
**Why Critical:** Code quality and stability

**Test:**
1. Open browser console
2. Switch through all 8 roles
3. Click every navigation item
4. Check console

**Pass Criteria:** Zero errors, zero warnings

---

## Test Execution Checklist

### Pre-Execution
- [ ] Open application in browser
- [ ] Open browser developer console
- [ ] Open React DevTools (if available)
- [ ] Clear browser cache
- [ ] Start from fresh page load

### Execute Tests
- [ ] Run Test Suite 1: Role Family Mapping (8 tests)
- [ ] Run Test Suite 2: Permission System (5 tests)
- [ ] Run Test Suite 3: Navigation Behavior (3 tests)
- [ ] Run Test Suite 4: Permission-Gated Tabs (4 tests)
- [ ] Run Test Suite 5: Mobile Navigation (3 tests)
- [ ] Run Test Suite 6: Role Switching (3 tests)
- [ ] Run Test Suite 7: Error Handling (3 tests)
- [ ] Run Test Suite 8: Integration Tests (3 tests)
- [ ] Run Test Suite 9: Visual Regression (2 tests)
- [ ] Run Test Suite 10: Performance (2 tests)

### Critical Path Tests
- [ ] Critical Test 1: Child Student Cannot See Billing
- [ ] Critical Test 2: Teacher Cannot See Reports
- [ ] Critical Test 3: Parent = Family Navigation
- [ ] Critical Test 4: Adult Student Shows All Learner Tabs
- [ ] Critical Test 5: No Console Errors

---

## Success Criteria

**Phase 1 Foundation passes if:**

✅ All Critical Path Tests pass  
✅ At least 95% of all other tests pass  
✅ No TypeScript compilation errors  
✅ No runtime JavaScript errors  
✅ Navigation correctly filtered for all 8 roles  
✅ Permission system functions correctly  
✅ Mobile navigation works  
✅ No visual regressions  
✅ No performance regressions  

---

## Known Limitations / Expected Behavior

### Expected Differences from Old System

1. **Navigation Order:** Some roles may have slightly different tab order due to role family consolidation
2. **Students Tab:** Parent and Family roles now have a "Students" tab (new feature)
3. **Practice Insights:** Instructor family shows "Practice Insights" instead of "Practice"

### Not Breaking Changes

- Page content and functionality unchanged
- Routing unchanged
- Existing components still work
- Only navigation filtering changed

---

## Bug Report Template

If any test fails, use this template:

```
### Bug Report

**Test:** [Test name and number]
**Role:** [User role being tested]
**Expected:** [What should happen]
**Actual:** [What actually happened]
**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Screenshots:** [If applicable]
**Console Errors:** [Copy/paste any errors]
**Severity:** [Critical / High / Medium / Low]
```

---

## Test Results Log

### Test Execution Date: _______________
### Tester: _______________
### Browser: _______________
### Environment: _______________

| Test Suite | Tests Passed | Tests Failed | Notes |
|------------|-------------|--------------|-------|
| 1. Role Family Mapping | __ / 8 | __ | |
| 2. Permission System | __ / 5 | __ | |
| 3. Navigation Behavior | __ / 3 | __ | |
| 4. Permission-Gated Tabs | __ / 4 | __ | |
| 5. Mobile Navigation | __ / 3 | __ | |
| 6. Role Switching | __ / 3 | __ | |
| 7. Error Handling | __ / 3 | __ | |
| 8. Integration Tests | __ / 3 | __ | |
| 9. Visual Regression | __ / 2 | __ | |
| 10. Performance | __ / 2 | __ | |
| **Critical Path** | __ / 5 | __ | |
| **TOTAL** | __ / 41 | __ | |

**Overall Status:** [ ] PASS / [ ] FAIL

**Decision:** 
- [ ] Proceed to Phase 2 (Dashboard Consolidation)
- [ ] Fix issues and re-test
- [ ] Rollback and revise approach

---

**Ready for Testing** ✅

All tests can now be executed in the browser preview.
