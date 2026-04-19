import { Flame, Snowflake, Zap, Award } from 'lucide-react';
import { useState } from 'react';

interface PracticeStreakWidgetProps {
  currentStreak: number;
  longestStreak: number;
  streakFreezes: number;
  daysThisWeek: boolean[];
  variant?: 'default' | 'compact';
}

export function PracticeStreakWidget({
  currentStreak,
  longestStreak,
  streakFreezes,
  daysThisWeek,
  variant = 'default'
}: PracticeStreakWidgetProps) {
  const [showInfo, setShowInfo] = useState(false);
  const completedDays = daysThisWeek.filter(Boolean).length;
  const progressPercentage = (completedDays / 7) * 100;

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-amber-700/70 font-medium">Practice Streak</p>
              <p className="text-2xl font-bold text-amber-900">{currentStreak} days</p>
            </div>
          </div>
          {streakFreezes > 0 && (
            <div className="flex items-center gap-1 bg-blue-50 rounded-md px-2 py-1 border border-blue-100">
              <Snowflake className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-semibold text-blue-700">{streakFreezes}</span>
            </div>
          )}
        </div>
        <div className="flex gap-1.5">
          {[...Array(7)].map((_, i) => {
            const isFreezeDay = i === 1 && !daysThisWeek[i]; // Monday is freeze day if not practiced
            return (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  isFreezeDay
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500'
                    : daysThisWeek[i]
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-amber-200/40'
                }`}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-5 shadow-lg">
      {/* Subtle background accents */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute top-0 -right-20 w-48 h-48 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-orange-50 to-amber-50 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Top row: Streak display and freeze badge */}
        <div className="flex items-center justify-between mb-5">
          {/* Streak display */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Flame className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-amber-600/70 font-semibold uppercase tracking-wider mb-0.5">Current Streak</p>
              <div className="text-5xl font-black text-amber-500 tracking-tight leading-none">
                {currentStreak}
              </div>
            </div>
          </div>

          {/* Freeze badge */}
          <div className="relative flex-shrink-0">
            <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 shadow-sm">
              <Snowflake className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-bold text-blue-600">1</span>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] hover:bg-blue-200 transition-colors"
              >
                ?
              </button>
            </div>
            {showInfo && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50">
                <p className="text-xs text-gray-600 leading-relaxed">
                  Streak Freezes protect your streak if you miss a day. Earn one by practicing 7 days in a row!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly dots flowing horizontally */}
        <div className="mb-4">
          <div className="flex items-center justify-between gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
              const isCompleted = daysThisWeek[i];
              const isToday = i === 5; // Friday is today
              const isFreezeUsed = i === 1; // Monday shows freeze
              const nextDayIsFrozen = i < 6 && i + 1 === 1;
              const prevDayIsFrozen = i > 0 && i - 1 === 1;

              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    {/* Connecting line with gradient for freeze transitions */}
                    {i < 6 && (
                      <>
                        {(isCompleted || isFreezeUsed) && (daysThisWeek[i + 1] || nextDayIsFrozen) ? (
                          <div className="absolute top-1/2 left-full w-full h-0.5" style={{ width: 'calc(100% + 0.25rem)' }}>
                            <div
                              className="w-full h-full"
                              style={{
                                background: isFreezeUsed
                                  ? 'linear-gradient(to right, #60a5fa, #f97316)'
                                  : nextDayIsFrozen
                                  ? 'linear-gradient(to right, #f97316, #60a5fa)'
                                  : 'linear-gradient(to right, #fbbf24, #f97316)'
                              }}
                            />
                          </div>
                        ) : (
                          <div
                            className="absolute top-1/2 left-full w-full h-0.5 bg-gray-200"
                            style={{ width: 'calc(100% + 0.25rem)' }}
                          />
                        )}
                      </>
                    )}

                    <div
                      className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isFreezeUsed
                          ? 'bg-gradient-to-br from-blue-400 to-blue-500 shadow-md border-2 border-blue-300'
                          : isCompleted
                          ? isToday
                            ? 'bg-gradient-to-br from-amber-300 to-orange-500 shadow-lg shadow-orange-500/30 scale-110 ring-2 ring-orange-200'
                            : 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-md'
                          : 'bg-gray-100 border-2 border-gray-200'
                      }`}
                    >
                      {isFreezeUsed ? (
                        <Snowflake className="w-4 h-4 text-white" />
                      ) : isCompleted ? (
                        <Zap className={`${isToday ? 'w-4 h-4' : 'w-4 h-4'} text-white`} />
                      ) : null}
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium ${isToday ? 'text-amber-600' : 'text-gray-600'}`}>
                    {day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Motivational message */}
        <div className="pt-3 border-t border-gray-200 text-center">
          {completedDays === 7 ? (
            <p className="text-amber-600 font-semibold text-xs flex items-center justify-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              Perfect week! Streak Freeze earned!
            </p>
          ) : (
            <p className="text-gray-600 text-xs">
              {7 - completedDays} more day{7 - completedDays > 1 ? 's' : ''} to complete this week
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
