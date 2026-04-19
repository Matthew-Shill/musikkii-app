import { Clock, Target, TrendingUp, Flame, Calendar } from 'lucide-react';

export function ParentPracticeInsights() {
  const studentName = 'Emma';

  const weeklyData = [
    { day: 'Mon', minutes: 30, practiced: true },
    { day: 'Tue', minutes: 25, practiced: true },
    { day: 'Wed', minutes: 0, practiced: false },
    { day: 'Thu', minutes: 35, practiced: true },
    { day: 'Fri', minutes: 40, practiced: true },
    { day: 'Sat', minutes: 20, practiced: true },
    { day: 'Sun', minutes: 0, practiced: false }
  ];

  const recentPractice = [
    { date: 'Today, 4:30 PM', duration: '40 min', focus: 'Moonlight Sonata - First Movement' },
    { date: 'Yesterday, 3:15 PM', duration: '35 min', focus: 'Scales practice, Hanon exercises' },
    { date: 'Apr 16, 5:00 PM', duration: '20 min', focus: 'Chord progressions' },
    { date: 'Apr 15, 4:45 PM', duration: '25 min', focus: 'Sight reading exercises' }
  ];

  const totalMinutes = weeklyData.reduce((sum, day) => sum + day.minutes, 0);
  const daysThisWeek = weeklyData.filter(d => d.practiced).length;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">This Week</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">Across {daysThisWeek} days</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-gray-600">Current Streak</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">12 days</p>
          <p className="text-xs text-gray-500 mt-1">Longest: 18 days</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Weekly Goal</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">83%</p>
          <p className="text-xs text-gray-500 mt-1">{totalMinutes}/180 min</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Avg Per Day</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">21 min</p>
          <p className="text-xs text-green-600 mt-1">+5 min from last week</p>
        </div>
      </div>

      {/* Weekly Practice Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">This Week</h2>
            <p className="text-sm text-gray-600">Daily practice minutes</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
            <Calendar className="w-4 h-4" />
            View History
          </button>
        </div>

        <div className="flex items-end justify-between gap-3 h-48">
          {weeklyData.map((day, idx) => {
            const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));
            const height = maxMinutes > 0 ? (day.minutes / maxMinutes) * 100 : 0;

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-gray-100 rounded-t-lg relative" style={{ height: '100%' }}>
                  {day.practiced && (
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-gray-700">
                        {day.minutes}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium text-gray-600">{day.day}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Practice Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Practice Sessions</h2>
        <div className="space-y-3">
          {recentPractice.map((session, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{session.focus}</p>
                <p className="text-sm text-gray-600 mt-1">{session.date}</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                <Clock className="w-3.5 h-3.5 text-blue-700" />
                <span className="text-sm font-semibold text-blue-700">{session.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
