'use client';

import { useSyncExternalStore } from 'react';

/**
 * A set of strings kept in localStorage per viewer (e.g. which inbox items have
 * been read), read through useSyncExternalStore so prerendered HTML (an empty
 * set) never mismatches and every reader updates together. The parsed set is
 * cached against the raw string, so a snapshot is stable between changes.
 */
const EMPTY: ReadonlySet<string> = new Set();
let listeners: (() => void)[] = [];
const cache = new Map<string, { raw: string | null; value: ReadonlySet<string> }>();

const subscribe = (l: () => void) => {
  listeners = [...listeners, l];
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};

function read(key: string): ReadonlySet<string> {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    /* storage blocked — nothing is remembered */
  }
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value: ReadonlySet<string> = EMPTY;
  try {
    value = raw ? new Set(JSON.parse(raw) as string[]) : EMPTY;
  } catch {
    value = EMPTY;
  }
  cache.set(key, { raw, value });
  return value;
}

export function useStoredSet(key: string): ReadonlySet<string> {
  return useSyncExternalStore(subscribe, () => read(key), () => EMPTY);
}

/** Add strings to the set (handlers only, never during render). */
export function addToStoredSet(key: string, values: string[]) {
  const next = [...new Set([...read(key), ...values])];
  try {
    localStorage.setItem(key, JSON.stringify(next));
  } catch {
    /* storage blocked — the change lasts until reload */
  }
  listeners.forEach((l) => l());
}
