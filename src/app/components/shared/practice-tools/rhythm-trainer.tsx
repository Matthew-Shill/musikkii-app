import { Play, Pause, RefreshCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const PRESET_RHYTHMS = [
  { name: 'Quarter Notes', pattern: [1, 1, 1, 1], difficulty: 'Easy' },
  { name: 'Eighth Notes', pattern: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], difficulty: 'Easy' },
  { name: 'Quarter + Eighth', pattern: [1, 0.5, 0.5, 1, 1], difficulty: 'Medium' },
  { name: 'Dotted Quarter', pattern: [1.5, 0.5, 1, 1], difficulty: 'Medium' },
  { name: 'Syncopation', pattern: [0.5, 1, 0.5, 1, 1], difficulty: 'Medium' },
  { name: 'Triplets', pattern: [0.33, 0.33, 0.33, 1, 0.33, 0.33, 0.33, 1], difficulty: 'Hard' },
  { name: 'Sixteenth Notes', pattern: [0.25, 0.25, 0.25, 0.25, 1, 0.25, 0.25, 0.25, 0.25, 1], difficulty: 'Hard' }
];

const TIME_SIGNATURES = [
  { name: '2/4', beatsPerMeasure: 2, beatUnit: 4 },
  { name: '3/4', beatsPerMeasure: 3, beatUnit: 4 },
  { name: '4/4', beatsPerMeasure: 4, beatUnit: 4 },
  { name: '5/4', beatsPerMeasure: 5, beatUnit: 4 },
  { name: '6/4', beatsPerMeasure: 6, beatUnit: 4 },
  { name: '6/8', beatsPerMeasure: 6, beatUnit: 8 }
];

const NOTE_TYPES = [
  { name: 'Whole', value: 4, label: '𝅝' },
  { name: 'Half', value: 2, label: '𝅗𝅥' },
  { name: 'Quarter', value: 1, label: '♩' },
  { name: 'Eighth', value: 0.5, label: '♪' },
  { name: 'Sixteenth', value: 0.25, label: '♬' },
  { name: 'Dotted Half', value: 3, label: '𝅗𝅥.' },
  { name: 'Dotted Quarter', value: 1.5, label: '♩.' },
  { name: 'Triplet', value: 0.33, label: '♪³' }
];

// Component to render a single rhythm note
function RhythmNote({ duration, isActive }: { duration: number; isActive: boolean }) {
  const color = isActive ? '#2563eb' : '#374151';
  const scale = isActive ? 1.2 : 1;

  // Determine note type based on duration
  const getNoteType = () => {
    if (duration >= 4) return 'whole';
    if (duration >= 3) return 'dotted-half';
    if (duration >= 2) return 'half';
    if (duration >= 1.5) return 'dotted-quarter';
    if (duration >= 1) return 'quarter';
    if (duration >= 0.5) return 'eighth';
    if (duration >= 0.3) return 'triplet';
    return 'sixteenth';
  };

  const noteType = getNoteType();
  const hasHollow = noteType === 'half' || noteType === 'dotted-half';

  return (
    <svg
      width={noteType.includes('dotted') ? '32' : '24'}
      height="80"
      viewBox="0 0 24 80"
      className="transition-transform"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Stem (not for whole notes) */}
      {noteType !== 'whole' && (
        <line x1="18" y1="50" x2="18" y2="10" stroke={color} strokeWidth="2" />
      )}

      {/* Note head */}
      <ellipse
        cx="12"
        cy="50"
        rx="6"
        ry="5"
        fill={hasHollow ? 'white' : color}
        stroke={hasHollow ? color : 'none'}
        strokeWidth={hasHollow ? '2' : '0'}
      />

      {/* Flag for eighth notes and smaller */}
      {noteType === 'eighth' && <path d="M 18 10 Q 26 15 24 25" fill={color} />}

      {/* Double flag for sixteenth notes */}
      {noteType === 'sixteenth' && (
        <>
          <path d="M 18 10 Q 26 15 24 25" fill={color} />
          <path d="M 18 16 Q 26 21 24 31" fill={color} />
        </>
      )}

      {/* Triplet flag */}
      {noteType === 'triplet' && <path d="M 18 10 Q 26 15 24 25" fill={color} />}

      {/* Dot for dotted notes */}
      {noteType.includes('dotted') && <circle cx="20" cy="50" r="2" fill={color} />}
    </svg>
  );
}

