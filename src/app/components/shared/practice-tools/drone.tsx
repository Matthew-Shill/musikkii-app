import { Play, Pause, Volume2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const NOTES = [
  { name: 'C', freq: 261.63 },
  { name: 'C#', freq: 277.18 },
  { name: 'D', freq: 293.66 },
  { name: 'D#', freq: 311.13 },
  { name: 'E', freq: 329.63 },
  { name: 'F', freq: 349.23 },
  { name: 'F#', freq: 369.99 },
  { name: 'G', freq: 392.00 },
  { name: 'G#', freq: 415.30 },
  { name: 'A', freq: 440.00 },
  { name: 'A#', freq: 466.16 },
  { name: 'B', freq: 493.88 }
];

export function Drone() {
  const [selectedNote, setSelectedNote] = useState(NOTES[9]); // A440
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(30);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      stopDrone();
    };
  }, []);

  const startDrone = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;

    // Create oscillator
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = selectedNote.freq;
    oscillator.type = 'sine';
    gainNode.gain.value = volume / 100;

    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  };

  const stopDrone = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      gainNodeRef.current = null;
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopDrone();
    } else {
      startDrone();
    }
  };

  const handleNoteChange = (note: typeof NOTES[0]) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      stopDrone();
    }
    setSelectedNote(note);
    if (wasPlaying) {
      // Restart with new note after a brief delay
      setTimeout(() => {
        setSelectedNote(note);
        startDrone();
      }, 50);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume / 100;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Drone / Sustained Pitch</h3>
      <p className="text-sm text-gray-600 mb-6">
        Play a continuous reference pitch for tuning and intonation practice
      </p>

      {/* Main Display */}
      <div className="mb-6 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <Volume2 className={`w-12 h-12 ${isPlaying ? 'text-green-600 animate-pulse' : 'text-gray-400'}`} />
          <div>
            <p className="text-5xl font-bold text-gray-900">{selectedNote.name}</p>
            <p className="text-sm text-gray-600 mt-1">{selectedNote.freq.toFixed(2)} Hz</p>
          </div>
        </div>

        {isPlaying && (
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            <p className="text-sm text-green-700 font-medium">Playing</p>
          </div>
        )}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPause}
        className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-3 mb-6 ${
          isPlaying
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isPlaying ? (
          <>
            <Pause className="w-6 h-6" />
            Stop Drone
          </>
        ) : (
          <>
            <Play className="w-6 h-6" />
            Start Drone
          </>
        )}
      </button>

      {/* Note Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Note:
        </label>
        <div className="grid grid-cols-6 gap-2">
          {NOTES.map((note) => (
            <button
              key={note.name}
              onClick={() => handleNoteChange(note)}
              className={`p-3 rounded-lg font-semibold transition-all ${
                selectedNote.name === note.name
                  ? 'bg-green-600 text-white shadow-md scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {note.name}
            </button>
          ))}
        </div>
      </div>

      {/* Volume Control */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Volume</label>
          <span className="text-lg font-semibold text-gray-900">{volume}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-gray-700">
          <strong>Use cases:</strong> Intonation practice, ear training, tuning reference, sustained pitch exercises for wind instruments
        </p>
      </div>
    </div>
  );
}
