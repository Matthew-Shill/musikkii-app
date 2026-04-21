import { Clock, Video, MapPin } from 'lucide-react';
import { LessonActions } from '../../shared/lesson-actions';
import type { Lesson } from '../../../types/domain';
import { initialsFromDisplayName } from '@/lib/lesson-ui-helpers';

interface LessonListProps {
  lessons: Lesson[];
  variant?: 'default' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
  /** Opens the same calendar detail modal as week/month (parent resolves id → `DashboardLessonRow`). */
  onLessonClick?: (lessonId: string) => void;
}

export function LessonList({
  lessons,
  variant = 'default',
  emptyTitle = 'No lessons found',
  emptyDescription,
  onLessonClick,
}: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-xl border border-gray-200 bg-white">
        <p className="text-gray-900 font-medium">{emptyTitle}</p>
        {emptyDescription ? <p className="text-gray-600 text-sm mt-2 max-w-md mx-auto">{emptyDescription}</p> : null}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {lessons.map((lesson) => (
        <div key={lesson.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
              {initialsFromDisplayName(
                lesson.teacherDisplayName && lesson.teacherDisplayName !== 'Teacher'
                  ? lesson.teacherDisplayName
                  : lesson.title
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <div
                  role={onLessonClick ? 'button' : undefined}
                  tabIndex={onLessonClick ? 0 : undefined}
                  className={onLessonClick ? 'min-w-0 flex-1 cursor-pointer rounded-lg -m-2 p-2 text-left hover:bg-gray-50' : 'min-w-0 flex-1'}
                  onClick={onLessonClick ? () => onLessonClick(lesson.id) : undefined}
                  onKeyDown={
                    onLessonClick
                      ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onLessonClick(lesson.id);
                          }
                        }
                      : undefined
                  }
                >
                  <h3 className="font-semibold text-lg">{lesson.title}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    <span className="font-medium text-gray-700">Teacher:</span>{' '}
                    {lesson.teacherDisplayName && lesson.teacherDisplayName !== 'Teacher' ? lesson.teacherDisplayName : '—'}
                    {lesson.studentDisplayName ? (
                      <>
                        {' '}
                        <span className="font-medium text-gray-700">· Student(s):</span> {lesson.studentDisplayName}
                      </>
                    ) : null}
                  </p>
                  {onLessonClick ? (
                    <p className="text-xs text-gray-400 mt-1">Click this block for full lesson details from the database.</p>
                  ) : null}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {lesson.date.toLocaleDateString()} at{' '}
                        {lesson.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

                  {lesson.focus ? (
                    <div className="mb-3 mt-3 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Focus:</span> {lesson.focus}
                      </p>
                    </div>
                  ) : null}

                  {lesson.notes ? (
                    <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 mb-1">Lesson notes</p>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{lesson.notes}</p>
                    </div>
                  ) : null}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    lesson.status === 'confirmed'
                      ? 'bg-green-100 text-green-700'
                      : lesson.status === 'scheduled'
                        ? 'bg-gray-100 text-gray-700'
                        : lesson.status === 'completed'
                          ? 'bg-blue-100 text-blue-700'
                          : lesson.status === 'cancelled'
                            ? 'bg-red-100 text-red-700'
                            : lesson.status === 'no-show'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {lesson.status === 'no-show'
                    ? 'No show'
                    : lesson.status.charAt(0).toUpperCase() + lesson.status.slice(1)}
                </span>
              </div>

              <LessonActions lessonId={lesson.id} lessonDate={lesson.date} variant={variant === 'compact' ? 'compact' : 'default'} />
              <p className="text-xs text-gray-400 mt-3">
                These row buttons are not saved. Open the lesson block above for a real NML request (learners / household).
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
