import { Search, AlertCircle, DollarSign, Users, TrendingUp, Download, Filter, Clock } from 'lucide-react';
import { useState } from 'react';

export function AdminPayoutsView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'on-track' | 'review' | 'exceptions'>('all');

  const teachers = [
    { 
      id: 1, 
      name: 'Jessica Miller',
      initials: 'JM',
      color: 'from-blue-400 to-blue-600',
      role: 'Full-Time Teacher',
      completedLessons: 28, 
      pendingLessons: 8,
      currentEarnings: 1140, 
      projectedPayout: 1520,
      payoutDate: 'Apr 1',
      method: 'Direct Deposit',
      status: 'On Track'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson',
      initials: 'SJ',
      color: 'from-purple-400 to-purple-600',
      role: 'Part-Time Teacher',
      completedLessons: 26, 
      pendingLessons: 7,
      currentEarnings: 1060, 
      projectedPayout: 1340,
      payoutDate: 'Apr 1',
      method: 'Direct Deposit',
      status: 'On Track'
    },
    { 
      id: 3, 
      name: 'Michael Davis',
      initials: 'MD',
      color: 'from-green-400 to-green-600',
      role: 'Teacher Manager',
      completedLessons: 21, 
      pendingLessons: 6,
      currentEarnings: 1340, 
      projectedPayout: 1580,
      payoutDate: 'Apr 1',
      method: 'Direct Deposit',
      status: 'On Track',
      note: 'Includes management stipend'
    },
    { 
      id: 4, 
      name: 'Katie Wilson',
      initials: 'KW',
      color: 'from-orange-400 to-orange-600',
      role: 'Full-Time Teacher',
      completedLessons: 22, 
      pendingLessons: 9,
      currentEarnings: 900, 
      projectedPayout: 1260,
      payoutDate: 'Apr 1',
      method: 'Check',
      status: 'Review Needed',
      alert: 'Bank info update required'
    },
    { 
      id: 5, 
      name: 'Emily Rodriguez',
      initials: 'ER',
      color: 'from-pink-400 to-rose-600',
      role: 'Part-Time Teacher',
      completedLessons: 18, 
      pendingLessons: 5,
      currentEarnings: 740, 
      projectedPayout: 940,
      payoutDate: 'Apr 1',
      method: 'Direct Deposit',
      status: 'On Track'
    },
  ];

  const totalPayoutLiability = teachers.reduce((sum, t) => sum + t.projectedPayout, 0);
  const totalCompletedEarnings = teachers.reduce((sum, t) => sum + t.currentEarnings, 0);
  const totalTeachers = teachers.length;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Payout Management</h1>
        <p className="text-gray-600">Monitor teacher compensation, payout cycles, and liabilities</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-gray-600">Active Teachers</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalTeachers}</p>
          <p className="text-xs text-gray-500 mt-1">Receiving payouts</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <p className="text-sm text-gray-600">Current Period Paid</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${totalCompletedEarnings.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">For completed lessons</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Next Payout Total</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">${totalPayoutLiability.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1">Due April 1, 2026</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <p className="text-sm text-gray-600">Exceptions</p>
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {teachers.filter(t => t.status === 'Review Needed').length}
          </p>
          <p className="text-xs text-amber-600 mt-1">Needs attention</p>
        </div>
      </div>

      {/* Payout Alerts */}
      {teachers.some(t => t.status === 'Review Needed') && (
        <div className="mb-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-amber-900">
                {teachers.filter(t => t.status === 'Review Needed').length} Payout Exception{teachers.filter(t => t.status === 'Review Needed').length > 1 ? 's' : ''} Require Review
              </p>
              <p className="text-sm text-amber-700 mt-1">Some teachers need attention before the next payout cycle.</p>
            </div>
            <button className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
              Review
            </button>
          </div>
        </div>
      )}

      {/* Upcoming Payout Cycle */}
      <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold">Next Payout Cycle</h2>
            <p className="text-gray-600">March 16 - March 31, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Total Payout Liability</p>
            <p className="text-3xl font-bold text-gray-900">${totalPayoutLiability.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Payout Date</p>
            <p className="text-lg font-semibold text-gray-900">April 1, 2026</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Teachers Receiving</p>
            <p className="text-lg font-semibold text-gray-900">{totalTeachers}</p>
          </div>
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Direct Deposits</p>
            <p className="text-lg font-semibold text-gray-900">
              {teachers.filter(t => t.method === 'Direct Deposit').length}
            </p>
          </div>
        </div>
      </div>

      {/* Teacher Payouts Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Table Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Teacher Payouts</h2>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Process Payouts
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by teacher name or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
              {[
                { id: 'all', label: 'All' },
                { id: 'on-track', label: 'On Track' },
                { id: 'review', label: 'Review' },
                { id: 'exceptions', label: 'Exceptions' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilterStatus(filter.id as any)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    filterStatus === filter.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Teacher</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Completed</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Pending</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Current Earnings</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Projected Payout</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Method</th>
                <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center text-white font-semibold`}>
                        {teacher.initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{teacher.name}</p>
                        {teacher.note && (
                          <p className="text-xs text-gray-500">{teacher.note}</p>
                        )}
                        {teacher.alert && (
                          <p className="text-xs text-amber-600">{teacher.alert}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {teacher.role}
                    </span>
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
                    <span className="font-semibold text-gray-900">${teacher.currentEarnings}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-gray-900">${teacher.projectedPayout}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600 text-sm">{teacher.method}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      teacher.status === 'On Track' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
                        View Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-300 bg-gray-50">
              <tr>
                <td colSpan={4} className="py-4 px-6 font-semibold text-gray-900">Total</td>
                <td className="py-4 px-6 font-semibold text-gray-900">${totalCompletedEarnings.toLocaleString()}</td>
                <td className="py-4 px-6 font-bold text-lg text-gray-900">${totalPayoutLiability.toLocaleString()}</td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-{teachers.length} of {teachers.length} teachers</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
