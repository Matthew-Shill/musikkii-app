import { lazy, Suspense } from 'react';

const DevAccountSwitcherLazy = import.meta.env.DEV ? lazy(() => import('./DevAccountSwitcher')) : null;

/**
 * Dev-only account switcher (sign-in page). In production builds `import.meta.env.DEV` is false, so the lazy
 * import is dead and this returns null without loading dev-only chunks.
 */
export function DevAccountSwitcherGate() {
  if (!import.meta.env.DEV || !DevAccountSwitcherLazy) {
    return null;
  }
  return (
    <Suspense fallback={null}>
      <DevAccountSwitcherLazy />
    </Suspense>
  );
}
