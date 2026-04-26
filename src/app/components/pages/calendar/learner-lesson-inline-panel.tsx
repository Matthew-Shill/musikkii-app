import { createPortal } from 'react-dom';
import { useState } from 'react';
import { X, Clock, Video, MapPin, FileText } from 'lucide-react';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import type { CalendarEventUiStatus } from '@/app/dashboard/calendarLessonAdapters';
import {
  lessonPrimaryLabel,
  lessonTeacherDisplayName,
  lessonStudentDisplayLabel,
  modalityLabel,
} from '@/app/dashboard/lessonDerived';
import { formatDbLessonStatusLabel, formatLessonDate, formatLessonTime, initialsFromDisplayName } from '@/lib/lesson-ui-helpers';
import { LearnerLessonActions } from './learner-lesson-actions';
import type { LessonIntentEventsConnection } from '@/app/dashboard/hooks/useLessonIntentEvents';
import { VirtualMeetingJoinLink } from '@/app/components/shared/virtual-meeting-join-link';

type Props = {
  row: DashboardLessonRow;
  actorProfileId: string;
  intentConnection: LessonIntentEventsConnection;
  cardUiStatus: CalendarEventUiStatus;
  onDismiss: () => void;
  onStatusChange: (lessonId: string, status: CalendarEventUiStatus) => void;
  onLessonDbStatusUpdated: (lessonId: string, dbStatus?: string) => void;
  onLessonsReload: () => Promise<void>;
};

function badgeClass(status: CalendarEventUiStatus) {
  switch (status) {
    case 'Confirmed':
      return 'bg-green-100 text-green-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    case 'NML Requested':
      return 'bg-purple-100 text-purple-700';
    case 'Completed':
      return 'bg-blue-100 text-blue-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}

function sanitizeNotesHtml(html: string): string {
  if (!html.trim()) return '';
  if (typeof window === 'undefined') return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  for (const a of Array.from(doc.querySelectorAll('a'))) {
    const href = (a.getAttribute('href') || '').trim();
    if (!href || /^javascript:/i.test(href)) a.replaceWith(doc.createTextNode(a.textContent || ''));
  }
  return doc.body.innerHTML.trim();
}

export function LearnerLessonInlinePanel({
  row,
  actorProfileId,
  intentConnection,
  cardUiStatus,
  onDismiss,
  onStatusChange,
  onLessonDbStatusUpdated,
  onLessonsReload,
}: Props) {
  const [notesOpen, setNotesOpen] = useState(false);
  const title = lessonPrimaryLabel(row);
  const teacher = lessonTeacherDisplayName(row);
  const student = lessonStudentDisplayLabel(row);
  const isVirtual = row.modality?.toLowerCase() === 'virtual';
  const isPastLesson = new Date(row.ends_at).getTime() < Date.now();
  const rowAny = row as DashboardLessonRow & {
    recording_url?: string | null;
    nml_video_url?: string | null;
    zoom_recording_url?: string | null;
  };
  const recordingUrl =
    rowAny.recording_url || rowAny.nml_video_url || rowAny.zoom_recording_url || row.meeting_url || row.teacher_meeting_url;
  const hasRecording = Boolean(recordingUrl);

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100 bg-gray-50/80">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
            {initialsFromDisplayName(teacher && teacher !== 'Teacher' ? teacher : title)}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">{title}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              <span className="font-medium text-gray-700">Teacher:</span> {teacher && teacher !== 'Teacher' ? teacher : '—'}
              {student ? (
                <>
                  {' '}
                  <span className="font-medium text-gray-700">· Student(s):</span> {student}
                </>
              ) : null}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeClass(cardUiStatus)}`}>
            {cardUiStatus === 'NML Requested' ? 'NML Requested' : cardUiStatus}
          </span>
          <button
            type="button"
            onClick={onDismiss}
            className="h-9 w-9 inline-flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
            aria-label="Close lesson panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-medium text-gray-500 uppercase tracking-wide">Status</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {formatDbLessonStatusLabel(row.status)}
          </span>
        </div>

        <div className="flex items-start gap-3 text-sm text-gray-700">
          <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Schedule</p>
            <p className="font-medium text-gray-900">
              {formatLessonDate(row.starts_at)} · {formatLessonTime(row.starts_at)} – {formatLessonTime(row.ends_at)}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 text-sm text-gray-700">
          {isVirtual ? (
            <Video className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Modality</p>
            <p className="font-medium text-gray-900">{modalityLabel(row.modality)}</p>
            {row.location?.trim() ? <p className="text-gray-600">{row.location}</p> : null}
            {isVirtual ? (
              <div className="mt-2 flex min-w-0 items-center gap-2">
                <VirtualMeetingJoinLink
                  startsAtIso={row.starts_at}
                  endsAtIso={row.ends_at}
                  lessonMeetingUrl={row.meeting_url}
                  teacherMeetingUrl={row.teacher_meeting_url}
                />
              </div>
            ) : null}
          </div>
        </div>

        {row.focus ? (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs font-semibold text-blue-900 mb-1">Lesson focus</p>
            <p className="text-sm text-blue-900">{row.focus}</p>
          </div>
        ) : null}

        {row.notes ? (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-gray-600" />
              <p className="text-xs font-semibold text-gray-900">Lesson notes</p>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{row.notes}</p>
          </div>
        ) : null}

        <LearnerLessonActions
          lessonId={row.id}
          lessonDbStatus={row.status}
          startsAtIso={row.starts_at}
          endsAtIso={row.ends_at}
          participants={row.participants}
          actorProfileId={actorProfileId}
          intentConnection={intentConnection}
          onStatusChange={onStatusChange}
          onLessonDbStatusUpdated={onLessonDbStatusUpdated}
          onLessonsReload={onLessonsReload}
        />
        {isPastLesson ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setNotesOpen(true)}
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
      </div>
      {notesOpen
        ? createPortal(
            <div className="fixed inset-0 z-[520] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
              <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
                  <h2 className="text-lg font-semibold text-slate-900">Lesson Notes</h2>
                  <button
                    type="button"
                    onClick={() => setNotesOpen(false)}
                    className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4 p-5">
                  {row.lesson_notes?.notes ? (
                    <div
                      className="text-sm text-slate-800 [&_a]:cursor-pointer [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:underline-offset-2"
                      dangerouslySetInnerHTML={{ __html: sanitizeNotesHtml(row.lesson_notes.notes) }}
                    />
                  ) : null}
                  {row.lesson_notes?.assignments?.length ? (
                    <ul className="space-y-2">
                      {row.lesson_notes.assignments.map((a) => (
                        <li key={a.id} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3 text-sm text-slate-800">
                          <p className="font-medium">{a.title || 'Untitled assignment'}</p>
                          {a.description ? <p className="mt-1 text-slate-600">{a.description}</p> : null}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {!row.lesson_notes?.notes &&
                  !row.lesson_notes?.assignments?.length &&
                  !row.lesson_notes?.reference_resources?.length ? (
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
