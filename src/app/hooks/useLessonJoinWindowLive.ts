'use client';

import { useEffect, useState } from 'react';
import { isLessonJoinWindow } from '@/lib/lessonJoinWindow';

/**
 * Re-evaluates join-window state periodically so UI unlocks without a full page reload.
 * When `enabled` is false, returns false and skips timers (caller supplies state elsewhere).
 */
export function useLessonJoinWindowLive(startsAtIso: string, endsAtIso: string, enabled = true): boolean {
  const [inWindow, setInWindow] = useState(() =>
    enabled ? isLessonJoinWindow(new Date(), startsAtIso, endsAtIso) : false,
  );

  useEffect(() => {
    if (!enabled) {
      setInWindow(false);
      return;
    }
    const tick = () => setInWindow(isLessonJoinWindow(new Date(), startsAtIso, endsAtIso));
    tick();
    const id = window.setInterval(tick, 30_000);
    const onVis = () => tick();
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [startsAtIso, endsAtIso, enabled]);

  return enabled ? inWindow : false;
}
