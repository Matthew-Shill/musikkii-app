import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import { useRole } from '@/app/context/role-context';
import { formatLessonDate, formatLessonTime } from '@/lib/lesson-ui-helpers';

type TeacherOption = { id: string; label: string };

type SegmentRow = {
  id: string;
  teacher_id: string;
  starts_at: string;
  ends_at: string;
  created_at: string;
};

type ExceptionRow = {
  id: string;
  teacher_id: string;
  starts_at: string;
  ends_at: string;
  label: string | null;
  created_at: string;
};

function toDatetimeLocalValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(local: string): string {
  const d = new Date(local);
  return d.toISOString();
}

export function TeacherAvailabilityPage() {
  const { session, accountRoleReady, user } = useAuthSession();
  const { roleFamily } = useRole();
  const isAdmin = roleFamily === 'operations' || roleFamily === 'leadership';

  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [teacherId, setTeacherId] = useState<string>('');
  const [segments, setSegments] = useState<SegmentRow[]>([]);
  const [exceptions, setExceptions] = useState<ExceptionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [segStart, setSegStart] = useState('');
  const [segEnd, setSegEnd] = useState('');
  const [editSegId, setEditSegId] = useState<string | null>(null);

  const [exStart, setExStart] = useState('');
  const [exEnd, setExEnd] = useState('');
  const [exLabel, setExLabel] = useState('');
  const [editExId, setEditExId] = useState<string | null>(null);

  const canQuery = useMemo(
    () => isSupabaseConfigured() && session && accountRoleReady && Boolean(teacherId),
    [session, accountRoleReady, teacherId]
  );

  const loadTeachers = useCallback(async () => {
    if (!isSupabaseConfigured() || !session || !accountRoleReady) return;
    if (!isAdmin) return;
    const { data, error: qErr } = await supabase
      .from('teachers')
      .select('id, profiles(full_name)')
      .order('created_at', { ascending: true });
    if (qErr) {
      console.warn('[TeacherAvailabilityPage] teachers', qErr);
      setTeachers([]);
      return;
    }
    const opts: TeacherOption[] = [];
    for (const row of data ?? []) {
      const r = row as Record<string, unknown>;
      const id = r.id != null ? String(r.id) : '';
      if (!id) continue;
      const pr = r.profiles;
      const prof = Array.isArray(pr) ? pr[0] : pr;
      const name =
        prof && typeof prof === 'object' && typeof (prof as Record<string, unknown>).full_name === 'string'
          ? String((prof as Record<string, unknown>).full_name).trim()
          : '';
      opts.push({ id, label: name || id.slice(0, 8) });
    }
    setTeachers(opts);
    setTeacherId((prev) => {
      if (prev && opts.some((o) => o.id === prev)) return prev;
      return opts[0]?.id ?? '';
    });
  }, [session, accountRoleReady, isAdmin]);

  const loadSelfTeacher = useCallback(async () => {
    if (!isSupabaseConfigured() || !session || !accountRoleReady || !user?.id) return;
    if (isAdmin) return;
    const { data, error: qErr } = await supabase
      .from('teachers')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();
    if (qErr) {
      console.warn('[TeacherAvailabilityPage] self teacher', qErr);
      setTeacherId('');
      return;
    }
    const id = data && typeof data === 'object' && 'id' in data ? String((data as { id: unknown }).id) : '';
    setTeacherId(id);
  }, [session, accountRoleReady, user?.id, isAdmin]);

  const loadRows = useCallback(async () => {
    setError(null);
    if (!canQuery) {
      setSegments([]);
      setExceptions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const [segRes, exRes] = await Promise.all([
      supabase
        .from('teacher_availability_segments')
        .select('id, teacher_id, starts_at, ends_at, created_at')
        .eq('teacher_id', teacherId)
        .order('starts_at', { ascending: true }),
      supabase
        .from('teacher_availability_exceptions')
        .select('id, teacher_id, starts_at, ends_at, label, created_at')
        .eq('teacher_id', teacherId)
        .order('starts_at', { ascending: true }),
    ]);
    setLoading(false);
    if (segRes.error) {
      setError(segRes.error.message);
      setSegments([]);
    } else {
      setSegments((segRes.data ?? []) as SegmentRow[]);
    }
    if (exRes.error) {
      setError((prev) => prev ?? exRes.error.message);
      setExceptions([]);
    } else {
      setExceptions((exRes.data ?? []) as ExceptionRow[]);
    }
  }, [canQuery, teacherId]);

  useEffect(() => {
    void loadTeachers();
    void loadSelfTeacher();
  }, [loadTeachers, loadSelfTeacher]);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const resetSegForm = () => {
    setSegStart('');
    setSegEnd('');
    setEditSegId(null);
  };

  const resetExForm = () => {
    setExStart('');
    setExEnd('');
    setExLabel('');
    setEditExId(null);
  };

  const saveSegment = async () => {
    if (!teacherId || !segStart || !segEnd) return;
    const startsAt = fromDatetimeLocalValue(segStart);
    const endsAt = fromDatetimeLocalValue(segEnd);
    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
      setError('Bookable window end must be after start.');
      return;
    }
    setSaving(true);
    setError(null);
    if (editSegId) {
      const { error: uErr } = await supabase
        .from('teacher_availability_segments')
        .update({ starts_at: startsAt, ends_at: endsAt })
        .eq('id', editSegId)
        .eq('teacher_id', teacherId);
      setSaving(false);
      if (uErr) {
        setError(uErr.message);
        return;
      }
    } else {
      const { error: iErr } = await supabase.from('teacher_availability_segments').insert({
        teacher_id: teacherId,
        starts_at: startsAt,
        ends_at: endsAt,
      });
      setSaving(false);
      if (iErr) {
        setError(iErr.message);
        return;
      }
    }
    resetSegForm();
    await loadRows();
  };

  const deleteSegment = async (id: string) => {
    if (!window.confirm('Remove this bookable window? Student slots will shrink immediately.')) return;
    setSaving(true);
    setError(null);
    const { error: dErr } = await supabase.from('teacher_availability_segments').delete().eq('id', id);
    setSaving(false);
    if (dErr) {
      setError(dErr.message);
      return;
    }
    if (editSegId === id) resetSegForm();
    await loadRows();
  };

  const startEditSegment = (row: SegmentRow) => {
    setEditSegId(row.id);
    setSegStart(toDatetimeLocalValue(row.starts_at));
    setSegEnd(toDatetimeLocalValue(row.ends_at));
  };

  const saveException = async () => {
    if (!teacherId || !exStart || !exEnd) return;
    const startsAt = fromDatetimeLocalValue(exStart);
    const endsAt = fromDatetimeLocalValue(exEnd);
    if (new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
      setError('Blocked interval end must be after start.');
      return;
    }
    setSaving(true);
    setError(null);
    const labelTrim = exLabel.trim() || null;
    if (editExId) {
      const { error: uErr } = await supabase
        .from('teacher_availability_exceptions')
        .update({ starts_at: startsAt, ends_at: endsAt, label: labelTrim })
        .eq('id', editExId)
        .eq('teacher_id', teacherId);
      setSaving(false);
      if (uErr) {
        setError(uErr.message);
        return;
      }
    } else {
      const { error: iErr } = await supabase.from('teacher_availability_exceptions').insert({
        teacher_id: teacherId,
        starts_at: startsAt,
        ends_at: endsAt,
        label: labelTrim,
      });
      setSaving(false);
      if (iErr) {
        setError(iErr.message);
        return;
      }
    }
    resetExForm();
    await loadRows();
  };

  const deleteException = async (id: string) => {
    if (!window.confirm('Remove this blocked interval?')) return;
    setSaving(true);
    setError(null);
    const { error: dErr } = await supabase.from('teacher_availability_exceptions').delete().eq('id', id);
    setSaving(false);
    if (dErr) {
      setError(dErr.message);
      return;
    }
    if (editExId === id) resetExForm();
    await loadRows();
  };

  const startEditException = (row: ExceptionRow) => {
    setEditExId(row.id);
    setExStart(toDatetimeLocalValue(row.starts_at));
    setExEnd(toDatetimeLocalValue(row.ends_at));
    setExLabel(row.label ?? '');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Teacher availability</h1>
      <p className="text-sm text-gray-600 mb-6">
        Bookable windows and blocked time feed the same server rules students see for self-reschedule. Times use your
        browser&apos;s local timezone and are stored in UTC.
      </p>

      {!isAdmin && !teacherId ? (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          No <code className="text-xs">teachers</code> row is linked to your profile. Ask an admin to link a teacher
          account, or use an admin role to manage others.
        </p>
      ) : null}

      {isAdmin ? (
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="teacher-select">
            Teacher
          </label>
          <select
            id="teacher-select"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
            className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            {teachers.length === 0 ? <option value="">No teachers in database</option> : null}
            {teachers.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-red-600 mb-4" role="alert">
          {error}
        </p>
      ) : null}

      {loading && canQuery ? <p className="text-sm text-gray-500 mb-4">Loading…</p> : null}

      {canQuery ? (
        <div className="space-y-10">
          <section className="rounded-xl border border-emerald-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Bookable windows</h2>
            <p className="text-xs text-gray-600 mb-4">
              Students may only reschedule into intervals fully inside these segments, excluding blocked time and other
              lessons.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="seg-start">
                  Start
                </label>
                <input
                  id="seg-start"
                  type="datetime-local"
                  value={segStart}
                  onChange={(e) => setSegStart(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="seg-end">
                  End
                </label>
                <input
                  id="seg-end"
                  type="datetime-local"
                  value={segEnd}
                  onChange={(e) => setSegEnd(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveSegment()}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50"
              >
                {editSegId ? 'Update window' : 'Add window'}
              </button>
              {editSegId ? (
                <button
                  type="button"
                  onClick={resetSegForm}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
            <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
              {segments.map((s) => (
                <li key={s.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="text-gray-900">
                      {formatLessonDate(s.starts_at)} {formatLessonTime(s.starts_at)} – {formatLessonTime(s.ends_at)}
                    </span>
                    <span className="text-gray-400 text-xs ml-2 font-mono">{s.id.slice(0, 8)}…</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditSegment(s)}
                      className="text-xs font-medium text-emerald-800 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteSegment(s.id)}
                      className="text-xs font-medium text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {segments.length === 0 && !loading ? (
              <p className="text-xs text-gray-500 mt-2">No windows yet — students will see no self-reschedule slots.</p>
            ) : null}
          </section>

          <section className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Blocked time / time off</h2>
            <p className="text-xs text-gray-600 mb-4">
              Intervals here are subtracted from bookable time. They do not delete existing lessons; they only block new
              self-reschedule targets overlapping them.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="ex-start">
                  Start
                </label>
                <input
                  id="ex-start"
                  type="datetime-local"
                  value={exStart}
                  onChange={(e) => setExStart(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="ex-end">
                  End
                </label>
                <input
                  id="ex-end"
                  type="datetime-local"
                  value={exEnd}
                  onChange={(e) => setExEnd(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm"
                />
              </div>
            </div>
            <label className="block text-xs font-medium text-gray-700 mb-1" htmlFor="ex-label">
              Label (optional)
            </label>
            <input
              id="ex-label"
              type="text"
              value={exLabel}
              onChange={(e) => setExLabel(e.target.value)}
              maxLength={200}
              placeholder="e.g. Spring break, Doctor appointment"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={saving}
                onClick={() => void saveException()}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 disabled:opacity-50"
              >
                {editExId ? 'Update block' : 'Add block'}
              </button>
              {editExId ? (
                <button
                  type="button"
                  onClick={resetExForm}
                  className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel edit
                </button>
              ) : null}
            </div>
            <ul className="mt-4 divide-y divide-gray-100 border-t border-gray-100">
              {exceptions.map((x) => (
                <li key={x.id} className="py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <div>
                    <span className="text-gray-900">
                      {formatLessonDate(x.starts_at)} {formatLessonTime(x.starts_at)} – {formatLessonTime(x.ends_at)}
                    </span>
                    {x.label ? <span className="block text-xs text-gray-600 mt-0.5">{x.label}</span> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEditException(x)}
                      className="text-xs font-medium text-amber-900 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteException(x.id)}
                      className="text-xs font-medium text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {exceptions.length === 0 && !loading ? (
              <p className="text-xs text-gray-500 mt-2">No blocked intervals.</p>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
}
