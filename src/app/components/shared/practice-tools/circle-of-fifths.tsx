import { useState } from 'react';

const CIRCLE_DATA = [
  { key: 'C', major: 'C Major', minor: 'A minor', sharps: 0, flats: 0, color: 'from-red-400 to-red-500' },
  { key: 'G', major: 'G Major', minor: 'E minor', sharps: 1, flats: 0, color: 'from-orange-400 to-orange-500' },
  { key: 'D', major: 'D Major', minor: 'B minor', sharps: 2, flats: 0, color: 'from-yellow-400 to-yellow-500' },
  { key: 'A', major: 'A Major', minor: 'F# minor', sharps: 3, flats: 0, color: 'from-lime-400 to-lime-500' },
  { key: 'E', major: 'E Major', minor: 'C# minor', sharps: 4, flats: 0, color: 'from-green-400 to-green-500' },
  { key: 'B', major: 'B Major', minor: 'G# minor', sharps: 5, flats: 0, color: 'from-emerald-400 to-emerald-500' },
  { key: 'F#/Gb', major: 'F#/Gb Major', minor: 'D#/Eb minor', sharps: 6, flats: 6, color: 'from-cyan-400 to-cyan-500' },
  { key: 'Db', major: 'Db Major', minor: 'Bb minor', sharps: 0, flats: 5, color: 'from-sky-400 to-sky-500' },
  { key: 'Ab', major: 'Ab Major', minor: 'F minor', sharps: 0, flats: 4, color: 'from-blue-400 to-blue-500' },
  { key: 'Eb', major: 'Eb Major', minor: 'C minor', sharps: 0, flats: 3, color: 'from-indigo-400 to-indigo-500' },
  { key: 'Bb', major: 'Bb Major', minor: 'G minor', sharps: 0, flats: 2, color: 'from-purple-400 to-purple-500' },
  { key: 'F', major: 'F Major', minor: 'D minor', sharps: 0, flats: 1, color: 'from-pink-400 to-pink-500' }
];

export function CircleOfFifths() {
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  const getAccidentals = (data: typeof CIRCLE_DATA[0]) => {
    if (data.sharps > 0) return `${data.sharps} Sharp${data.sharps > 1 ? 's' : ''}`;
    if (data.flats > 0) return `${data.flats} Flat${data.flats > 1 ? 's' : ''}`;
    return 'No Sharps or Flats';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Circle of Fifths</h3>
      <p className="text-sm text-gray-600 mb-6">
        Click a key to see its major and minor scales
      </p>

      <div className="flex flex-col items-center">
        {/* Circle Visualization */}
        <div className="relative w-80 h-80 mb-6">
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Circle of</p>
              <p className="text-lg font-bold text-gray-900">Fifths</p>
            </div>
          </div>

          {/* Key Segments */}
          {CIRCLE_DATA.map((data, index) => {
            const angle = (index * 30) - 90; // 360/12 = 30 degrees per segment
            const radian = (angle * Math.PI) / 180;
            const radius = 120;
            const x = 160 + radius * Math.cos(radian);
            const y = 160 + radius * Math.sin(radian);

            return (
              <button
                key={data.key}
                onClick={() => setSelectedKey(index)}
                className={`absolute w-16 h-16 rounded-full shadow-md transition-all transform -translate-x-1/2 -translate-y-1/2 ${
                  selectedKey === index
                    ? 'scale-125 z-10 ring-4 ring-white'
                    : 'hover:scale-110'
                }`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`w-full h-full rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center`}>
                  <span className="text-lg font-bold text-white drop-shadow">
                    {data.key}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Key Info */}
        {selectedKey !== null && (
          <div className="w-full p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="text-center mb-4">
              <h4 className="text-2xl font-bold text-gray-900 mb-1">
                {CIRCLE_DATA[selectedKey].key}
              </h4>
              <p className="text-sm text-gray-600">
                {getAccidentals(CIRCLE_DATA[selectedKey])}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Major Key</p>
                <p className="text-lg font-semibold text-gray-900">
                  {CIRCLE_DATA[selectedKey].major}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Relative Minor</p>
                <p className="text-lg font-semibold text-gray-900">
                  {CIRCLE_DATA[selectedKey].minor}
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedKey === null && (
          <div className="w-full p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Click on a key in the circle to see its details
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
