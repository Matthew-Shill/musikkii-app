import { Clock, Video, MapPin } from 'lucide-react';
import { LessonActions } from '../../shared/lesson-actions';
import type { Lesson } from '../../../types/domain';

interface LessonListProps {
  lessons: Lesson[];
  variant?: 'default' | 'compact';
}

export function LessonList({ lessons, variant = 'default' }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No lessons found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
              TR
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg">{lesson.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(lesson.date).toLocaleDateString()} at {new Date(lesson.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {lesson.modality === 'virtual' ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span>Virtual</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4" />
                          <span>In-Person</span>
                        </>
                      )}
                    </div>
                    {lesson.location && (
                      <>
                        <span>•</span>
                        <span>{lesson.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  lesson.status === 'confirmed'
                    ? 'bg-green-100 text-green-700'
                    : lesson.status === 'scheduled'
                    ? 'bg-gray-100 text-gray-700'
                    : lesson.status === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : lesson.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                </span>
              </div>

              {lesson.focus && (
                <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Focus:</span> {lesson.focus}
                  </p>
                </div>
              )}

              {lesson.notes && lesson.status === 'completed' && (
                <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-1">Lesson Notes</p>
                  <p className="text-sm text-gray-700">{lesson.notes}</p>
                </div>
              )}

              <LessonActions lessonId={lesson.id} variant={variant === 'compact' ? 'compact' : 'default'} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
