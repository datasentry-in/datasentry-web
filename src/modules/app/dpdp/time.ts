/**
 * Timestamps for records made in the browser (attestations, observations,
 * reports). Call these from event handlers only — never during render, or the
 * prerendered HTML and the browser disagree.
 */
const IST: Intl.DateTimeFormatOptions = { timeZone: 'Asia/Kolkata' };

export function formatIst(d: Date) {
  const date = d.toLocaleDateString('en-GB', { ...IST, day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString('en-GB', { ...IST, hour: '2-digit', minute: '2-digit', hour12: false });
  return `${date}, ${time} IST`;
}

export function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { ...IST, day: '2-digit', month: 'short', year: 'numeric' });
}

export function addHours(d: Date, h: number) {
  return new Date(d.getTime() + h * 3_600_000);
}

/** A Date as the value of an <input type="datetime-local">, in IST. */
export function toIstInput(d: Date) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
    }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** The value of an <input type="datetime-local">, read as IST. */
export function fromIstInput(v: string) {
  return new Date(`${v}:00+05:30`);
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Read a date as the console writes it — "15 Nov 2026" or "10 Oct 2026, 14:22"
 * (IST) — back into an instant. A date without a time is taken as the end of
 * that day, so something due today is not yet late. Null if it isn't a date.
 */
export function parseDisplayDate(s: string): Date | null {
  const m = s.match(/^(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})(?:, (\d{2}):(\d{2}))?/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[2]);
  if (month < 0) return null;
  const pad = (n: number | string) => String(n).padStart(2, '0');
  const time = m[4] ? `${m[4]}:${m[5]}:00` : '23:59:59';
  return new Date(`${m[3]}-${pad(month + 1)}-${pad(m[1])}T${time}+05:30`);
}

/**
 * "in 3 days", "2h ago", "today" — how far `at` is from `now`. Past due dates
 * read as "overdue", past events as "ago". Day-level dates compare calendar
 * days in IST, so a date due tomorrow says "tomorrow" all of today.
 */
export function relativeTo(at: Date, now: number, kind: 'due' | 'event' = 'due') {
  const ms = at.getTime() - now;
  const abs = Math.abs(ms);
  const min = Math.round(abs / 60_000);
  const hr = Math.round(abs / 3_600_000);
  const day = (d: Date | number) => Math.floor((new Date(d).getTime() + 5.5 * 3_600_000) / 86_400_000);
  const days = day(at) - day(now);

  if (kind === 'event') {
    if (min < 1) return 'just now';
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    if (days === -1) return 'yesterday';
    return `${-days} days ago`;
  }
  if (days === 0) return ms < 0 ? 'overdue today' : 'due today';
  if (days === 1) return 'due tomorrow';
  if (days > 1) return days > 60 ? `due in ${Math.round(days / 30)} months` : `due in ${days} days`;
  return `overdue ${-days} day${days === -1 ? '' : 's'}`;
}