// Bar line component
function BarLine() {
  return (
    <svg width="4" height="80" viewBox="0 0 4 80">
      <line x1="2" y1="20" x2="2" y2="70" stroke="#374151" strokeWidth="3" />
    </svg>
  );
}

export function RhythmTrainer() {
  const [usePreset, setUsePreset] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState(0);
  const [selectedNoteTypes, setSelectedNoteTypes] = useState<number[]>([1, 0.5]); // Quarter and eighth by default
  const [generatedPattern, setGeneratedPattern] = useState<number[]>([1, 1, 1, 1]);
  const [timeSignature, setTimeSignature] = useState(TIME_SIGNATURES[2]); // 4/4
  const [bpm, setBpm] = useState(80);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(-1);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentPattern = usePreset ? PRESET_RHYTHMS[selectedPreset].pattern : generatedPattern;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Generate initial pattern when switching to random mode
  useEffect(() => {
    if (!usePreset && selectedNoteTypes.length > 0) {
      generateRandomPattern();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usePreset]);

  const generateRandomPattern = () => {
    if (selectedNoteTypes.length === 0) return;

    const totalBeats = timeSignature.beatsPerMeasure * 2; // Generate 2 measures
    const pattern: number[] = [];
    let currentBeats = 0;

    while (currentBeats < totalBeats) {
      const remainingBeats = totalBeats - currentBeats;

      // Filter note types that fit in remaining space
      const validNotes = selectedNoteTypes.filter(note => note <= remainingBeats);

      if (validNotes.length === 0) {
        // Fill remaining space with the smallest available note
        const smallest = Math.min(...selectedNoteTypes);
        if (smallest <= remainingBeats) {
          pattern.push(smallest);
          currentBeats += smallest;
        } else {
          break;
        }
      } else {
        // Pick a random valid note
        const randomNote = validNotes[Math.floor(Math.random() * validNotes.length)];
        pattern.push(randomNote);
        currentBeats += randomNote;
      }
    }

    setGeneratedPattern(pattern);
    setIsPlaying(false);
    setCurrentBeat(-1);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const toggleNoteType = (value: number) => {
    if (selectedNoteTypes.includes(value)) {
      setSelectedNoteTypes(selectedNoteTypes.filter(v => v !== value));
    } else {
      setSelectedNoteTypes([...selectedNoteTypes, value]);
    }
  };

  const playClick = (isAccent: boolean = false) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.frequency.value = isAccent ? 1200 : 800;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  };

  const playRhythm = (beatIndex: number = 0, currentMeasureBeat: number = 0) => {
    if (beatIndex >= currentPattern.length) {
      // Loop back to start
      timeoutRef.current = setTimeout(() => playRhythm(0, 0), (60 / bpm) * 1000);
      setCurrentBeat(-1);
      return;
    }

    setCurrentBeat(beatIndex);

    // Accent first beat of each measure
    const isAccent = currentMeasureBeat === 0;
    playClick(isAccent);

    const beatDuration = currentPattern[beatIndex];
    const timeMs = (beatDuration * 60 / bpm) * 1000;

    // Calculate next measure beat
    const nextMeasureBeat = (currentMeasureBeat + beatDuration) % timeSignature.beatsPerMeasure;

    timeoutRef.current = setTimeout(() => playRhythm(beatIndex + 1, nextMeasureBeat), timeMs);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setCurrentBeat(-1);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    } else {
      setIsPlaying(true);
      playRhythm(0, 0);
    }
  };

  // Calculate bar lines positions based on time signature
  const getBarLinePositions = () => {
    const positions: number[] = [];
    let currentBeat = 0;

    currentPattern.forEach((duration, idx) => {
      currentBeat += duration;
      if (currentBeat >= timeSignature.beatsPerMeasure && idx < currentPattern.length - 1) {
        positions.push(idx + 1);
        currentBeat = currentBeat % timeSignature.beatsPerMeasure;
      }
    });

    return positions;
  };

  const barLinePositions = getBarLinePositions();

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Rhythm Trainer</h3>
      <p className="text-sm text-gray-600 mb-6">
        Practice common rhythm patterns and subdivisions
      </p>

      {/* Mode Toggle */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setUsePreset(true)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            usePreset
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Preset Patterns
        </button>
        <button
          onClick={() => setUsePreset(false)}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            !usePreset
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Random Generator
        </button>
      </div>

      {/* Time Signature Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Time Signature:
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TIME_SIGNATURES.map((sig) => (
            <button
              key={sig.name}
              onClick={() => setTimeSignature(sig)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                timeSignature.name === sig.name
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {sig.name}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Selection or Random Generator */}
      {usePreset ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Rhythm Pattern:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_RHYTHMS.map((rhythm, idx) => (
              <button
                key={rhythm.name}
                onClick={() => {
                  setSelectedPreset(idx);
                  setIsPlaying(false);
                  setCurrentBeat(-1);
                  if (timeoutRef.current) clearTimeout(timeoutRef.current);
                }}
                className={`p-3 rounded-lg text-left transition-all ${
                  selectedPreset === idx
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{rhythm.name}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      rhythm.difficulty === 'Easy'
                        ? 'bg-green-100 text-green-700'
                        : rhythm.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    } ${selectedPreset === idx ? 'bg-white/20 text-white' : ''}`}
                  >
                    {rhythm.difficulty}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Note Types to Include:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {NOTE_TYPES.map((note) => {
              const isSelected = selectedNoteTypes.includes(note.value);
              return (
                <button
                  key={note.name}
                  onClick={() => toggleNoteType(note.value)}
                  className={`p-3 rounded-lg text-center transition-all border-2 ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{note.label}</div>
                  <div className="text-xs">{note.name}</div>
                </button>
              );
            })}
          </div>
          <button
            onClick={generateRandomPattern}
            disabled={selectedNoteTypes.length === 0}
            className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
              selectedNoteTypes.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <RefreshCw className="w-5 h-5" />
            Generate New Pattern
          </button>
          {selectedNoteTypes.length === 0 && (
            <p className="text-xs text-red-600 mt-2 text-center">
              Please select at least one note type
            </p>
          )}
        </div>
      )}

      {/* Visual Pattern Display - Sheet Music Notation */}
      <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-100">
        <p className="text-sm text-gray-600 mb-3">
          Pattern Notation ({timeSignature.name}):
        </p>
        <div className="relative flex items-center justify-center min-h-[100px] overflow-x-auto">
          {/* Staff Lines Background */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
            <div className="w-full max-w-full space-y-[10px]">
              {[0, 1, 2, 3, 4].map((line) => (
                <div key={line} className="border-b border-gray-400 w-full" />
              ))}
            </div>
          </div>

          {/* Time Signature */}
          <div className="absolute left-4 z-10 flex flex-col items-center justify-center bg-purple-50">
            <div className="text-2xl font-bold text-gray-900">
              {timeSignature.beatsPerMeasure}
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {timeSignature.beatUnit}
            </div>
          </div>

          {/* Notes with Bar Lines */}
          <div className="flex items-center justify-center gap-1 relative z-10 pl-16">
            {currentPattern.map((duration, idx) => {
              const isActive = currentBeat === idx;
              const hasBarLine = barLinePositions.includes(idx);

              return (
                <div key={idx} className="flex items-center gap-1">
                  <div className="flex flex-col items-center relative">
                    <RhythmNote duration={duration} isActive={isActive} />
                  </div>
                  {hasBarLine && <BarLine />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* BPM Control */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Tempo (BPM)</label>
          <span className="text-2xl font-bold text-blue-600">{bpm}</span>
        </div>
        <input
          type="range"
          min="40"
          max="200"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>40</span>
          <span>200</span>
        </div>
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        disabled={currentPattern.length === 0}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 ${
          currentPattern.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isPlaying
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-6 h-6" />
            Stop
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            Play Pattern
          </>
        )}
      </button>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Tip:</strong> Start slow and gradually increase the tempo. Try clapping along
          with the pattern to internalize the rhythm. Bar lines appear automatically based on the
          time signature.
        </p>
      </div>
    </div>
  );
}
