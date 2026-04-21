import {
  Clock,
  Video,
  CheckCircle2,
  FileText,
  TrendingUp,
  Calendar,
  Download,
  MessageSquare,
  CreditCard,
  Play,
  Target,
  Star
} from 'lucide-react';
import { Link } from 'react-router';
import { PracticeStreakWidget } from '../shared/practice-streak-widget';
import { NextLessonCard } from './widgets/next-lesson-card';
import type { UserRole } from '../../types/domain';
import { mockAssignments, mockStreakState } from '../../data/mockData';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import {
  formatLessonDate,
  formatLessonTime,
  formatStatusLabel,
  initialsFromDisplayName,
  lessonStatusForUi,
} from '@/lib/lesson-ui-helpers';
import { lessonAvatarInitialsSource, lessonPrimaryLabel, lessonTeacherDisplayName } from '@/app/dashboard/lessonDerived';

interface LearnerDashboardProps {
  role: UserRole;
  userName: string;
}

export function LearnerDashboard({ role, userName }: LearnerDashboardProps) {
  const isChild = role === 'child-student';
  const { lessons, loading: lessonsLoading, error: lessonsError } = useDashboardLessons();

  const nowMs = Date.now();
  const upcomingLessonRows = lessons.filter((l) => new Date(l.ends_at).getTime() >= nowMs);
  const nextLessonRow = upcomingLessonRows[0];
  const laterLessons = upcomingLessonRows.slice(1);

  // Assignments / streak / messages: still prototype data until practice tables are wired.
  const assignments = mockAssignments.slice(0, 4);

  return (
    <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold mb-1 md:mb-2">
          {isChild ? `Hi ${userName}! 🎵` : `Welcome back, ${userName}!`}
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          {isChild ? 'Ready to practice today?' : 'Here\'s what\'s happening with your music journey'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <button className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:shadow-md active:scale-98 transition-all text-left group">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: 'var(--musikkii-blue)' }}>
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Join Lesson</h3>
              <p className="text-sm text-gray-600">Start video call</p>
            </div>
          </div>
        </button>

        <Link to="/practice" className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:shadow-md active:scale-98 transition-all text-left group block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-green-500">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Start Practice</h3>
              <p className="text-sm text-gray-600">Start your session</p>
            </div>
          </div>
        </Link>

        <Link to="/calendar" className="bg-white rounded-xl p-5 md:p-6 border border-gray-200 hover:shadow-md active:scale-98 transition-all text-left group block">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform bg-purple-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold">View Schedule</h3>
              <p className="text-sm text-gray-600">See all lessons</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {lessonsError ? (
            <p className="text-sm text-red-600" role="alert">
              {lessonsError}
            </p>
          ) : null}
          {lessonsLoading ? <p className="text-sm text-gray-500">Loading schedule…</p> : null}
          {nextLessonRow ? (
            <NextLessonCard
              teacherName={lessonTeacherDisplayName(nextLessonRow)}
              teacherInitials={initialsFromDisplayName(lessonAvatarInitialsSource(nextLessonRow))}
              lessonDate={formatLessonDate(nextLessonRow.starts_at)}
              lessonTime={formatLessonTime(nextLessonRow.starts_at)}
              lessonFocus={nextLessonRow.focus ?? undefined}
              status={lessonStatusForUi(nextLessonRow.status)}
              lessonId={nextLessonRow.id}
              variant={isChild ? 'child' : 'default'}
            />
          ) : null}
          {!lessonsLoading && !lessonsError && !nextLessonRow ? (
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-sm text-gray-600">
              No upcoming lessons yet.
            </div>
          ) : null}

          {/* Assignments/Practice Tasks */}
          <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm ${isChild ? 'rounded-2xl' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`font-semibold ${isChild ? 'text-2xl' : 'text-xl'}`}>
                {isChild ? 'Today\'s Practice' : 'Weekly Practice Plan'}
              </h2>
              {isChild && (
                <Link
                  to="/practice"
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Target className="w-4 h-4" style={{ color: 'var(--musikkii-blue)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--musikkii-blue)' }}>
                    {assignments.filter(a => a.state !== 'not-started').length} of {assignments.length} done
                  </span>
                </Link>
              )}
            </div>
            <div className="space-y-3">
              {assignments.map((assignment, idx) => {
                const completed = assignment.state === 'practiced' || assignment.state === 'ready-for-review';

                if (isChild) {
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        completed
                          ? 'bg-green-50 border-green-300'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        completed ? 'bg-green-500' : 'bg-gray-200'
                      }`}>
                        {completed ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-3 border-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-lg ${completed ? 'text-gray-600 line-through' : 'text-gray-900 font-medium'}`}>
                          {assignment.title}
                        </p>
                      </div>
                      {completed && assignment.currentStars > 0 && (
                        <div className="flex gap-1">
                          {[...Array(assignment.currentStars)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={idx} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                    <CheckCircle2 className={`w-5 h-5 ${completed ? 'text-green-500' : 'text-gray-300'}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {assignment.title}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">{assignment.difficulty * 5} min</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming Lessons */}
          {!isChild && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
              <div className="space-y-3">
                {laterLessons.length === 0 ? (
                  <p className="text-sm text-gray-500">No further lessons scheduled.</p>
                ) : (
                  laterLessons.map((lesson) => {
                    const uiStatus = lessonStatusForUi(lesson.status);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium">
                              {formatLessonDate(lesson.starts_at)}, {formatLessonTime(lesson.starts_at)}
                            </p>
                            <p className="text-sm text-gray-600">{lessonPrimaryLabel(lesson)}</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {formatStatusLabel(uiStatus)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Practice Streak Widget */}
          <PracticeStreakWidget
            currentStreak={mockStreakState.currentStreak}
            longestStreak={mockStreakState.longestStreak}
            streakFreezes={mockStreakState.streakFreezes}
            daysThisWeek={mockStreakState.daysThisWeek}
            variant="default"
          />

          {/* Overall Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className={`font-semibold mb-4 ${isChild ? 'text-xl' : ''}`}>
              {isChild ? 'Your Stats' : 'Your Progress'}
            </h3>
            {isChild ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-50 rounded-xl text-center">
                  <p className="text-3xl mb-1">⭐</p>
                  <p className="text-2xl font-bold mb-1">48</p>
                  <p className="text-sm text-gray-600">Stars</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl text-center">
                  <p className="text-3xl mb-1">🏆</p>
                  <p className="text-2xl font-bold mb-1">5</p>
                  <p className="text-sm text-gray-600">Level</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-gray-600">Total Practice Time</span>
                  </div>
                  <span className="text-lg font-semibold">87.5 hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm text-gray-600">Skills Mastered</span>
                  </div>
                  <span className="text-lg font-semibold">14</span>
                </div>
              </div>
            )}
          </div>

          {/* Practice Resources */}
          {!isChild && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h3 className="font-semibold mb-4">Practice Resources</h3>
              <div className="space-y-3">
                {[
                  { name: 'Scale Practice Guide', type: 'PDF' },
                  { name: 'Chord Chart - Major Keys', type: 'PDF' },
                  { name: 'Sheet Music', type: 'PDF' },
                ].map((resource, idx) => (
                  <button key={idx} className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors text-left">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{resource.name}</p>
                        <p className="text-xs text-gray-500">{resource.type}</p>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Messages */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Messages</h3>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <div className="flex items-start gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                    {isChild ? 'SJ' : 'JM'}
                  </div>
                  <p className="text-sm font-medium">{isChild ? 'Ms. Sarah' : 'Jessica Miller'}</p>
                </div>
                <p className="text-xs text-gray-600">Great job on today's practice!</p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
          </div>

          {/* Billing Summary */}
          {!isChild && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Billing</h3>
                <CreditCard className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Current Plan</span>
                  <span className="text-sm font-medium">Premium</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Payment</span>
                  <span className="text-sm font-medium">Apr 1, 2026</span>
                </div>
                <button className="w-full mt-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
