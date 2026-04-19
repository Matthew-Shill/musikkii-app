import { Clock, Play, Video } from 'lucide-react';
import { LessonActions } from '../../shared/lesson-actions';
import type { LessonStatus } from '../../../types/domain';

interface NextLessonCardProps {
  teacherName: string;
  teacherInitials: string;
  lessonDate: string;
  lessonTime: string;
  lessonFocus?: string;
  status: LessonStatus;
  lessonId: string;
  variant?: 'default' | 'child';
}

export function NextLessonCard({
  teacherName,
  teacherInitials,
  lessonDate,
  lessonTime,
  lessonFocus,
  status,
  lessonId,
  variant = 'default'
}: NextLessonCardProps) {
  if (variant === 'child') {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm opacity-90 mb-1">Your Next Lesson</p>
            <h2 className="text-3xl font-bold mb-4">{teacherName}</h2>
            <div className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              <span>{lessonDate} at {lessonTime}</span>
            </div>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <div className="text-4xl">🎵</div>
          </div>
        </div>
        <button className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          Join Lesson
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Next Lesson</h2>
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
          {teacherInitials}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg">{teacherName}</h3>
              <div className="flex items-center gap-2 text-gray-600 mt-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{lessonDate} at {lessonTime}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              status === 'confirmed'
                ? 'bg-green-100 text-green-700'
                : status === 'scheduled'
                ? 'bg-gray-100 text-gray-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          {lessonFocus && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Focus:</span> {lessonFocus}
              </p>
            </div>
          )}
          <LessonActions lessonId={lessonId} />
        </div>
      </div>
    </div>
  );
}
