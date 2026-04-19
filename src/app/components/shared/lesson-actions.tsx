import { CheckCircle2, PlayCircle, Calendar } from 'lucide-react';
import { useState } from 'react';

interface LessonActionsProps {
  lessonId: string;
  lessonDate?: Date | string; // Add lesson date for context-aware actions
  onConfirm?: (id: string) => void;
  onNML?: (id: string) => void;
  onReschedule?: (id: string) => void;
  variant?: 'default' | 'compact';
}

export function LessonActions({ 
  lessonId, 
  lessonDate,
  onConfirm, 
  onNML, 
  onReschedule,
  variant = 'default'
}: LessonActionsProps) {
  const [confirmed, setConfirmed] = useState(false);

  // Calculate if lesson is within 24 hours
  const isWithin24Hours = () => {
    if (!lessonDate) return false;
    const lesson = new Date(lessonDate);
    const now = new Date();
    const hoursUntilLesson = (lesson.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntilLesson < 24 && hoursUntilLesson > 0;
  };

  const showReschedule = !isWithin24Hours();

  const handleConfirm = () => {
    setConfirmed(true);
    onConfirm?.(lessonId);
  };

  const handleNML = () => {
    onNML?.(lessonId);
  };

  const handleReschedule = () => {
    onReschedule?.(lessonId);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={handleConfirm}
          disabled={confirmed}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            confirmed
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-green-50 text-green-700 hover:bg-green-100'
          }`}
          title="Confirm attendance"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {confirmed ? 'Confirmed' : 'Confirm'}
        </button>
        <button
          onClick={handleNML}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          title="Request Non-Meeting Lesson"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          NML
        </button>
        {showReschedule && (
          <button
            onClick={handleReschedule}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            title="Reschedule lesson"
          >
            <Calendar className="w-3.5 h-3.5" />
            Reschedule
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleConfirm}
        disabled={confirmed}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
          confirmed
            ? 'bg-green-100 text-green-700 cursor-not-allowed'
            : 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm'
        }`}
        title="Confirm attendance"
      >
        <CheckCircle2 className="w-4 h-4" />
        {confirmed ? 'Confirmed' : 'Confirm Attendance'}
      </button>
      <button
        onClick={handleNML}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 hover:shadow-sm transition-all"
        title="Request Non-Meeting Lesson"
      >
        <PlayCircle className="w-4 h-4" />
        Request NML
      </button>
      {showReschedule && (
        <button
          onClick={handleReschedule}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm transition-all"
          title="Reschedule lesson"
        >
          <Calendar className="w-4 h-4" />
          Reschedule
        </button>
      )}
    </div>
  );
}