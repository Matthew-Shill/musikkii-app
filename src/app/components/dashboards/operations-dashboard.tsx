import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import {
  filterTodayLessons,
  lessonPeopleCaption,
  lessonPrimaryLabel,
  lessonsStartingInMonth,
} from '@/app/dashboard/lessonDerived';

export function OperationsDashboard() {
  const { lessons, loading: lessonsLoading, error: lessonsError } = useDashboardLessons();
  const todayLessons = filterTodayLessons(lessons);
  const lessonsThisMonth = lessonsStartingInMonth(lessons);
  const pendingInvoices: { id: string }[] = [];
  const pendingPayouts: { id: string }[] = [];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Operations Dashboard</h1>
        <p className="text-gray-600">Platform operations and management</p>
      </div>

      {lessonsError ? (
        <p className="text-sm text-red-600" role="alert">
          {lessonsError}
        </p>
      ) : null}
      {lessonsLoading ? <p className="text-sm text-gray-500">Loading schedule…</p> : null}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-xs font-medium text-gray-500">ACTIVE</span>
          </div>
          <p className="text-3xl font-bold mb-1">142</p>
          <p className="text-sm text-gray-600">Total Students</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-green-500" />
            <span className="text-xs font-medium text-gray-500">ACTIVE</span>
          </div>
          <p className="text-3xl font-bold mb-1">18</p>
          <p className="text-sm text-gray-600">Total Teachers</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span className="text-xs font-medium text-gray-500">THIS MONTH</span>
          </div>
          <p className="text-3xl font-bold mb-1">{lessonsThisMonth}</p>
          <p className="text-sm text-gray-600">Lessons (this month, visible)</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span className="text-xs font-medium text-gray-500">GROWTH</span>
          </div>
          <p className="text-3xl font-bold mb-1">+12%</p>
          <p className="text-sm text-gray-600">vs Last Month</p>
        </div>
      </div>

      {/* Action Items */}
      {(pendingInvoices.length > 0 || pendingPayouts.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900">Action Required</h3>
              <p className="text-sm text-amber-800 mt-1">
                {pendingInvoices.length} pending invoices, {pendingPayouts.length} pending payouts
              </p>
            </div>
            <div className="flex gap-2">
              {pendingInvoices.length > 0 && (
                <Link
                  to="/billing"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Review Billing
                </Link>
              )}
              {pendingPayouts.length > 0 && (
                <Link
                  to="/payouts"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                >
                  Review Payouts
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Schedule */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Today's Lessons</h2>
              <Link
                to="/calendar"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View Full Calendar
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <p className="text-2xl font-bold" style={{ color: 'var(--musikkii-blue)' }}>{todayLessons.length}</p>
                <p className="text-xs text-gray-600">Total Lessons</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {todayLessons.filter((l) => l.status === 'confirmed').length}
                </p>
                <p className="text-xs text-gray-600">Confirmed</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {todayLessons.filter((l) => ['scheduled', 'pending', 'draft'].includes(l.status)).length}
                </p>
                <p className="text-xs text-gray-600">Pending / scheduled</p>
              </div>
            </div>
            <div className="space-y-2">
              {todayLessons.length === 0 && !lessonsLoading ? (
                <p className="text-sm text-gray-500 py-2">No lessons today.</p>
              ) : (
                todayLessons.slice(0, 5).map((lesson) => {
                  const people = lessonPeopleCaption(lesson);
                  return (
                  <div key={lesson.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(lesson.starts_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-600">{lessonPrimaryLabel(lesson)}</p>
                        {people ? <p className="text-[0.65rem] text-gray-500 mt-0.5">{people}</p> : null}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lesson.status}
                    </span>
                  </div>
                );
                })
              )}
            </div>
          </div>

          {/* Recent Student Activity */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link
                to="/students"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View All Students
              </Link>
            </div>
            <div className="space-y-3">
              {[
                { type: 'signup', student: 'Alex Johnson', time: '2 hours ago', status: 'success' },
                { type: 'lesson', student: 'Emma Wilson', time: '3 hours ago', status: 'success' },
                { type: 'payment', student: 'Chen Family', time: '5 hours ago', status: 'success' },
                { type: 'issue', student: 'Sarah Kim', time: '1 day ago', status: 'warning' }
              ].map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.student}</p>
                    <p className="text-sm text-gray-600 capitalize">{activity.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Financial Overview</h2>
            <p className="text-xs text-gray-500 mb-3">Placeholder figures — billing / payouts tables not wired yet.</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Revenue (This Month)</p>
                <p className="text-2xl font-bold text-green-600">$24,580</p>
                <p className="text-xs text-green-700 mt-1">+8% from last month</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Payouts (This Month)</p>
                <p className="text-2xl font-bold" style={{ color: 'var(--musikkii-blue)' }}>$16,240</p>
                <p className="text-xs text-gray-600 mt-1">{pendingPayouts.length} pending</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to="/billing"
                className="flex-1 py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                View Billing
              </Link>
              <Link
                to="/payouts"
                className="flex-1 py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                View Payouts
              </Link>
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
                to="/students"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Manage Students</span>
              </Link>
              <Link
                to="/teachers"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Manage Teachers</span>
              </Link>
              <Link
                to="/calendar"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Calendar className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">View Calendar</span>
              </Link>
              <Link
                to="/billing"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Billing</span>
              </Link>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-3">
              {[
                { name: 'Platform', status: 'operational' },
                { name: 'Video Conferencing', status: 'operational' },
                { name: 'Payment Processing', status: 'operational' },
                { name: 'Notifications', status: 'operational' }
              ].map((system, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{system.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      system.status === 'operational' ? 'bg-green-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-xs text-gray-600 capitalize">{system.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Recent Messages</h3>
              <MessageSquare className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium">Support Request</p>
                <p className="text-xs text-gray-600 mt-1">Payment issue from parent</p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Pending Tasks</h3>
            <div className="space-y-2">
              {[
                { task: 'Review new teacher applications', count: 3 },
                { task: 'Process refund requests', count: 2 },
                { task: 'Update platform policies', count: 1 }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium flex-1">{item.task}</p>
                  <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-medium">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
