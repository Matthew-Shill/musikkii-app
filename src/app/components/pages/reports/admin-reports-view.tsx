import { Users, Calendar, DollarSign, Mail, AlertCircle, CheckCircle, TrendingUp, Download, Filter } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

export function AdminReportsView() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [reportCategory, setReportCategory] = useState('overview');

  // Operational overview data
  const operationalOverview = {
    activeUsers: 847,
    activeStudents: 412,
    activeTeachers: 28,
    lessonsCompleted: 1001,
    lessonsCanceled: 45,
    reschedulesProcessed: 67,
    makeUpCreditsIssued: 34,
    makeUpCreditsUsed: 28,
    makeUpCreditsExpired: 6,
    trialConversions: 12,
    overdueOnboarding: 15
  };

  // Scheduling metrics
  const schedulingMetrics = {
    lessonFulfillmentRate: 95.5,
    cancellationRate: 4.3,
    rescheduleRate: 6.4,
    noShowRate: 0.8,
    schedulingConflicts: 3,
    substituteUsage: 8,
    unassignedStudents: 5
  };

  // Billing metrics
  const billingMetrics = {
    activeSubscriptions: 398,
    failedPayments: 12,
    overdueInvoices: 8,
    refundsIssued: 4,
    creditsIssued: 34,
    creditsApplied: 28,
    trialToPaidConversion: 68
  };

  // User & onboarding metrics
  const onboardingMetrics = {
    newUsersThisMonth: 45,
    onboardingCompletionRate: 87,
    incompleteProfiles: 23,
    activationRate: 82,
    linkingIssues: 5,
    assignmentLag: 12,
    inactiveAccounts: 89
  };

  // Communication metrics
  const communicationMetrics = {
    emailDeliveryRate: 99.2,
    smsDeliveryRate: 98.7,
    workflowSuccessRate: 96.5,
    unsentNotifications: 3,
    delayedFollowUps: 2,
    automationErrors: 4
  };

  // Lesson trends
  const lessonTrends = [
    { month: 'Sep', completed: 856, canceled: 48, rescheduled: 52 },
    { month: 'Oct', completed: 912, canceled: 42, rescheduled: 58 },
    { month: 'Nov', completed: 945, canceled: 39, rescheduled: 61 },
    { month: 'Dec', completed: 978, canceled: 44, rescheduled: 64 },
    { month: 'Jan', completed: 989, canceled: 41, rescheduled: 66 },
    { month: 'Feb', completed: 1001, canceled: 45, rescheduled: 67 },
  ];

  // User growth
  const userGrowth = [
    { month: 'Sep', new: 38, activated: 31 },
    { month: 'Oct', new: 42, activated: 35 },
    { month: 'Nov', new: 39, activated: 32 },
    { month: 'Dec', new: 41, activated: 34 },
    { month: 'Jan', new: 43, activated: 36 },
    { month: 'Feb', new: 45, activated: 37 },
  ];

  // Exception queue
  const exceptionQueue = [
    { category: 'Flagged Accounts', count: 7, priority: 'medium' },
    { category: 'Failed Payments', count: 12, priority: 'high' },
    { category: 'Overdue Onboarding', count: 15, priority: 'medium' },
    { category: 'Unassigned Students', count: 5, priority: 'high' },
    { category: 'Automation Failures', count: 4, priority: 'medium' },
    { category: 'Scheduling Conflicts', count: 3, priority: 'low' },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Operations Reports</h1>
          <p className="text-sm md:text-base text-gray-600">Monitor platform performance, system health, and operational efficiency</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Report Category</label>
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="overview">Operational Overview</option>
                <option value="scheduling">Scheduling Reports</option>
                <option value="billing">Billing & Payments</option>
                <option value="onboarding">User & Onboarding</option>
                <option value="communication">Communications</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last-7-days">Last 7 Days</option>
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="year-to-date">Year to Date</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Exception Queue Alert */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-3">Action Queue - Items Requiring Attention</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {exceptionQueue.filter(e => e.priority === 'high').map((exception) => (
                  <div key={exception.category} className="flex items-center justify-between bg-white rounded-lg p-3">
                    <span className="text-sm text-red-800 font-medium">{exception.category}</span>
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">{exception.count}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-sm text-red-700 hover:text-red-900 font-medium">View All Exceptions →</button>
            </div>
          </div>
        </div>

        {/* Operational Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-700" />
              <p className="text-xs font-medium text-blue-700">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{operationalOverview.activeUsers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-700" />
              <p className="text-xs font-medium text-green-700">Lessons Done</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{operationalOverview.lessonsCompleted}</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-amber-700" />
              <p className="text-xs font-medium text-amber-700">Canceled</p>
            </div>
            <p className="text-2xl font-bold text-amber-900">{operationalOverview.lessonsCanceled}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-700" />
              <p className="text-xs font-medium text-purple-700">Rescheduled</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{operationalOverview.reschedulesProcessed}</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-sm border border-pink-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-pink-700" />
              <p className="text-xs font-medium text-pink-700">Trial Conversions</p>
            </div>
            <p className="text-2xl font-bold text-pink-900">{operationalOverview.trialConversions}</p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-sm border border-red-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-red-700" />
              <p className="text-xs font-medium text-red-700">Overdue Steps</p>
            </div>
            <p className="text-2xl font-bold text-red-900">{operationalOverview.overdueOnboarding}</p>
          </div>
        </div>

        {/* Lesson Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Lesson Activity Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lessonTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} name="Completed" />
              <Line type="monotone" dataKey="canceled" stroke="#f59e0b" strokeWidth={3} name="Canceled" />
              <Line type="monotone" dataKey="rescheduled" stroke="#8b5cf6" strokeWidth={3} name="Rescheduled" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Scheduling Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Scheduling Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-900">Lesson Fulfillment Rate</span>
                <span className="text-lg font-bold text-green-700">{schedulingMetrics.lessonFulfillmentRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-gray-900">Cancellation Rate</span>
                <span className="text-lg font-bold text-amber-700">{schedulingMetrics.cancellationRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-900">Reschedule Rate</span>
                <span className="text-lg font-bold text-blue-700">{schedulingMetrics.rescheduleRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-gray-900">No-Show Rate</span>
                <span className="text-lg font-bold text-red-700">{schedulingMetrics.noShowRate}%</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Conflicts</p>
                    <p className="text-xl font-bold text-gray-900">{schedulingMetrics.schedulingConflicts}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Substitute Usage</p>
                    <p className="text-xl font-bold text-gray-900">{schedulingMetrics.substituteUsage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Reports */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Billing & Payments</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-900">Active Subscriptions</span>
                <span className="text-lg font-bold text-green-700">{billingMetrics.activeSubscriptions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-sm font-medium text-gray-900">Failed Payments</span>
                <span className="text-lg font-bold text-red-700">{billingMetrics.failedPayments}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-gray-900">Overdue Invoices</span>
                <span className="text-lg font-bold text-amber-700">{billingMetrics.overdueInvoices}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-900">Refunds Issued</span>
                <span className="text-lg font-bold text-blue-700">{billingMetrics.refundsIssued}</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Credits Issued</p>
                    <p className="text-xl font-bold text-gray-900">{billingMetrics.creditsIssued}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Credits Applied</p>
                    <p className="text-xl font-bold text-gray-900">{billingMetrics.creditsApplied}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">User Growth & Activation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" fill="#3b82f6" name="New Users" radius={[8, 8, 0, 0]} />
              <Bar dataKey="activated" fill="#10b981" name="Activated" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Onboarding & User Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Onboarding & Activation</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">New Users This Month</span>
                <span className="text-lg font-bold text-blue-900">{onboardingMetrics.newUsersThisMonth}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Completion Rate</span>
                <span className="text-lg font-bold text-green-900">{onboardingMetrics.onboardingCompletionRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <span className="text-sm text-gray-700">Incomplete Profiles</span>
                <span className="text-lg font-bold text-amber-900">{onboardingMetrics.incompleteProfiles}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-gray-700">Activation Rate</span>
                <span className="text-lg font-bold text-purple-900">{onboardingMetrics.activationRate}%</span>
              </div>
            </div>
          </div>

          {/* Communication Performance */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Communication & Automation</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">Email Delivery Rate</span>
                <span className="text-lg font-bold text-green-900">{communicationMetrics.emailDeliveryRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-gray-700">SMS Delivery Rate</span>
                <span className="text-lg font-bold text-green-900">{communicationMetrics.smsDeliveryRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-gray-700">Workflow Success Rate</span>
                <span className="text-lg font-bold text-blue-900">{communicationMetrics.workflowSuccessRate}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <span className="text-sm text-gray-700">Automation Errors</span>
                <span className="text-lg font-bold text-red-900">{communicationMetrics.automationErrors}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
