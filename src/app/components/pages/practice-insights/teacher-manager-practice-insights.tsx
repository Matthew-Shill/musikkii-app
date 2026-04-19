import { Clock, TrendingUp, Users, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

interface TeacherData {
  id: string;
  name: string;
  instrument: string;
  studentCount: number;
  totalMinutes: number;
  avgMinutesPerStudent: number;
  activeStudents: number;
  studentsNeedingAttention: number;
}

interface StudentData {
  id: string;
  name: string;
  weeklyMinutes: number;
  currentStreak: number;
  daysThisWeek: number;
  goalProgress: number;
  needsAttention: boolean;
}

export function TeacherManagerPracticeInsights() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);

  const teachers: TeacherData[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      instrument: 'Piano',
      studentCount: 12,
      totalMinutes: 1440,
      avgMinutesPerStudent: 120,
      activeStudents: 11,
      studentsNeedingAttention: 2
    },
    {
      id: '2',
      name: 'Michael Rivera',
      instrument: 'Guitar',
      studentCount: 15,
      totalMinutes: 1650,
      avgMinutesPerStudent: 110,
      activeStudents: 13,
      studentsNeedingAttention: 3
    },
    {
      id: '3',
      name: 'Emily Chen',
      instrument: 'Violin',
      studentCount: 10,
      totalMinutes: 1350,
      avgMinutesPerStudent: 135,
      activeStudents: 10,
      studentsNeedingAttention: 0
    },
    {
      id: '4',
      name: 'David Martinez',
      instrument: 'Drums',
      studentCount: 8,
      totalMinutes: 720,
      avgMinutesPerStudent: 90,
      activeStudents: 7,
      studentsNeedingAttention: 1
    }
  ];

  // Mock student data for selected teacher
  const getStudentsForTeacher = (teacherId: string): StudentData[] => {
    return [
      {
        id: '1',
        name: 'Emma Wilson',
        weeklyMinutes: 150,
        currentStreak: 12,
        daysThisWeek: 5,
        goalProgress: 83,
        needsAttention: false
      },
      {
        id: '2',
        name: 'Michael Chen',
        weeklyMinutes: 45,
        currentStreak: 3,
        daysThisWeek: 2,
        goalProgress: 25,
        needsAttention: true
      },
      {
        id: '3',
        name: 'Sophia Martinez',
        weeklyMinutes: 180,
        currentStreak: 15,
        daysThisWeek: 6,
        goalProgress: 100,
        needsAttention: false
      }
    ];
  };

  const totalStudents = teachers.reduce((sum, t) => sum + t.studentCount, 0);
  const totalMinutes = teachers.reduce((sum, t) => sum + t.totalMinutes, 0);
  const avgMinutes = Math.round(totalMinutes / totalStudents);
  const totalNeedingAttention = teachers.reduce((sum, t) => sum + t.studentsNeedingAttention, 0);

  // Teacher detail view
  if (selectedTeacher) {
    const teacher = teachers.find(t => t.id === selectedTeacher);
    if (!teacher) return null;

    const students = getStudentsForTeacher(selectedTeacher);

    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedTeacher(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all teachers
        </button>

        {/* Teacher header */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
              {teacher.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{teacher.name}</h2>
              <p className="text-gray-600">{teacher.instrument} • {teacher.studentCount} students</p>
            </div>
          </div>
        </div>

        {/* Teacher stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Total Practice</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.totalMinutes} min</p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Class Average</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.avgMinutesPerStudent} min</p>
            <p className="text-xs text-gray-500 mt-1">Per student</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Active Students</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.activeStudents}/{teacher.studentCount}</p>
            <p className="text-xs text-gray-500 mt-1">Practiced this week</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm text-gray-600">Need Attention</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{teacher.studentsNeedingAttention}</p>
            <p className="text-xs text-gray-500 mt-1">Below practice goals</p>
          </div>
        </div>

        {/* Students list */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{teacher.name}'s Students</h2>
            <p className="text-sm text-gray-600">Practice insights for this teacher's students</p>
          </div>

          <div className="divide-y divide-gray-200">
            {students.map((student) => (
              <div key={student.id} className="p-6 hover:bg-gray-50 transition-colors">
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

                    <div className="grid grid-cols-4 gap-4">
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
                        <p className="text-base font-bold text-amber-600">{student.currentStreak} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Goal Progress</p>
                        <p className={`text-base font-bold ${student.goalProgress >= 70 ? 'text-green-600' : student.goalProgress >= 40 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {student.goalProgress}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Overview of all teachers
  return (
    <div className="space-y-6">
      {/* Organization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
          <p className="text-xs text-gray-500 mt-1">Across {teachers.length} teachers</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Total Practice</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">This week</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Org Average</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">Per student</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <p className="text-sm text-gray-600">Need Attention</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalNeedingAttention}</p>
          <p className="text-xs text-gray-500 mt-1">Students organization-wide</p>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Teaching Team</h2>
          <p className="text-sm text-gray-600">Click a teacher to view their students' practice insights</p>
        </div>

        <div className="divide-y divide-gray-200">
          {teachers.map((teacher) => (
            <button
              key={teacher.id}
              onClick={() => setSelectedTeacher(teacher.id)}
              className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{teacher.name}</h3>
                      <p className="text-sm text-gray-600">{teacher.instrument} • {teacher.studentCount} students</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Practice</p>
                      <p className="text-base font-bold text-gray-900">{teacher.totalMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Class Average</p>
                      <p className="text-base font-bold text-gray-900">{teacher.avgMinutesPerStudent} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Active Students</p>
                      <p className="text-base font-bold text-green-600">{teacher.activeStudents}/{teacher.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Need Attention</p>
                      <p className={`text-base font-bold ${teacher.studentsNeedingAttention > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                        {teacher.studentsNeedingAttention}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Engagement</p>
                      <p className="text-base font-bold text-blue-600">
                        {Math.round((teacher.activeStudents / teacher.studentCount) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-gray-400 ml-4" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
