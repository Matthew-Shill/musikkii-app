import { TrendingUp, Users, Target, Award, BarChart3, Download, AlertTriangle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { useState } from 'react';

export function ExecutiveReportsView() {
  const [dateRange, setDateRange] = useState('last-90-days');
  const [segment, setSegment] = useState('all');

  // Business performance overview
  const businessPerformance = {
    totalActiveStudents: 412,
    totalFamilies: 186,
    totalTeachers: 28,
    monthlyGrowth: 8.3,
    retentionRate: 92.5,
    churnRate: 7.5,
    lessonVolume: 1001,
    avgUtilization: 78.4
  };

  // Growth trends
  const growthTrends = [
    { month: 'Aug', students: 356, families: 162, revenue: 45200 },
    { month: 'Sep', students: 368, families: 168, revenue: 46800 },
    { month: 'Oct', students: 382, families: 174, revenue: 48600 },
    { month: 'Nov', students: 394, families: 179, revenue: 50100 },
    { month: 'Dec', students: 403, families: 182, revenue: 51300 },
    { month: 'Jan', students: 408, families: 184, revenue: 51900 },
    { month: 'Feb', students: 412, families: 186, revenue: 52400 },
  ];

  // Enrollment by type
  const enrollmentData = [
    { type: 'Piano', students: 186, growth: 12 },
    { type: 'Guitar', students: 94, growth: 8 },
    { type: 'Violin', students: 67, growth: 6 },
    { type: 'Voice', students: 42, growth: 4 },
    { type: 'Drums', students: 23, growth: 2 },
  ];

  // Retention & engagement
  const retentionData = [
    { month: 'Sep', active: 356, inactive: 42, atRisk: 18 },
    { month: 'Oct', active: 368, inactive: 38, atRisk: 16 },
    { month: 'Nov', active: 382, inactive: 35, atRisk: 15 },
    { month: 'Dec', active: 394, inactive: 32, atRisk: 14 },
    { month: 'Jan', active: 408, inactive: 28, atRisk: 12 },
    { month: 'Feb', active: 412, inactive: 25, atRisk: 11 },
  ];

  // Teacher utilization
  const teacherUtilization = [
    { category: 'Optimal (75-90%)', count: 18, percentage: 64 },
    { category: 'Underutilized (<75%)', count: 6, percentage: 21 },
    { category: 'Over-capacity (>90%)', count: 4, percentage: 14 },
  ];

  // Trial conversion funnel
  const conversionFunnel = [
    { stage: 'Trial Scheduled', count: 68, percentage: 100 },
    { stage: 'Trial Completed', count: 62, percentage: 91 },
    { stage: 'Converted to Paid', count: 42, percentage: 68 },
  ];

  // Quality indicators
  const qualityMetrics = {
    studentProgressScore: 88,
    parentSatisfaction: 4.6,
    teacherPerformanceAvg: 91,
    lessonConsistency: 94,
    noteCompletionRate: 96,
    serviceExperienceScore: 92
  };

  // Strategic risks
  const strategicRisks = [
    { area: 'Teacher Capacity Constraints', level: 'medium', impact: 'Growth limited by available teacher capacity' },
    { area: 'Student Churn Trend', level: 'low', impact: 'Slight uptick in churn among 6-month cohort' },
    { area: 'Payment Failure Rate', level: 'low', impact: '3% payment failure - within normal range' },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Strategic Performance Reports</h1>
          <p className="text-sm md:text-base text-gray-600">Business performance, growth trends, and organizational health insights</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Time Period</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="last-30-days">Last 30 Days</option>
                <option value="last-90-days">Last 90 Days</option>
                <option value="last-6-months">Last 6 Months</option>
                <option value="year-to-date">Year to Date</option>
                <option value="all-time">All Time</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Segment</label>
              <select
                value={segment}
                onChange={(e) => setSegment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Segments</option>
                <option value="students">Students Only</option>
                <option value="families">Families Only</option>
                <option value="teachers">Teachers Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>

        {/* Business Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-700" />
              <p className="text-xs md:text-sm font-medium text-blue-700">Active Students</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-900">{businessPerformance.totalActiveStudents}</p>
            <p className="text-xs text-blue-600 mt-1">+{businessPerformance.monthlyGrowth}% this month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-700" />
              <p className="text-xs md:text-sm font-medium text-purple-700">Total Families</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-900">{businessPerformance.totalFamilies}</p>
            <p className="text-xs text-purple-600 mt-1">{(businessPerformance.totalActiveStudents / businessPerformance.totalFamilies).toFixed(1)} students/family</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-700" />
              <p className="text-xs md:text-sm font-medium text-green-700">Retention Rate</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-900">{businessPerformance.retentionRate}%</p>
            <p className="text-xs text-green-600 mt-1">Strong performance</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-amber-700" />
              <p className="text-xs md:text-sm font-medium text-amber-700">Utilization</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-900">{businessPerformance.avgUtilization}%</p>
            <p className="text-xs text-amber-600 mt-1">{businessPerformance.lessonVolume} lessons/month</p>
          </div>
        </div>

        {/* Strategic Risks Alert */}
        {strategicRisks.some(r => r.level === 'high' || r.level === 'medium') && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 mb-3">Strategic Attention Areas</h3>
                <div className="space-y-2">
                  {strategicRisks.filter(r => r.level === 'medium').map((risk, i) => (
                    <div key={i} className="bg-white rounded-lg p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 text-sm">{risk.area}</h4>
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                              {risk.level} risk
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{risk.impact}</p>
                        </div>
                        <button className="text-sm text-amber-700 hover:text-amber-900 font-medium ml-4">Review</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Growth Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Growth & Revenue Trends</h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={growthTrends}>
              <defs>
                <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="left" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis yAxisId="right" orientation="right" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Area yAxisId="left" type="monotone" dataKey="students" stroke="#3b82f6" fillOpacity={1} fill="url(#colorStudents)" name="Students" />
              <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Enrollment by Program */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Enrollment by Program</h2>
            <div className="space-y-3">
              {enrollmentData.map((program) => (
                <div key={program.type} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{program.type}</h4>
                    <span className="text-sm text-green-600 font-medium">+{program.growth} this month</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(program.students / 412) * 100}%` }}
                      />
                    </div>
                    <span className="text-lg font-bold text-gray-900">{program.students}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{((program.students / 412) * 100).toFixed(1)}% of total students</p>
                </div>
              ))}
            </div>
          </div>

          {/* Trial Conversion Funnel */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Trial Conversion Funnel</h2>
            <div className="space-y-4">
              {conversionFunnel.map((stage, index) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                    <span className="text-sm font-bold text-gray-900">{stage.percentage}%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-purple-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    <span className="absolute right-0 -top-1 text-xs font-bold text-gray-900">{stage.count}</span>
                  </div>
                </div>
              ))}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-green-800">
                  <strong>68% conversion rate</strong> from trial to paid - exceeding industry benchmarks
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Retention & Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Student Retention & Engagement Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} name="Active Students" />
              <Line type="monotone" dataKey="inactive" stroke="#ef4444" strokeWidth={3} name="Inactive" />
              <Line type="monotone" dataKey="atRisk" stroke="#f59e0b" strokeWidth={3} name="At Risk" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Teacher Utilization */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Teacher Capacity & Utilization</h2>
            <div className="space-y-4">
              {teacherUtilization.map((category) => (
                <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm">{category.category}</h4>
                    <span className="text-lg font-bold text-gray-900">{category.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full ${
                        category.category.includes('Optimal') ? 'bg-green-500' :
                        category.category.includes('Under') ? 'bg-amber-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{category.percentage}% of teaching staff</p>
                </div>
              ))}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800">
                  <strong>64% of teachers</strong> operating at optimal capacity (75-90% utilization)
                </p>
              </div>
            </div>
          </div>

          {/* Quality & Experience Indicators */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Quality & Experience Metrics</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-sm font-medium text-gray-900">Student Progress Score</span>
                <span className="text-lg font-bold text-green-700">{qualityMetrics.studentProgressScore}/100</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-sm font-medium text-gray-900">Parent Satisfaction</span>
                <span className="text-lg font-bold text-blue-700">{qualityMetrics.parentSatisfaction}/5.0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-sm font-medium text-gray-900">Teacher Performance Avg</span>
                <span className="text-lg font-bold text-purple-700">{qualityMetrics.teacherPerformanceAvg}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-sm font-medium text-gray-900">Lesson Consistency</span>
                <span className="text-lg font-bold text-amber-700">{qualityMetrics.lessonConsistency}%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg border border-pink-200">
                <span className="text-sm font-medium text-gray-900">Service Experience</span>
                <span className="text-lg font-bold text-pink-700">{qualityMetrics.serviceExperienceScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Insights */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-blue-900">Strategic Performance Insights</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Growth Momentum
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 8.3% monthly student growth - accelerating</li>
                <li>• 186 active families with 2.2 students avg</li>
                <li>• Piano program leading with 45% share</li>
                <li>• 68% trial conversion exceeds targets</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Retention Strength
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 92.5% retention rate - industry-leading</li>
                <li>• Declining at-risk cohort (down 39%)</li>
                <li>• 94% lesson consistency across platform</li>
                <li>• 4.6/5.0 parent satisfaction score</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                Opportunities
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Teacher capacity exists for 100+ students</li>
                <li>• 6 underutilized teachers ready for growth</li>
                <li>• Multi-student families show expansion potential</li>
                <li>• Strong quality metrics support scaling</li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Watch Areas
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 4 teachers over-capacity need redistribution</li>
                <li>• Slight churn uptick in 6-month cohort</li>
                <li>• Teacher hiring needed to sustain growth</li>
                <li>• Monitor payment failure trends</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
