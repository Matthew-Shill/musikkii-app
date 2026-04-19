import { Play, Volume2, Check, X } from 'lucide-react';
import { useState, useRef } from 'react';

const INTERVALS = [
  { name: 'Unison', semitones: 0 },
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 }
];

export function IntervalTrainer() {
  const [currentInterval, setCurrentInterval] = useState<typeof INTERVALS[0] | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [useFixedStartNote, setUseFixedStartNote] = useState(true);
  const [currentBaseFreq, setCurrentBaseFreq] = useState(440);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playInterval = (interval: typeof INTERVALS[0], baseFreq: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Play first note
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.frequency.value = baseFreq;
    gain1.gain.setValueAtTime(0.3, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.8);

    // Play second note (after delay)
    const secondFreq = baseFreq * Math.pow(2, interval.semitones / 12);
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.frequency.value = secondFreq;
    gain2.gain.setValueAtTime(0.3, ctx.currentTime + 1);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
    osc2.start(ctx.currentTime + 1);
    osc2.stop(ctx.currentTime + 1.8);
  };

  const startNewQuestion = () => {
    const randomInterval = INTERVALS[Math.floor(Math.random() * INTERVALS.length)];

    // Generate random base frequency if variable mode, otherwise use A440
    const baseFreq = useFixedStartNote
      ? 440
      : 220 + Math.random() * 440; // Random frequency between 220Hz and 660Hz

    setCurrentInterval(randomInterval);
    setCurrentBaseFreq(baseFreq);
    setSelectedAnswer(null);
    setIsCorrect(null);
    playInterval(randomInterval, baseFreq);
  };

  const handleAnswer = (intervalName: string) => {
    if (!currentInterval || isCorrect !== null) return;

    setSelectedAnswer(intervalName);
    const correct = intervalName === currentInterval.name;
    setIsCorrect(correct);
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
  };

  const handleReplay = () => {
    if (currentInterval) {
      playInterval(currentInterval, currentBaseFreq);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Interval Trainer</h3>
      <p className="text-sm text-gray-600 mb-6">
        Train your ear to recognize musical intervals
      </p>

      {/* Score */}
      <div className="flex items-center justify-between mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <div>
          <p className="text-sm text-gray-600">Your Score</p>
          <p className="text-2xl font-bold text-gray-900">
            {score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {score.correct} / {score.total} correct
          </p>
        </div>
      </div>

      {/* Starting Note Toggle */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <label className="flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-sm font-medium text-gray-900">Starting Note</p>
            <p className="text-xs text-gray-600">
              {useFixedStartNote ? 'Fixed (A440)' : 'Variable (random)'}
            </p>
          </div>
          <button
            onClick={() => setUseFixedStartNote(!useFixedStartNote)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useFixedStartNote ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useFixedStartNote ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </label>
      </div>

      {/* Question Area */}
      <div className="mb-6">
        {currentInterval ? (
          <div className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-purple-100 text-center">
            <Volume2 className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-4">
              What interval did you hear?
            </p>
            <button
              onClick={handleReplay}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4" />
              Replay Interval
            </button>
            {isCorrect !== null && (
              <div className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? (
                    <>
                      <Check className="w-5 h-5 inline mr-2" />
                      Correct! It was a {currentInterval.name}
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5 inline mr-2" />
                      Incorrect. It was a {currentInterval.name}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center">
            <p className="text-gray-600 mb-4">Ready to train your ear?</p>
            <button
              onClick={startNewQuestion}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Training
            </button>
          </div>
        )}
      </div>

      {/* Answer Options */}
      {currentInterval && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Select the interval:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INTERVALS.map((interval) => {
              const isSelected = selectedAnswer === interval.name;
              const showResult = isCorrect !== null && isSelected;

              return (
                <button
                  key={interval.name}
                  onClick={() => handleAnswer(interval.name)}
                  disabled={isCorrect !== null}
                  className={`p-3 rounded-lg font-medium text-sm transition-all ${
                    showResult
                      ? isCorrect
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : isSelected
                      ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  } ${isCorrect !== null ? 'cursor-not-allowed' : ''}`}
                >
                  {interval.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Next Button */}
      {isCorrect !== null && (
        <button
          onClick={startNewQuestion}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Next Question
        </button>
      )}
    </div>
  );
}
