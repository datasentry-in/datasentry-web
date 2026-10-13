'use client';

import { useSyncExternalStore } from 'react';

/**
 * Entrance motion — the page easing in, headline figures popping, live values
 * fading — plays on the first page of a visit only. Once it has run, moving
 * between pages is instant: motion answers an action (a menu, a sheet, a toast),
 * never a page change. Per page load, so a reload plays the entrance again.
 */
const SETTLE_MS = 800;
let settled = false;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const subscribe = (l: () => void) => {
  listeners.add(l);
  timer ??= setTimeout(() => {
    settled = true;
    listeners.forEach((f) => f());
  }, SETTLE_MS);
  return () => {
    listeners.delete(l);
  };
};

/** False until the first page's entrance has finished; true for the rest of the visit. */
export const useSettled = () => useSyncExternalStore(subscribe, () => settled, () => false);
