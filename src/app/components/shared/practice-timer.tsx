import { Play, Pause, Square, Plus, Minus, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PracticeTimerProps {
  isExpanded: boolean;
  onToggle: () => void;
}

export function PracticeTimer({ isExpanded, onToggle }: PracticeTimerProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [manualMinutes, setManualMinutes] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleAddMinutes = (minutes: number) => {
    setSeconds((s) => s + minutes * 60);
  };

  const handleManualAdd = () => {
    if (manualMinutes > 0) {
      setSeconds((s) => s + manualMinutes * 60);
      setManualMinutes(0);
    }
  };

  if (!isExpanded) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6">
        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-600 font-medium">Practice Timer</span>
          </div>
          <div className="text-6xl font-bold text-gray-900 tracking-tight font-mono">
            {formatTime(seconds)}
          </div>
          {seconds > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {Math.floor(seconds / 60)} minutes practiced
            </p>
          )}
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            onClick={handleStartStop}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md hover:shadow-lg ${
              isRunning
                ? 'bg-yellow-500 hover:bg-yellow-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                {seconds > 0 ? 'Resume' : 'Start'}
              </>
            )}
          </button>

          {seconds > 0 && (
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            >
              <Square className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-3">
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide text-center">
            Quick Add Time
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                onClick={() => handleAddMinutes(mins)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-sm font-medium text-gray-700"
              >
                +{mins}m
              </button>
            ))}
          </div>

          {/* Manual Entry */}
          <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
            <div className="flex-1 flex items-center gap-2">
              <button
                onClick={() => setManualMinutes(Math.max(0, manualMinutes - 1))}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={manualMinutes === 0}
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <input
                type="number"
                min="0"
                max="120"
                value={manualMinutes}
                onChange={(e) => setManualMinutes(Math.max(0, Math.min(120, parseInt(e.target.value) || 0)))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
              <button
                onClick={() => setManualMinutes(Math.min(120, manualMinutes + 1))}
                className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <button
              onClick={handleManualAdd}
              disabled={manualMinutes === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>

        {/* Session Summary */}
        {seconds >= 300 && (
          <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 text-center font-medium">
              🎉 Great session! You've practiced for {Math.floor(seconds / 60)} minutes!
            </p>
          </div>
        )}
      </div>

      {/* Collapse Button */}
      <button
        onClick={onToggle}
        className="w-full py-2 bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-600 font-medium"
      >
        Hide Timer
      </button>
    </div>
  );
}
