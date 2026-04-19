import { DollarSign, Download, Calendar, Users, TrendingUp, AlertCircle, Search } from 'lucide-react';
import { useState } from 'react';

export function TeacherManagerPayoutsView() {
  const [activeTab, setActiveTab] = useState<'my-payouts' | 'team-overview'>('my-payouts');
  const [searchTerm, setSearchTerm] = useState('');

  const teamPayouts = [
    { 
      id: 1, 
      name: 'Jessica Miller', 
      initials: 'JM',
      color: 'from-blue-400 to-blue-600',
      completedLessons: 28, 
      pendingLessons: 8,
      currentPeriodEarnings: 1140, 
      nextPayout: 1520,
      payoutDate: 'Apr 1',
      status: 'On Track'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      initials: 'SJ',
      color: 'from-purple-400 to-purple-600',
      completedLessons: 26, 
      pendingLessons: 7,
      currentPeriodEarnings: 1060, 
      nextPayout: 1340,
      payoutDate: 'Apr 1',
      status: 'On Track'
    },
    { 
      id: 3, 
      name: 'Michael Davis', 
      initials: 'MD',
      color: 'from-green-400 to-green-600',
      completedLessons: 24, 
      pendingLessons: 6,
      currentPeriodEarnings: 980, 
      nextPayout: 1220,
      payoutDate: 'Apr 1',
      status: 'On Track'
    },
    { 
      id: 4, 
      name: 'Katie Wilson', 
      initials: 'KW',
      color: 'from-orange-400 to-orange-600',
      completedLessons: 22, 
      pendingLessons: 9,
      currentPeriodEarnings: 900, 
      nextPayout: 1260,
      payoutDate: 'Apr 1',
      status: 'Review Needed',
      alert: '2 rescheduled lessons'
    }
  ];

  const totalTeamPayout = teamPayouts.reduce((sum, t) => sum + t.nextPayout, 0);
  const totalCompletedLessons = teamPayouts.reduce((sum, t) => sum + t.completedLessons, 0);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Payouts</h1>
        <p className="text-gray-600">Manage your earnings and oversee team compensation</p>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('my-payouts')}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'my-payouts'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Payouts
          </button>
          <button
            onClick={() => setActiveTab('team-overview')}
            className={`px-6 py-2.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'team-overview'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Team Overview
          </button>
        </div>
      </div>

      {activeTab === 'my-payouts' ? (
        /* My Payouts View - Similar to Teacher */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Period Summary */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Payout Period</h2>
                  <p className="text-gray-600">March 16 - March 31, 2026</p>
                </div>
                <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                  In Progress
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Teaching</p>
                  <p className="text-2xl font-bold text-blue-600">$840</p>
                  <p className="text-xs text-gray-500 mt-1">21 lessons</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Management</p>
                  <p className="text-2xl font-bold text-purple-600">$500</p>
                  <p className="text-xs text-gray-500 mt-1">Stipend</p>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">$1,340</p>
                  <p className="text-xs text-gray-500 mt-1">Est. Apr 1</p>
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Earnings Breakdown</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Teaching Income</h3>
                    <span className="text-2xl font-bold text-blue-600">$840</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Lessons Completed</p>
                      <p className="font-semibold text-gray-900">21</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Average Rate</p>
                      <p className="font-semibold text-gray-900">$40/lesson</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">Management Compensation</h3>
                    <span className="text-2xl font-bold text-purple-600">$500</span>
                  </div>
                  <div className="text-sm">
                    <p className="text-gray-600">Monthly Management Stipend</p>
                    <p className="font-semibold text-gray-900">Overseeing {teamPayouts.length} teachers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Next Payout */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-600" />
                Next Payout
              </h3>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                <p className="text-4xl font-bold text-gray-900">$1,340</p>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Teaching</span>
                  <span className="font-semibold text-gray-900">$840</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Management</span>
                  <span className="font-semibold text-gray-900">$500</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
                <Calendar className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-900 font-medium">April 1, 2026</p>
                  <p className="text-blue-700 text-xs mt-0.5">Direct deposit to bank</p>
                </div>
              </div>
            </div>

            {/* Team Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold">Your Team</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Teachers Managed</p>
                  <p className="text-3xl font-bold text-purple-600">{teamPayouts.length}</p>
                </div>
                <div className="pt-3 border-t border-purple-200">
                  <p className="text-sm text-gray-600 mb-1">Team Payout (Next Cycle)</p>
                  <p className="text-2xl font-bold text-gray-900">${totalTeamPayout.toLocaleString()}</p>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('team-overview')}
                className="w-full mt-4 px-4 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                View Team Details
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Team Overview */
        <div className="space-y-6">
          {/* Team Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Team Size</p>
              </div>
              <p className="text-3xl font-semibold text-gray-900">{teamPayouts.length}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Total Lessons</p>
              </div>
              <p className="text-3xl font-semibold text-gray-900">{totalCompletedLessons}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Team Payout</p>
              </div>
              <p className="text-3xl font-semibold text-gray-900">${totalTeamPayout.toLocaleString()}</p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-gray-600">Needs Review</p>
              </div>
              <p className="text-3xl font-semibold text-gray-900">
                {teamPayouts.filter(t => t.status === 'Review Needed').length}
              </p>
            </div>
          </div>

          {/* Team Payouts Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Teacher Payouts</h2>
                  <p className="text-sm text-gray-600 mt-1">Current payout period: Mar 16 - Mar 31, 2026</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                  <Download className="w-4 h-4" />
                  Export Report
                </button>
              </div>

              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Teacher</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Completed</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Pending</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Current Earnings</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Next Payout</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Payout Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {teamPayouts.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center text-white font-semibold`}>
                            {teacher.initials}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{teacher.name}</p>
                            {teacher.alert && (
                              <p className="text-xs text-amber-600">{teacher.alert}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {teacher.completedLessons} lessons
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                          {teacher.pendingLessons} lessons
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">${teacher.currentPeriodEarnings}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">${teacher.nextPayout}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{teacher.payoutDate}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          teacher.status === 'On Track' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end">
                          <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
