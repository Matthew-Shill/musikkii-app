import { TrendingUp, Award, Target, Users, ChevronDown, ChevronUp, Brain, Music, CheckCircle2, AlertCircle, Eye, Star } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StudentData {
  id: number;
  name: string;
  age: number;
  instrument: string;
  teacher: string;
  startDate: string;
  duration: string;
  lessonsCompleted: number;
  attendance: number;
  practiceHours: number;
  songsCompleted: number;
  songsInProgress: number;
  currentLevel: string;
  milestones: number;
  skillAreas: { name: string; progress: number; level: string }[];
  recentFeedback: { date: string; note: string; category: string }[];
  strengths: string[];
  focusAreas: string[];
  nextGoal: string;
}

export function MultiStudentProgressView() {
  const [expandedStudent, setExpandedStudent] = useState<number | null>(null);

  const students: StudentData[] = [
    {
      id: 1,
      name: 'Emma',
      age: 10,
      instrument: 'Piano',
      teacher: 'Sarah Johnson',
      startDate: 'Sep 10, 2025',
      duration: '6 months',
      lessonsCompleted: 24,
      attendance: 100,
      practiceHours: 52.5,
      songsCompleted: 8,
      songsInProgress: 3,
      currentLevel: 'Intermediate',
      milestones: 7,
      skillAreas: [
        { name: 'Technique', progress: 75, level: 'Intermediate' },
        { name: 'Rhythm', progress: 65, level: 'Developing' },
        { name: 'Reading', progress: 70, level: 'Intermediate' },
        { name: 'Theory', progress: 68, level: 'Developing' },
      ],
      recentFeedback: [
        { date: 'Feb 22', note: 'Excellent improvement in hand positioning and finger coordination', category: 'Technique' },
        { date: 'Feb 18', note: 'Consistent practice showing great results', category: 'Practice Habits' },
      ],
      strengths: ['Consistent practice schedule', 'Strong sight reading', 'Excellent attendance'],
      focusAreas: ['Performance confidence', 'Creative expression'],
      nextGoal: 'Master 5 new songs by March 31'
    },
    {
      id: 2,
      name: 'Sophia',
      age: 7,
      instrument: 'Piano',
      teacher: 'Sarah Johnson',
      startDate: 'Oct 15, 2025',
      duration: '4 months',
      lessonsCompleted: 16,
      attendance: 100,
      practiceHours: 28,
      songsCompleted: 5,
      songsInProgress: 2,
      currentLevel: 'Beginner',
      milestones: 4,
      skillAreas: [
        { name: 'Technique', progress: 55, level: 'Beginner' },
        { name: 'Rhythm', progress: 60, level: 'Beginner' },
        { name: 'Reading', progress: 50, level: 'Beginner' },
        { name: 'Theory', progress: 45, level: 'Emerging' },
      ],
      recentFeedback: [
        { date: 'Feb 20', note: 'Wonderful enthusiasm and eagerness to learn!', category: 'Attitude' },
        { date: 'Feb 15', note: 'Good progress recognizing notes on the staff', category: 'Reading' },
      ],
      strengths: ['Enthusiastic learner', 'Good rhythm sense', 'Improving finger strength'],
      focusAreas: ['Note recognition practice', 'Hand position consistency'],
      nextGoal: 'Complete Beginner Repertoire Book 1'
    },
    {
      id: 3,
      name: 'Liam',
      age: 13,
      instrument: 'Guitar',
      teacher: 'Michael Davis',
      startDate: 'Sep 5, 2025',
      duration: '6.5 months',
      lessonsCompleted: 26,
      attendance: 96,
      practiceHours: 68,
      songsCompleted: 12,
      songsInProgress: 4,
      currentLevel: 'Intermediate',
      milestones: 8,
      skillAreas: [
        { name: 'Technique', progress: 80, level: 'Intermediate' },
        { name: 'Rhythm', progress: 85, level: 'Strong' },
        { name: 'Reading', progress: 65, level: 'Developing' },
        { name: 'Theory', progress: 70, level: 'Intermediate' },
      ],
      recentFeedback: [
        { date: 'Feb 21', note: 'Great progress on chord transitions and rhythm patterns', category: 'Technique' },
        { date: 'Feb 14', note: 'Showing creativity in improvisation exercises', category: 'Creativity' },
      ],
      strengths: ['Strong rhythm skills', 'Natural musical ear', 'Self-motivated practice'],
      focusAreas: ['Music theory application', 'Expand chord vocabulary'],
      nextGoal: 'Learn 3 advanced songs and perform at Spring Recital'
    }
  ];

  const toggleStudent = (studentId: number) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  // Family-wide stats
  const totalLessons = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);
  const totalPracticeHours = students.reduce((sum, s) => sum + s.practiceHours, 0);
  const totalSongsCompleted = students.reduce((sum, s) => sum + s.songsCompleted, 0);
  const totalMilestones = students.reduce((sum, s) => sum + s.milestones, 0);
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length);

  // Practice comparison data
  const practiceComparison = students.map(s => ({
    name: s.name,
    hours: s.practiceHours
  }));

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Family Music Progress</h1>
          <p className="text-sm md:text-base text-gray-600">Track all your children's musical development in one place</p>
        </div>

        {/* Family Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Family Overview</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">Active Students</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">{students.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-purple-700 font-medium mb-1">Total Lessons</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">{totalLessons}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-green-700 font-medium mb-1">Practice Hours</p>
              <p className="text-2xl md:text-3xl font-bold text-green-900">{totalPracticeHours}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-amber-700 font-medium mb-1">Songs Completed</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-900">{totalSongsCompleted}</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-pink-700 font-medium mb-1">Avg Attendance</p>
              <p className="text-2xl md:text-3xl font-bold text-pink-900">{avgAttendance}%</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Practice Time Comparison</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={practiceComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Individual Student Cards */}
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Student Header - Always Visible */}
              <div
                className="p-4 md:p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleStudent(student.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      {student.name[0]}
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">{student.name}</h3>
                      <p className="text-sm text-gray-600">Age {student.age} • {student.instrument} • {student.currentLevel}</p>
                      <p className="text-xs text-gray-500 mt-1">Teacher: {student.teacher}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:grid grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-500">Lessons</p>
                        <p className="text-lg font-bold text-gray-900">{student.lessonsCompleted}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Practice</p>
                        <p className="text-lg font-bold text-gray-900">{student.practiceHours}h</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Songs</p>
                        <p className="text-lg font-bold text-gray-900">{student.songsCompleted}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Attendance</p>
                        <p className="text-lg font-bold text-gray-900">{student.attendance}%</p>
                      </div>
                    </div>
                    {expandedStudent === student.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Mobile Stats - Visible when collapsed */}
                {expandedStudent !== student.id && (
                  <div className="md:hidden grid grid-cols-4 gap-2 mt-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Lessons</p>
                      <p className="text-base font-bold text-gray-900">{student.lessonsCompleted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Practice</p>
                      <p className="text-base font-bold text-gray-900">{student.practiceHours}h</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Songs</p>
                      <p className="text-base font-bold text-gray-900">{student.songsCompleted}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Attendance</p>
                      <p className="text-base font-bold text-gray-900">{student.attendance}%</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expanded Details */}
              {expandedStudent === student.id && (
                <div className="border-t border-gray-200 p-4 md:p-6 bg-gray-50">
                  {/* Progress Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Learning Duration</p>
                      <p className="text-lg font-bold text-gray-900">{student.duration}</p>
                      <p className="text-xs text-gray-500">{student.startDate}</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Current Level</p>
                      <p className="text-lg font-bold text-gray-900">{student.currentLevel}</p>
                      <p className="text-xs text-gray-500">{student.milestones} milestones</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Songs Progress</p>
                      <p className="text-lg font-bold text-gray-900">{student.songsCompleted} done</p>
                      <p className="text-xs text-gray-500">{student.songsInProgress} in progress</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-xs text-gray-600 mb-1">Next Goal</p>
                      <p className="text-xs font-medium text-gray-900 line-clamp-2">{student.nextGoal}</p>
                    </div>
                  </div>

                  {/* Skill Development */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Brain className="w-4 h-4 text-purple-600" />
                      Skill Development
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {student.skillAreas.map((skill) => (
                        <div key={skill.name} className="bg-white rounded-lg p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-900">{skill.name}</span>
                            <span className="text-sm text-gray-600">{skill.level}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                              style={{ width: `${skill.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 text-right mt-1">{skill.progress}%</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Teacher Feedback */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      Recent Teacher Feedback
                    </h4>
                    <div className="space-y-2">
                      {student.recentFeedback.map((feedback, index) => (
                        <div key={index} className="bg-blue-50 border-l-4 border-blue-400 rounded-r-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                              {feedback.category}
                            </span>
                            <span className="text-xs text-gray-600">{feedback.date}</span>
                          </div>
                          <p className="text-sm text-gray-700">{feedback.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Focus Areas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="text-sm font-bold text-green-900 mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Strengths
                      </h4>
                      <ul className="space-y-1">
                        {student.strengths.map((strength, index) => (
                          <li key={index} className="text-xs text-green-800 flex items-start gap-1">
                            <Star className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Focus Areas
                      </h4>
                      <ul className="space-y-1">
                        {student.focusAreas.map((area, index) => (
                          <li key={index} className="text-xs text-blue-800 flex items-start gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
