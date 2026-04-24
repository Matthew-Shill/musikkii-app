import {
  Calendar,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
  CreditCard,
  FileText,
  Users
} from 'lucide-react';
import { Link } from 'react-router';
import { useState } from 'react';
import type { UserRole } from '../../types/domain';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import { useCalendarLessonIntentBatch } from '@/app/dashboard/hooks/useCalendarLessonIntentBatch';
import { calendarLessonDbStatusToUi } from '@/app/dashboard/calendarLessonAdapters';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import { LearnerLessonActions } from '../pages/calendar/learner-lesson-actions';
import { useHouseholdDashboardStudents } from '@/app/dashboard/hooks/useHouseholdDashboardStudents';
import {
  filterUpcomingOpenLessons,
  lessonAvatarInitialsSource,
  lessonPrimaryLabel,
  lessonTeacherDisplayName,
  lessonsStartingInMonth,
  modalityLabel,
} from '@/app/dashboard/lessonDerived';
import {
  formatLessonDate,
  formatLessonTime,
  formatStatusLabel,
  initialsFromDisplayName,
  lessonStatusForUi,
} from '@/lib/lesson-ui-helpers';

interface HouseholdDashboardProps {
  role: UserRole;
}

export function HouseholdDashboard({ role }: HouseholdDashboardProps) {
  const { user } = useAuthSession();
  const { lessons, loading: lessonsLoading, error: lessonsError, reload: reloadLessons } = useDashboardLessons();
  const { students, loading: studentsLoading, error: studentsError } = useHouseholdDashboardStudents();
  const [eventStatuses, setEventStatuses] = useState<Record<string, CalendarEventUiStatus>>({});
  const upcomingLessons = filterUpcomingOpenLessons(lessons).slice(0, 3);
  const intentBatch = useCalendarLessonIntentBatch(upcomingLessons, user?.id);
  const primaryStudent = students[0];
  const lessonsThisMonth = lessonsStartingInMonth(lessons);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          {role === 'parent' ? 'Parent Dashboard' : 'Family Dashboard'}
        </h1>
        <p className="text-gray-600">Overview of your family's music education journey</p>
      </div>

      {lessonsError ? (
        <p className="text-sm text-red-600" role="alert">
          {lessonsError}
        </p>
      ) : null}
      {lessonsLoading ? <p className="text-sm text-gray-500">Loading schedule…</p> : null}
      {studentsError ? (
        <p className="text-sm text-red-600" role="alert">
          {studentsError}
        </p>
      ) : null}

      {/* Action Items */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Action Required</h3>
            <p className="text-sm text-amber-800 mt-1">Please confirm attendance for upcoming lessons</p>
          </div>
          <Link
            to="/calendar"
            className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
          >
            View Calendar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Student Overview Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Student Overview</h2>
              <Link
                to="/students"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View All Students
              </Link>
            </div>
            <div className="flex items-start gap-4">
              {studentsLoading ? (
                <p className="text-sm text-gray-500">Loading students…</p>
              ) : primaryStudent ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                    {initialsFromDisplayName(primaryStudent.displayName)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{primaryStudent.displayName}</h3>
                        <p className="text-sm text-gray-600">Student · visible via household RLS</p>
                        {students.length > 1 ? (
                          <p className="text-xs text-gray-500 mt-1">
                            Also linked:{' '}
                            {students
                              .slice(1)
                              .map((s) => s.displayName)
                              .join(', ')}
                          </p>
                        ) : null}
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        Active
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Lessons This Month</p>
                        <p className="text-xl font-semibold" style={{ color: 'var(--musikkii-blue)' }}>
                          {lessonsThisMonth}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Attendance Rate</p>
                        <p className="text-xl font-semibold text-green-600">—</p>
                        <p className="text-[0.65rem] text-gray-500 mt-1">Not tracked yet</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Practice Hours</p>
                        <p className="text-xl font-semibold text-purple-600">—</p>
                        <p className="text-[0.65rem] text-gray-500 mt-1">Not tracked yet</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  No student profiles linked to your account yet. After seeding, ensure household membership and student
                  rows exist for your guardian profile.
                </p>
              )}
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
            <div className="space-y-4">
              {upcomingLessons.length === 0 && !lessonsLoading ? (
                <p className="text-sm text-gray-500">No upcoming lessons.</p>
              ) : (
                upcomingLessons.map((lesson) => {
                  const uiStatus = lessonStatusForUi(lesson.status);
                  const title = lessonPrimaryLabel(lesson);
                  const teacher = lessonTeacherDisplayName(lesson);
                  const cardUi: CalendarEventUiStatus =
                    eventStatuses[lesson.id] ??
                    (intentBatch.nmlPendingByLessonId[lesson.id] ? 'NML Requested' : calendarLessonDbStatusToUi(lesson.status));
                  const pill =
                    cardUi === 'NML Requested'
                      ? { label: 'NML Requested', className: 'bg-purple-100 text-purple-700' }
                      : cardUi === 'Cancelled'
                        ? { label: 'Cancelled', className: 'bg-red-100 text-red-700' }
                        : cardUi === 'Confirmed'
                          ? { label: formatStatusLabel(uiStatus), className: 'bg-green-100 text-green-700' }
                          : { label: formatStatusLabel(uiStatus), className: 'bg-gray-100 text-gray-700' };
                  const conn = user?.id ? intentBatch.intentConnectionByLessonId[lesson.id] : undefined;
                  return (
                    <div key={lesson.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between mb-3 gap-2">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {initialsFromDisplayName(lessonAvatarInitialsSource(lesson))}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold">{title}</h4>
                            <p className="text-xs text-gray-600 mt-0.5">With {teacher}</p>
                            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>
                                  {formatLessonDate(lesson.starts_at)} · {formatLessonTime(lesson.starts_at)}
                                </span>
                              </div>
                              <span>•</span>
                              <span>{modalityLabel(lesson.modality)}</span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${pill.className}`}>
                          {pill.label}
                        </span>
                      </div>
                      {user?.id && conn ? (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <LearnerLessonActions
                            lessonId={lesson.id}
                            lessonDbStatus={lesson.status}
                            startsAtIso={lesson.starts_at}
                            endsAtIso={lesson.ends_at}
                            participants={lesson.participants}
                            actorProfileId={user.id}
                            intentConnection={conn}
                            onStatusChange={(lessonId, status) =>
                              setEventStatuses((prev) => ({ ...prev, [lessonId]: status }))
                            }
                            onLessonDbStatusUpdated={(lessonId) => {
                              setEventStatuses((prev) => {
                                const next = { ...prev };
                                delete next[lessonId];
                                return next;
                              });
                              void reloadLessons();
                            }}
                            onLessonsReload={reloadLessons}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Progress Snapshot */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Progress Snapshot</h2>
              <Link
                to="/progress"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View Full Progress
              </Link>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Practice Streak</span>
                  <span className="text-sm font-semibold text-orange-600">12 days 🔥</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-400 to-red-500" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">This Week's Practice</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--musikkii-blue)' }}>5 of 7 days</span>
                </div>
                <div className="flex gap-1">
                  {[true, true, true, true, true, false, false].map((done, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-2 rounded-full ${done ? 'bg-green-500' : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { icon: '🎵', text: 'Emma practiced for 45 minutes', time: '2 hours ago' },
                { icon: '⭐', text: 'Emma earned 3 stars on C Major Scale', time: '5 hours ago' },
                { icon: '📝', text: 'New assignment from Ms. Rodriguez', time: 'Yesterday' },
                { icon: '✅', text: 'Lesson completed with Ms. Rodriguez', time: '2 days ago' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/calendar"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">View Calendar</span>
              </Link>
              <Link
                to="/students"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Manage Students</span>
              </Link>
              <Link
                to="/messages"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Messages</span>
              </Link>
              <Link
                to="/billing"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Billing</span>
              </Link>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Billing</h3>
              <CreditCard className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">
              Billing summaries are not wired to Supabase yet. Use <strong>Billing</strong> in the nav when available.
            </p>
            <Link
              to="/billing"
              className="mt-3 block w-full py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--musikkii-blue)' }}
            >
              Go to Billing
            </Link>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Messages</h3>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    TR
                  </div>
                  <p className="text-sm font-medium">Ms. Rodriguez</p>
                </div>
                <p className="text-xs text-gray-600">Emma did great in today's lesson!</p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Helpful Resources</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Parent Guide to Practice</p>
                  <p className="text-xs text-gray-500">PDF</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
                <FileText className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Scheduling Tips</p>
                  <p className="text-xs text-gray-500">PDF</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
