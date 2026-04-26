import { createPortal } from 'react-dom';
import { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Video, MapPin } from 'lucide-react';
import { LessonActions } from '../../shared/lesson-actions';
import type { Lesson } from '../../../types/domain';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { initialsFromDisplayName } from '@/lib/lesson-ui-helpers';
import { LearnerLessonActions } from './learner-lesson-actions';
import { VirtualMeetingJoinLink } from '../../shared/virtual-meeting-join-link';
import { TeacherLessonAttendanceTrigger } from './teacher-lesson-attendance-trigger';

interface LessonListProps {
  lessons: Lesson[];
  variant?: 'default' | 'compact';
  emptyTitle?: string;
  emptyDescription?: string;
  /** Non-learner roles: opens detail modal from parent. Omitted for learner/household inline cards. */
  onLessonClick?: (lessonId: string) => void;
  /** Rows the signed-in teacher may take attendance for (same tab as list). */
  teacherAttendanceSourceRows?: DashboardLessonRow[];
  onTeacherAttendanceSaved?: () => void | Promise<void>;
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

function sanitizeNotesHtml(html: string): string {
  if (!html.trim()) return '';
  if (typeof window === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const allowedTags = new Set(['A', 'B', 'STRONG', 'I', 'EM', 'U', 'UL', 'OL', 'LI', 'P', 'BR', 'HR', 'DIV', 'SPAN']);
  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  const toRemove: Element[] = [];
  while (walker.nextNode()) {
    const el = walker.currentNode as Element;
    if (!allowedTags.has(el.tagName)) {
      toRemove.push(el);
      continue;
    }
    for (const attr of [...el.attributes]) {
      const n = attr.name.toLowerCase();
      const v = attr.value.trim();
      if (el.tagName === 'A' && (n === 'href' || n === 'target' || n === 'rel')) continue;
      el.removeAttribute(attr.name);
      if (n.startsWith('on')) el.removeAttribute(attr.name);
      if (v.toLowerCase().startsWith('javascript:')) el.removeAttribute(attr.name);
    }
    if (el.tagName === 'A') {
      const href = (el.getAttribute('href') || '').trim();
      if (!href || /^javascript:/i.test(href)) el.replaceWith(doc.createTextNode(el.textContent || ''));
    }
  }
  for (const el of toRemove) el.replaceWith(doc.createTextNode(el.textContent || ''));
  return doc.body.innerHTML.trim();
}

export function LessonList({
  lessons,
  variant = 'default',
  emptyTitle = 'No lessons found',
  emptyDescription,
  onLessonClick,
  learnerInline,
  teacherAttendanceSourceRows,
  onTeacherAttendanceSaved,
}: LessonListProps) {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [notesRowId, setNotesRowId] = useState<string | null>(null);
  const notesRow = useMemo(
    () => (notesRowId && learnerInline ? rowByLessonId(learnerInline.sourceRows, notesRowId) : null),
    [learnerInline, notesRowId]
  );

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
        const isPastLesson = row ? new Date(row.ends_at).getTime() < Date.now() : false;
        const isClosedByStatus = ['completed', 'no_show', 'cancelled'].includes(lesson.status);
        const canViewPostLesson = Boolean(learnerInline && row && (isPastLesson || isClosedByStatus));
        const rowAny = row as
          | (DashboardLessonRow & {
              recording_url?: string | null;
              nml_video_url?: string | null;
              zoom_recording_url?: string | null;
            })
          | undefined;
        const recordingUrl =
          rowAny?.recording_url ||
          rowAny?.nml_video_url ||
          rowAny?.zoom_recording_url ||
          row?.meeting_url ||
          row?.teacher_meeting_url;
        const hasRecording = Boolean(recordingUrl);

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
                {canViewPostLesson ? (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (row?.id) setNotesRowId(row.id);
                      }}
                      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Lesson Notes
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (recordingUrl) window.open(recordingUrl, '_blank', 'noopener,noreferrer');
                      }}
                      disabled={!hasRecording}
                      title={hasRecording ? 'Open lesson recording' : 'Recording not available yet'}
                      className={`inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-medium ${
                        hasRecording
                          ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
                      }`}
                    >
                      View Recording
                    </button>
                  </div>
                ) : null}

                {!learnerInline ? (
                  <>
                    {(() => {
                      const attRow = teacherAttendanceSourceRows?.find((r) => r.id === lesson.id);
                      return attRow ? (
                        <TeacherLessonAttendanceTrigger
                          row={attRow}
                          variant={variant === 'compact' ? 'compact' : 'default'}
                          onSaved={onTeacherAttendanceSaved}
                        />
                      ) : (
                        <LessonActions lessonId={lesson.id} lessonDate={lesson.date} variant={variant === 'compact' ? 'compact' : 'default'} />
                      );
                    })()}
                    <p className="text-xs text-gray-400 mt-3">
                      {teacherAttendanceSourceRows?.some((r) => r.id === lesson.id)
                        ? 'Take attendance to record how the lesson went and save notes.'
                        : 'These row buttons are not saved. Open the lesson block above for full details.'}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })}
      {notesRow
        ? createPortal(
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Lesson notes</h2>
                    <p className="mt-1 text-sm text-slate-600">{new Date(notesRow.starts_at).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotesRowId(null)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close notes"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  {notesRow.lesson_notes?.notes ? (
                    <section className="rounded-xl border border-sky-100/80 bg-white p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-900/90">Lesson Notes</h3>
                      <div
                        className="text-sm text-slate-800 [&_a]:cursor-pointer [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:underline-offset-2"
                        dangerouslySetInnerHTML={{ __html: sanitizeNotesHtml(notesRow.lesson_notes.notes) }}
                      />
                    </section>
                  ) : null}
                  {notesRow.lesson_notes?.assignments?.length ? (
                    <section className="rounded-xl border border-violet-100/80 bg-white p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-900/90">Assignments</h3>
                      <ul className="space-y-2">
                        {notesRow.lesson_notes.assignments.map((a) => (
                          <li key={a.id} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3 text-sm text-slate-800">
                            <p className="font-medium">{a.title || 'Untitled assignment'}</p>
                            {a.description ? <p className="mt-1 text-slate-600">{a.description}</p> : null}
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {notesRow.lesson_notes?.reference_resources?.length ? (
                    <section className="rounded-xl border border-amber-100/80 bg-white p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-900/90">Reference Materials</h3>
                      <ul className="space-y-1.5 text-sm text-slate-700">
                        {notesRow.lesson_notes.reference_resources.map((resource) => (
                          <li key={resource.id}>{resource.title}</li>
                        ))}
                      </ul>
                    </section>
                  ) : null}
                  {!notesRow.lesson_notes?.notes &&
                  !notesRow.lesson_notes?.assignments?.length &&
                  !notesRow.lesson_notes?.reference_resources?.length ? (
                    <p className="text-sm text-slate-500">No lesson notes were uploaded for this lesson yet.</p>
                  ) : null}
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
