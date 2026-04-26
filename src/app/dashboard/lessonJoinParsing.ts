import { pickProfileNameFromEmbed } from './studentProfileEmbed';

export type LessonParticipantJoin = {
  lessonParticipantId: string;
  studentId: string;
  studentProfileId: string | null;
};

/**
 * Extract display names and participant metadata from PostgREST-embedded rows on `lessons`.
 * Nested rows respect their own RLS; missing embeds yield nulls / empty arrays.
 */
export function parseDashboardLessonJoins(row: Record<string, unknown>): {
  teacher_display_name: string | null;
  teacher_profile_id: string | null;
  teacher_meeting_url: string | null;
  student_display_name: string | null;
  participants: LessonParticipantJoin[];
} {
  const teachersRaw = row.teachers;
  const teacherRow = Array.isArray(teachersRaw) ? teachersRaw[0] : teachersRaw;
  let teacher_display_name: string | null = null;
  let teacher_profile_id: string | null = null;
  let teacher_meeting_url: string | null = null;
  if (teacherRow && typeof teacherRow === 'object') {
    const tr = teacherRow as Record<string, unknown>;
    teacher_display_name = pickProfileNameFromEmbed(tr.profiles);
    const pid = tr.profile_id;
    if (pid != null) teacher_profile_id = String(pid);
    const rawUrl = tr.meeting_url;
    if (typeof rawUrl === 'string' && rawUrl.trim()) teacher_meeting_url = rawUrl.trim();
  }

  const lpRaw = row.lesson_participants;
  const names: string[] = [];
  const participants: LessonParticipantJoin[] = [];
  if (Array.isArray(lpRaw)) {
    for (const p of lpRaw) {
      if (!p || typeof p !== 'object') continue;
      const pr = p as Record<string, unknown>;
      const lpId = pr.id;
      const studentsRaw = pr.students;
      const studentRow = Array.isArray(studentsRaw) ? studentsRaw[0] : studentsRaw;
      if (!studentRow || typeof studentRow !== 'object') continue;
      const sr = studentRow as Record<string, unknown>;
      const n = pickProfileNameFromEmbed(sr.profiles);
      if (n) names.push(n);
      const sid = sr.id;
      const pid = sr.profile_id;
      if (lpId != null && sid != null) {
        participants.push({
          lessonParticipantId: String(lpId),
          studentId: String(sid),
          studentProfileId: pid != null ? String(pid) : null,
        });
      }
    }
  }
  const unique = [...new Set(names)];
  const student_display_name = unique.length ? unique.join(', ') : null;

  return { teacher_display_name, teacher_profile_id, teacher_meeting_url, student_display_name, participants };
}
