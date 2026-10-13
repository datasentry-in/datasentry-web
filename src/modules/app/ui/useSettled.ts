'use client';

import { useSyncExternalStore } from 'react';

/**
 * The headline figures popping in and live values fading in play on the first
 * page of a visit only; after that they arrive settled (the short page
 * entrance itself plays on every navigation). Per page load, so a reload plays
 * them again.
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
