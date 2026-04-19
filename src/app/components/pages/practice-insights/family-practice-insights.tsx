import { Clock, Flame, ChevronRight, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface ChildData {
  id: string;
  name: string;
  instrument: string;
  weeklyMinutes: number;
  currentStreak: number;
  daysThisWeek: number;
  goalProgress: number;
  avgPerDay: number;
  trend: number;
}

export function FamilyPracticeInsights() {
  const [selectedChild, setSelectedChild] = useState<string | null>(null);

  const children: ChildData[] = [
    {
      id: '1',
      name: 'Emma',
      instrument: 'Piano',
      weeklyMinutes: 150,
      currentStreak: 12,
      daysThisWeek: 5,
      goalProgress: 83,
      avgPerDay: 21,
      trend: 5
    },
    {
      id: '2',
      name: 'Oliver',
      instrument: 'Guitar',
      weeklyMinutes: 120,
      currentStreak: 8,
      daysThisWeek: 4,
      goalProgress: 67,
      avgPerDay: 17,
      trend: -3
    },
    {
      id: '3',
      name: 'Sophia',
      instrument: 'Violin',
      weeklyMinutes: 180,
      currentStreak: 15,
      daysThisWeek: 6,
      goalProgress: 100,
      avgPerDay: 26,
      trend: 8
    }
  ];

  const totalMinutes = children.reduce((sum, child) => sum + child.weeklyMinutes, 0);
  const avgStreak = Math.round(children.reduce((sum, child) => sum + child.currentStreak, 0) / children.length);

  if (selectedChild) {
    const child = children.find(c => c.id === selectedChild);
    if (!child) return null;

    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => setSelectedChild(null)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to all children
        </button>

        {/* Individual child view - similar to parent view */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900">{child.name}'s Practice</h2>
          <p className="text-gray-600">{child.instrument}</p>
        </div>

        {/* Stats would go here - same as parent view */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">This Week</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{child.weeklyMinutes} min</p>
            <p className="text-xs text-gray-500 mt-1">Across {child.daysThisWeek} days</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Flame className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{child.currentStreak} days</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Weekly Goal</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{child.goalProgress}%</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Avg Per Day</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{child.avgPerDay} min</p>
            <p className={`text-xs mt-1 ${child.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {child.trend >= 0 ? '+' : ''}{child.trend} min from last week
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Household Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">Total This Week</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalMinutes} min</p>
          <p className="text-xs text-gray-500 mt-1">Across all children</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-sm text-gray-600">Avg Streak</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{avgStreak} days</p>
          <p className="text-xs text-gray-500 mt-1">Household average</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm text-gray-600">Active Students</p>
          </div>
          <p className="text-3xl font-bold text-gray-900">{children.length}</p>
          <p className="text-xs text-gray-500 mt-1">Practicing this week</p>
        </div>
      </div>

      {/* Individual Children */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Children</h2>
          <p className="text-sm text-gray-600">Click to view detailed insights</p>
        </div>

        <div className="divide-y divide-gray-200">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {child.name[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{child.name}</h3>
                      <p className="text-sm text-gray-600">{child.instrument}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">This Week</p>
                      <p className="text-lg font-bold text-gray-900">{child.weeklyMinutes} min</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Streak</p>
                      <p className="text-lg font-bold text-amber-600 flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {child.currentStreak}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Goal Progress</p>
                      <p className="text-lg font-bold text-green-600">{child.goalProgress}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Avg/Day</p>
                      <p className="text-lg font-bold text-gray-900">{child.avgPerDay} min</p>
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-gray-400" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
