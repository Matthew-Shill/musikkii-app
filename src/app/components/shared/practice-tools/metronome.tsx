import { Play, Pause, Plus, Minus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export function Metronome() {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playClick = (isAccent: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = isAccent ? 1200 : 800;
    gainNode.gain.value = isAccent ? 0.3 : 0.2;

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = 60000 / bpm;
      intervalRef.current = setInterval(() => {
        setBeatCount((prev) => {
          const nextBeat = (prev % beatsPerMeasure) + 1;
          playClick(nextBeat === 1);
          return nextBeat;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setBeatCount(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, bpm, beatsPerMeasure]);

  const handleBpmChange = (change: number) => {
    setBpm(Math.max(40, Math.min(240, bpm + change)));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Metronome</h3>
        <div className="flex items-center gap-2">
          <select
            value={beatsPerMeasure}
            onChange={(e) => setBeatsPerMeasure(parseInt(e.target.value))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isPlaying}
          >
            <option value={2}>2/4</option>
            <option value={3}>3/4</option>
            <option value={4}>4/4</option>
            <option value={6}>6/8</option>
          </select>
        </div>
      </div>

      {/* BPM Display */}
      <div className="text-center mb-8">
        <div className="text-6xl font-bold text-gray-900 mb-2 font-mono">
          {bpm}
        </div>
        <p className="text-sm text-gray-500">BPM</p>
      </div>

      {/* Beat Indicators */}
      <div className="flex justify-center gap-3 mb-8">
        {[...Array(beatsPerMeasure)].map((_, i) => (
          <div
            key={i}
            className={`w-12 h-12 rounded-full border-2 transition-all ${
              beatCount === i + 1
                ? i === 0
                  ? 'bg-blue-600 border-blue-600 scale-110'
                  : 'bg-gray-900 border-gray-900 scale-110'
                : 'bg-white border-gray-300'
            }`}
          />
        ))}
      </div>

      {/* BPM Controls */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => handleBpmChange(-10)}
          className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          -10
        </button>
        <button
          onClick={() => handleBpmChange(-1)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Minus className="w-5 h-5" />
        </button>
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="flex-1"
        />
        <button
          onClick={() => handleBpmChange(1)}
          className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleBpmChange(10)}
          className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          +10
        </button>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={togglePlay}
        className={`w-full py-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
          isPlaying
            ? 'bg-red-500 hover:bg-red-600'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-5 h-5" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Start
          </>
        )}
      </button>

      {/* Tempo Presets */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: 'Largo', bpm: 60 },
          { label: 'Adagio', bpm: 80 },
          { label: 'Andante', bpm: 100 },
          { label: 'Moderato', bpm: 120 },
          { label: 'Allegro', bpm: 140 },
          { label: 'Vivace', bpm: 160 },
          { label: 'Presto', bpm: 180 },
          { label: 'Prestissimo', bpm: 200 }
        ].map((preset) => (
          <button
            key={preset.label}
            onClick={() => setBpm(preset.bpm)}
            className="px-2 py-1.5 text-xs font-medium border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            disabled={isPlaying}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
