import {
  Calendar,
  Users,
  TrendingUp,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { useMemo, useState } from 'react';
import type { UserRole } from '../../types/domain';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import { TeacherLessonAttendanceTrigger } from '../pages/calendar/teacher-lesson-attendance-trigger';
import { useInstructorActiveStudentCount } from '@/app/dashboard/hooks/useInstructorActiveStudentCount';
import {
  filterTodayLessons,
  filterHistoryLessons,
  filterUpcomingOpenLessons,
  isInCalendarWeek,
  lessonPrimaryLabel,
  lessonStudentDisplayLabel,
} from '@/app/dashboard/lessonDerived';
import {
  formatLessonDate,
  formatLessonTime,
  initialsFromDisplayName,
} from '@/lib/lesson-ui-helpers';

interface InstructorDashboardProps {
  role: UserRole;
}

export function InstructorDashboard({ role }: InstructorDashboardProps) {
  const isManager = role === 'teacher-manager';
  const { user } = useAuthSession();
  const { lessons, loading: lessonsLoading, error: lessonsError, reload: reloadLessons } = useDashboardLessons();
  const { activeStudentCount, loading: activeStudentsLoading, error: activeStudentsError } =
    useInstructorActiveStudentCount();
  const todayLessons = filterTodayLessons(lessons);
  const [scheduleTab, setScheduleTab] = useState<'upcoming' | 'completed'>('upcoming');
  const upcomingLessons = useMemo(
    () =>
      filterUpcomingOpenLessons(todayLessons)
        .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
        .slice(0, 8),
    [todayLessons]
  );
  const completedLessons = useMemo(
    () =>
      filterHistoryLessons(todayLessons)
        .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
        .slice(0, 8),
    [todayLessons]
  );
  const scheduleRows = scheduleTab === 'upcoming' ? upcomingLessons : completedLessons;
  const weeklyLessonCount = lessons.filter((l) => isInCalendarWeek(l.starts_at)).length;

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          {isManager ? 'Teaching Manager Dashboard' : 'Instructor Dashboard'}
        </h1>
        <p className="text-gray-600">Manage your students and lessons</p>
      </div>

      {lessonsError ? (
        <p className="text-sm text-red-600" role="alert">
          {lessonsError}
        </p>
      ) : null}
      {lessonsLoading ? <p className="text-sm text-gray-500">Loading schedule…</p> : null}
      {activeStudentsError ? (
        <p className="text-sm text-red-600" role="alert">
          {activeStudentsError}
        </p>
      ) : null}

      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">TODAY</span>
          </div>
          <p className="text-3xl font-bold mb-1">{todayLessons.length}</p>
          <p className="text-sm text-gray-600">Lessons</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-xs font-medium text-gray-500">ACTIVE</span>
          </div>
          <p className="text-3xl font-bold mb-1">
            {activeStudentsLoading ? '…' : activeStudentCount ?? '—'}
          </p>
          <p className="text-sm text-gray-600">Active students</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">THIS WEEK</span>
          </div>
          <p className="text-3xl font-bold mb-1">{lessonsLoading ? '…' : weeklyLessonCount}</p>
          <p className="text-sm text-gray-600">Lessons this week</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-medium text-gray-500">THIS MONTH</span>
          </div>
          <p className="text-3xl font-bold mb-1">—</p>
          <p className="text-sm text-gray-600">Expected Payout</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Today's Schedule */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
              <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setScheduleTab('upcoming')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    scheduleTab === 'upcoming' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  type="button"
                  onClick={() => setScheduleTab('completed')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium ${
                    scheduleTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
            <Link
              to="/calendar"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--musikkii-blue)' }}
            >
              View Full Calendar
            </Link>
          </div>
          <div className="space-y-3">
            {scheduleRows.length === 0 && !lessonsLoading ? (
              <p className="text-sm text-gray-500">
                {scheduleTab === 'upcoming' ? 'No upcoming lessons.' : 'No completed lessons yet.'}
              </p>
            ) : (
              scheduleRows.map((lesson) => {
                const title = lessonPrimaryLabel(lesson);
                const students = lessonStudentDisplayLabel(lesson);
                const avatarSource = students ?? title;
                return (
                  <div key={lesson.id} className="flex items-center justify-between gap-3 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                        {initialsFromDisplayName(avatarSource)}
                      </div>
                      <div>
                        <p className="font-medium">{title}</p>
                        {students ? <p className="text-xs text-gray-600">{students}</p> : null}
                        <p className="text-sm text-gray-600">
                          {formatLessonDate(lesson.starts_at)} at {formatLessonTime(lesson.starts_at)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user?.id && lesson.teacher_profile_id === user.id ? (
                        <TeacherLessonAttendanceTrigger row={lesson} variant="compact" onSaved={reloadLessons} />
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Student Insights */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Student Activity</h2>
              <Link
                to="/practice-insights"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View Practice Insights
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { student: 'Emma Wilson', activity: 'Practiced 45 min', status: 'excellent', time: '2 hours ago' },
                { student: 'Alex Chen', activity: 'Submitted recording', status: 'good', time: '5 hours ago' },
                { student: 'Sarah Kim', activity: 'No practice in 3 days', status: 'needs-attention', time: '3 days ago' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    item.status === 'excellent'
                      ? 'bg-green-500'
                      : item.status === 'good'
                      ? 'bg-blue-500'
                      : 'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.student}</p>
                    <p className="text-sm text-gray-600">{item.activity}</p>
                    <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Payout Summary */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Payouts</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600">Payout data is not wired to Supabase yet.</p>
            <Link
              to="/payouts"
              className="mt-3 block w-full py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: 'var(--musikkii-blue)' }}
            >
              View Payouts
            </Link>
          </div>

        {/* Tasks */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Tasks</h3>
            <div className="space-y-3">
              {[
                { task: 'Grade Emma\'s recording', urgent: true },
                { task: 'Update lesson notes (3 lessons)', urgent: false },
                { task: 'Review Alex\'s NoteCheck', urgent: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {item.urgent ? (
                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-gray-300 mt-0.5" />
                  )}
                  <p className="text-sm font-medium flex-1">{item.task}</p>
                </div>
              ))}
            </div>
          </div>

        {/* Messages */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Messages</h3>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    EW
                  </div>
                  <p className="text-sm font-medium">Emma Wilson</p>
                </div>
                <p className="text-xs text-gray-600">Question about next lesson...</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
          </div>

        {/* Performance Stats */}
        {isManager && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Team Performance</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Lessons</span>
                <span className="text-lg font-semibold">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="text-lg font-semibold text-green-600">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <span className="text-lg font-semibold">4.8 ⭐</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
