'use client';

import { useSyncExternalStore } from 'react';

/**
 * One shared clock per tick rate. Every component asking for the same `ms`
 * reads the same value and re-renders on the same tick; the interval runs only
 * while something is subscribed.
 */
type Clock = { subscribe: (l: () => void) => () => void; read: () => number };
const clocks = new Map<number, Clock>();

function clockFor(ms: number): Clock {
  const existing = clocks.get(ms);
  if (existing) return existing;
  const listeners = new Set<() => void>();
  let now = 0;
  let timer: ReturnType<typeof setInterval> | undefined;
  const clock: Clock = {
    subscribe(l) {
      listeners.add(l);
      timer ??= setInterval(() => {
        now = Date.now();
        listeners.forEach((f) => f());
      }, ms);
      return () => {
        listeners.delete(l);
        if (!listeners.size) {
          clearInterval(timer);
          timer = undefined;
        }
      };
    },
    // Refreshed lazily, so a render after an idle spell never reads a stale time,
    // and repeated reads within one tick return the same value.
    read() {
      const t = Date.now();
      if (t - now >= ms) now = t;
      return now;
    },
  };
  clocks.set(ms, clock);
  return clock;
}

/**
 * The real clock, ticking every `ms`. Null while hydrating prerendered HTML —
 * the server cannot know the time, so time-dependent UI renders its fallback
 * there — and the live value from then on, including on the first render after
 * an in-app navigation, so a page arrives already filled in.
 */
export function useNow(ms = 1000) {
  const clock = clockFor(ms);
  return useSyncExternalStore(clock.subscribe, clock.read, () => null);
}
