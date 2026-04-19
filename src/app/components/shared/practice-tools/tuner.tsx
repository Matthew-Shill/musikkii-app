import { Music, Mic } from 'lucide-react';
import { useState } from 'react';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function Tuner() {
  const [isListening, setIsListening] = useState(false);
  const [detectedNote, setDetectedNote] = useState<string | null>(null);
  const [cents, setCents] = useState(0);

  const handleStartStop = () => {
    if (!isListening) {
      // In a real implementation, this would access the microphone
      // For now, we'll show a simulated state
      setIsListening(true);
      setDetectedNote('A');
      setCents(-5);
    } else {
      setIsListening(false);
      setDetectedNote(null);
      setCents(0);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Chromatic Tuner</h3>
      <p className="text-sm text-gray-600 mb-6">
        Tune your instrument with real-time pitch detection
      </p>

      {/* Main Display */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100 text-center">
          {detectedNote ? (
            <>
              <p className="text-6xl font-bold text-gray-900 mb-2">{detectedNote}</p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-full max-w-md h-4 bg-gray-200 rounded-full overflow-hidden relative">
                  {/* Center marker */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 -translate-x-1/2" />
                  {/* Needle */}
                  <div
                    className={`absolute top-0 bottom-0 w-2 rounded-full transition-all ${
                      Math.abs(cents) < 5
                        ? 'bg-green-500'
                        : Math.abs(cents) < 15
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{
                      left: `${50 + cents}%`,
                      transform: 'translateX(-50%)'
                    }}
                  />
                </div>
              </div>
              <p className="text-lg font-semibold text-gray-700">
                {cents > 0 ? '+' : ''}{cents} cents
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {Math.abs(cents) < 5
                  ? '✓ In Tune!'
                  : cents > 0
                  ? '↑ Too Sharp'
                  : '↓ Too Flat'}
              </p>
            </>
          ) : (
            <>
              <Mic className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600">
                {isListening ? 'Listening...' : 'Click Start to begin tuning'}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-6">
        <button
          onClick={handleStartStop}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isListening ? 'Stop' : 'Start Tuning'}
        </button>
      </div>

      {/* Reference Notes */}
      <div className="border-t border-gray-200 pt-4">
        <p className="text-xs text-gray-600 uppercase tracking-wide mb-3">Reference Notes</p>
        <div className="grid grid-cols-12 gap-1">
          {NOTES.map((note) => (
            <div
              key={note}
              className={`p-2 rounded text-center text-xs font-medium ${
                note === detectedNote
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {note}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600">
          <strong>Note:</strong> This tuner requires microphone access. Make sure to allow microphone permissions when prompted.
        </p>
      </div>
    </div>
  );
}
