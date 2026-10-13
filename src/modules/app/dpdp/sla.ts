import type { Dsr } from './types';
import { parseDisplayDate } from './time';

/**
 * A request's response window, from the day it was received to the deadline,
 * measured against `now`. The one place lateness is worked out — the request
 * desk, the bell, the sidebar badge and the bars all call this, so they can
 * never disagree, and nothing stores a frozen "days left".
 */
const DAY = 86_400_000;

export function responseWindow(received: string, days: number, now: number) {
  // parseDisplayDate reads a bare date as end of day; the clock starts at receipt.
  const start = (parseDisplayDate(received)?.getTime() ?? now) - DAY + 1000;
  const end = start + days * DAY;
  const daysLeft = Math.ceil((end - now) / DAY);
  return {
    start,
    end,
    daysLeft,
    late: daysLeft < 0,
    day: Math.min(days, Math.max(1, Math.ceil((now - start) / DAY))),
    elapsed: Math.min(1, Math.max(0, (now - start) / (end - start))),
  };
}

/** Open requests already past their window, most overdue first. Empty until the clock is known. */
export function lateRequests(dsrs: Dsr[], days: number, now: number | null) {
  if (now === null) return [];
  return dsrs
    .filter((d) => d.status !== 'Closed')
    .map((d) => ({ dsr: d, ...responseWindow(d.received, days, now) }))
    .filter((w) => w.late)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
