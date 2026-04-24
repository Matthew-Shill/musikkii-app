import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useRole } from '@/app/context/role-context';
import { useDashboardLessons } from '@/app/dashboard/hooks/useDashboardLessons';
import { dashboardRowToCalendarEventDetails } from '@/app/dashboard/calendarLessonAdapters';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';
import { formatSelfRescheduleRpcError } from '@/app/dashboard/lessonIntentSummary';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type Slot = { starts_at: string; ends_at: string };

function dateKeyFromIso(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function LessonReschedulePage() {
  const navigate = useNavigate();
  const { lessonId = '' } = useParams();
  const { roleFamily } = useRole();
  const { lessons, loading, error, reload } = useDashboardLessons();
  const [monthDate, setMonthDate] = useState(() => new Date());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const sourceRow = useMemo(() => lessons.find((l) => l.id === lessonId), [lessons, lessonId]);
  const lesson = useMemo(() => (sourceRow ? dashboardRowToCalendarEventDetails(sourceRow) : null), [sourceRow]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setSlotsLoading(true);
      setSlotsError(null);
      if (!isSupabaseConfigured() || !lessonId) {
        setSlots([]);
        setSlotsLoading(false);
        return;
      }
      const { data, error: rpcError } = await supabase.rpc('list_lesson_self_reschedule_candidates', {
        p_lesson_id: lessonId,
        p_limit: 120,
      });
      if (cancelled) return;
      setSlotsLoading(false);
      if (rpcError) {
        setSlots([]);
        setSlotsError(formatSelfRescheduleRpcError(rpcError.message));
        return;
      }
      let arr: unknown[] = [];
      if (Array.isArray(data)) {
        arr = data;
      } else if (typeof data === 'string') {
        try {
          const parsed: unknown = JSON.parse(data);
          if (Array.isArray(parsed)) arr = parsed;
        } catch {
          arr = [];
        }
      }
      const parsed: Slot[] = [];
      for (const row of arr) {
        if (!row || typeof row !== 'object') continue;
        const r = row as Record<string, unknown>;
        if (typeof r.starts_at === 'string' && typeof r.ends_at === 'string') {
          parsed.push({ starts_at: r.starts_at, ends_at: r.ends_at });
        }
      }
      setSlots(parsed);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  const slotsByDay = useMemo(() => {
    const map = new Map<string, Slot[]>();
    for (const slot of slots) {
      const key = dateKeyFromIso(slot.starts_at);
      const current = map.get(key) ?? [];
      current.push(slot);
      map.set(key, current);
    }
    for (const [, value] of map) {
      value.sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime());
    }
    return map;
  }, [slots]);

  const visibleSlots = selectedDateKey ? slotsByDay.get(selectedDateKey) ?? [] : [];
  const calendarDays = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const first = new Date(year, month, 1);
    const firstWeekday = first.getDay();
    const start = new Date(year, month, 1 - firstWeekday);
    return Array.from({ length: 42 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
      return { date: day, key, inMonth: day.getMonth() === month, hasSlots: slotsByDay.has(key) };
    });
  }, [monthDate, slotsByDay]);

  const confirmReschedule = async () => {
    if (!selectedSlot) return;
    setSaveError(null);
    setSaving(true);
    const { error: rpcError } = await supabase.rpc('commit_student_lesson_self_reschedule', {
      p_lesson_id: lessonId,
      p_new_starts_at: selectedSlot.starts_at,
    });
    setSaving(false);
    if (rpcError) {
      setSaveError(formatSelfRescheduleRpcError(rpcError.message));
      return;
    }
    await reload();
    navigate('/calendar');
  };

  if (roleFamily !== 'learner' && roleFamily !== 'household') {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <p className="text-sm text-gray-600">Rescheduling from this page is available for learner and household accounts.</p>
        <Link to="/calendar" className="inline-flex mt-3 text-sm font-medium text-blue-700 hover:text-blue-800">
          Back to calendar
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Link to="/calendar" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to calendar
          </Link>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mt-2">Reschedule lesson</h1>
          <p className="text-sm text-gray-600 mt-1">Pick a date, choose a valid teacher time, then confirm.</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
        {loading ? <p className="text-sm text-gray-600">Loading lesson details…</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {!loading && !error && !lesson ? <p className="text-sm text-amber-800">Lesson not found.</p> : null}
        {lesson ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">{lesson.title}</p>
            <p className="text-sm text-gray-600">
              Current time: {formatLessonDate(lesson.startsAtIso)} · {formatLessonTime(lesson.startsAtIso)} - {formatLessonTime(lesson.endsAtIso)}
            </p>
          </div>
        ) : null}
      </div>

      <div className="grid lg:grid-cols-[1.2fr,1fr] gap-5">
        <section className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900">
              <CalendarDays className="w-4 h-4" />
              {monthDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setMonthDate(new Date())}
                className="px-3 h-8 rounded-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setMonthDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-gray-600 border-r border-gray-200 last:border-r-0">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day) => (
              <button
                type="button"
                key={day.key}
                onClick={() => {
                  setSelectedDateKey(day.key);
                  setSelectedSlot(null);
                }}
                disabled={!day.hasSlots}
                className={`min-h-20 border-r border-b border-gray-200 last:border-r-0 text-left px-2 py-2 transition-colors ${
                  day.inMonth ? 'bg-white' : 'bg-gray-50'
                } ${selectedDateKey === day.key ? 'ring-2 ring-blue-400 ring-inset' : ''} ${
                  day.hasSlots ? 'hover:bg-blue-50' : 'opacity-55 cursor-not-allowed'
                }`}
              >
                <span className={`text-xs font-medium ${day.inMonth ? 'text-gray-700' : 'text-gray-400'}`}>{day.date.getDate()}</span>
                {day.hasSlots ? <span className="mt-1 block text-[10px] text-blue-700 font-medium">Open times</span> : null}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Available times</h2>
          {slotsLoading ? <p className="text-sm text-gray-600">Loading availability…</p> : null}
          {slotsError ? <p className="text-sm text-red-700">{slotsError}</p> : null}
          {!slotsLoading && !slotsError && !selectedDateKey ? (
            <p className="text-sm text-gray-600">Select a day on the calendar to see valid times.</p>
          ) : null}
          {!slotsLoading && !slotsError && selectedDateKey && visibleSlots.length === 0 ? (
            <p className="text-sm text-gray-600">No open times for that day.</p>
          ) : null}
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {visibleSlots.map((slot) => (
              <button
                type="button"
                key={slot.starts_at}
                onClick={() => setSelectedSlot(slot)}
                className={`w-full text-left px-3 py-2.5 rounded-lg border text-sm transition-colors ${
                  selectedSlot?.starts_at === slot.starts_at
                    ? 'border-blue-400 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                }`}
              >
                {formatLessonTime(slot.starts_at)} - {formatLessonTime(slot.ends_at)}
              </button>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 md:p-5 space-y-3">
        <h2 className="text-sm font-semibold text-gray-900">Review and confirm</h2>
        {!selectedSlot ? (
          <p className="text-sm text-gray-600">Choose a time to continue.</p>
        ) : (
          <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
            <p className="font-medium">New lesson time</p>
            <p className="mt-1 inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatLessonDate(selectedSlot.starts_at)} · {formatLessonTime(selectedSlot.starts_at)} - {formatLessonTime(selectedSlot.ends_at)}
            </p>
          </div>
        )}
        {saveError ? <p className="text-sm text-red-700">{saveError}</p> : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate('/calendar')}
            className="px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          >
            Back
          </button>
          <button
            type="button"
            disabled={!selectedSlot || saving}
            onClick={() => void confirmReschedule()}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? 'Rescheduling…' : 'Confirm reschedule'}
          </button>
        </div>
      </section>
    </div>
  );
}
