import { Calendar as CalendarIcon, List, Grid3x3, Clock, Plus, X, Video, MapPin, CheckCircle, RefreshCw, AlertCircle, FileText, XCircle, Play } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useRole } from '../../context/role-context';
import { LessonList } from './calendar/lesson-list';
import { LessonStudentIntentPanels } from './calendar/lesson-student-intent-panels';
import type { AppRoleFamily } from '../../types/domain';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import {
  filterHistoryLessons,
  filterUpcomingOpenLessons,
  startOfWeekMonday,
} from '@/app/dashboard/lessonDerived';
import {
  calendarLessonDbStatusToUi,
  dashboardRowToCalendarEventDetails,
  dashboardRowToListLesson,
  dashboardRowsForWeekGrid,
  type CalendarEventDetails,
  type CalendarEventUiStatus,
  type CalendarWeekLayoutEvent,
} from '@/app/dashboard/calendarLessonAdapters';
import { modalityLabel } from '@/app/dashboard/lessonDerived';
import { formatDbLessonStatusLabel, formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';

type ViewMode = 'list' | 'week' | 'month';
type CalendarTab = 'upcoming' | 'completed' | 'requests' | 'schedule' | 'team' | 'operations' | 'overview';

function getTabsForRoleFamily(family: AppRoleFamily): { id: CalendarTab; label: string }[] {
  switch (family) {
    case 'instructor':
      return [
        { id: 'schedule', label: 'My Schedule' },
        { id: 'requests', label: 'Requests' },
      ];
    case 'operations':
    case 'leadership':
      return [
        { id: 'schedule', label: 'Schedule' },
        { id: 'operations', label: 'Operations' },
      ];
    default:
      return [
        { id: 'upcoming', label: 'Upcoming' },
        { id: 'completed', label: 'Completed' },
      ];
  }
}

function listTabSourceRows(
  lessons: DashboardLessonRow[],
  activeTab: CalendarTab,
  roleFamily: AppRoleFamily
): DashboardLessonRow[] {
  const byStart = (a: DashboardLessonRow, b: DashboardLessonRow) =>
    new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime();

  switch (activeTab) {
    case 'requests':
    case 'operations':
      return [];
    case 'upcoming':
      return filterUpcomingOpenLessons(lessons).sort(byStart);
    case 'completed':
      return filterHistoryLessons(lessons);
    case 'schedule':
      if (roleFamily === 'operations' || roleFamily === 'leadership') {
        return [...lessons].sort(byStart);
      }
      return filterUpcomingOpenLessons(lessons).sort(byStart);
    default:
      return [...lessons].sort(byStart);
  }
}

function listEmptyCopy(activeTab: CalendarTab, roleFamily: AppRoleFamily): { title: string; description: string } {
  if (activeTab === 'requests') {
    return {
      title: 'Requests not connected',
      description:
        'Lesson request workflows are not backed by the API yet. Use My Schedule for real lessons from Supabase.',
    };
  }
  if (activeTab === 'operations') {
    return {
      title: 'Operations tools are placeholders',
      description: 'This tab is UI-only. Open Schedule for organization-wide lessons returned under your RLS scope.',
    };
  }
  if (activeTab === 'completed') {
    return {
      title: 'No past lessons',
      description:
        'When lessons end or statuses move off the active schedule, they appear here for roles that can read history.',
    };
  }
  if (activeTab === 'upcoming' || activeTab === 'schedule') {
    const scope =
      roleFamily === 'household' || roleFamily === 'learner'
        ? 'your household or learner visibility'
        : roleFamily === 'instructor'
          ? 'your assigned teaching scope'
          : 'your admin or leadership scope';
    return {
      title: 'No upcoming lessons',
      description: `No open future lessons were returned for ${scope}. If you expected rows, confirm seed data and RLS on public.lessons.`,
    };
  }
  return { title: 'No lessons found', description: 'Try another tab or check back later.' };
}

export function CalendarPage() {
  const { role, roleFamily } = useRole();
  const { user } = useAuthSession();
  const { lessons, loading, error, reload: reloadLessons } = useDashboardLessons();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventDetails | null>(null);
  const [eventStatuses, setEventStatuses] = useState<Record<string, CalendarEventUiStatus>>({});
  const [weekAnchor, setWeekAnchor] = useState(() => new Date());

  const tabs = getTabsForRoleFamily(roleFamily);
  const [activeTab, setActiveTab] = useState<CalendarTab>(tabs[0].id);

  useEffect(() => {
    const next = getTabsForRoleFamily(roleFamily);
    setActiveTab(next[0].id);
  }, [roleFamily]);

  const listSourceRows = useMemo(
    () => listTabSourceRows(lessons, activeTab, roleFamily),
    [lessons, activeTab, roleFamily]
  );

  const listLessons = useMemo(() => listSourceRows.map(dashboardRowToListLesson), [listSourceRows]);

  const emptyCopy = listEmptyCopy(activeTab, roleFamily);

  const calendarEvents = useMemo(() => lessons.map(dashboardRowToCalendarEventDetails), [lessons]);

  const weekGridEvents = useMemo(
    () => dashboardRowsForWeekGrid(lessons, weekAnchor),
    [lessons, weekAnchor]
  );

  const renderCalendarView = () => (
    <LessonList
      lessons={listLessons}
      variant={roleFamily === 'household' ? 'compact' : 'default'}
      emptyTitle={emptyCopy.title}
      emptyDescription={emptyCopy.description}
      onLessonClick={(lessonId) => {
        const row = lessons.find((l) => l.id === lessonId);
        if (row) setSelectedEvent(dashboardRowToCalendarEventDetails(row));
      }}
    />
  );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6 md:mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 md:mb-2">Calendar</h1>
            <p className="text-sm md:text-base text-gray-600">
              {roleFamily === 'learner' && 'View and manage your lessons'}
              {roleFamily === 'household' && 'View and manage all household lessons'}
              {roleFamily === 'instructor' && 'Manage your teaching schedule and student lessons'}
              {roleFamily === 'operations' && 'Monitor organization-wide scheduling and operations'}
              {roleFamily === 'leadership' && 'Oversee organization-wide scheduling and operations'}
            </p>
            {loading ? <p className="text-sm text-gray-500 mt-2">Loading schedule…</p> : null}
            {error ? (
              <p className="text-sm text-red-600 mt-2" role="alert">
                {error}
              </p>
            ) : null}
            {!loading && !error && lessons.length === 0 ? (
              <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-2 inline-block">
                No lessons returned for this account. Confirm seeds and RLS on <code className="text-xs">public.lessons</code>.
              </p>
            ) : null}
          </div>

          {(roleFamily === 'learner' || roleFamily === 'household') && (
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
              style={{ backgroundColor: 'var(--musikkii-blue)' }}
            >
              <Plus className="w-5 h-5" />
              Request Lesson
            </button>
          )}
        </div>

        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Week View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Month View"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (
        renderCalendarView()
      ) : viewMode === 'week' ? (
        <WeekView
          weekAnchor={weekAnchor}
          onPrevWeek={() =>
            setWeekAnchor((d) => {
              const x = new Date(d);
              x.setDate(x.getDate() - 7);
              return x;
            })
          }
          onNextWeek={() =>
            setWeekAnchor((d) => {
              const x = new Date(d);
              x.setDate(x.getDate() + 7);
              return x;
            })
          }
          onThisWeek={() => setWeekAnchor(new Date())}
          events={weekGridEvents}
          onEventClick={setSelectedEvent}
          eventStatuses={eventStatuses}
        />
      ) : (
        <MonthView events={calendarEvents} onEventClick={setSelectedEvent} eventStatuses={eventStatuses} />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          role={role}
          roleFamily={roleFamily}
          actorProfileId={user?.id}
          onClose={() => setSelectedEvent(null)}
          onStatusChange={(eventId, newStatus) => {
            setEventStatuses((prev) => ({ ...prev, [eventId]: newStatus }));
            setSelectedEvent({ ...selectedEvent, status: newStatus });
          }}
          currentStatus={eventStatuses[selectedEvent.id] || selectedEvent.status}
          onLessonsReload={reloadLessons}
          onLessonTimeUpdated={(lessonId, startsAtIso, endsAtIso) => {
            setSelectedEvent((ev) => {
              if (!ev || ev.id !== lessonId) return ev;
              const t = new Date(startsAtIso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
              return {
                ...ev,
                startsAtIso,
                endsAtIso,
                date: new Date(startsAtIso),
                time: t,
              };
            });
          }}
          onLessonDbStatusUpdated={(lessonId, dbStatus) => {
            setEventStatuses((prev) => {
              const next = { ...prev };
              delete next[lessonId];
              return next;
            });
            setSelectedEvent((ev) => {
              if (!ev || ev.id !== lessonId) return ev;
              return {
                ...ev,
                dbStatus,
                status: calendarLessonDbStatusToUi(dbStatus),
              };
            });
          }}
        />
      )}
    </div>
  );
}

