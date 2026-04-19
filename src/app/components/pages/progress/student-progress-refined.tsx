import {
  Flame,
  Trophy,
  Star,
  Crown,
  Medal,
  Award,
  Users,
  TrendingUp,
  Target,
  MapPin,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Zap,
  Heart,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Shield,
  Swords
} from 'lucide-react';
import { useState } from 'react';

const LEAGUES = [
  { name: 'Iron', color: 'from-gray-400 to-gray-600', icon: Shield },
  { name: 'Bronze', color: 'from-orange-700 to-orange-900', icon: Shield },
  { name: 'Silver', color: 'from-gray-300 to-gray-500', icon: Medal },
  { name: 'Gold', color: 'from-yellow-400 to-yellow-600', icon: Crown },
  { name: 'Platinum', color: 'from-cyan-400 to-cyan-600', icon: Trophy },
  { name: 'Emerald', color: 'from-emerald-400 to-emerald-600', icon: Sparkles },
  { name: 'Diamond', color: 'from-blue-400 to-blue-600', icon: Sparkles },
  { name: 'Virtuoso', color: 'from-purple-400 to-purple-600', icon: Star },
  { name: 'Maestro', color: 'from-pink-400 to-pink-600', icon: Crown },
  { name: 'Legend', color: 'from-red-400 via-orange-500 to-yellow-500', icon: Swords }
];

export function StudentProgressRefined() {
  const [activeTab, setActiveTab] = useState<'overview' | 'growth'>('overview');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1 md:mb-2">Your Progress</h1>
        <p className="text-sm md:text-base text-gray-600">Track your achievements and musical growth</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 md:gap-2 mb-6 md:mb-8 bg-white rounded-xl p-1 md:p-1.5 border border-gray-200 shadow-sm w-full md:w-auto md:inline-flex">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 md:flex-initial px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4" />
            <span className="text-sm md:text-base">Overview</span>
          </span>
        </button>
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex-1 md:flex-initial px-4 md:px-6 py-2 md:py-2.5 rounded-lg font-medium transition-all ${
            activeTab === 'growth'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm md:text-base">Growth</span>
          </span>
        </button>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? <OverviewTab /> : <GrowthTab />}
    </div>
  );
}

