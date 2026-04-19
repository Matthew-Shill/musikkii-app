import { useState, useRef } from 'react';
import { Volume2 } from 'lucide-react';

const NOTES = [
  { note: 'C', freq: 261.63, isBlack: false },
  { note: 'C#', freq: 277.18, isBlack: true },
  { note: 'D', freq: 293.66, isBlack: false },
  { note: 'D#', freq: 311.13, isBlack: true },
  { note: 'E', freq: 329.63, isBlack: false },
  { note: 'F', freq: 349.23, isBlack: false },
  { note: 'F#', freq: 369.99, isBlack: true },
  { note: 'G', freq: 392.00, isBlack: false },
  { note: 'G#', freq: 415.30, isBlack: true },
  { note: 'A', freq: 440.00, isBlack: false },
  { note: 'A#', freq: 466.16, isBlack: true },
  { note: 'B', freq: 493.88, isBlack: false },
  { note: 'C', freq: 523.25, isBlack: false }
];

export function MiniPiano() {
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playNote = (frequency: number, note: string) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 1);

    setActiveNote(note);
    setTimeout(() => setActiveNote(null), 300);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Mini Piano</h3>
        <Volume2 className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm text-gray-600 mb-6">Click the keys to play notes</p>

      {/* Piano Keys */}
      <div className="relative h-48 flex justify-center">
        <div className="flex items-end">
          {NOTES.map((note, index) => {
            if (note.isBlack) {
              return (
                <button
                  key={`${note.note}-${index}`}
                  onClick={() => playNote(note.freq, note.note)}
                  className={`absolute w-8 h-28 rounded-b-lg shadow-md transition-all z-10 ${
                    activeNote === note.note
                      ? 'bg-gray-600'
                      : 'bg-gray-900 hover:bg-gray-700'
                  }`}
                  style={{
                    left: `${(Math.floor((index) / 2) * 48) + 32}px`
                  }}
                >
                  <span className="text-[10px] text-white font-medium mt-auto block mb-1">
                    {note.note}
                  </span>
                </button>
              );
            }
            return null;
          })}

          {NOTES.filter(n => !n.isBlack).map((note, index) => (
            <button
              key={`${note.note}-${index}`}
              onClick={() => playNote(note.freq, note.note)}
              className={`w-12 h-48 rounded-b-lg border-2 border-gray-300 shadow-sm transition-all ${
                activeNote === note.note
                  ? 'bg-blue-100'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <span className="text-xs font-medium text-gray-700 mt-auto block mb-2">
                {note.note}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          One octave from C4 to C5 (Middle C to Tenor C)
        </p>
      </div>
    </div>
  );
}
