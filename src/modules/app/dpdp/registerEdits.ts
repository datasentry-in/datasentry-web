'use client';

import { useSyncExternalStore } from 'react';
import { NO_EDITS, type RegisterEdits } from './flowGraph';

/**
 * Register edits made in this browser session, per client: an activity's lawful
 * basis or retention, a recipient's hosting country or contract. The RoPA
 * register writes them; the data flow map, its facts and its side panel read
 * them — so a change in the register shows on the map. Kept in sessionStorage
 * (a new session starts from the register as recorded) and read through
 * useSyncExternalStore, so prerendered HTML (no edits) never mismatches. A live
 * app writes these to its data layer, with the audit trail, instead.
 */
const KEY = 'ds-console-register-edits';
type All = Record<string, RegisterEdits>;

let listeners: (() => void)[] = [];
const subscribe = (l: () => void) => {
  listeners = [...listeners, l];
  return () => {
    listeners = listeners.filter((x) => x !== l);
  };
};

let cache: { raw: string | null; all: All } = { raw: null, all: {} };
function readAll(): All {
  let raw: string | null = null;
  try {
    raw = sessionStorage.getItem(KEY);
  } catch {
    /* storage blocked — edits last until reload */
  }
  if (raw !== cache.raw) {
    let all: All = {};
    try {
      all = raw ? (JSON.parse(raw) as All) : {};
    } catch {
      all = {};
    }
    cache = { raw, all };
  }
  return cache.all;
}

function write(all: All) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    /* storage blocked */
  }
  listeners.forEach((l) => l());
}

/** This session's edits to one client's register (stable between changes). */
export function useRegisterEdits(org: string): RegisterEdits {
  return useSyncExternalStore(subscribe, () => readAll()[org] ?? NO_EDITS, () => NO_EDITS);
}

const current = (org: string): RegisterEdits => readAll()[org] ?? NO_EDITS;

export function editActivity(org: string, id: string, patch: RegisterEdits['activities'][string]) {
  const e = current(org);
  write({ ...readAll(), [org]: { ...e, activities: { ...e.activities, [id]: { ...e.activities[id], ...patch } } } });
}

export function editParty(org: string, id: string, patch: RegisterEdits['parties'][string]) {
  const e = current(org);
  write({ ...readAll(), [org]: { ...e, parties: { ...e.parties, [id]: { ...e.parties[id], ...patch } } } });
}

/** Back to the register as recorded. */
export function resetEdits(org: string) {
  const all = { ...readAll() };
  delete all[org];
  write(all);
}
