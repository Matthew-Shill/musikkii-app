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
import { LessonActions } from '../shared/lesson-actions';
import { Link } from 'react-router';
import { mockLessons, mockInvoices } from '../../data/mockData';
import type { UserRole } from '../../types/domain';

interface HouseholdDashboardProps {
  role: UserRole;
}

export function HouseholdDashboard({ role }: HouseholdDashboardProps) {
  const upcomingLessons = mockLessons.filter(l => l.status === 'scheduled' || l.status === 'confirmed');
  const nextInvoice = mockInvoices.find(i => i.status === 'pending');

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">
          {role === 'parent' ? 'Parent Dashboard' : 'Family Dashboard'}
        </h1>
        <p className="text-gray-600">Overview of your family's music education journey</p>
      </div>

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
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-2xl font-semibold">
                EC
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">Emma Chen</h3>
                    <p className="text-sm text-gray-600">Age 10 • Violin Student</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    Active
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Lessons This Month</p>
                    <p className="text-xl font-semibold" style={{ color: 'var(--musikkii-blue)' }}>8</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Attendance Rate</p>
                    <p className="text-xl font-semibold text-green-600">95%</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Practice Hours</p>
                    <p className="text-xl font-semibold text-purple-600">12.5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Upcoming Lessons</h2>
            <div className="space-y-4">
              {upcomingLessons.slice(0, 3).map((lesson, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
                        TR
                      </div>
                      <div>
                        <h4 className="font-semibold">Violin with Ms. Rodriguez</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{new Date(lesson.date).toLocaleDateString()}</span>
                          </div>
                          <span>•</span>
                          <span>{lesson.modality === 'virtual' ? 'Virtual' : 'In-Person'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {lesson.status === 'confirmed' ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          Confirmed
                        </span>
                      ) : (
                        <button className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
                                style={{ color: 'var(--musikkii-blue)', border: '1px solid var(--musikkii-blue)' }}>
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Lesson Actions */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <LessonActions
                      lessonId={lesson.id}
                      variant="compact"
                    />
                  </div>
                </div>
              ))}
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
            {nextInvoice ? (
              <div className="space-y-3">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Next Payment</span>
                    <span className="text-sm font-semibold text-amber-700">
                      ${nextInvoice.amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Due {new Date(nextInvoice.dueDate).toLocaleDateString()}</p>
                </div>
                <Link
                  to="/billing"
                  className="block w-full py-2 text-center text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  style={{ color: 'var(--musikkii-blue)' }}
                >
                  View Billing Details
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No upcoming payments</p>
            )}
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
