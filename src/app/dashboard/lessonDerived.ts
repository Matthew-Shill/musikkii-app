import type { DashboardLessonRow } from './lessonTypes';

export function lessonDurationMinutes(row: Pick<DashboardLessonRow, 'starts_at' | 'ends_at'>): number {
  const ms = new Date(row.ends_at).getTime() - new Date(row.starts_at).getTime();
  return Math.max(1, Math.round(ms / 60000));
}

export function isSameLocalDay(iso: string, ref: Date = new Date()): boolean {
  return new Date(iso).toDateString() === ref.toDateString();
}

/** Lesson still in play or in the future (not ended). */
export function isLessonStillOpen(row: Pick<DashboardLessonRow, 'ends_at'>): boolean {
  return new Date(row.ends_at).getTime() >= Date.now();
}

export function isActiveScheduleStatus(status: string): boolean {
  return !['cancelled', 'completed', 'no_show'].includes(status);
}

export function filterUpcomingOpenLessons(rows: DashboardLessonRow[]): DashboardLessonRow[] {
  return rows.filter((r) => isActiveScheduleStatus(r.status) && isLessonStillOpen(r));
}

export function filterTodayLessons(rows: DashboardLessonRow[], ref: Date = new Date()): DashboardLessonRow[] {
  return rows.filter((r) => isSameLocalDay(r.starts_at, ref));
}

export function lessonsStartingInMonth(rows: Pick<DashboardLessonRow, 'starts_at'>[], ref: Date = new Date()): number {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  return rows.filter((r) => {
    const d = new Date(r.starts_at);
    return d.getFullYear() === y && d.getMonth() === m;
  }).length;
}

export function modalityLabel(modality: string): string {
  return modality === 'virtual' ? 'Virtual' : 'In-Person';
}

export function lessonPrimaryLabel(row: DashboardLessonRow): string {
  return row.subject?.trim() ? row.subject.trim() : 'Music lesson';
}

export function lessonTeacherDisplayName(row: Pick<DashboardLessonRow, 'teacher_display_name'>): string {
  const t = row.teacher_display_name?.trim();
  return t || 'Teacher';
}

export function lessonStudentDisplayLabel(row: Pick<DashboardLessonRow, 'student_display_name'>): string | null {
  const s = row.student_display_name?.trim();
  return s || null;
}

/** Avatar initials: prefer resolved teacher name, else lesson title. */
export function lessonAvatarInitialsSource(row: DashboardLessonRow): string {
  const t = row.teacher_display_name?.trim();
  if (t) return t;
  return lessonPrimaryLabel(row);
}

/** One-line caption when at least one of teacher/student names resolved (no bare "Teacher" only). */
export function lessonPeopleCaption(row: DashboardLessonRow): string | null {
  const parts: string[] = [];
  const t = row.teacher_display_name?.trim();
  const s = row.student_display_name?.trim();
  if (t) parts.push(t);
  if (s) parts.push(s);
  return parts.length ? parts.join(' · ') : null;
}

/** Monday 00:00 local for the calendar week containing `d`. */
export function startOfWeekMonday(d: Date): Date {
  const x = new Date(d);
  const day = x.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  x.setDate(x.getDate() + diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Whole-day offset from `weekStartMonday` (Monday 00:00) to `lessonStart` in local calendar days (0–6 in-week). */
export function calendarDayIndexFromWeekStart(weekStartMonday: Date, lessonStart: Date): number {
  const a = Date.UTC(weekStartMonday.getFullYear(), weekStartMonday.getMonth(), weekStartMonday.getDate());
  const b = Date.UTC(lessonStart.getFullYear(), lessonStart.getMonth(), lessonStart.getDate());
  return Math.round((b - a) / 86400000);
}

/** Lessons that are not in {@link filterUpcomingOpenLessons} (past/closed or inactive status), newest first. */
export function filterHistoryLessons(rows: DashboardLessonRow[]): DashboardLessonRow[] {
  const upcomingIds = new Set(filterUpcomingOpenLessons(rows).map((r) => r.id));
  return rows
    .filter((r) => !upcomingIds.has(r.id))
    .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime());
}

/** True if `iso` falls in the same Monday-based calendar week as `ref` (local time). */
export function isInCalendarWeek(iso: string, ref: Date = new Date()): boolean {
  return startOfWeekMonday(new Date(iso)).getTime() === startOfWeekMonday(ref).getTime();
}
