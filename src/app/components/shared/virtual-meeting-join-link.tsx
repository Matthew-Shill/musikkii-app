'use client';

import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';
import { cn } from '@/app/components/ui/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/app/components/ui/tooltip';
import { useLessonJoinWindowLive } from '@/app/hooks/useLessonJoinWindowLive';
import { resolveVirtualMeetingUrl } from '@/lib/lessonJoinWindow';

const BRAND = '#0331bd';

const TOOLTIP_INACTIVE = 'Available 5 minutes before lesson start';
const TOOLTIP_ACTIVE = 'Join your lesson';

type Props = {
  startsAtIso: string;
  endsAtIso: string;
  lessonMeetingUrl?: string | null;
  teacherMeetingUrl?: string | null;
  variant?: 'inline' | 'compact';
  className?: string;
  /** Prevents week/month grid cells from treating pointer interaction as “select lesson”. */
  isolateFromCalendarCell?: boolean;
  /** When set, skips the internal timer (e.g. parent already tracks the same lesson window). */
  joinWindowOverride?: boolean;
  /** Merged onto the “Virtual •” label (e.g. light text on a gradient card). */
  metadataClassName?: string;
};

function swallowCalendarCell(e: MouseEvent | PointerEvent) {
  e.stopPropagation();
}

function swallowKeyIfLocked(e: KeyboardEvent, locked: boolean) {
  if (!locked) return;
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    e.stopPropagation();
  }
}

export function VirtualMeetingJoinLink({
  startsAtIso,
  endsAtIso,
  lessonMeetingUrl,
  teacherMeetingUrl,
  variant = 'inline',
  className,
  isolateFromCalendarCell,
  joinWindowOverride,
  metadataClassName,
}: Props) {
  const href = resolveVirtualMeetingUrl(lessonMeetingUrl, teacherMeetingUrl);
  const internalWindow = useLessonJoinWindowLive(startsAtIso, endsAtIso, joinWindowOverride === undefined);
  const inWindow = joinWindowOverride !== undefined ? joinWindowOverride : internalWindow;

  const labelPartsClass = cn(
    variant === 'compact' ? 'text-[0.65rem] leading-tight text-gray-800/95' : 'text-sm text-gray-600',
    metadataClassName,
  );

  const cellHandlers = isolateFromCalendarCell
    ? {
        onPointerDown: swallowCalendarCell,
        onMouseDown: swallowCalendarCell,
        onClick: swallowCalendarCell,
      }
    : {};

  const inactiveShell =
    'relative inline rounded-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#0331bd]/40';

  const inactiveLabel = 'select-none cursor-not-allowed [text-decoration:none]';

  return (
    <span className={cn('inline-flex items-center gap-1 min-w-0', className)} {...cellHandlers}>
      <span className={cn('shrink-0', labelPartsClass)}>Virtual</span>
      <span className={cn('shrink-0', labelPartsClass)}>•</span>
      <Tooltip>
        <TooltipTrigger asChild>
          {inWindow ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                variant === 'compact' ? 'text-[0.65rem] leading-tight' : 'text-sm',
                'font-medium underline underline-offset-2 cursor-pointer hover:opacity-90 shrink min-w-0 truncate',
              )}
              style={{ color: BRAND }}
              onPointerDown={isolateFromCalendarCell ? swallowCalendarCell : undefined}
              onMouseDown={isolateFromCalendarCell ? swallowCalendarCell : undefined}
              onClick={isolateFromCalendarCell ? swallowCalendarCell : undefined}
            >
              Join link
            </a>
          ) : (
            <span
              role="link"
              aria-disabled="true"
              tabIndex={0}
              className={cn(
                inactiveShell,
                inactiveLabel,
                variant === 'compact' ? 'text-[0.65rem] leading-tight' : 'text-sm',
                'font-medium shrink min-w-0 truncate',
              )}
              style={{ color: BRAND, opacity: 0.45 }}
              onPointerDown={isolateFromCalendarCell ? swallowCalendarCell : undefined}
              onMouseDown={isolateFromCalendarCell ? swallowCalendarCell : undefined}
              onClick={isolateFromCalendarCell ? swallowCalendarCell : undefined}
              onKeyDown={(e) => swallowKeyIfLocked(e, true)}
            >
              <span className="relative z-0">Join link</span>
              <span
                className="pointer-events-none absolute inset-0 z-[1] rounded-sm bg-white/45 mix-blend-screen"
                aria-hidden
              />
            </span>
          )}
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          {inWindow ? TOOLTIP_ACTIVE : TOOLTIP_INACTIVE}
        </TooltipContent>
      </Tooltip>
    </span>
  );
}
