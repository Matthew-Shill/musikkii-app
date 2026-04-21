import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Link } from 'react-router';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import { lessonsStartingInMonth } from '@/app/dashboard/lessonDerived';

export function LeadershipDashboard() {
  const { lessons, loading: lessonsLoading, error: lessonsError } = useDashboardLessons();
  const lessonsThisMonth = lessonsStartingInMonth(lessons);

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold mb-2">Leadership Dashboard</h1>
        <p className="text-gray-600">Strategic overview and business intelligence</p>
      </div>

      {lessonsError ? (
        <p className="text-sm text-red-600" role="alert">
          {lessonsError}
        </p>
      ) : null}
      {lessonsLoading ? <p className="text-sm text-gray-500">Loading lesson visibility…</p> : null}

      {/* Key Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>+12%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">$94.2K</p>
          <p className="text-sm text-gray-600">Monthly Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>+8%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">142</p>
          <p className="text-sm text-gray-600">Active Students</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <ArrowUp className="w-3 h-3" />
              <span>+5%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{lessonsThisMonth}</p>
          <p className="text-sm text-gray-600">Lessons this month (RLS-visible)</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <div className="flex items-center gap-1 text-xs font-medium text-red-600">
              <ArrowDown className="w-3 h-3" />
              <span>-2%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">4.2%</p>
          <p className="text-sm text-gray-600">Churn Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Revenue Trends */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Revenue Overview</h2>
              <Link
                to="/analytics"
                className="text-sm font-medium hover:underline"
                style={{ color: 'var(--musikkii-blue)' }}
              >
                View Analytics
              </Link>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 78, 82, 71, 88, 94].map((value, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all hover:opacity-80"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-xs text-gray-500">
                    {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][idx]}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">6-Month Growth</span>
                <span className="font-semibold text-green-600">+44.6%</span>
              </div>
            </div>
          </div>

          {/* Growth Metrics */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Growth Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Student Acquisition</span>
                  <span className="text-sm font-semibold text-green-600">+18 this month</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{ width: '72%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Teacher Utilization</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--musikkii-blue)' }}>87%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{ width: '87%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Lesson Completion Rate</span>
                  <span className="text-sm font-semibold text-purple-600">94%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Department Performance</h2>
            <div className="space-y-4">
              {[
                { dept: 'Piano', students: 58, revenue: 34200, growth: 12 },
                { dept: 'Violin', students: 42, revenue: 24800, growth: 8 },
                { dept: 'Guitar', students: 28, revenue: 16500, growth: 15 },
                { dept: 'Voice', students: 14, revenue: 8300, growth: -3 }
              ].map((dept, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{dept.dept}</h4>
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      dept.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {dept.growth >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      <span>{Math.abs(dept.growth)}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-600">Students</p>
                      <p className="text-lg font-semibold">{dept.students}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Revenue</p>
                      <p className="text-lg font-semibold">${(dept.revenue / 1000).toFixed(1)}K</p>
                    </div>
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
            <h3 className="font-semibold mb-4">Quick Access</h3>
            <div className="space-y-2">
              <Link
                to="/analytics"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Analytics</span>
              </Link>
              <Link
                to="/students"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Students</span>
              </Link>
              <Link
                to="/teachers"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Teachers</span>
              </Link>
              <Link
                to="/billing"
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <DollarSign className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium">Financials</span>
              </Link>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Key Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">Strong Growth</p>
                <p className="text-xs text-green-700 mt-1">Student acquisition up 18 this month</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-900">High Engagement</p>
                <p className="text-xs text-blue-700 mt-1">Practice completion at 89%</p>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-medium text-amber-900">Watch Voice Dept</p>
                <p className="text-xs text-amber-700 mt-1">3% decline in enrollments</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">MRR</span>
                <span className="text-lg font-semibold">$94.2K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Gross Margin</span>
                <span className="text-lg font-semibold text-green-600">68%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">CAC</span>
                <span className="text-lg font-semibold">$142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">LTV</span>
                <span className="text-lg font-semibold">$2,840</span>
              </div>
            </div>
          </div>

          {/* Team Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="font-semibold mb-4">Team Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Teachers</span>
                <span className="text-lg font-semibold">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Rating</span>
                <span className="text-lg font-semibold">4.7 ⭐</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Retention</span>
                <span className="text-lg font-semibold text-green-600">94%</span>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <h3 className="font-semibold mb-3">Q2 Goals</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Revenue Target</span>
                  <span className="font-medium">$120K</span>
                </div>
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '79%' }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Student Growth</span>
                  <span className="font-medium">200</span>
                </div>
                <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '71%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
