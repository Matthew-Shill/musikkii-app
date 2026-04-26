import { createPortal } from 'react-dom';
import {
  Bold,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Mail,
  Minus,
  Plus,
  Sparkles,
  Trash2,
  Underline,
  X,
} from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useRole } from '@/app/context/role-context';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import {
  ASSIGNMENT_TYPE_OPTIONS,
  ATTENDANCE_UI_OPTIONS,
  LESSON_RESOURCE_LEVEL_OPTIONS,
  LESSON_RESOURCE_TYPE_OPTIONS,
  calculateAssignmentXP,
  createEmptyLessonAssignment,
  dbLessonStatusForOutcome,
  emptyLessonNotesRecord,
  normalizeDifficulty,
  type AssignmentType,
  type LessonAssignmentNote,
  type LessonCompletionOutcome,
  type LessonNotesRecord,
  type LessonResourceDraft,
  type LessonResourceSnapshot,
} from '@/app/dashboard/lessonCompletionTypes';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';
import { supabase } from '@/lib/supabase';

type ResourcePanelMode = 'menu' | 'existing' | 'create';
type ResourcePanelState =
  | { scope: 'assignment'; assignmentId: string; mode: ResourcePanelMode }
  | { scope: 'reference'; mode: ResourcePanelMode }
  | null;
type ExistingResourceOption = {
  id: string;
  title: string;
  resource_type: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  level: string;
};

const EXISTING_RESOURCE_OPTIONS: ExistingResourceOption[] = [
  { id: 'res-scale-packet', title: 'Scale Packet in C/G', resource_type: 'sheet music', difficulty: 2, level: 'Beginner' },
  { id: 'res-warmup-rhythm', title: '7-min Rhythm Warmup', resource_type: 'video', difficulty: 1, level: 'Beginner' },
  { id: 'res-song-arrangement', title: 'Song Arrangement Worksheet', resource_type: 'lyrics / chords', difficulty: 3, level: 'Intermediate' },
];

function stripHtml(input: string): string {
  return input.replace(/<[^>]+>/g, '').trim();
}

function sanitizeRichText(html: string): string {
  const next = html
    .replace(/\sdir="rtl"/gi, '')
    .replace(/\sdir='rtl'/gi, '')
    .replace(/direction\s*:\s*rtl;?/gi, '')
    .trim();
  if (!next) return '';
  if (next === '<br>' || next === '<div><br></div>' || next === '<p><br></p>') return '';
  if (typeof window === 'undefined') return next;

  const parser = new DOMParser();
  const doc = parser.parseFromString(next, 'text/html');
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
      const name = attr.name.toLowerCase();
      const value = attr.value.trim();
      if (el.tagName === 'A' && (name === 'href' || name === 'target' || name === 'rel')) continue;
      if (name === 'style' && el.tagName === 'HR') continue;
      el.removeAttribute(attr.name);
      if (name.startsWith('on')) el.removeAttribute(attr.name);
      if (value.toLowerCase().startsWith('javascript:')) el.removeAttribute(attr.name);
    }
    if (el.tagName === 'A') {
      const href = (el.getAttribute('href') || '').trim();
      if (!href || /^javascript:/i.test(href)) {
        el.replaceWith(doc.createTextNode(el.textContent || ''));
        continue;
      }
      const isNewTab = el.getAttribute('target') === '_blank';
      if (isNewTab) el.setAttribute('rel', 'noopener noreferrer');
      else el.removeAttribute('rel');
    }
  }

  for (const el of toRemove) {
    el.replaceWith(doc.createTextNode(el.textContent || ''));
  }
  return doc.body.innerHTML.trim();
}

/** Anchor wrapping the selection/caret, if any (for edit-link prefills). */
function getLinkAnchorFromSelection(editor: HTMLElement, sel: Selection | null): HTMLAnchorElement | null {
  if (!sel?.rangeCount) return null;
  const r = sel.getRangeAt(0);
  if (!editor.contains(r.commonAncestorContainer)) return null;
  const n = r.commonAncestorContainer;
  const el = n.nodeType === Node.TEXT_NODE ? n.parentElement : (n as Element);
  const a = el?.closest?.('a');
  return a && editor.contains(a) ? (a as HTMLAnchorElement) : null;
}

function attendancePillClass(outcome: LessonCompletionOutcome | null): string {
  switch (outcome) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'completed_makeup':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'nml_completed':
      return 'bg-violet-100 text-violet-700 border-violet-200';
    case 'student_missed':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'teacher_cancelled':
      return 'bg-orange-100 text-orange-700 border-orange-200';
    default:
      return 'bg-[var(--musikkii-blue)] text-white border-transparent';
  }
}

function assignmentXpFor(assignmentType: AssignmentType, difficulty: number): number {
  const d = normalizeDifficulty(difficulty);
  return calculateAssignmentXP({ assignmentType, difficulty: d });
}

function setAssignmentWithXp(
  assignment: LessonAssignmentNote,
  patch: Partial<LessonAssignmentNote>
): LessonAssignmentNote {
  const assignment_type = (patch.assignment_type ?? assignment.assignment_type) as AssignmentType;
  const difficulty = normalizeDifficulty(patch.difficulty ?? assignment.difficulty);
  return {
    ...assignment,
    ...patch,
    assignment_type,
    difficulty,
    xp: assignmentXpFor(assignment_type, difficulty),
  };
}

export interface TeacherLessonAttendanceTriggerProps {
  row: DashboardLessonRow;
  variant?: 'default' | 'compact';
  onSaved?: () => void | Promise<void>;
}

