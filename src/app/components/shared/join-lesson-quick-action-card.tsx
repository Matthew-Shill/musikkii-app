'use client';

import { Video } from 'lucide-react';
import type { DashboardLessonRow } from '@/app/dashboard/lessonTypes';
import { useLessonJoinWindowLive } from '@/app/hooks/useLessonJoinWindowLive';
import { resolveVirtualMeetingUrl } from '@/lib/lessonJoinWindow';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { cn } from '@/app/components/ui/utils';

type Props = {
  nextLesson: DashboardLessonRow | null | undefined;
  className?: string;
};

export function JoinLessonQuickActionCard({ nextLesson, className }: Props) {
  const virtualEligible = nextLesson?.modality === 'virtual';
  const startsAtIso = nextLesson?.starts_at ?? '1970-01-01T00:00:00.000Z';
  const endsAtIso = nextLesson?.ends_at ?? '1970-01-01T00:00:01.000Z';
  const trackWindow = Boolean(nextLesson && virtualEligible);
  const inWindow = useLessonJoinWindowLive(startsAtIso, endsAtIso, trackWindow);
  const active = trackWindow && inWindow;
  const href =
    nextLesson && virtualEligible
      ? resolveVirtualMeetingUrl(nextLesson.meeting_url, nextLesson.teacher_meeting_url)
      : '';

  const inactiveTooltip = (() => {
    if (!nextLesson) return 'No upcoming lesson';
    if (!virtualEligible) return 'Video join opens shortly before virtual lessons.';
    return 'Available 5 minutes before lesson start';
  })();

  const openMeeting = () => {
    if (!active || !href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-disabled={!active}
          tabIndex={0}
          onClick={() => openMeeting()}
          onKeyDown={(e) => {
            if (!active && (e.key === 'Enter' || e.key === ' ')) e.preventDefault();
            if (active && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              openMeeting();
            }
          }}
          className={cn(
            'relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white p-5 text-left transition-all md:p-6',
            active ? 'group cursor-pointer hover:shadow-md active:scale-[0.98]' : 'cursor-not-allowed',
            className,
          )}
        >
          <div className="relative z-0 flex items-center gap-3">
            <div
              className={cn(
                'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white transition-transform',
                active ? 'group-hover:scale-110' : null,
              )}
              style={{
                backgroundColor: 'var(--musikkii-blue)',
                opacity: active ? 1 : 0.5,
              }}
            >
              <Video className="h-6 w-6" aria-hidden />
            </div>
            <div className="min-w-0">
              <h3
                className={cn('font-semibold', active ? 'text-gray-900' : 'text-gray-900')}
                style={active ? undefined : { opacity: 0.72 }}
              >
                Join Lesson
              </h3>
              <p className="text-sm text-gray-600" style={active ? undefined : { opacity: 0.72 }}>
                Start video call
              </p>
            </div>
          </div>
          {!active ? (
            <span
              className="pointer-events-none absolute inset-0 z-[1] rounded-xl bg-white/40 mix-blend-screen"
              aria-hidden
            />
          ) : null}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={6}>
        {active ? 'Join your lesson' : inactiveTooltip}
      </TooltipContent>
    </Tooltip>
  );
}
