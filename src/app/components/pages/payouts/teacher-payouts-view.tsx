import { DollarSign, Download, Calendar, CheckCircle2, Clock, TrendingUp, FileText } from 'lucide-react';

export function TeacherPayoutsView() {
  const completedLessons = [
    { id: 1, date: 'Mar 17', student: 'Emma Williams', duration: '45 min', rate: 45, amount: 45 },
    { id: 2, date: 'Mar 17', student: 'Michael Chen', duration: '30 min', rate: 35, amount: 35 },
    { id: 3, date: 'Mar 16', student: 'Sarah Johnson', duration: '45 min', rate: 45, amount: 45 },
    { id: 4, date: 'Mar 16', student: 'David Park', duration: '30 min', rate: 35, amount: 35 },
    { id: 5, date: 'Mar 15', student: 'Emma Williams', duration: '45 min', rate: 45, amount: 45 },
  ];

  const pendingLessons = [
    { id: 1, date: 'Mar 19', student: 'Michael Chen', duration: '30 min', rate: 35, amount: 35 },
    { id: 2, date: 'Mar 20', student: 'Emma Williams', duration: '45 min', rate: 45, amount: 45 },
    { id: 3, date: 'Mar 21', student: 'David Park', duration: '30 min', rate: 35, amount: 35 },
  ];

  const payoutHistory = [
    { id: 1, period: 'Mar 1 - Mar 15, 2026', lessons: 28, amount: 1140, paidDate: 'Mar 16, 2026', status: 'Paid' },
    { id: 2, period: 'Feb 16 - Feb 29, 2026', lessons: 26, amount: 1060, paidDate: 'Mar 1, 2026', status: 'Paid' },
    { id: 3, period: 'Feb 1 - Feb 15, 2026', lessons: 27, amount: 1100, paidDate: 'Feb 16, 2026', status: 'Paid' }
  ];

  const completedEarnings = completedLessons.reduce((sum, lesson) => sum + lesson.amount, 0);
  const pendingEarnings = pendingLessons.reduce((sum, lesson) => sum + lesson.amount, 0);
  const projectedPayout = completedEarnings + pendingEarnings;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Payouts</h1>
        <p className="text-gray-600">Track your earnings, lessons, and payout schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Payout Period */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Current Payout Period</h2>
                <p className="text-gray-600">March 16 - March 31, 2026</p>
              </div>
              <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                In Progress
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Completed Lessons</p>
                <p className="text-3xl font-bold text-green-600">{completedLessons.length}</p>
                <p className="text-sm text-gray-600 mt-1">${completedEarnings} earned</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Pending Lessons</p>
                <p className="text-3xl font-bold text-amber-600">{pendingLessons.length}</p>
                <p className="text-sm text-gray-600 mt-1">${pendingEarnings} pending</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Projected Payout</p>
                <p className="text-3xl font-bold text-gray-900">${projectedPayout}</p>
                <p className="text-sm text-gray-600 mt-1">Est. Apr 1</p>
              </div>
            </div>
          </div>

          {/* Completed Lessons Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Completed Lessons</h2>
              <p className="text-sm text-gray-600 mt-1">Lessons completed this period</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Student</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Duration</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Rate</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {completedLessons.map((lesson) => (
                    <tr key={lesson.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-600">{lesson.date}</td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{lesson.student}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{lesson.duration}</td>
                      <td className="py-4 px-6 text-gray-600">${lesson.rate}/lesson</td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-semibold text-gray-900">${lesson.amount.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-300 bg-gray-50">
                  <tr>
                    <td colSpan={4} className="py-4 px-6 font-semibold text-gray-900">Total Completed</td>
                    <td className="py-4 px-6 text-right font-bold text-green-600 text-lg">
                      ${completedEarnings.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Pending Lessons */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Pending Lessons</h2>
                  <p className="text-sm text-gray-600 mt-1">Scheduled lessons not yet completed</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                  ${pendingEarnings} Pending
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-3">
                {pendingLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-100">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">{lesson.date.split(' ')[0]}</p>
                        <p className="text-lg font-semibold text-gray-900">{lesson.date.split(' ')[1]}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{lesson.student}</p>
                        <p className="text-sm text-gray-600">{lesson.duration}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${lesson.amount}</p>
                      <p className="text-xs text-gray-500">After completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payout History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Payout History</h2>
              <p className="text-sm text-gray-600 mt-1">Previous payouts and statements</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Period</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Lessons</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Amount</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Paid Date</th>
                    <th className="text-left py-3 px-6 text-sm font-medium text-gray-600">Status</th>
                    <th className="text-right py-3 px-6 text-sm font-medium text-gray-600">Statement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {payoutHistory.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-900">{payout.period}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{payout.lessons}</td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-gray-900">${payout.amount}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">{payout.paidDate}</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          {payout.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Download Statement">
                            <Download className="w-4 h-4 text-gray-600" />
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

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Next Payout Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-600" />
              Next Payout
            </h3>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Estimated Amount</p>
              <p className="text-4xl font-bold text-gray-900">${projectedPayout}</p>
            </div>

            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">${completedEarnings}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Pending</span>
                <span className="font-semibold text-amber-600">${pendingEarnings}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-blue-900 font-medium">Payout on April 1, 2026</p>
                <p className="text-blue-700 text-xs mt-0.5">Transferred to bank account ending in 4532</p>
              </div>
            </div>
          </div>

          {/* Pay Structure */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4">Pay Structure</h3>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">45-min Lesson</span>
                  <span className="font-semibold text-gray-900">$45</span>
                </div>
                <p className="text-xs text-gray-500">Standard rate</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">30-min Lesson</span>
                  <span className="font-semibold text-gray-900">$35</span>
                </div>
                <p className="text-xs text-gray-500">Standard rate</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900 font-medium">Bi-weekly Payout Schedule</p>
              <p className="text-xs text-blue-700 mt-1">Paid on the 1st and 16th of each month</p>
            </div>
          </div>

          {/* Bank Account */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-gray-600" />
              Payout Method
            </h3>

            <div className="p-4 bg-gradient-to-br from-gray-900 to-gray-700 rounded-lg text-white mb-4">
              <p className="text-xs opacity-75 mb-3">Bank Account</p>
              <p className="text-lg tracking-wider mb-4">Chase ••••4532</p>
              <p className="text-sm opacity-90">Direct Deposit</p>
            </div>

            <button className="w-full px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Update Payout Method
            </button>
          </div>

          {/* Earnings Overview */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold">This Month</h3>
            </div>
            
            <div className="mb-3">
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-3xl font-bold text-green-600">$2,240</p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Lessons Taught</span>
                <span className="font-semibold text-gray-900">56</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Avg. per Lesson</span>
                <span className="font-semibold text-gray-900">$40</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