function OverviewTab() {
  const currentLeague = LEAGUES[2]; // Silver
  const leagueRank = 2;
  const totalInLeague = 50;
  const weeklyXP = 234;
  const promotionZone = 10; // Top 10 promote
  const demotionZone = 40; // Bottom 10 demote

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Weekly XP & League Status */}
      <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 rounded-2xl p-5 md:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Weekly XP</p>
              <div className="flex items-baseline gap-3">
                <span className="text-6xl font-bold">{weeklyXP}</span>
                <Zap className="w-8 h-8 text-yellow-300" />
              </div>
            </div>
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentLeague.color} flex items-center justify-center shadow-lg`}>
              <currentLeague.icon className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/20">
            <div>
              <p className="text-white/70 text-xs mb-1">League</p>
              <p className="font-semibold text-lg">{currentLeague.name}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Rank</p>
              <p className="font-semibold text-lg">#{leagueRank}</p>
            </div>
            <div>
              <p className="text-white/70 text-xs mb-1">Streak</p>
              <div className="flex items-center gap-1">
                <Flame className="w-5 h-5 text-orange-300" />
                <p className="font-semibold text-lg">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* League Standings */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${currentLeague.color} flex items-center justify-center`}>
              <currentLeague.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{currentLeague.name} League</h2>
              <p className="text-sm text-gray-600">Week resets in 3 days</p>
            </div>
          </div>
        </div>

        {/* Promotion/Demotion Info */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <ChevronUp className="w-4 h-4 text-green-600" />
              <p className="text-xs font-semibold text-green-700">Promotion Zone</p>
            </div>
            <p className="text-sm text-gray-700">Top {promotionZone} advance to {LEAGUES[3].name}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <ChevronDown className="w-4 h-4 text-red-600" />
              <p className="text-xs font-semibold text-red-700">Demotion Zone</p>
            </div>
            <p className="text-sm text-gray-700">Bottom {totalInLeague - demotionZone} drop to {LEAGUES[1].name}</p>
          </div>
        </div>

        {/* League Leaderboard */}
        <div className="space-y-2">
          {[
            { rank: 1, name: 'MusicMaster', xp: 312, isYou: false },
            { rank: 2, name: 'You', xp: 234, isYou: true },
            { rank: 3, name: 'PianoQueen', xp: 228, isYou: false },
            { rank: 4, name: 'ScalePro', xp: 220, isYou: false },
            { rank: 5, name: 'RhythmKing', xp: 215, isYou: false },
            { rank: 6, name: 'JazzFan99', xp: 208, isYou: false },
            { rank: 7, name: 'ClassicalKid', xp: 198, isYou: false },
            { rank: 8, name: 'BachLover', xp: 192, isYou: false },
            { rank: 9, name: 'StringMaster', xp: 188, isYou: false },
            { rank: 10, name: 'DrummerBoy', xp: 180, isYou: false }
          ].map((player) => {
            const inPromotionZone = player.rank <= promotionZone;
            const inDemotionZone = player.rank > demotionZone;

            return (
              <div
                key={player.rank}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  player.isYou
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                    : inPromotionZone
                    ? 'bg-green-50/50 border border-green-200'
                    : inDemotionZone
                    ? 'bg-red-50/50 border border-red-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    player.rank === 1
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg'
                      : player.rank === 2
                      ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-md'
                      : player.rank === 3
                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-md'
                      : player.isYou
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {player.rank}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${player.isYou ? 'text-blue-900' : 'text-gray-900'}`}>
                    {player.name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-gray-900">{player.xp} XP</span>
                </div>
              </div>
            );
          })}
        </div>

        <button className="w-full mt-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-colors">
          View Full Standings ({totalInLeague} players)
        </button>
      </div>

      {/* Weekly Momentum */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">XP This Week</p>
              <p className="text-2xl font-bold text-gray-900">234</p>
            </div>
          </div>
          <p className="text-xs text-green-600 font-medium">+42 from last week</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Stars Earned</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">4 assignments completed</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">12 days</p>
            </div>
          </div>
          <p className="text-xs text-gray-600">Longest: 18 days</p>
        </div>
      </div>

      {/* Achievements & Friend Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-semibold text-gray-900">Achievements</h2>
            </div>
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: 'Week Warrior', icon: Trophy, color: 'from-yellow-400 to-orange-500', earned: true },
              { name: 'Perfect Practice', icon: Star, color: 'from-blue-400 to-blue-600', earned: true },
              { name: '100 Stars', icon: Zap, color: 'from-purple-400 to-purple-600', earned: true },
              { name: 'Early Bird', icon: Crown, color: 'from-pink-400 to-pink-600', earned: false },
              { name: 'Dedication', icon: Medal, color: 'from-green-400 to-green-600', earned: false },
              { name: 'Master', icon: Award, color: 'from-red-400 to-red-600', earned: false }
            ].map((achievement, idx) => (
              <div
                key={idx}
                className={`aspect-square rounded-xl p-3 flex flex-col items-center justify-center text-center ${
                  achievement.earned
                    ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg`
                    : 'bg-gray-100 text-gray-400 border-2 border-dashed border-gray-300'
                }`}
              >
                <achievement.icon className="w-7 h-7 mb-1.5" />
                <p className="text-[10px] font-medium leading-tight">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Friend Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Friend Activity</h2>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Sarah M.', action: 'moved up to Gold League', time: '2h ago', avatar: 'S', color: 'from-pink-500 to-purple-500' },
              { name: 'Alex K.', action: 'earned Perfect Week badge', time: '5h ago', avatar: 'A', color: 'from-blue-500 to-cyan-500' },
              { name: 'Emma R.', action: 'reached 15-day streak 🔥', time: '1d ago', avatar: 'E', color: 'from-green-500 to-emerald-500' },
              { name: 'David L.', action: 'leveled up to Level 12', time: '1d ago', avatar: 'D', color: 'from-orange-500 to-red-500' }
            ].map((friend, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${friend.color} flex items-center justify-center text-white font-semibold shadow-md`}>
                  {friend.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-semibold">{friend.name}</span> {friend.action}
                  </p>
                  <p className="text-xs text-gray-500">{friend.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GrowthTab() {
  return (
    <div className="space-y-6">
      {/* Current Level & Stars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Level Progress */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/80 text-sm uppercase tracking-wide mb-1">Your Level</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">8</span>
                  <Crown className="w-8 h-8 text-purple-200" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress to Level 9</span>
                <span className="font-medium">62%</span>
              </div>
              <div className="w-full h-3 bg-purple-900/30 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full shadow-lg" style={{ width: '62%' }} />
              </div>
              <p className="text-white/80 text-xs">Based on balanced musical growth across all areas</p>
            </div>
          </div>
        </div>

        {/* Total Stars */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-32 translate-x-32" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-white/90 text-sm uppercase tracking-wide mb-1">Total Stars</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">142</span>
                  <Star className="w-8 h-8 fill-white" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
              <div>
                <p className="text-white/80 text-xs mb-1">This Week</p>
                <p className="text-2xl font-bold">+8</p>
              </div>
              <div>
                <p className="text-white/80 text-xs mb-1">This Month</p>
                <p className="text-2xl font-bold">+28</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Musical Growth by Category */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Musical Growth</h2>
            <p className="text-sm text-gray-600">Your development across different musical areas</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { skill: 'Technique', level: 8, max: 10, stars: 45, color: 'blue' },
            { skill: 'Sight Reading', level: 6, max: 10, stars: 28, color: 'green' },
            { skill: 'Music Theory', level: 7, max: 10, stars: 32, color: 'purple' },
            { skill: 'Rhythm', level: 9, max: 10, stars: 52, color: 'orange' },
            { skill: 'Dynamics', level: 5, max: 10, stars: 18, color: 'pink' },
            { skill: 'Expression', level: 6, max: 10, stars: 24, color: 'indigo' }
          ].map((skill) => (
            <div key={skill.skill} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-900">{skill.skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Level {skill.level}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{skill.stars}</span>
                  </div>
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${skill.color}-400 to-${skill.color}-600 rounded-full`}
                  style={{ width: `${(skill.level / skill.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones & Teacher Feedback */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Milestones */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Milestones</h2>
          </div>
          <div className="space-y-3">
            {[
              { title: 'Reached Level 8', date: 'Apr 15, 2026', icon: Crown, color: 'purple' },
              { title: 'Earned 100th star', date: 'Apr 10, 2026', icon: Star, color: 'yellow' },
              { title: 'First recital performance', date: 'Mar 28, 2026', icon: Trophy, color: 'blue' },
              { title: 'Mastered all major scales', date: 'Mar 15, 2026', icon: Award, color: 'green' }
            ].map((milestone, idx) => (
              <div key={idx} className={`flex items-start gap-3 p-3 bg-${milestone.color}-50 rounded-lg border border-${milestone.color}-100`}>
                <div className={`w-8 h-8 rounded-lg bg-${milestone.color}-200 flex items-center justify-center flex-shrink-0`}>
                  <milestone.icon className={`w-4 h-4 text-${milestone.color}-700`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900">{milestone.title}</p>
                  <p className="text-xs text-gray-600">{milestone.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Evaluations */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Heart className="w-5 h-5 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Teacher Feedback</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                teacher: 'Ms. Rodriguez',
                date: 'Apr 14, 2026',
                feedback: 'Excellent progress on technique this month. Your finger independence has improved significantly.'
              },
              {
                teacher: 'Ms. Rodriguez',
                date: 'Mar 31, 2026',
                feedback: 'Great work on sight reading! You\'re recognizing patterns much faster now.'
              }
            ].map((evaluation, idx) => (
              <div key={idx} className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{evaluation.teacher}</span>
                  <span className="text-xs text-gray-600">{evaluation.date}</span>
                </div>
                <p className="text-sm text-gray-700">{evaluation.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths & Focus Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <Zap className="w-7 h-7" />
            <h2 className="text-xl font-semibold">Your Strengths</h2>
          </div>
          <div className="space-y-2.5">
            {['Rhythm accuracy & timing', 'Quick musical learner', 'Consistent practice habits', 'Strong musical memory'].map(
              (strength, idx) => (
                <div key={idx} className="flex items-center gap-3 text-green-50 bg-white/10 rounded-lg p-3 backdrop-blur">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{strength}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-5">
            <Lightbulb className="w-7 h-7" />
            <h2 className="text-xl font-semibold">Focus Areas</h2>
          </div>
          <div className="space-y-2.5">
            {[
              'Dynamics control & expression',
              'Sight reading speed',
              'Hand position consistency',
              'Musical phrasing'
            ].map((area, idx) => (
              <div key={idx} className="flex items-center gap-3 text-blue-50 bg-white/10 rounded-lg p-3 backdrop-blur">
                <Target className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Journey Timeline */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Learning Journey</h2>
            <p className="text-sm text-gray-600">Your musical development over time</p>
          </div>
        </div>
        <div className="relative pl-8 space-y-8">
          <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />

          {[
            { month: 'April 2026', achievements: ['Reached Level 8', 'Started Moonlight Sonata'], stars: 8 },
            { month: 'March 2026', achievements: ['First recital performance', 'Completed 12 pieces'], stars: 12 },
            { month: 'February 2026', achievements: ['Mastered major scales', 'Improved sight reading'], stars: 10 },
            { month: 'January 2026', achievements: ['Started piano lessons', 'Learned basic theory'], stars: 6 }
          ].map((period, idx) => (
            <div key={idx} className="relative">
              <div className="absolute -left-8 w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-4 border-white shadow-lg" />
              <div className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-bold text-gray-900">{period.month}</p>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-100 rounded-full">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-semibold text-yellow-700">+{period.stars}</span>
                  </div>
                </div>
                <ul className="space-y-2">
                  {period.achievements.map((achievement, aidx) => (
                    <li key={aidx} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