export function TeacherLessonAttendanceTrigger({
  row,
  variant = 'default',
  onSaved,
}: TeacherLessonAttendanceTriggerProps) {
  const { user } = useAuthSession();
  const { roleFamily } = useRole();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const notesEditorRef = useRef<HTMLDivElement>(null);
  const linkPopoverRef = useRef<HTMLDivElement>(null);

  const canTeach = Boolean(
    user?.id && row.teacher_profile_id && row.teacher_profile_id === user.id && roleFamily === 'instructor'
  );

  const [pickerOpen, setPickerOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0, width: 288 });
  const [notesOpen, setNotesOpen] = useState(false);
  const [readOnlyOpen, setReadOnlyOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [resourcePanel, setResourcePanel] = useState<ResourcePanelState>(null);
  const [outcome, setOutcome] = useState<LessonCompletionOutcome | null>(null);
  const [notesHtml, setNotesHtml] = useState('');
  const [assignments, setAssignments] = useState<LessonAssignmentNote[]>([]);
  const [sendToStudent, setSendToStudent] = useState(false);
  const [sendToParent, setSendToParent] = useState(false);
  const [resourceDrafts, setResourceDrafts] = useState<LessonResourceDraft[]>([]);
  const [referenceResources, setReferenceResources] = useState<LessonResourceSnapshot[]>([]);
  const [referenceMaterialsOpen, setReferenceMaterialsOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftType, setDraftType] = useState<string>(LESSON_RESOURCE_TYPE_OPTIONS[0]);
  const [draftLevel, setDraftLevel] = useState<string>(LESSON_RESOURCE_LEVEL_OPTIONS[0]);
  const [draftDifficulty, setDraftDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [draftFileName, setDraftFileName] = useState<string | undefined>();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [linkPopoverOpen, setLinkPopoverOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkOpenInNewTab, setLinkOpenInNewTab] = useState(false);
  /** Ref so Apply Link always sees the range captured when opening the popover (not a stale render). */
  const savedRangeRef = useRef<Range | null>(null);
  const [recentNotes, setRecentNotes] = useState<
    { id: string; starts_at: string; outcome: LessonCompletionOutcome | null; lesson_notes: LessonNotesRecord }[]
  >([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const isClosedByStatus = ['completed', 'cancelled', 'no_show'].includes(row.status);
  const hasOutcome = Boolean(row.outcome);
  const isCompletedContext = isClosedByStatus || hasOutcome;
  const isUpcomingLesson = !isCompletedContext && new Date(row.starts_at).getTime() > Date.now();
  const rowAny = row as DashboardLessonRow & {
    recording_url?: string | null;
    nml_video_url?: string | null;
    zoom_recording_url?: string | null;
  };
  const recordingUrl =
    rowAny.recording_url || rowAny.nml_video_url || rowAny.zoom_recording_url || row.meeting_url || row.teacher_meeting_url;
  const hasRecording = Boolean(recordingUrl);
  const isCancelledLesson = row.status === 'cancelled' || row.outcome === 'teacher_cancelled';
  const shouldShowRecordingButton = !isUpcomingLesson && !isCancelledLesson;
  const hasSavedLessonNotes = Boolean(
    stripHtml(row.lesson_notes?.notes ?? '') ||
      row.lesson_notes?.assignments?.length ||
      row.lesson_notes?.reference_resources?.length
  );
  const notesButtonLabel = hasSavedLessonNotes ? 'Lesson Notes' : 'Recent Notes';
  const attendanceMeta = row.outcome ? ATTENDANCE_UI_OPTIONS.find((o) => o.value === row.outcome) : null;

  const assignmentForResourcePanel = useMemo(() => {
    if (!resourcePanel || resourcePanel.scope !== 'assignment') return null;
    return assignments.find((a) => a.id === resourcePanel.assignmentId) ?? null;
  }, [assignments, resourcePanel]);

  const hydrateFromRow = useCallback(() => {
    const ln = row.lesson_notes ?? emptyLessonNotesRecord();
    setNotesHtml(ln.notes || '');
    setAssignments(ln.assignments.length > 0 ? ln.assignments : [createEmptyLessonAssignment()]);
    setSendToStudent(Boolean(ln.send_to_student));
    setSendToParent(Boolean(ln.send_to_parent));
    setResourceDrafts(ln.resource_drafts ?? []);
    setReferenceResources(ln.reference_resources ?? []);
    setReferenceMaterialsOpen(false);
    setDraftTitle('');
    setDraftType(LESSON_RESOURCE_TYPE_OPTIONS[0]);
    setDraftLevel(LESSON_RESOURCE_LEVEL_OPTIONS[0]);
    setDraftDifficulty(2);
    setDraftFileName(undefined);
    setSaveError(null);
    setResourcePanel(null);
    setLinkPopoverOpen(false);
    savedRangeRef.current = null;
  }, [row.lesson_notes]);

  useLayoutEffect(() => {
    if (!pickerOpen || !anchorRef.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    setMenuPos({
      top: r.bottom + 6,
      left: Math.max(8, Math.min(r.left, window.innerWidth - 296)),
      width: Math.max(280, r.width),
    });
  }, [pickerOpen]);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setPickerOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [pickerOpen]);

  useEffect(() => {
    if (!notesOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (resourcePanel) setResourcePanel(null);
        else setNotesOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [notesOpen, resourcePanel]);

  useEffect(() => {
    if (!linkPopoverOpen) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (linkPopoverRef.current?.contains(target)) return;
      if (notesEditorRef.current?.contains(target)) return;
      savedRangeRef.current = null;
      setLinkPopoverOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [linkPopoverOpen]);

  useEffect(() => {
    if (!notesOpen || !notesEditorRef.current) return;
    notesEditorRef.current.innerHTML = notesHtml || '';
  }, [notesOpen]);

  const openNotesAfterPick = (picked: LessonCompletionOutcome) => {
    setOutcome(picked);
    hydrateFromRow();
    setPickerOpen(false);
    setNotesOpen(true);
  };

  const openSavedNotesView = () => {
    hydrateFromRow();
    setReadOnlyOpen(true);
  };

  const loadRecentNotes = useCallback(async () => {
    const studentIds = (row.participants ?? []).map((p) => p.studentId).filter(Boolean);
    if (studentIds.length === 0) return;
    setHistoryLoading(true);
    const { data } = await supabase
      .from('lesson_participants')
      .select('lessons!inner(id, starts_at, outcome, lesson_notes)')
      .in('student_id', studentIds)
      .limit(20);
    const normalized = ((data ?? []) as Array<{ lessons: Record<string, unknown>[] | null }>)
      .map((item) => (Array.isArray(item.lessons) ? item.lessons[0] : null))
      .filter((item): item is Record<string, unknown> => Boolean(item && item.id))
      .map((item) => ({
        id: String(item.id),
        starts_at: String(item.starts_at),
        outcome: (item.outcome as LessonCompletionOutcome | null) ?? null,
        lesson_notes: (item.lesson_notes as LessonNotesRecord) ?? emptyLessonNotesRecord(),
      }))
      .filter((item) => item.lesson_notes && (stripHtml(item.lesson_notes.notes || '') || item.lesson_notes.assignments.length > 0))
      .sort((a, b) => new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime())
      .filter((item) => item.id !== row.id);
    setRecentNotes(normalized.slice(0, 5));
    setHistoryLoading(false);
  }, [row.id, row.participants]);

  const updateAssignment = (id: string, patch: Partial<LessonAssignmentNote>) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? setAssignmentWithXp(a, patch) : a))
    );
  };

  const removeAssignment = (id: string) => {
    setAssignments((prev) =>
      prev.length <= 1 ? prev : prev.filter((a) => a.id !== id)
    );
    if (resourcePanel?.scope === 'assignment' && resourcePanel.assignmentId === id) setResourcePanel(null);
  };

  const addAssignment = () => {
    setAssignments((prev) => [...prev, createEmptyLessonAssignment()]);
  };

  const toResourceSnapshot = (resource: ExistingResourceOption | LessonResourceDraft): LessonResourceSnapshot => ({
    id: resource.id ?? `draft-${crypto.randomUUID()}`,
    title: resource.title,
    resource_type: resource.resource_type,
    difficulty: resource.difficulty,
    ...(resource.level ? { level: resource.level } : {}),
  });

  const applyResourceToAssignment = (
    assignmentId: string,
    resource: {
      id: string;
      title: string;
      difficulty: 1 | 2 | 3 | 4 | 5;
      resource_type?: string;
      level?: string;
    }
  ) => {
    setAssignments((prev) =>
      prev.map((a) =>
            a.id === assignmentId
          ? setAssignmentWithXp(a, {
              resource_id: resource.id,
              resource_title: resource.title,
              difficulty: resource.difficulty,
              resource_snapshot: {
                id: resource.id,
                title: resource.title,
                resource_type: resource.resource_type ?? 'resource',
                difficulty: resource.difficulty,
                ...(resource.level ? { level: resource.level } : {}),
              },
            })
          : a
      )
    );
  };

  const clearResourceFromAssignment = (assignmentId: string) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === assignmentId
          ? setAssignmentWithXp(a, { resource_id: null, resource_title: null, resource_snapshot: null })
          : a
      )
    );
  };

  const addCustomResourceAndAttach = () => {
    const title = draftTitle.trim();
    if (!title && !draftFileName) return;
    const resourceId = `resource-${crypto.randomUUID()}`;
    const finalTitle = title || (draftFileName ? `File: ${draftFileName}` : 'Custom Resource');
    const draft: LessonResourceDraft = {
      id: resourceId,
      title: finalTitle,
      resource_type: draftType,
      level: draftLevel,
      file_name: draftFileName,
      difficulty: draftDifficulty,
    };
    setResourceDrafts((prev) => [...prev, draft]);
    const snapshot = toResourceSnapshot(draft);
    if (resourcePanel?.scope === 'assignment') {
      applyResourceToAssignment(resourcePanel.assignmentId, {
        id: resourceId,
        title: finalTitle,
        difficulty: draftDifficulty,
        resource_type: draftType,
        level: draftLevel,
      });
    } else {
      setReferenceResources((prev) => [...prev, snapshot]);
    }
    setDraftTitle('');
    setDraftFileName(undefined);
    setDraftType(LESSON_RESOURCE_TYPE_OPTIONS[0]);
    setDraftLevel(LESSON_RESOURCE_LEVEL_OPTIONS[0]);
    setDraftDifficulty(2);
    setResourcePanel(
      resourcePanel?.scope === 'assignment'
        ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'menu' }
        : { scope: 'reference', mode: 'menu' }
    );
  };

  const executeEditorCommand = (command: string, value?: string) => {
    notesEditorRef.current?.focus();
    document.execCommand(command, false, value);
    const html = notesEditorRef.current?.innerHTML ?? '';
    setNotesHtml(sanitizeRichText(html));
  };

  /** Normalize teacher-entered URLs (insertHTML/execCommand is unreliable for links). */
  function normalizeUserHref(raw: string): string {
    const t = raw.trim();
    if (!t || /^javascript:/i.test(t)) return '';
    if (/^(https?:|mailto:|#)/i.test(t)) return t;
    return `https://${t}`;
  }

  const prefillLinkFormFromAnchor = (anchor: HTMLAnchorElement) => {
    const ar = document.createRange();
    ar.selectNode(anchor);
    savedRangeRef.current = ar;
    setLinkUrl(anchor.getAttribute('href') || '');
    setLinkText(anchor.textContent || '');
    setLinkOpenInNewTab(anchor.getAttribute('target') === '_blank');
  };

  const openLinkPopover = () => {
    const editor = notesEditorRef.current;
    const selection = window.getSelection();
    if (!editor) {
      savedRangeRef.current = null;
      setLinkText('');
      setLinkUrl('');
      setLinkOpenInNewTab(false);
      setLinkPopoverOpen(true);
      return;
    }

    const anchor = getLinkAnchorFromSelection(editor, selection);
    if (anchor) {
      prefillLinkFormFromAnchor(anchor);
    } else if (selection?.rangeCount) {
      const r = selection.getRangeAt(0);
      if (editor.contains(r.commonAncestorContainer)) {
        savedRangeRef.current = r.cloneRange();
        setLinkText(r.toString().trim());
        setLinkUrl('');
        setLinkOpenInNewTab(false);
      } else {
        savedRangeRef.current = null;
        setLinkText('');
        setLinkUrl('');
        setLinkOpenInNewTab(false);
      }
    } else {
      savedRangeRef.current = null;
      setLinkText('');
      setLinkUrl('');
      setLinkOpenInNewTab(false);
    }
    setLinkPopoverOpen(true);
  };

  const openEnteredLinkInBrowser = () => {
    const href = normalizeUserHref(linkUrl.trim());
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const handleNotesEditorClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    const editor = notesEditorRef.current;
    const raw = e.target as Node;
    const target =
      raw.nodeType === Node.TEXT_NODE ? (raw.parentElement as HTMLElement | null) : (raw as HTMLElement);
    if (!editor || !target) return;
    const a = target.closest('a');
    if (!a || !editor.contains(a)) return;

    if (e.metaKey || e.ctrlKey) {
      const raw = a.getAttribute('href')?.trim();
      if (!raw) return;
      const href = normalizeUserHref(raw) || raw;
      e.preventDefault();
      e.stopPropagation();
      window.open(href, '_blank', 'noopener,noreferrer');
      return;
    }

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) return;

    e.preventDefault();
    e.stopPropagation();
    prefillLinkFormFromAnchor(a);
    setLinkPopoverOpen(true);
  };

  const restoreSelectionInEditor = (): Range | null => {
    const editor = notesEditorRef.current;
    if (!editor) return null;
    editor.focus();
    const sel = window.getSelection();
    if (!sel) return null;
    const saved = savedRangeRef.current;
    if (saved) {
      try {
        if (editor.contains(saved.commonAncestorContainer)) {
          const clone = saved.cloneRange();
          sel.removeAllRanges();
          sel.addRange(clone);
          return clone;
        }
      } catch {
        /* fall through to caret at end */
      }
    }
    const end = document.createRange();
    end.selectNodeContents(editor);
    end.collapse(false);
    sel.removeAllRanges();
    sel.addRange(end);
    return end;
  };

  const applyLink = () => {
    const hrefRaw = linkUrl.trim();
    const href = normalizeUserHref(hrefRaw);
    if (!href) return;

    const editor = notesEditorRef.current;
    if (!editor) return;

    const range = restoreSelectionInEditor();
    if (!range) return;

    const displayText = (linkText.trim() || range.toString().trim() || href).trim();
    if (!displayText) return;

    range.deleteContents();
    const a = document.createElement('a');
    a.href = href;
    a.textContent = displayText;
    if (linkOpenInNewTab) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    range.insertNode(a);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      const after = document.createRange();
      after.setStartAfter(a);
      after.collapse(true);
      sel.addRange(after);
    }

    setNotesHtml(sanitizeRichText(editor.innerHTML));
    savedRangeRef.current = null;
    setLinkPopoverOpen(false);
  };

  const insertDivider = () => {
    executeEditorCommand('insertHTML', '<hr style="border:none;border-top:1px solid #dbe2ea;margin:12px 0;" />');
  };

  const handleSave = async () => {
    if (!outcome) return;
    setSaveError(null);
    setSaving(true);

    const normalizedAssignments = assignments.map((a) =>
      setAssignmentWithXp(a, {
        title: a.title.trim(),
        description: a.description.trim(),
      })
    );
    const payload: LessonNotesRecord = {
      goals: row.lesson_notes?.goals ?? [],
      notes: sanitizeRichText(notesHtml),
      assignments: normalizedAssignments,
      ...(referenceResources.length > 0 ? { reference_resources: referenceResources } : {}),
      send_to_student: sendToStudent,
      send_to_parent: sendToParent,
      ...(resourceDrafts.length > 0 ? { resource_drafts: resourceDrafts } : {}),
    };

    const status = dbLessonStatusForOutcome(outcome);
    const { error: upErr } = await supabase
      .from('lessons')
      .update({
        outcome,
        lesson_notes: payload,
        status,
      })
      .eq('id', row.id);

    setSaving(false);
    if (upErr) {
      setSaveError(upErr.message);
      return;
    }
    setNotesOpen(false);
    setOutcome(null);
    setResourcePanel(null);
    await onSaved?.();
  };

  if (!canTeach) return null;

  const compact = variant === 'compact';
  const outcomeMeta = outcome ? ATTENDANCE_UI_OPTIONS.find((o) => o.value === outcome) : null;

  const pickerPanel =
    pickerOpen &&
    createPortal(
      <div
        ref={menuRef}
        className="fixed z-[400] rounded-xl border border-slate-200/90 bg-white shadow-2xl overflow-hidden py-1"
        style={{ top: menuPos.top, left: menuPos.left, width: menuPos.width }}
        role="listbox"
        aria-label="Attendance"
      >
        {ATTENDANCE_UI_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="option"
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm font-medium text-slate-800 transition-colors ${opt.rowHoverClass}`}
            onClick={() => openNotesAfterPick(opt.value)}
          >
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${opt.dotClass}`} aria-hidden />
            {opt.label}
          </button>
        ))}
      </div>,
      document.body
    );

  const readOnlyModal =
    readOnlyOpen &&
    createPortal(
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Saved lesson notes</h2>
              <p className="mt-1 text-sm text-slate-600">
                {formatLessonDate(row.starts_at)} · {formatLessonTime(row.starts_at)}
              </p>
            </div>
            <button type="button" onClick={() => setReadOnlyOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-4 p-5">
            {stripHtml(row.lesson_notes?.notes ?? '') ? (
              <section className="rounded-xl border border-sky-100/80 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-sky-900/90">Lesson Notes</h3>
                <div
                  className="text-sm text-slate-800 [&_a]:cursor-pointer [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-sky-900"
                  dangerouslySetInnerHTML={{ __html: sanitizeRichText(row.lesson_notes.notes || '') }}
                />
              </section>
            ) : null}
            {row.lesson_notes?.assignments?.length ? (
              <section className="rounded-xl border border-violet-100/80 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-violet-900/90">Assignments</h3>
                <ul className="space-y-2">
                  {row.lesson_notes.assignments.map((a, idx) => (
                    <li key={a.id || idx} className="rounded-lg border border-violet-100 bg-violet-50/40 p-3 text-sm text-slate-800">
                      <p className="font-medium">{a.title || `Assignment ${idx + 1}`}</p>
                      {a.description ? <p className="mt-1 text-slate-600">{a.description}</p> : null}
                      <p className="mt-1 text-xs text-slate-500">
                        {a.assignment_type} · Difficulty {a.difficulty} · ⚡ +{a.xp} XP
                      </p>
                      {a.resource_title ? <p className="mt-1 text-xs text-violet-700">Attached resource: {a.resource_title}</p> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            {row.lesson_notes?.reference_resources?.length ? (
              <section className="rounded-xl border border-amber-100/80 bg-white p-4">
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-amber-900/90">Reference Materials</h3>
                <ul className="space-y-1.5">
                  {row.lesson_notes.reference_resources.map((r) => (
                    <li key={r.id} className="text-sm text-slate-700">
                      {r.title} · {r.resource_type}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
            <section className="rounded-xl border border-emerald-100/80 bg-white p-4 text-sm text-slate-700">
              <p>Send lesson summary to student: {row.lesson_notes?.send_to_student ? 'Yes' : 'No'}</p>
              <p>Send lesson summary to parent: {row.lesson_notes?.send_to_parent ? 'Yes' : 'No'}</p>
            </section>
          </div>
        </div>
      </div>,
      document.body
    );

  const historyModal =
    historyOpen &&
    createPortal(
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
        <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-white px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent notes</h2>
              <p className="mt-1 text-sm text-slate-600">Teacher prep context from recent lessons.</p>
            </div>
            <button type="button" onClick={() => setHistoryOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="space-y-3 p-5">
            {historyLoading ? <p className="text-sm text-slate-500">Loading recent notes…</p> : null}
            {!historyLoading && recentNotes.length === 0 ? <p className="text-sm text-slate-500">No recent notes available yet.</p> : null}
            {recentNotes.map((item) => (
              <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">
                  {formatLessonDate(item.starts_at)} · {ATTENDANCE_UI_OPTIONS.find((o) => o.value === item.outcome)?.label ?? 'No attendance'}
                </p>
                {stripHtml(item.lesson_notes.notes || '') ? (
                  <div
                    className="mt-2 text-sm text-slate-700 [&_a]:cursor-pointer [&_a]:font-medium [&_a]:text-sky-700 [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-sky-900"
                    dangerouslySetInnerHTML={{ __html: sanitizeRichText(item.lesson_notes.notes || '') }}
                  />
                ) : null}
                {item.lesson_notes.assignments.length > 0 ? (
                  <p className="mt-2 text-xs text-violet-700">{item.lesson_notes.assignments.length} assignment(s)</p>
                ) : null}
                {item.lesson_notes.reference_resources?.length ? (
                  <p className="text-xs text-amber-700">{item.lesson_notes.reference_resources.length} reference material(s)</p>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </div>,
      document.body
    );

  const notesModal =
    notesOpen &&
    outcome &&
    createPortal(
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[2px]">
        <div
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xl"
          role="dialog"
          aria-labelledby="lesson-notes-title"
          aria-modal="true"
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 px-5 py-4">
            <div>
              <h2 id="lesson-notes-title" className="text-lg font-semibold text-slate-900">
                Lesson notes
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-medium text-slate-700">{row.student_display_name ?? 'Student'}</span>
                {' · '}
                {formatLessonDate(row.starts_at)} · {formatLessonTime(row.starts_at)}
              </p>
              {outcomeMeta ? (
                <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <span className={`inline-flex h-2 w-2 rounded-full ${outcomeMeta.dotClass}`} aria-hidden />
                  <span className="font-medium text-slate-800">{outcomeMeta.label}</span>
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => setNotesOpen(false)}
              className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5">
            {resourcePanel && (resourcePanel.scope === 'reference' || assignmentForResourcePanel) ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setResourcePanel(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back to lesson notes
                  </button>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {resourcePanel.scope === 'assignment'
                      ? `Resource for: ${assignmentForResourcePanel?.title || 'Untitled assignment'}`
                      : 'Reference Materials'}
                  </p>
                </div>

                {resourcePanel.mode === 'menu' ? (
                  <section className="rounded-xl border border-amber-100/80 bg-gradient-to-br from-amber-50/40 to-white p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-900">
                      <Sparkles className="h-5 w-5 text-amber-700" />
                      <h3 className="text-sm font-semibold uppercase tracking-wide">
                        {resourcePanel.scope === 'assignment' ? 'Assignment Resource' : 'Reference Material'}
                      </h3>
                    </div>
                    <div className="mt-3 space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setResourcePanel(
                            resourcePanel.scope === 'assignment'
                              ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'existing' }
                              : { scope: 'reference', mode: 'existing' }
                          )
                        }
                        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-amber-50"
                      >
                        Use existing resource
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setResourcePanel(
                            resourcePanel.scope === 'assignment'
                              ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'create' }
                              : { scope: 'reference', mode: 'create' }
                          )
                        }
                        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-left text-sm font-medium text-slate-800 hover:bg-amber-50"
                      >
                        Create custom resource
                      </button>
                      {resourcePanel.scope === 'assignment' && assignmentForResourcePanel?.resource_id ? (
                        <button
                          type="button"
                          onClick={() => clearResourceFromAssignment(assignmentForResourcePanel.id)}
                          className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-left text-sm font-medium text-red-700 hover:bg-red-50"
                        >
                          Remove attached resource
                        </button>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                {resourcePanel.mode === 'existing' ? (
                  <section className="rounded-xl border border-sky-100/80 bg-gradient-to-br from-sky-50/40 to-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-900">Select Existing Resource</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setResourcePanel(
                            resourcePanel.scope === 'assignment'
                              ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'menu' }
                              : { scope: 'reference', mode: 'menu' }
                          )
                        }
                        className="text-xs font-medium text-sky-700 hover:text-sky-900"
                      >
                        Back
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {EXISTING_RESOURCE_OPTIONS.map((res) => (
                        <li key={res.id}>
                          <button
                            type="button"
                            onClick={() => {
                              if (resourcePanel.scope === 'assignment') {
                                applyResourceToAssignment(resourcePanel.assignmentId, res);
                              } else {
                                setReferenceResources((prev) => [...prev, toResourceSnapshot(res)]);
                              }
                              setResourcePanel(
                                resourcePanel.scope === 'assignment'
                                  ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'menu' }
                                  : { scope: 'reference', mode: 'menu' }
                              );
                            }}
                            className="w-full cursor-pointer rounded-lg border border-sky-200 bg-white px-3 py-2 text-left hover:border-sky-300 hover:bg-sky-50"
                          >
                            <p className="text-sm font-medium text-slate-900">{res.title}</p>
                            <p className="text-xs text-slate-500">
                              {res.resource_type} · Difficulty {res.difficulty} · {res.level}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                {resourcePanel.mode === 'create' ? (
                  <section className="rounded-xl border border-violet-100/80 bg-gradient-to-br from-violet-50/40 to-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-900">Create Custom Resource</h3>
                      <button
                        type="button"
                        onClick={() =>
                          setResourcePanel(
                            resourcePanel.scope === 'assignment'
                              ? { scope: 'assignment', assignmentId: resourcePanel.assignmentId, mode: 'menu' }
                              : { scope: 'reference', mode: 'menu' }
                          )
                        }
                        className="text-xs font-medium text-violet-700 hover:text-violet-900"
                      >
                        Back
                      </button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <label className="block text-xs text-violet-900/80 sm:col-span-2">
                        Title
                        <input
                          type="text"
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          placeholder="Resource title"
                          className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="block text-xs text-violet-900/80">
                        Resource type
                        <select
                          value={draftType}
                          onChange={(e) => setDraftType(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                        >
                          {LESSON_RESOURCE_TYPE_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs text-violet-900/80">
                        Difficulty
                        <select
                          value={draftDifficulty}
                          onChange={(e) => setDraftDifficulty(normalizeDifficulty(Number(e.target.value)))}
                          className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                        >
                          {[1, 2, 3, 4, 5].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs text-violet-900/80">
                        Resource level
                        <select
                          value={draftLevel}
                          onChange={(e) => setDraftLevel(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                        >
                          {LESSON_RESOURCE_LEVEL_OPTIONS.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="block text-xs text-violet-900/80 sm:col-span-2">
                        File upload
                        <input
                          type="file"
                          className="mt-1 block w-full text-sm text-slate-700"
                          onChange={(e) => setDraftFileName(e.target.files?.[0]?.name)}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={addCustomResourceAndAttach}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-100"
                    >
                      <Plus className="h-4 w-4" />
                      Save & Attach
                    </button>
                  </section>
                ) : null}
              </div>
            ) : (
              <div className="space-y-4">
                <section className="rounded-xl border border-sky-100/80 bg-gradient-to-br from-sky-50/40 to-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 text-sky-900">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 text-sky-700">
                      <FileText className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-sky-900/90">Lesson Notes</h3>
                  </div>
                  <div className="mb-2 rounded-lg border border-sky-100 bg-white">
                    <div className="flex flex-wrap items-center gap-1.5 border-b border-sky-100 px-2 py-1.5">
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={() => executeEditorCommand('bold')}>
                      <Bold className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={() => executeEditorCommand('italic')}>
                      <Italic className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={() => executeEditorCommand('underline')}>
                      <Underline className="h-4 w-4" />
                    </button>
                    <span className="mx-1 h-4 w-px bg-slate-200" />
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={() => executeEditorCommand('insertUnorderedList')}>
                      <List className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={() => executeEditorCommand('insertOrderedList')}>
                      <ListOrdered className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded p-1.5 hover:bg-slate-100"
                      title="Insert link"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openLinkPopover();
                      }}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button type="button" className="rounded p-1.5 hover:bg-slate-100" onClick={insertDivider} title="Insert divider">
                      <Minus className="h-4 w-4" />
                    </button>
                    {/* TODO(chord-diagrams): insert flow should be instrument -> chord name -> voicing/shape -> diagram block.
                        Candidate libs: SVGuitar (+ ukulele mode), Tonal for chord metadata, future custom piano renderer. */}
                    <button
                      type="button"
                      disabled
                      className="rounded p-1.5 text-slate-300"
                      title="Insert chord diagram (coming soon)"
                    >
                      🎸
                    </button>
                    </div>
                    {linkPopoverOpen ? (
                      <div ref={linkPopoverRef} className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2">
                        <label className="text-xs text-slate-600 sm:col-span-2">
                          URL
                          <input
                            type="url"
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            placeholder="https://"
                            className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        </label>
                        <label className="text-xs text-slate-600 sm:col-span-2">
                          Link text
                          <input
                            type="text"
                            value={linkText}
                            onChange={(e) => setLinkText(e.target.value)}
                            placeholder="Display text"
                            className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm"
                          />
                        </label>
                        <label className="inline-flex items-center gap-2 text-xs text-slate-700 sm:col-span-2">
                          <input
                            type="checkbox"
                            checked={linkOpenInNewTab}
                            onChange={(e) => setLinkOpenInNewTab(e.target.checked)}
                            className="rounded border-slate-300"
                          />
                          Open in new tab
                        </label>
                        <p className="text-[11px] leading-snug text-slate-500 sm:col-span-2">
                          Click a link to edit it. ⌘/Ctrl+click (or Open link) to visit the URL in a new tab.
                        </p>
                        <div className="sm:col-span-2 flex flex-wrap items-center justify-end gap-2">
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={openEnteredLinkInBrowser}
                            disabled={!normalizeUserHref(linkUrl.trim())}
                            className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-800 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open link
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              savedRangeRef.current = null;
                              setLinkPopoverOpen(false);
                            }}
                            className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={applyLink}
                            className="rounded-md bg-sky-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-sky-700"
                          >
                            Apply Link
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                  <div
                    ref={notesEditorRef}
                    contentEditable
                    dir="ltr"
                    suppressContentEditableWarning
                    onClickCapture={handleNotesEditorClickCapture}
                    onInput={() => setNotesHtml(sanitizeRichText(notesEditorRef.current?.innerHTML ?? ''))}
                    onFocus={() => {
                      const el = notesEditorRef.current;
                      if (!el) return;
                      el.setAttribute('dir', 'ltr');
                      el.style.direction = 'ltr';
                      el.style.unicodeBidi = 'plaintext';
                    }}
                    className="min-h-[150px] w-full rounded-lg border border-sky-100 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500/20 [&_a]:cursor-pointer [&_a]:font-medium [&_a]:text-sky-600 [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-sky-400/80 [&_a:hover]:text-sky-800"
                    style={{ direction: 'ltr', unicodeBidi: 'plaintext' }}
                    aria-label="Lesson notes rich text editor"
                  />
                  {!stripHtml(notesHtml) ? (
                    <p className="mt-2 text-xs text-slate-500">Document what happened in this specific lesson.</p>
                  ) : null}
                </section>

                <section className="rounded-xl border border-violet-100/80 bg-gradient-to-br from-violet-50/40 to-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-2 text-violet-900">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-violet-900/90">Assignments</h3>
                    </div>
                    <button
                      type="button"
                      onClick={addAssignment}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-900 hover:bg-violet-100"
                    >
                      <Plus className="h-4 w-4" />
                      Add assignment
                    </button>
                  </div>

                  <div className="space-y-3">
                    {assignments.map((assignment, idx) => (
                      <article key={assignment.id} className="rounded-xl border border-violet-200/80 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold uppercase tracking-wide text-violet-800">
                            Assignment {idx + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() => removeAssignment(assignment.id)}
                            className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                            aria-label="Remove assignment"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <label className="block text-xs text-slate-600 sm:col-span-2">
                            Title
                            <input
                              type="text"
                              value={assignment.title}
                              onChange={(e) => updateAssignment(assignment.id, { title: e.target.value })}
                              placeholder="Assignment title"
                              className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                            />
                          </label>
                          <label className="block text-xs text-slate-600 sm:col-span-2">
                            Description
                            <textarea
                              value={assignment.description}
                              onChange={(e) => updateAssignment(assignment.id, { description: e.target.value })}
                              rows={3}
                              placeholder="Practice instructions"
                              className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                            />
                          </label>
                          <label className="block text-xs text-slate-600">
                            Assignment type
                            <select
                              value={assignment.assignment_type}
                              onChange={(e) =>
                                updateAssignment(assignment.id, {
                                  assignment_type: e.target.value as AssignmentType,
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                            >
                              {ASSIGNMENT_TYPE_OPTIONS.map((t) => (
                                <option key={t.value} value={t.value}>
                                  {t.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block text-xs text-slate-600">
                            Difficulty
                            <select
                              value={assignment.difficulty}
                              onChange={(e) =>
                                updateAssignment(assignment.id, {
                                  difficulty: normalizeDifficulty(Number(e.target.value)),
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-violet-100 bg-white px-3 py-2 text-sm"
                              disabled={Boolean(assignment.resource_id)}
                            >
                              {[1, 2, 3, 4, 5].map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            {assignment.resource_id ? (
                              <p className="mt-1 text-[11px] text-slate-500">Difficulty locked to attached resource.</p>
                            ) : null}
                          </label>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-violet-50/80 px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-700">
                            ⚡ +{assignment.xp} XP
                          </span>
                          <div className="flex flex-wrap items-center gap-2">
                            {assignment.resource_title ? (
                              <span className="rounded-md bg-white px-2 py-1 text-xs text-slate-700 border border-violet-100">
                                Resource: {assignment.resource_title}
                              </span>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => setResourcePanel({ scope: 'assignment', assignmentId: assignment.id, mode: 'menu' })}
                              className="inline-flex items-center gap-1 rounded-md border border-violet-200 bg-white px-2.5 py-1 text-xs font-medium text-violet-900 hover:bg-violet-50"
                            >
                              Attach resource (optional)
                              <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addAssignment}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-900 hover:bg-violet-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add assignment
                  </button>
                </section>

                <section className="rounded-xl border border-amber-100/80 bg-gradient-to-br from-amber-50/30 to-white shadow-sm overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setReferenceMaterialsOpen((prev) => !prev)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-amber-50/50"
                  >
                    <div className="flex items-center gap-2 text-amber-950">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold uppercase tracking-wide">Reference Materials</span>
                    </div>
                    <span className="text-xs text-slate-500">{referenceMaterialsOpen ? 'Expanded' : 'Collapsed by default'}</span>
                  </button>
                  {referenceMaterialsOpen ? (
                    <div className="border-t border-amber-100/80 px-4 py-3">
                      <p className="text-xs text-amber-900/80">
                        Add lesson materials that are not tied to a specific assignment.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setResourcePanel({ scope: 'reference', mode: 'existing' })}
                          className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50"
                        >
                          Use existing resource
                        </button>
                        <button
                          type="button"
                          onClick={() => setResourcePanel({ scope: 'reference', mode: 'create' })}
                          className="rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-50"
                        >
                          Create custom resource
                        </button>
                      </div>
                      {referenceResources.length > 0 ? (
                        <ul className="mt-3 space-y-1.5">
                          {referenceResources.map((resource) => (
                            <li key={resource.id} className="rounded-lg border border-amber-100 bg-white px-3 py-2 text-xs text-slate-700">
                              <span className="font-medium">{resource.title}</span>
                              <span className="text-slate-500"> · {resource.resource_type}</span>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </section>

                <section className="rounded-xl border border-emerald-100/80 bg-gradient-to-br from-emerald-50/50 to-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-900/90">Email / Delivery</h3>
                  </div>
                  <label className="flex items-start gap-2.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={sendToStudent}
                      onChange={(e) => setSendToStudent(e.target.checked)}
                      className="mt-0.5 rounded border-emerald-300"
                    />
                    Send lesson summary to student
                  </label>
                  <label className="mt-2 flex items-start gap-2.5 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={sendToParent}
                      onChange={(e) => setSendToParent(e.target.checked)}
                      className="mt-0.5 rounded border-emerald-300"
                    />
                    Send lesson summary to parent
                  </label>
                  <p className="mt-2 text-xs text-slate-500">
                    Lesson notes, assignments, and selected materials will be included when delivery is enabled.
                  </p>
                </section>

                {saveError ? (
                  <p className="text-sm text-red-600" role="alert">
                    {saveError}
                  </p>
                ) : null}

                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleSave()}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-opacity hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ backgroundColor: 'var(--musikkii-blue)' }}
                >
                  {saving ? 'Saving…' : 'Save Lesson'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <div className="relative inline-flex flex-wrap items-center gap-2">
      {isCancelledLesson ? (
        <span
          className={`inline-flex items-center rounded-full border border-red-200 bg-red-100 font-medium text-red-700 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
          }`}
          title="Cancelled lessons do not require attendance."
        >
          Cancelled
        </span>
      ) : (
        <button
          ref={anchorRef}
          type="button"
          onClick={() => setPickerOpen((o) => !o)}
          className={`inline-flex items-center justify-center gap-2 rounded-lg border font-medium shadow-sm transition-opacity hover:opacity-90 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2.5 text-sm'
          } ${row.outcome ? 'bg-white text-slate-700 border-slate-200' : 'text-white border-transparent'}`}
          style={!row.outcome ? { backgroundColor: 'var(--musikkii-blue)' } : undefined}
          aria-label={row.outcome ? 'Change attendance' : 'Take attendance'}
          data-state={row.outcome ? 'selected' : 'pending'}
          aria-expanded={pickerOpen}
          aria-haspopup="listbox"
          title={row.outcome ? 'Change attendance' : 'Take attendance'}
        >
          <span className={row.outcome ? `inline-flex items-center rounded-full border px-2 py-0.5 ${attendancePillClass(row.outcome)}` : ''}>
            {attendanceMeta?.label ?? 'Take Attendance'}
          </span>
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${pickerOpen ? 'rotate-180' : ''}`} />
        </button>
      )}

      {!isUpcomingLesson ? (
        <button
          type="button"
          onClick={() => {
            if (hasSavedLessonNotes) openSavedNotesView();
            else {
              setHistoryOpen(true);
              void loadRecentNotes();
            }
          }}
          className={`inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
          }`}
        >
          {notesButtonLabel}
        </button>
      ) : null}

      {isUpcomingLesson ? (
        <button
          type="button"
          onClick={() => {
            setHistoryOpen(true);
            void loadRecentNotes();
          }}
          className={`inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:bg-slate-50 ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
          }`}
        >
          Recent Notes
        </button>
      ) : null}
      {shouldShowRecordingButton ? (
        <button
          type="button"
          onClick={() => {
            if (recordingUrl) window.open(recordingUrl, '_blank', 'noopener,noreferrer');
          }}
          disabled={!hasRecording}
          title={hasRecording ? 'Open lesson recording' : 'Recording not available yet'}
          className={`inline-flex items-center justify-center rounded-lg border font-medium ${
            compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2 text-sm'
          } ${
            hasRecording
              ? 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400'
          }`}
        >
          View Recording
        </button>
      ) : null}
      {pickerPanel}
      {notesModal}
      {readOnlyModal}
      {historyModal}
    </div>
  );
}
