import type { Lesson } from '@/app/types/domain';
import type { DashboardLessonRow } from './lessonTypes';
import type { LessonParticipantJoin } from './lessonJoinParsing';
import {
  calendarDayIndexFromWeekStart,
  lessonDurationMinutes,
  lessonPrimaryLabel,
  lessonStudentDisplayLabel,
  lessonTeacherDisplayName,
  startOfWeekMonday,
} from './lessonDerived';

export type CalendarEventUiStatus = 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested';

/** Week / month grid + modal — read-only fields mirror `useDashboardLessons` / `DashboardLessonRow`. */
export type CalendarEventDetails = {
  id: string;
  title: string;
  teacher: string;
  /** Participant name(s) from embedded students→profiles when RLS allows. */
  student: string | null;
  date: Date;
  time: string;
  /** Duration in hours (week grid layout). */
  duration: number;
  /** Exact scheduled length from `starts_at` / `ends_at`. */
  durationMinutes: number;
  modality: 'In-Person' | 'Virtual';
  /** Raw `lessons.modality` for read-only display. */
  dbModality: string;
  location?: string;
  status: CalendarEventUiStatus;
  focus?: string;
  notes?: string;
  startsAtIso: string;
  endsAtIso: string;
  dbStatus: string;
  subjectRaw: string | null;
  participants: LessonParticipantJoin[];
  lessonMeetingUrl: string | null;
  teacherMeetingUrl: string | null;
};

export type CalendarWeekLayoutEvent = CalendarEventDetails & { day: number; hour: number };

/** Week/month/list join link — true for DB `virtual` or derived `Virtual` modality. */
export function isVirtualCalendarEvent(event: Pick<CalendarEventDetails, 'modality' | 'dbModality'>): boolean {
  return event.modality === 'Virtual' || event.dbModality?.toLowerCase() === 'virtual';
}

export function dbLessonStatusToDomain(status: string): Lesson['status'] {
  switch (status) {
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'no_show':
      return 'no-show';
    default:
      return 'scheduled';
  }
}

export function dbModalityToLessonModality(m: string): Lesson['modality'] {
  return m === 'virtual' ? 'virtual' : 'in-person';
}

export function dashboardRowToListLesson(row: DashboardLessonRow): Lesson {
  const studentLine = lessonStudentDisplayLabel(row);
  return {
    id: row.id,
    title: lessonPrimaryLabel(row),
    studentId: '',
    teacherId: '',
    date: new Date(row.starts_at),
    duration: lessonDurationMinutes(row),
    modality: dbModalityToLessonModality(row.modality),
    location: row.location ?? undefined,
    status: dbLessonStatusToDomain(row.status),
    participants: [],
    notes: row.notes ?? undefined,
    focus: row.focus ?? undefined,
    createdAt: new Date(row.starts_at),
    teacherDisplayName: lessonTeacherDisplayName(row),
    studentDisplayName: studentLine ?? undefined,
    calendarJoin: {
      startsAtIso: row.starts_at,
      endsAtIso: row.ends_at,
      lessonMeetingUrl: row.meeting_url,
      teacherMeetingUrl: row.teacher_meeting_url,
    },
  };
}

export function calendarLessonDbStatusToUi(status: string): CalendarEventUiStatus {
  switch (status) {
    case 'confirmed':
      return 'Confirmed';
    case 'completed':
    case 'no_show':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      return 'Pending';
  }
}

export function dashboardRowToCalendarEventDetails(row: DashboardLessonRow): CalendarEventDetails {
  const start = new Date(row.starts_at);
  const mins = lessonDurationMinutes(row);
  return {
    id: row.id,
    title: lessonPrimaryLabel(row),
    teacher: lessonTeacherDisplayName(row),
    student: lessonStudentDisplayLabel(row),
    date: start,
    time: start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }),
    duration: Math.max(0.25, mins / 60),
    durationMinutes: mins,
    modality: row.modality === 'virtual' ? 'Virtual' : 'In-Person',
    dbModality: row.modality,
    location: row.location ?? undefined,
    status: calendarLessonDbStatusToUi(row.status),
    focus: row.focus ?? undefined,
    notes: row.notes ?? undefined,
    startsAtIso: row.starts_at,
    endsAtIso: row.ends_at,
    dbStatus: row.status,
    subjectRaw: row.subject,
    participants: row.participants,
    lessonMeetingUrl: row.meeting_url,
    teacherMeetingUrl: row.teacher_meeting_url,
  };
}

export function dashboardRowsForWeekGrid(
  rows: DashboardLessonRow[],
  weekRef: Date
): CalendarWeekLayoutEvent[] {
  const weekStart = startOfWeekMonday(weekRef);
  return rows
    .filter((r) => {
      const dayIdx = calendarDayIndexFromWeekStart(weekStart, new Date(r.starts_at));
      return dayIdx >= 0 && dayIdx <= 6;
    })
    .map((r) => {
      const base = dashboardRowToCalendarEventDetails(r);
      const start = new Date(r.starts_at);
      const day = calendarDayIndexFromWeekStart(weekStart, start);
      const hour = start.getHours() + start.getMinutes() / 60;
      return { ...base, day, hour };
    });
}
