'use client';

import { parseDisplayDate, relativeTo } from '@/modules/app/dpdp/time';
import { useNow } from '@/modules/app/dpdp/useNow';

/**
 * A date shown relative to now — "due in 3 days", "2h ago" — with the exact
 * date on hover. The prerendered HTML carries the exact date; the relative
 * form fills in after mount, so there is no hydration mismatch. Overdue dates
 * turn red, dates within a week amber.
 */
export default function When({
  date, kind = 'due', tone = true, className = '',
}: { date: string; kind?: 'due' | 'event'; tone?: boolean; className?: string }) {
  const now = useNow(60_000);
  const at = parseDisplayDate(date);
  if (!at || now === null) return <span className={className}>{date}</span>;

  const label = relativeTo(at, now, kind);
  const left = at.getTime() - now;
  const colour =
    !tone || kind === 'event' ? ''
      : left < 0 ? 'text-[var(--ds-danger)]'
        : left < 7 * 86_400_000 ? 'text-[var(--ds-warn)]'
          : '';
  return (
    <time dateTime={at.toISOString()} title={date} className={`${colour} ${className}`}>
      {label}
    </time>
  );
}
