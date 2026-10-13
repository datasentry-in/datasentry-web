'use client';

import { useSyncExternalStore } from 'react';

/**
 * Per-viewer display preferences kept in localStorage and read through
 * useSyncExternalStore, so the prerendered HTML (the default) never mismatches
 * on hydration and every reader updates when one is changed.
 */
let listeners: (() => void)[] = [];
const subscribe = (l: () => void) => {
  listeners = [...listeners, l];
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};
const read = (key: string, fallback: boolean) => {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : v === '1';
  } catch {
    return fallback;
  }
};

export function setPref(key: string, on: boolean) {
  try {
    localStorage.setItem(key, on ? '1' : '0');
  } catch {
    /* storage blocked — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}

export function usePref(key: string, fallback: boolean) {
  return useSyncExternalStore(subscribe, () => read(key, fallback), () => fallback);
}

/** Flip a boolean preference. */
export const togglePref = (key: string, fallback: boolean) => setPref(key, !read(key, fallback));

/** Presenter mode: show the "Design note" lines written for walkthroughs. */
export const PRESENTER = 'ds-console-presenter';
/** The client sidebar collapsed to an icon rail. */
export const SIDEBAR_COLLAPSED = 'ds-console-sidebar-collapsed';
