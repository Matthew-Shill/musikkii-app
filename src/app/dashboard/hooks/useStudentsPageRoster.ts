import { useCallback, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useAuthSession } from '@/app/context/auth-session-context';
import { pickProfileNameFromEmbed } from '../studentProfileEmbed';

export type StudentRosterRow = {
  studentId: string;
  profileId: string;
  displayName: string;
};

export type StudentsRosterMode = 'household' | 'instructor' | 'operations';

function mapStudentRows(data: Record<string, unknown>[]): StudentRosterRow[] {
  return data.map((row) => {
    const id = String(row.id);
    const profileId = String(row.profile_id);
    const name = pickProfileNameFromEmbed(row.profiles);
    return {
      studentId: id,
      profileId,
      displayName: name ?? 'Student',
    };
  });
}

type TsaRow = {
  status?: string;
  students?: Record<string, unknown> | Record<string, unknown>[] | null;
};

function extractFromTsa(row: TsaRow): StudentRosterRow | null {
  const s = row.students;
  const student = Array.isArray(s) ? s[0] : s;
  if (!student || typeof student !== 'object') return null;
  const id = student.id;
  const profileId = student.profile_id;
  if (id == null || profileId == null) return null;
  const name = pickProfileNameFromEmbed(student.profiles);
  return {
    studentId: String(id),
    profileId: String(profileId),
    displayName: name ?? 'Student',
  };
}

/**
 * RLS-scoped student roster for the Students page and household dashboard.
 * **Mode must match the viewer** — do not call `household` for instructor-only sessions (e.g. teacher-manager broad `students` policies).
 */
export function useStudentsPageRoster(mode: StudentsRosterMode | null) {
  const { session, accountRoleReady } = useAuthSession();
  const configured = isSupabaseConfigured();
  const [students, setStudents] = useState<StudentRosterRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!configured || !session || !accountRoleReady || !mode) {
      setStudents([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    if (mode === 'household') {
      const { data, error: qErr } = await supabase
        .from('students')
        .select('id, profile_id, profiles ( full_name )')
        .order('created_at', { ascending: true });
      setLoading(false);
      if (qErr) {
        console.warn('[useStudentsPageRoster:household]', qErr);
        setError(qErr.message);
        setStudents([]);
        return;
      }
      setStudents(mapStudentRows((data ?? []) as Record<string, unknown>[]));
      return;
    }

    if (mode === 'instructor') {
      const { data, error: qErr } = await supabase
        .from('teacher_student_assignments')
        .select(
          `
          status,
          students!inner (
            id,
            profile_id,
            profiles ( full_name )
          )
        `
        )
        .eq('status', 'active');
      setLoading(false);
      if (qErr) {
        console.warn('[useStudentsPageRoster:instructor]', qErr);
        setError(qErr.message);
        setStudents([]);
        return;
      }
      const byId = new Map<string, StudentRosterRow>();
      for (const row of data ?? []) {
        const parsed = extractFromTsa(row as TsaRow);
        if (parsed) byId.set(parsed.studentId, parsed);
      }
      setStudents([...byId.values()].sort((a, b) => a.displayName.localeCompare(b.displayName)));
      return;
    }

    if (mode === 'operations') {
      const { data, error: qErr } = await supabase
        .from('students')
        .select('id, profile_id, profiles ( full_name )')
        .order('created_at', { ascending: true })
        .limit(200);
      setLoading(false);
      if (qErr) {
        console.warn('[useStudentsPageRoster:operations]', qErr);
        setError(qErr.message);
        setStudents([]);
        return;
      }
      setStudents(mapStudentRows((data ?? []) as Record<string, unknown>[]));
    }
  }, [configured, session, accountRoleReady, mode]);

  useEffect(() => {
    void load();
  }, [load]);

  return { students, loading, error, reload: load };
}
