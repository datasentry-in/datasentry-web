'use client';

import { parseDisplayDate } from '@/modules/app/dpdp/time';
import { useNow } from '@/modules/app/dpdp/useNow';
import { Skeleton } from '@/modules/app/ui/ui';

/**
 * A request's response window as a bar: from receipt to deadline, filled to
 * today. Turns amber in the last week and red once past. Live from the clock;
 * a placeholder until mounted, so the prerendered page carries no stale count.
 */
const DAY = 86_400_000;

export default function SlaBar({ received, days }: { received: string; days: number }) {
  const now = useNow(60_000);
  const start = parseDisplayDate(received)?.getTime();
  if (!start) return null;
  // parseDisplayDate reads a bare date as end of day; the clock starts at receipt.
  const from = start - DAY + 1000;
  const end = from + days * DAY;
  if (now === null) return <Skeleton className="h-4 w-36" />;

  const left = Math.ceil((end - now) / DAY);
  const pct = Math.min(100, Math.max(0, ((now - from) / (end - from)) * 100));
  const tone = left < 0 ? 'var(--ds-danger)' : left <= 7 ? 'var(--ds-warn)' : 'var(--ds-accent)';
  return (
    <div className="w-36" title={`Due ${new Date(end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`}>
      <p className="text-[12px] font-medium" style={{ color: left <= 7 ? tone : undefined }}>
        {left < 0 ? `${-left} days overdue` : `${left} days left`}
      </p>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone }} />
      </div>
      <p className="mt-0.5 text-[11px] text-[var(--ds-text-3)]">day {Math.min(days, Math.max(1, Math.ceil((now - from) / DAY)))} of {days}</p>
    </div>
  );
}
