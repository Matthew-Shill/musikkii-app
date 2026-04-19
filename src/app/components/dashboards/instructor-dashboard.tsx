import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  DollarSign,
  MessageSquare,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router';
import { mockLessons, mockPayouts } from '../../data/mockData';
import type { UserRole } from '../../types/domain';

interface InstructorDashboardProps {
  role: UserRole;
}

export function InstructorDashboard({ role }: InstructorDashboardProps) {
  const isManager = role === 'teacher-manager';
  const todayLessons = mockLessons.filter(l => {
    const today = new Date();
    const lessonDate = new Date(l.date);
    return lessonDate.toDateString() === today.toDateString();
  });
  const upcomingLessons = mockLessons.filter(l => l.status === 'scheduled' || l.status === 'confirmed').slice(0, 5);
  const nextPayout = mockPayouts.find(p => p.status === 'pending');

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          {isManager ? 'Teaching Manager Dashboard' : 'Instructor Dashboard'}
        </h1>
        <p className="text-gray-600">Manage your students and lessons</p>
      </div>

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
          <p className="text-3xl font-bold mb-1">24</p>
          <p className="text-sm text-gray-600">Students</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">THIS WEEK</span>
          </div>
          <p className="text-3xl font-bold mb-1">18</p>
          <p className="text-sm text-gray-600">Lessons</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-medium text-gray-500">THIS MONTH</span>
          </div>
          <p className="text-3xl font-bold mb-1">${nextPayout ? nextPayout.amount.toFixed(0) : '0'}</p>
          <p className="text-sm text-gray-600">Expected Payout</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Schedule</h2>
              <Link
                to="/calendar"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View Full Calendar
              </Link>
            </div>
            {todayLessons.length > 0 ? (
              <div className="space-y-3">
                {todayLessons.map((lesson, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        EW
                      </div>
                      <div>
                        <h4 className="font-semibold">Emma Wilson</h4>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{new Date(lesson.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>•</span>
                          <span>{lesson.duration} min</span>
                          <span>•</span>
                          <span>{lesson.modality === 'virtual' ? 'Virtual' : 'In-Person'}</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg font-medium text-sm text-white hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: 'var(--musikkii-blue)' }}>
                      Start Lesson
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No lessons scheduled for today
              </div>
            )}
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
            <div className="space-y-3">
              {upcomingLessons.map((lesson, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                      EW
                    </div>
                    <div>
                      <p className="font-medium">Emma Wilson</p>
                      <p className="text-sm text-gray-600">
                        {new Date(lesson.date).toLocaleDateString()} at {new Date(lesson.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    lesson.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                  </span>
                </div>
              ))}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 rounded-lg font-medium text-sm text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: 'var(--musikkii-blue)' }}>
                Create Assignment
              </button>
              <Link
                to="/calendar"
                className="block w-full px-4 py-3 text-center rounded-lg font-medium text-sm border hover:bg-gray-50 transition-colors"
                style={{ borderColor: 'var(--musikkii-blue)', color: 'var(--musikkii-blue)' }}
              >
                Schedule Lesson
              </Link>
              <Link
                to="/students"
                className="block w-full px-4 py-3 text-center rounded-lg font-medium text-sm border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                View Students
              </Link>
            </div>
          </div>

          {/* Payout Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Payouts</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            {nextPayout ? (
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium mb-1">Next Payout</p>
                  <p className="text-2xl font-bold mb-1" style={{ color: 'var(--musikkii-blue)' }}>
                    ${nextPayout.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-600">{nextPayout.lessonCount} lessons</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(nextPayout.periodStart).toLocaleDateString()} - {new Date(nextPayout.periodEnd).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/payouts"
                  className="block w-full py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: 'var(--musikkii-blue)' }}
                >
                  View All Payouts
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No pending payouts</p>
            )}
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
    </div>
  );
}
