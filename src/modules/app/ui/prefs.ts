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

/** A string preference (e.g. the last client opened); `fallback` until one is stored. */
const readValue = (key: string, fallback: string) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export function setPrefValue(key: string, value: string) {
  if (readValue(key, '') === value) return;
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage blocked — the choice just won't persist */
  }
  listeners.forEach((l) => l());
}

export function usePrefValue(key: string, fallback: string) {
  return useSyncExternalStore(subscribe, () => readValue(key, fallback), () => fallback);
}

/** Flip a boolean preference. */
export const togglePref = (key: string, fallback: boolean) => setPref(key, !read(key, fallback));

/** Presenter mode: show the "Design note" lines written for walkthroughs. */
export const PRESENTER = 'ds-console-presenter';
/** The client sidebar collapsed to an icon rail. */
export const SIDEBAR_COLLAPSED = 'ds-console-sidebar-collapsed';
/** The last client opened — whose modules the sidebar shows on pages outside a client. */
export const LAST_CLIENT = 'ds-console-last-client';
