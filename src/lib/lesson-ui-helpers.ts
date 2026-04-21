import type { LessonStatus } from '@/app/types/domain';

/** Map DB `lessons.status` to the subset used by dashboard cards. */
export function lessonStatusForUi(dbStatus: string): LessonStatus {
  switch (dbStatus) {
    case 'confirmed':
      return 'confirmed';
    case 'completed':
      return 'completed';
    case 'cancelled':
      return 'cancelled';
    case 'no_show':
      return 'no-show';
    case 'scheduled':
    case 'pending':
    case 'draft':
    default:
      return 'scheduled';
  }
}

export function initialsFromDisplayName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatLessonDate(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(d);
}

export function formatLessonTime(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' }).format(d);
}

export function formatStatusLabel(s: LessonStatus): string {
  if (s === 'no-show') return 'No show';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Human-readable label for raw `public.lessons.status` (read-only UI). */
export function formatDbLessonStatusLabel(dbStatus: string): string {
  const s = dbStatus.trim();
  switch (s) {
    case 'no_show':
      return 'No show';
    case 'scheduled':
    case 'pending':
    case 'draft':
    case 'confirmed':
    case 'completed':
    case 'cancelled':
      return s.charAt(0).toUpperCase() + s.slice(1);
    default:
      return s.replace(/_/g, ' ');
  }
}
