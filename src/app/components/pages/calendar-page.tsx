import { Calendar as CalendarIcon, List, Grid3x3, Clock, Plus, X, Video, MapPin, CheckCircle, RefreshCw, AlertCircle, FileText, XCircle, Play } from 'lucide-react';
import { useState } from 'react';
import { useRole, UserRole } from '../../context/role-context';
import { LessonList } from './calendar/lesson-list';
import { mockLessons } from '../../data/mockData';
import type { AppRoleFamily } from '../../types/domain';

type ViewMode = 'list' | 'week' | 'month';
type CalendarTab = 'upcoming' | 'completed' | 'requests' | 'schedule' | 'team' | 'operations' | 'overview';

interface EventDetails {
  id: string;
  title: string;
  teacher: string;
  date: Date;
  time: string;
  duration: number;
  modality: 'In-Person' | 'Virtual';
  location?: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested';
  focus?: string;
  notes?: string;
}

export function CalendarPage() {
  const { role, roleFamily } = useRole();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedEvent, setSelectedEvent] = useState<EventDetails | null>(null);
  const [eventStatuses, setEventStatuses] = useState<Record<string, 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested'>>({});

  // Determine tabs based on role family
  const getTabsForRoleFamily = (family: AppRoleFamily) => {
    switch (family) {
      case 'instructor':
        return [
          { id: 'schedule' as CalendarTab, label: 'My Schedule' },
          { id: 'requests' as CalendarTab, label: 'Requests' }
        ];
      case 'operations':
      case 'leadership':
        return [
          { id: 'schedule' as CalendarTab, label: 'Schedule' },
          { id: 'operations' as CalendarTab, label: 'Operations' }
        ];
      default:
        // learner, household
        return [
          { id: 'upcoming' as CalendarTab, label: 'Upcoming' },
          { id: 'completed' as CalendarTab, label: 'Completed' }
        ];
    }
  };

  const tabs = getTabsForRoleFamily(roleFamily);
  const [activeTab, setActiveTab] = useState<CalendarTab>(tabs[0].id);

  // Get appropriate lessons based on tab and role family
  const getLessonsForTab = () => {
    const now = new Date();

    if (activeTab === 'upcoming') {
      return mockLessons.filter(l =>
        (l.status === 'scheduled' || l.status === 'confirmed') &&
        new Date(l.date) >= now
      );
    }

    if (activeTab === 'completed') {
      return mockLessons.filter(l =>
        l.status === 'completed' ||
        new Date(l.date) < now
      );
    }

    // For instructor/operations/leadership: show all lessons
    return mockLessons;
  };

  // Get appropriate calendar view component based on role family
  const renderCalendarView = () => {
    const lessons = getLessonsForTab();
    return <LessonList lessons={lessons} variant={roleFamily === 'household' ? 'compact' : 'default'} />;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
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
          </div>
          
          {/* Quick Actions */}
          {(roleFamily === 'learner' || roleFamily === 'household') && (
            <button className="flex items-center gap-2 px-4 py-2.5 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
                    style={{ backgroundColor: 'var(--musikkii-blue)' }}>
              <Plus className="w-5 h-5" />
              Request Lesson
            </button>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* View Mode Selector */}
          <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="List View"
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Week View"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'month'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              title="Month View"
            >
              <CalendarIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Content */}
      {viewMode === 'list' ? (
        renderCalendarView()
      ) : viewMode === 'week' ? (
        <WeekView role={role} onEventClick={setSelectedEvent} eventStatuses={eventStatuses} />
      ) : (
        <MonthView role={role} onEventClick={setSelectedEvent} eventStatuses={eventStatuses} />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          role={role}
          onClose={() => setSelectedEvent(null)}
          onStatusChange={(eventId, newStatus) => {
            setEventStatuses(prev => ({ ...prev, [eventId]: newStatus }));
            setSelectedEvent({ ...selectedEvent, status: newStatus });
          }}
          currentStatus={eventStatuses[selectedEvent.id] || selectedEvent.status}
        />
      )}
    </div>
  );
}

