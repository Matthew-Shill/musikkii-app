import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface KeyData {
  name: string;
  chords: {
    I: string;
    ii: string;
    iii: string;
    IV: string;
    V: string;
    vi: string;
    vii: string;
  };
  scale: string[];
}

const KEYS: KeyData[] = [
  {
    name: 'C Major',
    chords: { I: 'C', ii: 'Dm', iii: 'Em', IV: 'F', V: 'G', vi: 'Am', vii: 'Bdim' },
    scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B']
  },
  {
    name: 'G Major',
    chords: { I: 'G', ii: 'Am', iii: 'Bm', IV: 'C', V: 'D', vi: 'Em', vii: 'F#dim' },
    scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#']
  },
  {
    name: 'D Major',
    chords: { I: 'D', ii: 'Em', iii: 'F#m', IV: 'G', V: 'A', vi: 'Bm', vii: 'C#dim' },
    scale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#']
  },
  {
    name: 'A Major',
    chords: { I: 'A', ii: 'Bm', iii: 'C#m', IV: 'D', V: 'E', vi: 'F#m', vii: 'G#dim' },
    scale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
  },
  {
    name: 'E Major',
    chords: { I: 'E', ii: 'F#m', iii: 'G#m', IV: 'A', V: 'B', vi: 'C#m', vii: 'D#dim' },
    scale: ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#']
  },
  {
    name: 'B Major',
    chords: { I: 'B', ii: 'C#m', iii: 'D#m', IV: 'E', V: 'F#', vi: 'G#m', vii: 'A#dim' },
    scale: ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#']
  },
  {
    name: 'F# Major',
    chords: { I: 'F#', ii: 'G#m', iii: 'A#m', IV: 'B', V: 'C#', vi: 'D#m', vii: 'E#dim' },
    scale: ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'E#']
  },
  {
    name: 'Db Major',
    chords: { I: 'Db', ii: 'Ebm', iii: 'Fm', IV: 'Gb', V: 'Ab', vi: 'Bbm', vii: 'Cdim' },
    scale: ['Db', 'Eb', 'F', 'Gb', 'Ab', 'Bb', 'C']
  },
  {
    name: 'Ab Major',
    chords: { I: 'Ab', ii: 'Bbm', iii: 'Cm', IV: 'Db', V: 'Eb', vi: 'Fm', vii: 'Gdim' },
    scale: ['Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G']
  },
  {
    name: 'Eb Major',
    chords: { I: 'Eb', ii: 'Fm', iii: 'Gm', IV: 'Ab', V: 'Bb', vi: 'Cm', vii: 'Ddim' },
    scale: ['Eb', 'F', 'G', 'Ab', 'Bb', 'C', 'D']
  },
  {
    name: 'Bb Major',
    chords: { I: 'Bb', ii: 'Cm', iii: 'Dm', IV: 'Eb', V: 'F', vi: 'Gm', vii: 'Adim' },
    scale: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A']
  },
  {
    name: 'F Major',
    chords: { I: 'F', ii: 'Gm', iii: 'Am', IV: 'Bb', V: 'C', vi: 'Dm', vii: 'Edim' },
    scale: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E']
  }
];

export function KeyStudy() {
  const [selectedKey, setSelectedKey] = useState(0);

  const currentKey = KEYS[selectedKey];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Key Study</h3>
      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
        Learn the chords in all 12 major keys
      </p>

      {/* Key Selector */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Select a Key:
        </label>
        <div className="relative">
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(parseInt(e.target.value))}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-base sm:text-lg"
          >
            {KEYS.map((key, index) => (
              <option key={key.name} value={index}>
                {key.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Scale Display */}
      <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Major Scale</p>
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {currentKey.scale.map((note, index) => (
            <div
              key={index}
              className="p-1.5 sm:p-2 bg-white rounded-lg border border-blue-200 text-center"
            >
              <div className="text-sm sm:text-lg font-bold text-gray-900">{note}</div>
              <div className="text-[10px] sm:text-xs text-gray-500">{index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Chord Progressions */}
      <div className="space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm font-medium text-gray-700">Diatonic Chords:</p>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Object.entries(currentKey.chords).map(([numeral, chord]) => {
            const isMinor = numeral === 'ii' || numeral === 'iii' || numeral === 'vi';
            const isDim = numeral === 'vii';
            const isMajor = numeral === 'I' || numeral === 'IV' || numeral === 'V';

            return (
              <div
                key={numeral}
                className={`p-1.5 sm:p-3 rounded-lg border-2 ${
                  isMajor
                    ? 'bg-blue-50 border-blue-300'
                    : isMinor
                    ? 'bg-purple-50 border-purple-300'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1 font-medium">{numeral}</div>
                  <div className="text-xs sm:text-base font-bold text-gray-900 leading-tight">{chord}</div>
                  <div className="text-[8px] sm:text-[10px] text-gray-500 mt-0.5 sm:mt-1">
                    {isMajor ? 'Maj' : isMinor ? 'Min' : 'Dim'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Common Progressions */}
        <div className="pt-3 sm:pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Common Progressions:</p>
          <div className="space-y-2">
            {[
              { name: 'I-IV-V-I', chords: [currentKey.chords.I, currentKey.chords.IV, currentKey.chords.V, currentKey.chords.I] },
              { name: 'I-V-vi-IV', chords: [currentKey.chords.I, currentKey.chords.V, currentKey.chords.vi, currentKey.chords.IV] },
              { name: 'I-vi-IV-V', chords: [currentKey.chords.I, currentKey.chords.vi, currentKey.chords.IV, currentKey.chords.V] },
              { name: 'ii-V-I', chords: [currentKey.chords.ii, currentKey.chords.V, currentKey.chords.I] }
            ].map((progression) => (
              <div
                key={progression.name}
                className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <span className="text-xs sm:text-sm font-mono text-gray-600 sm:w-24">{progression.name}</span>
                <div className="flex gap-1.5 sm:gap-2 flex-1">
                  {progression.chords.map((chord, idx) => (
                    <div
                      key={idx}
                      className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded text-center font-semibold text-sm sm:text-base text-gray-900"
                    >
                      {chord}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-3 sm:gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border-2 border-blue-300 rounded"></div>
          <span className="text-gray-600">Major</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-50 border-2 border-purple-300 rounded"></div>
          <span className="text-gray-600">Minor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-50 border-2 border-gray-300 rounded"></div>
          <span className="text-gray-600">Dim</span>
        </div>
      </div>
    </div>
  );
}
