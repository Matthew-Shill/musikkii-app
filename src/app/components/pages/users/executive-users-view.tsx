import { Users, TrendingUp, Target, Award, AlertTriangle, ChevronRight, UserCheck, UserPlus } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function ExecutiveUsersView() {
  // User base overview data
  const userStats = {
    totalUsers: 847,
    activeStudents: 412,
    totalFamilies: 186,
    totalTeachers: 28,
    growthThisMonth: 34,
    retentionRate: 94,
    activeAccounts: 758,
    trialToPaidConversion: 68
  };

  // Role distribution data
  const roleDistribution = [
    { name: 'Students', value: 412, color: '#3b82f6' },
    { name: 'Parents', value: 186, color: '#8b5cf6' },
    { name: 'Multi-Student Families', value: 124, color: '#ec4899' },
    { name: 'Teachers', value: 28, color: '#10b981' },
    { name: 'Admins', value: 8, color: '#f59e0b' },
  ];

  // Growth trend data
  const growthTrend = [
    { month: 'Sep', users: 650, active: 590 },
    { month: 'Oct', users: 702, active: 635 },
    { month: 'Nov', users: 745, active: 672 },
    { month: 'Dec', users: 780, active: 705 },
    { month: 'Jan', users: 813, active: 738 },
    { month: 'Feb', users: 847, active: 758 },
  ];

  // Student-to-teacher distribution
  const teacherLoad = [
    { teacher: 'Sarah Johnson', students: 24, capacity: 30 },
    { teacher: 'Michael Davis', students: 22, capacity: 30 },
    { teacher: 'Emily Chen', students: 19, capacity: 25 },
    { teacher: 'David Martinez', students: 18, capacity: 25 },
    { teacher: 'Lisa Anderson', students: 16, capacity: 20 },
    { teacher: 'Others', students: 313, capacity: 400 },
  ];

  // Onboarding completion trends
  const onboardingData = [
    { week: 'Week 1', completed: 85, incomplete: 15 },
    { week: 'Week 2', completed: 88, incomplete: 12 },
    { week: 'Week 3', completed: 82, incomplete: 18 },
    { week: 'Week 4', completed: 91, incomplete: 9 },
  ];

  // Engagement insights
  const engagementMetrics = {
    highEngagement: 412,
    mediumEngagement: 289,
    lowEngagement: 57,
    atRisk: 89
  };

  // Family insights
  const familyInsights = {
    singleStudent: 98,
    twoStudents: 56,
    threeOrMore: 32,
    avgStudentsPerFamily: 2.2
  };

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">User Base Overview</h1>
          <p className="text-sm md:text-base text-gray-600">Strategic insights into user growth, engagement, and organizational health</p>
        </div>

        {/* User Base Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-700" />
              <p className="text-xs md:text-sm font-medium text-blue-700">Total Users</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-900">{userStats.totalUsers}</p>
            <p className="text-xs text-blue-600 mt-1">+{userStats.growthThisMonth} this month</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-700" />
              <p className="text-xs md:text-sm font-medium text-purple-700">Active Students</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-purple-900">{userStats.activeStudents}</p>
            <p className="text-xs text-purple-600 mt-1">{userStats.totalFamilies} families</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="w-5 h-5 text-green-700" />
              <p className="text-xs md:text-sm font-medium text-green-700">Teachers</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-900">{userStats.totalTeachers}</p>
            <p className="text-xs text-green-600 mt-1">Avg {(userStats.activeStudents / userStats.totalTeachers).toFixed(1)} students each</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm border border-amber-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-amber-700" />
              <p className="text-xs md:text-sm font-medium text-amber-700">Retention Rate</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-amber-900">{userStats.retentionRate}%</p>
            <p className="text-xs text-amber-600 mt-1">{userStats.trialToPaidConversion}% trial conversion</p>
          </div>
        </div>

        {/* Growth Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">User Growth Trend</h2>
              <p className="text-sm text-gray-600">Total users and active accounts over time</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} name="Total Users" />
              <Line type="monotone" dataKey="active" stroke="#10b981" strokeWidth={3} name="Active Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Role Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Role Distribution</h2>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full md:w-1/2 space-y-2">
                {roleDistribution.map((role) => (
                  <div key={role.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="text-sm text-gray-700">{role.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{role.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Family Account Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Family Account Insights</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">Single Student Families</p>
                <p className="text-2xl font-bold text-blue-900">{familyInsights.singleStudent}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700 font-medium mb-1">Two Student Families</p>
                <p className="text-2xl font-bold text-purple-900">{familyInsights.twoStudents}</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-pink-700 font-medium mb-1">3+ Student Families</p>
                <p className="text-2xl font-bold text-pink-900">{familyInsights.threeOrMore}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">Average Students per Family</p>
                <p className="text-xl font-bold text-gray-900">{familyInsights.avgStudentsPerFamily}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Teacher Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Teacher Load Distribution</h2>
              <p className="text-sm text-gray-600">Student assignments and capacity utilization</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teacherLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="teacher" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="students" fill="#3b82f6" name="Current Students" radius={[8, 8, 0, 0]} />
              <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement & Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-6">User Engagement Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <p className="text-xs font-medium text-green-700">High Engagement</p>
              </div>
              <p className="text-2xl font-bold text-green-900">{engagementMetrics.highEngagement}</p>
              <p className="text-xs text-green-600 mt-1">Active & consistent</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <p className="text-xs font-medium text-blue-700">Medium Engagement</p>
              </div>
              <p className="text-2xl font-bold text-blue-900">{engagementMetrics.mediumEngagement}</p>
              <p className="text-xs text-blue-600 mt-1">Moderate activity</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <p className="text-xs font-medium text-amber-700">Low Engagement</p>
              </div>
              <p className="text-2xl font-bold text-amber-900">{engagementMetrics.lowEngagement}</p>
              <p className="text-xs text-amber-600 mt-1">Needs attention</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <p className="text-xs font-medium text-red-700">At Risk</p>
              </div>
              <p className="text-2xl font-bold text-red-900">{engagementMetrics.atRisk}</p>
              <p className="text-xs text-red-600 mt-1">Intervention needed</p>
            </div>
          </div>
        </div>

        {/* Onboarding Completion Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Onboarding Completion Trends</h2>
              <p className="text-sm text-gray-600">Weekly onboarding success rates</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={onboardingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" style={{ fontSize: '12px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" radius={[0, 0, 0, 0]} />
              <Bar dataKey="incomplete" stackId="a" fill="#ef4444" name="Incomplete" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Strategic Insights & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-green-700" />
              <h3 className="font-bold text-green-900">Growth Opportunities</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-green-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Strong retention:</strong> 94% user retention rate indicates high satisfaction</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Multi-student growth:</strong> 32 families with 3+ students show expansion potential</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Teacher capacity:</strong> Room to onboard 100+ more students with current staff</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-green-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Trial conversion:</strong> 68% trial-to-paid shows effective onboarding</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
              <h3 className="font-bold text-amber-900">Areas Requiring Attention</h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>At-risk users:</strong> 89 users showing low engagement patterns</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Onboarding bottlenecks:</strong> 9-18% incomplete onboarding weekly</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Teacher load variance:</strong> Uneven distribution across instructor base</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-amber-800">
                <ChevronRight className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span><strong>Engagement monitoring:</strong> 57 users in low engagement segment</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
