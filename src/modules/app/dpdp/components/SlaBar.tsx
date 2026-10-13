'use client';

import { responseWindow } from '@/modules/app/dpdp/sla';
import { useNow } from '@/modules/app/dpdp/useNow';
import { Skeleton } from '@/modules/app/ui/ui';

/**
 * A request's response window as a bar: from receipt to deadline, filled to
 * today. Turns amber in the last week and red once past. Live from the clock
 * (sla.ts); a placeholder until mounted, so the prerendered page carries no
 * stale count.
 */
export default function SlaBar({ received, days }: { received: string; days: number }) {
  const now = useNow(60_000);
  if (now === null) return <Skeleton className="h-4 w-36" />;
  const w = responseWindow(received, days, now);
  const tone = w.late ? 'var(--ds-danger)' : w.daysLeft <= 7 ? 'var(--ds-warn)' : 'var(--ds-accent)';
  return (
    <div
      className="ds-fade-in w-36"
      title={`Due ${new Date(w.end).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })}`}
    >
      <p className="text-[12px] font-medium" style={{ color: w.daysLeft <= 7 ? tone : undefined }}>
        {w.late ? `${-w.daysLeft} days overdue` : `${w.daysLeft} days left`}
      </p>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
        <div className="h-full rounded-full" style={{ width: `${w.elapsed * 100}%`, background: tone }} />
      </div>
      <p className="mt-0.5 text-[11px] text-[var(--ds-text-3)]">day {w.day} of {days}</p>
    </div>
  );
}
