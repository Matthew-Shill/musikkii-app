import { Clock, Play } from 'lucide-react';
import type { LessonStatus } from '../../../types/domain';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { LessonActions } from '../../shared/lesson-actions';
import { LearnerLessonActions } from '../../pages/calendar/learner-lesson-actions';

interface NextLessonCardProps {
  teacherName: string;
  teacherInitials: string;
  lessonDate: string;
  lessonTime: string;
  lessonFocus?: string;
  status: LessonStatus;
  lessonId: string;
  variant?: 'default' | 'child';
  /** When set, overrides the status pill (e.g. NML Requested). */
  calendarUiStatus?: CalendarEventUiStatus;
  learnerActions?: {
    dashboardRow: DashboardLessonRow;
    actorProfileId: string;
    intentConnection: LessonIntentEventsConnection;
    cardUiStatus: CalendarEventUiStatus;
    onStatusChange: (lessonId: string, status: CalendarEventUiStatus) => void;
    onLessonDbStatusUpdated: (lessonId: string, dbStatus?: string) => void;
    onLessonsReload: () => Promise<void>;
  };
}

function statusPillFromCalendar(ui: CalendarEventUiStatus): { label: string; className: string } {
  switch (ui) {
    case 'Confirmed':
      return { label: 'Confirmed', className: 'bg-green-100 text-green-700' };
    case 'Cancelled':
      return { label: 'Cancelled', className: 'bg-red-100 text-red-700' };
    case 'NML Requested':
      return { label: 'NML Requested', className: 'bg-purple-100 text-purple-700' };
    case 'Completed':
      return { label: 'Completed', className: 'bg-blue-100 text-blue-700' };
    default:
      return { label: 'Scheduled', className: 'bg-gray-100 text-gray-700' };
  }
}

export function NextLessonCard({
  teacherName,
  teacherInitials,
  lessonDate,
  lessonTime,
  lessonFocus,
  status,
  lessonId,
  variant = 'default',
  calendarUiStatus,
  learnerActions,
}: NextLessonCardProps) {
  if (variant === 'child') {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Next Lesson</p>
            <h2 className="text-3xl font-bold mb-4">{teacherName}</h2>
            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              <span>
                {lessonDate} at {lessonTime}
              </span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-4xl">🎵</div>
          </div>
        </div>
        <button className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          Join Lesson
        </button>
      </div>
    );
  }

  const pill = calendarUiStatus ? statusPillFromCalendar(calendarUiStatus) : null;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Next Lesson</h2>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
          {teacherInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2 gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-lg">{teacherName}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">
                  {lessonDate} at {lessonTime}
                </span>
              </div>
            </div>
            {pill ? (
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${pill.className}`}>{pill.label}</span>
            ) : (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                  status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : status === 'scheduled'
                      ? 'bg-gray-100 text-gray-700'
                      : 'bg-blue-100 text-blue-700'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          {lessonFocus && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Focus:</span> {lessonFocus}
              </p>
            </div>
          )}
          {learnerActions ? (
            <div className="mt-4">
              <LearnerLessonActions
                lessonId={learnerActions.dashboardRow.id}
                lessonDbStatus={learnerActions.dashboardRow.status}
                startsAtIso={learnerActions.dashboardRow.starts_at}
                endsAtIso={learnerActions.dashboardRow.ends_at}
                participants={learnerActions.dashboardRow.participants}
                actorProfileId={learnerActions.actorProfileId}
                intentConnection={learnerActions.intentConnection}
                onStatusChange={learnerActions.onStatusChange}
                onLessonDbStatusUpdated={learnerActions.onLessonDbStatusUpdated}
                onLessonsReload={learnerActions.onLessonsReload}
              />
            </div>
          ) : (
            <>
              <LessonActions lessonId={lessonId} />
              <p className="text-xs text-gray-400 mt-3">
                These row buttons are not saved. Use the calendar for persisted learner actions when signed in.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
