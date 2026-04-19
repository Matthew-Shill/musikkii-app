import { Users, TrendingUp, AlertTriangle, Award, BookOpen, Calendar, Filter, Download, ChevronRight, Target } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

export function TeacherManagerReportsView() {
  const [dateRange, setDateRange] = useState('last-30-days');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  // Teacher performance overview data
  const performanceOverview = {
    totalActiveTeachers: 28,
    avgLessonCompletion: 94.2,
    avgAttendance: 96.8,
    avgRetention: 92.5,
    avgSatisfaction: 4.6,
    avgResponsiveness: 88.3
  };

  // Teacher load data
  const teacherLoad = [
    { teacher: 'Sarah Johnson', students: 24, capacity: 30, utilization: 80, lessons: 96 },
    { teacher: 'Michael Davis', students: 22, capacity: 30, utilization: 73, lessons: 88 },
    { teacher: 'Emily Chen', students: 19, capacity: 25, utilization: 76, lessons: 76 },
    { teacher: 'David Martinez', students: 18, capacity: 25, utilization: 72, lessons: 72 },
    { teacher: 'Lisa Anderson', students: 16, capacity: 20, utilization: 80, lessons: 64 },
    { teacher: 'Robert Wilson', students: 28, capacity: 25, utilization: 112, lessons: 112 },
    { teacher: 'Jennifer Lee', students: 14, capacity: 20, utilization: 70, lessons: 56 },
  ];

  // Student outcomes by teacher
  const studentOutcomes = [
    { teacher: 'Sarah Johnson', practiceEngagement: 92, lessonConsistency: 96, milestoneCompletion: 88 },
    { teacher: 'Michael Davis', practiceEngagement: 89, lessonConsistency: 94, milestoneCompletion: 85 },
    { teacher: 'Emily Chen', practiceEngagement: 95, lessonConsistency: 98, milestoneCompletion: 91 },
    { teacher: 'David Martinez', practiceEngagement: 87, lessonConsistency: 92, milestoneCompletion: 83 },
    { teacher: 'Lisa Anderson', practiceEngagement: 91, lessonConsistency: 95, milestoneCompletion: 89 },
  ];

  // Quality metrics
  const qualityMetrics = [
    { metric: 'Lesson Notes Completion', value: 96, trend: 'up', status: 'excellent' },
    { metric: 'Feedback Timeliness', value: 88, trend: 'stable', status: 'good' },
    { metric: 'Technology Compliance', value: 100, trend: 'up', status: 'excellent' },
    { metric: 'Assignment Quality', value: 92, trend: 'up', status: 'excellent' },
  ];

  // Retention risk data
  const retentionRisks = [
    { teacher: 'David Martinez', atRiskStudents: 3, lowEngagement: 5, attendanceIssues: 2 },
    { teacher: 'Jennifer Lee', atRiskStudents: 2, lowEngagement: 3, attendanceIssues: 1 },
    { teacher: 'Robert Wilson', atRiskStudents: 4, lowEngagement: 6, attendanceIssues: 3 },
  ];

  // Lesson completion trend
  const completionTrend = [
    { week: 'Week 1', completed: 245, canceled: 12, noShow: 3 },
    { week: 'Week 2', completed: 252, canceled: 10, noShow: 2 },
    { week: 'Week 3', completed: 248, canceled: 15, noShow: 4 },
    { week: 'Week 4', completed: 256, canceled: 8, noShow: 2 },
  ];

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Teacher Performance Reports</h1>
          <p className="text-sm md:text-base text-gray-600">Monitor teacher effectiveness, coaching opportunities, and student outcomes</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Teacher</label>
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Teachers</option>
                <option value="sarah">Sarah Johnson</option>
                <option value="michael">Michael Davis</option>
                <option value="emily">Emily Chen</option>
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

        {/* Performance Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-700" />
              <p className="text-xs font-medium text-blue-700">Active Teachers</p>
            </div>
            <p className="text-2xl font-bold text-blue-900">{performanceOverview.totalActiveTeachers}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-green-700" />
              <p className="text-xs font-medium text-green-700">Lesson Completion</p>
            </div>
            <p className="text-2xl font-bold text-green-900">{performanceOverview.avgLessonCompletion}%</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-700" />
              <p className="text-xs font-medium text-purple-700">Attendance Rate</p>
            </div>
            <p className="text-2xl font-bold text-purple-900">{performanceOverview.avgAttendance}%</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-amber-700" />
              <p className="text-xs font-medium text-amber-700">Retention Rate</p>
            </div>
            <p className="text-2xl font-bold text-amber-900">{performanceOverview.avgRetention}%</p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl shadow-sm border border-pink-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-pink-700" />
              <p className="text-xs font-medium text-pink-700">Satisfaction</p>
            </div>
            <p className="text-2xl font-bold text-pink-900">{performanceOverview.avgSatisfaction}/5</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl shadow-sm border border-indigo-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-indigo-700" />
              <p className="text-xs font-medium text-indigo-700">Responsiveness</p>
            </div>
            <p className="text-2xl font-bold text-indigo-900">{performanceOverview.avgResponsiveness}%</p>
          </div>
        </div>

        {/* Coaching Opportunities Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-900 mb-2">Coaching Opportunities</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">Robert Wilson: Over capacity (112%) - student load management</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Review →</button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">Jennifer Lee: Below 75% utilization - roster building support</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Review →</button>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-800">3 teachers with students showing low engagement - intervention needed</span>
                  <button className="text-amber-700 hover:text-amber-900 font-medium">Review →</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Completion Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Lesson Completion Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={completionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#10b981" name="Completed" radius={[8, 8, 0, 0]} />
              <Bar dataKey="canceled" fill="#f59e0b" name="Canceled" radius={[8, 8, 0, 0]} />
              <Bar dataKey="noShow" fill="#ef4444" name="No-Show" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Teacher Load & Capacity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Teacher Load & Capacity</h2>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View Details →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Teacher</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Students</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Capacity</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Utilization</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Lessons/Month</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {teacherLoad.map((teacher) => (
                  <tr key={teacher.teacher} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{teacher.teacher}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{teacher.students}</td>
                    <td className="px-4 py-3 text-gray-700">{teacher.capacity}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.utilization > 100 ? 'bg-red-100 text-red-700' :
                        teacher.utilization >= 75 ? 'bg-green-100 text-green-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {teacher.utilization}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{teacher.lessons}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Student Outcomes by Teacher */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Student Outcomes by Teacher</h2>
          <div className="space-y-4">
            {studentOutcomes.map((teacher) => (
              <div key={teacher.teacher} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{teacher.teacher}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700 font-medium mb-1">Practice Engagement</p>
                    <p className="text-xl font-bold text-blue-900">{teacher.practiceEngagement}%</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-medium mb-1">Lesson Consistency</p>
                    <p className="text-xl font-bold text-green-900">{teacher.lessonConsistency}%</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-700 font-medium mb-1">Milestone Completion</p>
                    <p className="text-xl font-bold text-purple-900">{teacher.milestoneCompletion}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Quality & Instructional Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityMetrics.map((metric) => (
              <div key={metric.metric} className={`rounded-lg p-4 border-2 ${
                metric.status === 'excellent' ? 'bg-green-50 border-green-200' :
                metric.status === 'good' ? 'bg-blue-50 border-blue-200' :
                'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric.status === 'excellent' ? 'bg-green-100 text-green-700' :
                    metric.status === 'good' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {metric.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}%</p>
                <p className="text-xs text-gray-600">Trend: {metric.trend === 'up' ? '↑ Improving' : '→ Stable'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Retention Risk */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">Retention Risk by Teacher</h2>
          <div className="space-y-3">
            {retentionRisks.map((risk) => (
              <div key={risk.teacher} className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{risk.teacher}</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-gray-600">At-Risk Students</p>
                        <p className="text-lg font-bold text-red-600">{risk.atRiskStudents}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Low Engagement</p>
                        <p className="text-lg font-bold text-amber-600">{risk.lowEngagement}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Attendance Issues</p>
                        <p className="text-lg font-bold text-orange-600">{risk.attendanceIssues}</p>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium">
                    Intervene
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
