import { TrendingUp, Award, Target, Calendar, Brain, Music, Eye, CheckCircle2, AlertCircle, Star, BookOpen } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ParentProgressView() {
  // Practice consistency data
  const practiceData = [
    { month: 'Sep', minutes: 320, attendance: 100 },
    { month: 'Oct', minutes: 420, attendance: 100 },
    { month: 'Nov', minutes: 480, attendance: 100 },
    { month: 'Dec', minutes: 510, attendance: 100 },
    { month: 'Jan', minutes: 590, attendance: 100 },
    { month: 'Feb', minutes: 640, attendance: 100 },
  ];

  // Skill Development
  const skillAreas = [
    { name: 'Technique', progress: 75, level: 'Intermediate', trend: 'improving', teacherNote: 'Finger coordination improving steadily' },
    { name: 'Rhythm', progress: 65, level: 'Developing', trend: 'improving', teacherNote: 'Better understanding of beat and timing' },
    { name: 'Reading', progress: 70, level: 'Intermediate', trend: 'strong', teacherNote: 'Reading notation confidently' },
    { name: 'Listening', progress: 60, level: 'Developing', trend: 'improving', teacherNote: 'Ear training showing good progress' },
    { name: 'Theory', progress: 68, level: 'Developing', trend: 'strong', teacherNote: 'Grasping concepts well for age level' },
    { name: 'Performance', progress: 55, level: 'Emerging', trend: 'improving', teacherNote: 'Building confidence, needs encouragement' },
  ];

  const radarData = skillAreas.map(skill => ({
    category: skill.name,
    score: skill.progress
  }));

  // Milestones
  const milestones = [
    { id: 1, title: 'Started Music Lessons', date: 'Sep 10, 2025', status: 'completed', category: 'Journey' },
    { id: 2, title: 'First Song Completed', date: 'Sep 28, 2025', status: 'completed', category: 'Achievement' },
    { id: 3, title: '10 Lessons Attended', date: 'Oct 24, 2025', status: 'completed', category: 'Consistency' },
    { id: 4, title: 'Basic Scales Mastered', date: 'Nov 15, 2025', status: 'completed', category: 'Skill' },
    { id: 5, title: '50 Hours Practice', date: 'Dec 8, 2025', status: 'completed', category: 'Dedication' },
    { id: 6, title: 'First Recital Performance', date: 'Jan 18, 2026', status: 'completed', category: 'Performance' },
    { id: 7, title: 'Intermediate Level Reached', date: 'Feb 5, 2026', status: 'completed', category: 'Progress' },
    { id: 8, title: '100 Hours Practice Goal', date: 'Target: Apr 2026', status: 'in-progress', category: 'Goal' },
  ];

  // Teacher observations
  const teacherObservations = [
    {
      date: 'Feb 22, 2026',
      category: 'Technique',
      observation: 'Emma is showing excellent improvement in hand positioning and finger coordination. She is ready to tackle more complex pieces.',
      sentiment: 'positive'
    },
    {
      date: 'Feb 18, 2026',
      category: 'Practice Habits',
      observation: 'Consistent practice schedule is evident in her progress. Keep encouraging regular practice sessions.',
      sentiment: 'positive'
    },
    {
      date: 'Feb 15, 2026',
      category: 'Performance Confidence',
      observation: 'Emma sometimes hesitates during performances. Building confidence through low-pressure practice performances at home would help.',
      sentiment: 'constructive'
    },
    {
      date: 'Feb 10, 2026',
      category: 'Musical Understanding',
      observation: 'She demonstrates strong comprehension of musical concepts and can apply theory to practice effectively.',
      sentiment: 'positive'
    },
  ];

  // Goals and benchmarks
  const currentGoals = [
    { id: 1, title: 'Master 5 New Songs This Quarter', progress: 60, target: 'Mar 31, 2026', status: 'on-track', category: 'Repertoire' },
    { id: 2, title: 'Improve Sight Reading Speed', progress: 70, target: 'Mar 15, 2026', status: 'ahead', category: 'Reading' },
    { id: 3, title: 'Practice 100 Hours Total', progress: 52, target: 'Apr 15, 2026', status: 'on-track', category: 'Dedication' },
    { id: 4, title: 'Perform at Spring Recital', progress: 80, target: 'Apr 1, 2026', status: 'on-track', category: 'Performance' },
  ];

  // Learning Journey Timeline
  const journeyEvents = [
    { date: 'Sep 10, 2025', event: 'Began lessons with Sarah Johnson', type: 'start', description: 'First piano lesson - introduced to basics' },
    { date: 'Sep 28, 2025', event: 'Completed first song', type: 'achievement', description: '"Twinkle Twinkle Little Star" played from memory' },
    { date: 'Nov 15, 2025', event: 'Teacher checkpoint - strong foundation', type: 'evaluation', description: 'Progressing well, showing dedication' },
    { date: 'Jan 18, 2026', event: 'Winter Recital Performance', type: 'performance', description: 'Performed confidently in front of audience' },
    { date: 'Feb 5, 2026', event: 'Advanced to Intermediate Level', type: 'milestone', description: 'Ready for more complex musical pieces' },
  ];

  // Songs completed
  const songsCompleted = 8;
  const songsInProgress = 3;

  return (
    <div className="bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Emma's Musical Progress</h1>
          <p className="text-sm md:text-base text-gray-600">Track your child's development and growth over time</p>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Development Overview</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-blue-700 font-medium mb-1">Learning Duration</p>
              <p className="text-2xl md:text-3xl font-bold text-blue-900">6 months</p>
              <p className="text-xs text-blue-600 mt-1">Since Sep 2025</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-green-700 font-medium mb-1">Lesson Attendance</p>
              <p className="text-2xl md:text-3xl font-bold text-green-900">100%</p>
              <p className="text-xs text-green-600 mt-1">24 of 24 lessons</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-purple-700 font-medium mb-1">Total Practice Time</p>
              <p className="text-2xl md:text-3xl font-bold text-purple-900">52.5 hrs</p>
              <p className="text-xs text-purple-600 mt-1">Growing steadily</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-4">
              <p className="text-xs md:text-sm text-amber-700 font-medium mb-1">Songs Completed</p>
              <p className="text-2xl md:text-3xl font-bold text-amber-900">{songsCompleted}</p>
              <p className="text-xs text-amber-600 mt-1">{songsInProgress} in progress</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Practice Consistency (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={practiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="minutes" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} name="Minutes" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">Lesson Attendance</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={practiceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <YAxis domain={[0, 100]} stroke="#6b7280" style={{ fontSize: '12px' }} />
                  <Tooltip />
                  <Bar dataKey="attendance" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Skill Development */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Skill Development by Category</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">Skill Balance Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#d1d5db" />
                  <PolarAngleAxis dataKey="category" style={{ fontSize: '11px' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} style={{ fontSize: '10px' }} />
                  <Radar name="Progress" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {skillAreas.map((skill) => (
                <div key={skill.name} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">{skill.name}</h4>
                      <p className="text-xs text-gray-500">{skill.level}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {skill.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-600" />}
                      {skill.trend === 'strong' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                      <span className="text-lg font-bold text-gray-900">{skill.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${skill.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 italic">Teacher: "{skill.teacherNote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Milestones & Achievements */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Milestones Achieved</h2>
            </div>

            <div className="space-y-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    milestone.status === 'completed'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {milestone.status === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Target className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm">{milestone.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        milestone.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {milestone.category}
                      </span>
                      <span className="text-xs text-gray-600">{milestone.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Current Goals */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Current Learning Goals</h2>
            </div>

            <div className="space-y-4">
              {currentGoals.map((goal) => (
                <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{goal.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">{goal.category}</span>
                        <span>Due: {goal.target}</span>
                      </div>
                    </div>
                    {goal.status === 'ahead' && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Ahead</span>
                    )}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 text-right">{goal.progress}% complete</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Teacher Observations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-green-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Teacher Observations & Feedback</h2>
          </div>

          <div className="space-y-3">
            {teacherObservations.map((obs, index) => (
              <div
                key={index}
                className={`border-l-4 rounded-r-lg p-4 ${
                  obs.sentiment === 'positive'
                    ? 'border-green-400 bg-green-50'
                    : 'border-blue-400 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    obs.sentiment === 'positive'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {obs.category}
                  </span>
                  <span className="text-xs text-gray-600">{obs.date}</span>
                </div>
                <p className="text-sm text-gray-700">{obs.observation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Journey Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Learning Journey Timeline</h2>
          </div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {journeyEvents.map((item, index) => (
                <div key={index} className="relative pl-12">
                  <div
                    className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      item.type === 'start' ? 'bg-blue-600' :
                      item.type === 'achievement' ? 'bg-green-600' :
                      item.type === 'evaluation' ? 'bg-purple-600' :
                      item.type === 'performance' ? 'bg-amber-600' :
                      'bg-indigo-600'
                    }`}
                  >
                    {item.type === 'achievement' && <Star className="w-4 h-4 text-white" />}
                    {item.type === 'start' && <BookOpen className="w-4 h-4 text-white" />}
                    {item.type === 'performance' && <Music className="w-4 h-4 text-white" />}
                    {item.type === 'evaluation' && <Eye className="w-4 h-4 text-white" />}
                    {item.type === 'milestone' && <Award className="w-4 h-4 text-white" />}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">{item.date}</p>
                    <p className="text-sm font-semibold text-gray-900 mb-1">{item.event}</p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths and Focus Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-700" />
              <h3 className="font-bold text-green-900">Current Strengths</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-green-800">
                <strong>Consistency:</strong> Excellent lesson attendance and regular practice schedule
              </li>
              <li className="text-sm text-green-800">
                <strong>Reading Skills:</strong> Reading notation at age-appropriate level with confidence
              </li>
              <li className="text-sm text-green-800">
                <strong>Dedication:</strong> Shows commitment and enthusiasm for learning
              </li>
              <li className="text-sm text-green-800">
                <strong>Technical Progress:</strong> Hand positioning and finger coordination developing well
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-blue-700" />
              <h3 className="font-bold text-blue-900">Recommended Focus Areas</h3>
            </div>
            <ul className="space-y-2">
              <li className="text-sm text-blue-800">
                <strong>Performance Confidence:</strong> Practice playing in front of family to build comfort
              </li>
              <li className="text-sm text-blue-800">
                <strong>Creative Expression:</strong> Encourage improvisation and musical experimentation
              </li>
              <li className="text-sm text-blue-800">
                <strong>Ear Training:</strong> Continued development of listening and interval recognition
              </li>
              <li className="text-sm text-blue-800">
                <strong>Support at Home:</strong> Keep encouraging regular practice and celebrate progress
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
