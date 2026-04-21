import { useStudentsPageRoster, type StudentRosterRow } from './useStudentsPageRoster';

export type HouseholdStudentSummary = StudentRosterRow;

/**
 * Students visible to the current profile via RLS (`students_select_household` / self / teacher paths).
 * Same query path as the **Students** page household roster (`useStudentsPageRoster('household')`).
 */
export function useHouseholdDashboardStudents() {
  return useStudentsPageRoster('household');
}