function WeekView({
  weekAnchor,
  onPrevWeek,
  onNextWeek,
  onThisWeek,
  events,
  onEventClick,
  eventStatuses,
}: {
  weekAnchor: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onThisWeek: () => void;
  events: CalendarWeekLayoutEvent[];
  onEventClick: (event: CalendarEventDetails) => void;
  eventStatuses: Record<string, CalendarEventUiStatus>;
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);
  const weekStart = startOfWeekMonday(weekAnchor);

  const getStatusColor = (status: CalendarEventUiStatus) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 border-2 border-green-300';
      case 'Pending':
        return 'bg-yellow-100 border-2 border-yellow-300';
      case 'Cancelled':
        return 'bg-red-100 border-2 border-red-300';
      case 'NML Requested':
        return 'bg-purple-100 border-2 border-purple-300';
      case 'Completed':
        return 'bg-gray-100 border-2 border-gray-300';
      default:
        return 'bg-gray-100 border-2 border-gray-300';
    }
  };

  const decorated = events.map((event) => {
    const finalStatus = eventStatuses[event.id] ?? event.status;
    return { ...event, status: finalStatus, color: getStatusColor(finalStatus) };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-end gap-2 p-3 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={onPrevWeek}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Previous week
        </button>
        <button
          type="button"
          onClick={onThisWeek}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          This week
        </button>
        <button
          type="button"
          onClick={onNextWeek}
          className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Next week
        </button>
      </div>
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 bg-gray-50 border-r border-gray-200">
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        {days.map((day, idx) => {
          const d = new Date(weekStart);
          d.setDate(d.getDate() + idx);
          return (
            <div key={idx} className="p-4 text-center border-r border-gray-200 last:border-r-0 bg-gray-50">
              <p className="font-semibold text-sm text-gray-900">{day}</p>
              <p className="text-xs text-gray-500 mt-1">
                {d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-8">
        <div className="border-r border-gray-200">
          {hours.map((hour) => (
            <div key={hour} className="h-16 border-b border-gray-200 p-2 text-right">
              <span className="text-xs text-gray-500">
                {hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
              </span>
            </div>
          ))}
        </div>

        {days.map((_, dayIdx) => (
          <div key={dayIdx} className="border-r border-gray-200 last:border-r-0 relative">
            {hours.map((hour) => (
              <div key={hour} className="h-16 border-b border-gray-200 hover:bg-gray-50 transition-colors" />
            ))}

            {decorated
              .filter((e) => e.day === dayIdx)
              .map((event) => {
                const textColor =
                  event.status === 'Confirmed'
                    ? 'text-green-800'
                    : event.status === 'Cancelled'
                      ? 'text-red-800'
                      : event.status === 'NML Requested'
                        ? 'text-purple-800'
                        : event.status === 'Completed'
                          ? 'text-gray-700'
                          : 'text-yellow-800';
                const slot = Math.max(0, Math.min(12, Math.floor(event.hour - 8)));
                const heightPx = Math.max(28, Math.round(event.duration * 64) - 4);
                return (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick(event);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`absolute left-1 right-1 ${event.color} ${textColor} p-2 rounded text-xs font-medium shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-105`}
                    style={{
                      top: `${slot * 64}px`,
                      height: `${heightPx}px`,
                    }}
                  >
                    <div className="font-semibold truncate">{event.title}</div>
                    <div className="opacity-90 mt-0.5 truncate">{event.time}</div>
                    {event.teacher !== 'Teacher' ? (
                      <div className="opacity-90 mt-0.5 truncate text-[0.65rem] leading-tight">{event.teacher}</div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {decorated.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6 px-4 border-t border-gray-100">
          No lessons this week in your visible schedule.
        </p>
      ) : null}
    </div>
  );
}

function MonthView({
  events,
  onEventClick,
  eventStatuses,
}: {
  events: CalendarEventDetails[];
  onEventClick: (event: CalendarEventDetails) => void;
  eventStatuses: Record<string, CalendarEventUiStatus>;
}) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: { day: number; isCurrentMonth: boolean; date: Date }[] = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  const merged = events.map((event) => ({
    ...event,
    status: eventStatuses[event.id] ?? event.status,
  }));

  const getEventsForDate = (date: Date) =>
    merged.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((dayObj, idx) => {
          const dayEvents = getEventsForDate(dayObj.date);
          const isToday = dayObj.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={idx}
              className={`min-h-32 p-2 border-r border-b border-gray-200 last:border-r-0 ${
                !dayObj.isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
              } hover:bg-gray-50 transition-colors`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday
                    ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center'
                    : !dayObj.isCurrentMonth
                      ? 'text-gray-400'
                      : 'text-gray-700'
                }`}
              >
                {dayObj.day}
              </div>

              <div className="space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onEventClick(event);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className={`text-xs p-1.5 rounded cursor-pointer hover:shadow-md transition-all ${
                      event.status === 'Confirmed'
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : event.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : event.status === 'NML Requested'
                            ? 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                            : event.status === 'Completed'
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    }`}
                  >
                    <div className="font-semibold truncate">{event.time}</div>
                    <div className="truncate">{event.title}</div>
                    {event.teacher !== 'Teacher' ? (
                      <div className="truncate opacity-90 text-[0.6rem] leading-tight">{event.teacher}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {merged.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-6 px-4 border-t border-gray-100">
          No lessons in your visible schedule for any month yet.
        </p>
      ) : null}
    </div>
  );
}

function EventDetailsModal({
  event,
  role,
  roleFamily,
  actorProfileId,
  onClose,
  onStatusChange,
  currentStatus,
  onLessonsReload,
  onLessonTimeUpdated,
  onLessonDbStatusUpdated,
}: {
  event: CalendarEventDetails;
  role: string;
  roleFamily: AppRoleFamily;
  actorProfileId: string | undefined;
  onClose: () => void;
  onStatusChange: (eventId: string, newStatus: CalendarEventUiStatus) => void;
  currentStatus: CalendarEventUiStatus;
  onLessonsReload: () => Promise<void>;
  onLessonTimeUpdated: (lessonId: string, startsAtIso: string, endsAtIso: string) => void;
  onLessonDbStatusUpdated: (lessonId: string, dbStatus: string) => void;
}) {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const isStudent = role === 'adult-student' || role === 'child-student';
  const lessonEnd = new Date(event.endsAtIso);
  const lessonEndedByClock = lessonEnd.getTime() < Date.now();
  const dbStatusAsUi = calendarLessonDbStatusToUi(event.dbStatus);
  const hasLocalStatusOverride = currentStatus !== dbStatusAsUi;
  const isPast = lessonEndedByClock || currentStatus === 'Completed';
  const isCancelled = currentStatus === 'Cancelled';
  const showPersistedNml =
    (roleFamily === 'learner' || roleFamily === 'household') && Boolean(actorProfileId?.trim());

  const now = new Date();
  const hoursUntilEvent = (new Date(event.startsAtIso).getTime() - now.getTime()) / (1000 * 60 * 60);
  const canReschedule = hoursUntilEvent >= 24;

  const handleConfirm = () => {
    onStatusChange(event.id, 'Confirmed');
    onClose();
  };

  const handleReschedule = () => {
    onClose();
  };

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    onStatusChange(event.id, 'Cancelled');
    setShowCancelConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative">
        <div className="p-6 border-b border-gray-200 flex items-start justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{event.title}</h2>
            <div className="text-sm text-gray-600 space-y-0.5 mt-1">
              <p>
                <span className="font-medium text-gray-700">Teacher:</span>{' '}
                {event.teacher !== 'Teacher' ? event.teacher : '—'}
              </p>
              <p>
                <span className="font-medium text-gray-700">Student(s):</span>{' '}
                {event.student ?? '—'}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono break-all">Lesson ID: {event.id}</p>
            <p className="text-xs text-gray-400 mt-2">
              Confirm and cancel in the footer are previews only (not saved). Learner/household: emerald Reschedule now
              moves time via RPC; violet Save as make-up credit cancels the lesson and creates one credit row; sky panel
              is teacher message intent; purple NML for under-24h / non-meeting.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Database status</span>
            <span className="px-3 py-1.5 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
              {formatDbLessonStatusLabel(event.dbStatus)}
            </span>
            {hasLocalStatusOverride ? (
              <>
                <span className="text-xs text-gray-400">·</span>
                <span className="text-xs font-medium text-amber-700 uppercase tracking-wide">Local preview</span>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    currentStatus === 'Confirmed'
                      ? 'bg-green-100 text-green-700'
                      : currentStatus === 'Cancelled'
                        ? 'bg-red-100 text-red-700'
                        : currentStatus === 'NML Requested'
                          ? 'bg-purple-100 text-purple-700'
                          : currentStatus === 'Completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {currentStatus}
                </span>
              </>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Schedule</p>
                <p className="font-medium text-gray-900">
                  {formatLessonDate(event.startsAtIso)} · {formatLessonTime(event.startsAtIso)} –{' '}
                  {formatLessonTime(event.endsAtIso)}
                </p>
                <p className="text-sm text-gray-600">{event.durationMinutes} minutes</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {event.modality === 'Virtual' ? (
                <>
                  <Video className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Modality</p>
                    <p className="font-medium text-gray-900">{modalityLabel(event.dbModality)}</p>
                    <p className="text-sm text-gray-600">Database value: {event.dbModality}</p>
                  </div>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Modality</p>
                    <p className="font-medium text-gray-900">{modalityLabel(event.dbModality)}</p>
                    <p className="text-sm text-gray-600">{event.location?.trim() || '—'}</p>
                  </div>
                </>
              )}
            </div>

            {event.subjectRaw?.trim() && event.subjectRaw.trim() !== event.title ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700">
                <span className="font-medium text-gray-800">Subject (raw):</span> {event.subjectRaw.trim()}
              </div>
            ) : null}
          </div>

          {event.focus ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-1">Lesson focus</p>
              <p className="text-sm text-blue-800">{event.focus}</p>
            </div>
          ) : null}

          {event.notes ? (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <p className="text-sm font-semibold text-gray-900">Lesson notes</p>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{event.notes}</p>
            </div>
          ) : null}

          {showPersistedNml ? (
            <LessonStudentIntentPanels
              lessonId={event.id}
              participants={event.participants}
              lessonDbStatus={event.dbStatus}
              endsAtIso={event.endsAtIso}
              startsAtIso={event.startsAtIso}
              onLessonTimeUpdated={(startsAtIso, endsAtIso) =>
                onLessonTimeUpdated(event.id, startsAtIso, endsAtIso)
              }
              onLessonsReload={onLessonsReload}
              onLessonDbStatusUpdated={onLessonDbStatusUpdated}
            />
          ) : null}

          {isPast ? (
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-900">Lesson recording</p>
              </div>
              <p className="text-xs text-purple-800 mb-2">Recordings are not loaded from the database yet.</p>
              <button
                type="button"
                disabled
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-500 rounded-lg text-sm font-medium cursor-not-allowed"
              >
                <Video className="w-4 h-4" />
                Watch recording
              </button>
            </div>
          ) : null}
        </div>

        {isStudent && !isPast && !isCancelled && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
            <p className="text-xs text-gray-500">
              {showPersistedNml
                ? 'Confirm and cancel here are not saved. Reschedule uses the sky panel above when the 24-hour rule allows.'
                : 'These actions are not persisted yet.'}
            </p>
            {canReschedule ? (
              <>
                <div className={`grid gap-3 ${currentStatus === 'Pending' && !showPersistedNml ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {currentStatus === 'Pending' && (
                    <button
                      type="button"
                      onClick={handleConfirm}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Confirm
                    </button>
                  )}
                  {!showPersistedNml ? (
                    <button
                      type="button"
                      onClick={handleReschedule}
                      className={`flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                        currentStatus === 'Pending' ? '' : 'col-span-2'
                      }`}
                    >
                      <RefreshCw className="w-5 h-5" />
                      Reschedule
                    </button>
                  ) : null}
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {currentStatus === 'Pending' && (
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm
                  </button>
                )}
                {!showPersistedNml ? (
                  <p className="text-xs text-amber-900 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    Reschedule preview is hidden under 24h — with Supabase sign-in, use the NML panel in this modal for a
                    real teacher-visible request.
                  </p>
                ) : null}
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={handleCancelClick}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-red-300 text-red-700 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {isStudent && (isPast || isCancelled) && (
          <div className="p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {!isStudent && !isPast && (
          <div className="p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {!isStudent && isPast && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {showCancelConfirmation && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-2xl">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Cancel Lesson</h3>
                </div>
                <p className="text-gray-600 text-sm">This confirmation is a UI placeholder only — nothing is written to the database.</p>
              </div>

              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-red-900 mb-1">Not a billable action yet</p>
                  <p className="text-sm text-red-800">Cancellation APIs are not wired; this only updates local preview state.</p>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Keep Lesson
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmCancel}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Cancel Lesson
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
