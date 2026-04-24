import { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Video, MapPin } from 'lucide-react';
import { LessonActions } from '../../shared/lesson-actions';
import type { Lesson } from '../../../types/domain';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { initialsFromDisplayName } from '@/lib/lesson-ui-helpers';
import { LearnerLessonActions } from './learner-lesson-actions';
import { VirtualMeetingJoinLink } from '../../shared/virtual-meeting-join-link';

interface LessonListProps {
  lessons: Lesson[];
  variant?: 'default' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
  /** Non-learner roles: opens detail modal from parent. Omitted for learner/household inline cards. */
  onLessonClick?: (lessonId: string) => void;
  /** Learner / household: actions and NML state live on the card (no modal). */
  learnerInline?: {
    actorProfileId: string;
    sourceRows: DashboardLessonRow[];
    intentConnectionsByLessonId: Record<string, LessonIntentEventsConnection>;
    cardUiStatusByLessonId: Record<string, CalendarEventUiStatus>;
    onStatusChange: (lessonId: string, status: CalendarEventUiStatus) => void;
    onLessonDbStatusUpdated: (lessonId: string, dbStatus?: string) => void;
    onLessonsReload: () => Promise<void>;
  };
}

function rowByLessonId(rows: DashboardLessonRow[], lessonId: string): DashboardLessonRow | undefined {
  return rows.find((r) => r.id === lessonId);
}

function calendarStatusPill(status: CalendarEventUiStatus): { label: string; className: string } {
  switch (status) {
    case 'Confirmed':
      return { label: 'Confirmed', className: 'bg-green-100 text-green-700' };
    case 'Cancelled':
      return { label: 'Cancelled', className: 'bg-red-100 text-red-700' };
    case 'NML Requested':
      return { label: 'NML Requested', className: 'bg-purple-100 text-purple-700' };
    case 'Completed':
      return { label: 'Completed', className: 'bg-blue-100 text-blue-700' };
    case 'Pending':
    default:
      return { label: 'Scheduled', className: 'bg-gray-100 text-gray-700' };
  }
}

export function LessonList({
  lessons,
  variant = 'default',
  emptyTitle = 'No lessons found',
  emptyDescription,
  onLessonClick,
  learnerInline,
}: LessonListProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

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
      {lessons.map((lesson) => {
        const row = learnerInline ? rowByLessonId(learnerInline.sourceRows, lesson.id) : undefined;
        const cardUi = learnerInline?.cardUiStatusByLessonId[lesson.id];
        const pill = cardUi ? calendarStatusPill(cardUi) : null;
        const intentConn = learnerInline && row ? learnerInline.intentConnectionsByLessonId[lesson.id] : undefined;
        const detailsOpen = expandedIds[lesson.id] ?? false;

        return (
          <div
            key={lesson.id}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {initialsFromDisplayName(
                  lesson.teacherDisplayName && lesson.teacherDisplayName !== 'Teacher'
                    ? lesson.teacherDisplayName
                    : lesson.title
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    role={!learnerInline && onLessonClick ? 'button' : undefined}
                    tabIndex={!learnerInline && onLessonClick ? 0 : undefined}
                    className={
                      !learnerInline && onLessonClick
                        ? 'min-w-0 flex-1 cursor-pointer rounded-lg -m-2 p-2 text-left hover:bg-gray-50'
                        : 'min-w-0 flex-1'
                    }
                    onClick={!learnerInline && onLessonClick ? () => onLessonClick(lesson.id) : undefined}
                    onKeyDown={
                      !learnerInline && onLessonClick
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
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>
                          {lesson.date.toLocaleDateString()} at{' '}
                          {lesson.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1 min-w-0">
                        {lesson.modality === 'virtual' ? (
                          <>
                            <Video className="w-4 h-4 flex-shrink-0" />
                            {lesson.calendarJoin ? (
                              <VirtualMeetingJoinLink
                                startsAtIso={lesson.calendarJoin.startsAtIso}
                                endsAtIso={lesson.calendarJoin.endsAtIso}
                                lessonMeetingUrl={lesson.calendarJoin.lessonMeetingUrl}
                                teacherMeetingUrl={lesson.calendarJoin.teacherMeetingUrl}
                              />
                            ) : (
                              <span>Virtual</span>
                            )}
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
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {pill ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${pill.className}`}>{pill.label}</span>
                    ) : (
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
                    )}
                    {(lesson.focus || lesson.notes) && learnerInline ? (
                      <button
                        type="button"
                        onClick={() => setExpandedIds((prev) => ({ ...prev, [lesson.id]: !detailsOpen }))}
                        className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900"
                      >
                        {detailsOpen ? (
                          <>
                            Hide details <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            Details <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>

                {learnerInline && (lesson.focus || lesson.notes) && detailsOpen ? (
                  <div className="space-y-3 mb-4">
                    {lesson.focus ? (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Focus:</span> {lesson.focus}
                        </p>
                      </div>
                    ) : null}
                    {lesson.notes ? (
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900 mb-1">Lesson notes</p>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{lesson.notes}</p>
                      </div>
                    ) : null}
                  </div>
                ) : null}

                {!learnerInline && lesson.focus ? (
                  <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Focus:</span> {lesson.focus}
                    </p>
                  </div>
                ) : null}

                {!learnerInline && lesson.notes ? (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">Lesson notes</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{lesson.notes}</p>
                  </div>
                ) : null}

                {learnerInline && row && intentConn ? (
                  <LearnerLessonActions
                    lessonId={row.id}
                    lessonDbStatus={row.status}
                    startsAtIso={row.starts_at}
                    endsAtIso={row.ends_at}
                    participants={row.participants}
                    actorProfileId={learnerInline.actorProfileId}
                    intentConnection={intentConn}
                    onStatusChange={learnerInline.onStatusChange}
                    onLessonDbStatusUpdated={learnerInline.onLessonDbStatusUpdated}
                    onLessonsReload={learnerInline.onLessonsReload}
                  />
                ) : null}

                {!learnerInline ? (
                  <>
                    <LessonActions lessonId={lesson.id} lessonDate={lesson.date} variant={variant === 'compact' ? 'compact' : 'default'} />
                    <p className="text-xs text-gray-400 mt-3">
                      These row buttons are not saved. Open the lesson block above for full details.
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