// Week View Component
function WeekView({ role, onEventClick, eventStatuses }: {
  role: string;
  onEventClick: (event: EventDetails) => void;
  eventStatuses: Record<string, 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested'>;
}) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const getStatusColor = (status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested') => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 border-2 border-green-300';
      case 'Pending': return 'bg-yellow-100 border-2 border-yellow-300';
      case 'Cancelled': return 'bg-red-100 border-2 border-red-300';
      case 'NML Requested': return 'bg-purple-100 border-2 border-purple-300';
      case 'Completed': return 'bg-gray-100 border-2 border-gray-300';
      default: return 'bg-gray-100 border-2 border-gray-300';
    }
  };

  // Sample events for week view with full details
  const baseEvents: (EventDetails & { day: number; hour: number })[] = [
    {
      id: '1',
      day: 0,
      hour: 14,
      duration: 1,
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 21, 14, 0),
      time: '2:00 PM',
      modality: 'Virtual',
      status: 'Pending',
      focus: 'Chord progressions and improvisation'
    },
    {
      id: '2',
      day: 2,
      hour: 14,
      duration: 1,
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 23, 14, 0),
      time: '2:00 PM',
      modality: 'In-Person',
      location: 'Studio A',
      status: 'Confirmed',
      focus: 'Scale practice and technique'
    },
    {
      id: '3',
      day: 4,
      hour: 14,
      duration: 1,
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 25, 14, 0),
      time: '2:00 PM',
      modality: 'Virtual',
      status: 'Pending'
    }
  ];

  const now = new Date();
  const events = baseEvents.map(event => {
    // Auto-mark past lessons as completed if not already set to a different status
    const isPast = event.date < now;
    let finalStatus = eventStatuses[event.id] || event.status;

    // If event is in the past and hasn't been manually changed, mark as completed
    if (isPast && !eventStatuses[event.id] && event.status !== 'Completed' && event.status !== 'Cancelled' && event.status !== 'NML Requested') {
      finalStatus = 'Completed';
    }

    return {
      ...event,
      status: finalStatus,
      color: getStatusColor(finalStatus)
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="grid grid-cols-8 border-b border-gray-200">
        <div className="p-4 bg-gray-50 border-r border-gray-200">
          <Clock className="w-5 h-5 text-gray-400" />
        </div>
        {days.map((day, idx) => (
          <div key={idx} className="p-4 text-center border-r border-gray-200 last:border-r-0 bg-gray-50">
            <p className="font-semibold text-sm text-gray-900">{day}</p>
            <p className="text-xs text-gray-500 mt-1">Mar {17 + idx}</p>
          </div>
        ))}
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

            {/* Events */}
            {events
              .filter((e) => e.day === dayIdx)
              .map((event, idx) => {
                const textColor = event.status === 'Confirmed' ? 'text-green-800' :
                                 event.status === 'Cancelled' ? 'text-red-800' :
                                 event.status === 'NML Requested' ? 'text-purple-800' :
                                 event.status === 'Completed' ? 'text-gray-700' :
                                 'text-yellow-800';
                return (
                  <div
                    key={idx}
                    onClick={() => onEventClick(event)}
                    className={`absolute left-1 right-1 ${event.color} ${textColor} p-2 rounded text-xs font-medium shadow-sm cursor-pointer hover:shadow-md transition-all hover:scale-105`}
                    style={{
                      top: `${(event.hour - 8) * 64}px`,
                      height: `${event.duration * 64 - 4}px`
                    }}
                  >
                    <div className="font-semibold">{event.title}</div>
                    <div className="opacity-90 mt-0.5">{event.teacher}</div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

// Month View Component
function MonthView({ role, onEventClick, eventStatuses }: {
  role: string;
  onEventClick: (event: EventDetails) => void;
  eventStatuses: Record<string, 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested'>;
}) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, date: new Date(year, month - 1, prevMonthLastDay - i) });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    // Next month days
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(year, month + 1, i) });
    }

    return days;
  };

  // Sample events for month view
  const baseEvents: EventDetails[] = [
    {
      id: '1',
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 21, 14, 0),
      time: '2:00 PM',
      duration: 1,
      modality: 'Virtual',
      status: 'Pending',
      focus: 'Chord progressions'
    },
    {
      id: '2',
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 23, 14, 0),
      time: '2:00 PM',
      duration: 1,
      modality: 'In-Person',
      location: 'Studio A',
      status: 'Confirmed',
      focus: 'Scale practice'
    },
    {
      id: '3',
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 15, 14, 0),
      time: '2:00 PM',
      duration: 1,
      modality: 'Virtual',
      status: 'Confirmed',
      notes: 'Great progress on scales. Focus on thumb technique next time.'
    },
    {
      id: '4',
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 25, 14, 0),
      time: '2:00 PM',
      duration: 1,
      modality: 'Virtual',
      status: 'Pending'
    },
    {
      id: '5',
      title: 'Piano Lesson',
      teacher: 'Sarah Johnson',
      date: new Date(2026, 3, 28, 14, 0),
      time: '2:00 PM',
      duration: 1,
      modality: 'In-Person',
      location: 'Studio A',
      status: 'Confirmed'
    }
  ];

  const now = new Date();
  const events = baseEvents.map(event => {
    // Auto-mark past lessons as completed if not already set to a different status
    const isPast = event.date < now;
    let finalStatus = eventStatuses[event.id] || event.status;

    // If event is in the past and hasn't been manually changed, mark as completed
    if (isPast && !eventStatuses[event.id] && event.status !== 'Completed' && event.status !== 'Cancelled' && event.status !== 'NML Requested') {
      finalStatus = 'Completed';
    }

    return {
      ...event,
      status: finalStatus
    };
  });

  const getEventsForDate = (date: Date) => {
    return events.filter(event =>
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    );
  };

  const calendarDays = getCalendarDays();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Month Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {daysOfWeek.map(day => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
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
              <div className={`text-sm font-medium mb-1 ${
                isToday
                  ? 'w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center'
                  : !dayObj.isCurrentMonth
                  ? 'text-gray-400'
                  : 'text-gray-700'
              }`}>
                {dayObj.day}
              </div>

              <div className="space-y-1">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
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
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Event Details Modal
function EventDetailsModal({
  event,
  role,
  onClose,
  onStatusChange,
  currentStatus
}: {
  event: EventDetails;
  role: string;
  onClose: () => void;
  onStatusChange: (eventId: string, newStatus: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested') => void;
  currentStatus: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled' | 'NML Requested';
}) {
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const isStudent = role === 'adult-student' || role === 'child-student';
  const isPast = currentStatus === 'Completed';
  const isCancelled = currentStatus === 'Cancelled';
  const isNMLRequested = currentStatus === 'NML Requested';

  // Calculate hours until the event
  const now = new Date();
  const hoursUntilEvent = (event.date.getTime() - now.getTime()) / (1000 * 60 * 60);
  const canReschedule = hoursUntilEvent >= 24;

  const handleConfirm = () => {
    console.log('Confirming lesson:', event.id);
    onStatusChange(event.id, 'Confirmed');
    onClose();
  };

  const handleReschedule = () => {
    console.log('Rescheduling lesson:', event.id);
    onClose();
  };

  const handleRequestNML = () => {
    console.log('Requesting NML (Never Miss A Lesson) video for:', event.id);
    onStatusChange(event.id, 'NML Requested');
    onClose();
  };

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    console.log('Canceling/forfeiting lesson:', event.id);
    onStatusChange(event.id, 'Cancelled');
    setShowCancelConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 flex items-start justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-1">{event.title}</h2>
            <p className="text-sm text-gray-600">with {event.teacher}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              currentStatus === 'Confirmed' ? 'bg-green-100 text-green-700' :
              currentStatus === 'Cancelled' ? 'bg-red-100 text-red-700' :
              currentStatus === 'NML Requested' ? 'bg-purple-100 text-purple-700' :
              currentStatus === 'Completed' ? 'bg-gray-100 text-gray-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {currentStatus}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">
                  {event.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-sm text-gray-600">{event.time} ({event.duration} hour)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              {event.modality === 'Virtual' ? (
                <>
                  <Video className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Virtual Lesson</p>
                    <p className="text-sm text-gray-600">Online video call</p>
                  </div>
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">In-Person</p>
                    <p className="text-sm text-gray-600">{event.location || 'Studio location'}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Focus/Notes */}
          {event.focus && !isPast && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-semibold text-blue-900 mb-1">Lesson Focus</p>
              <p className="text-sm text-blue-800">{event.focus}</p>
            </div>
          )}

          {isPast && (
            <div className="space-y-3">
              {/* Lesson Recording */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Play className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-semibold text-purple-900">Lesson Recording</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                  <Video className="w-4 h-4" />
                  Watch Recording
                </button>
              </div>

              {/* Lesson Notes */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-600" />
                  <p className="text-sm font-semibold text-gray-900">Lesson Notes</p>
                </div>
                <p className="text-sm text-gray-700">
                  {event.notes || 'Great progress on scales. Focus on thumb technique next time.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        {isStudent && !isPast && !isCancelled && !isNMLRequested && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-3">
            {canReschedule ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {currentStatus === 'Pending' && (
                    <button
                      onClick={handleConfirm}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Confirm
                    </button>
                  )}
                  <button
                    onClick={handleReschedule}
                    className={`flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                      currentStatus === 'Pending' ? '' : 'col-span-2'
                    }`}
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reschedule
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRequestNML}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border-2 border-purple-200 text-purple-700 rounded-lg font-semibold hover:bg-purple-50 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Request NML
                  </button>
                  <button
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
                    onClick={handleConfirm}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm
                  </button>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleRequestNML}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                  >
                    <Video className="w-5 h-5" />
                    Request NML
                  </button>
                  <button
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

        {isStudent && (isPast || isCancelled || isNMLRequested) && (
          <div className="p-6 border-t border-gray-200">
            <button
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
              onClick={onClose}
              className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {showCancelConfirmation && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 rounded-2xl">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 text-red-600 mb-2">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">Cancel Lesson</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  Are you sure you want to cancel this lesson?
                </p>
              </div>

              <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-semibold text-red-900 mb-1">Warning: This is a billable action</p>
                  <p className="text-sm text-red-800">
                    This lesson will be cancelled and billed to your account. No makeup video will be requested.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelConfirmation(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Keep Lesson
                  </button>
                  <button
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