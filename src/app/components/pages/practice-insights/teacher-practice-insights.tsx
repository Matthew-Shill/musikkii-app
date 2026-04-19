import { Clock, Flame, TrendingUp, ChevronRight, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface StudentData {
  id: string;
  name: string;
  instrument: string;
  weeklyMinutes: number;
  currentStreak: number;
  daysThisWeek: number;
  goalProgress: number;
  avgPerDay: number;
  trend: number;
  needsAttention: boolean;
}

export function TeacherPracticeInsights() {
  const [sortBy, setSortBy] = useState<'name' | 'time' | 'streak'>('name');

  const students: StudentData[] = [
    {
      id: '1',
      name: 'Emma Wilson',
      instrument: 'Piano',
      weeklyMinutes: 150,
      currentStreak: 12,
      daysThisWeek: 5,
      goalProgress: 83,
      avgPerDay: 21,
      trend: 5,
      needsAttention: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      instrument: 'Piano',
      weeklyMinutes: 45,
      currentStreak: 3,
      daysThisWeek: 2,
      goalProgress: 25,
      avgPerDay: 6,
      trend: -15,
      needsAttention: true
    },
    {
      id: '3',
      name: 'Sophia Martinez',
      instrument: 'Piano',
      weeklyMinutes: 180,
      currentStreak: 15,
      daysThisWeek: 6,
      goalProgress: 100,
      avgPerDay: 26,
      trend: 8,
      needsAttention: false
    },
    {
      id: '4',
      name: 'Lucas Brown',
      instrument: 'Piano',
      weeklyMinutes: 90,
      currentStreak: 7,
      daysThisWeek: 4,
      goalProgress: 50,
      avgPerDay: 13,
      trend: 0,
      needsAttention: false
    },
    {
      id: '5',
      name: 'Olivia Davis',
      instrument: 'Piano',
      weeklyMinutes: 30,
      currentStreak: 0,
      daysThisWeek: 1,
      goalProgress: 17,
      avgPerDay: 4,
      trend: -20,
      needsAttention: true
    }
  ];

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'time') return b.weeklyMinutes - a.weeklyMinutes;
    if (sortBy === 'streak') return b.currentStreak - a.currentStreak;
    return 0;
  });

  const totalMinutes = students.reduce((sum, s) => sum + s.weeklyMinutes, 0);
  const avgMinutes = Math.round(totalMinutes / students.length);
  const studentsNeedingAttention = students.filter(s => s.needsAttention).length;
  const activeStudents = students.filter(s => s.daysThisWeek > 0).length;

  return (
    <div className="space-y-6">
      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Practice</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Class Average</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">Per student</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Active Students</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{activeStudents}/{students.length}</p>
          <p className="text-xs text-gray-500 mt-1">Practiced this week</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">Need Attention</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{studentsNeedingAttention}</p>
          <p className="text-xs text-gray-500 mt-1">Below practice goals</p>
        </div>
      </div>

      {/* Students Needing Attention */}
      {studentsNeedingAttention > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-900">Students Needing Attention</h3>
          </div>
          <div className="space-y-2">
            {students.filter(s => s.needsAttention).map(student => (
              <div key={student.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{student.name}</p>
                  <p className="text-sm text-gray-600">Only {student.weeklyMinutes} min this week ({student.goalProgress}% of goal)</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                  Send Reminder
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">All Students</h2>
              <p className="text-sm text-gray-600">Practice insights for your students</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'time' | 'streak')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <option value="name">Sort by Name</option>
                <option value="time">Sort by Practice Time</option>
                <option value="streak">Sort by Streak</option>
              </select>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {sortedStudents.map((student) => (
            <div
              key={student.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{student.name}</h3>
                      {student.needsAttention && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                          <AlertTriangle className="w-3 h-3" />
                          Needs attention
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">This Week</p>
                      <p className="text-base font-bold text-gray-900">{student.weeklyMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Days Active</p>
                      <p className="text-base font-bold text-gray-900">{student.daysThisWeek}/7</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Streak</p>
                      <p className="text-base font-bold text-amber-600 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {student.currentStreak}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Goal Progress</p>
                      <p className={`text-base font-bold ${student.goalProgress >= 70 ? 'text-green-600' : student.goalProgress >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {student.goalProgress}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Trend</p>
                      <p className={`text-base font-bold flex items-center gap-1 ${student.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {student.trend >= 0 ? '↑' : '↓'} {Math.abs(student.trend)} min
                      </p>
                    </div>
                  </div>
                </div>

                <button className="ml-6 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
