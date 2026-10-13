'use client';

import { useEffect, useState } from 'react';

/**
 * The real clock, ticking every `ms`; null until mounted. Pages are
 * prerendered, so time-dependent UI must not read the clock during the first
 * render — this fills it from a timer after mount, keeping setState out of the
 * effect body (react-hooks/set-state-in-effect).
 */
export function useNow(ms = 1000) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const every = setInterval(tick, ms);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [ms]);
  return now;
}
