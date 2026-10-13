'use client';

import { useNow } from '@/modules/app/dpdp/useNow';
import { Skeleton } from '@/modules/app/ui/ui';

/**
 * Rule 7 gives 72 hours from awareness to intimate the Board. The clock is
 * the whole point of the module, so it ticks — and a bar drains with it, so the
 * time left reads at a glance. Red in the last 12 hours and once past.
 * A placeholder until mounted: the page is prerendered.
 */
export default function Countdown({ deadlineIso, windowHours = 72 }: { deadlineIso: string; windowHours?: number }) {
  const now = useNow(1000);
  const digits = 'ds-figure text-[38px] leading-none tracking-[-0.04em] sm:text-[46px]';

  if (now === null) {
    return (
      <span className="flex flex-col gap-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-1.5 w-full max-w-md" />
      </span>
    );
  }

  const end = new Date(deadlineIso).getTime();
  const ms = end - now;
  const overdue = ms <= 0;
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  const left = Math.max(0, Math.min(1, ms / (windowHours * 3_600_000)));
  const urgent = overdue || ms < 12 * 3_600_000;

  return (
    <span className="flex flex-col gap-3">
      <span className="flex flex-wrap items-baseline gap-2">
        <span className={digits} style={{ color: overdue ? 'var(--ds-danger)' : 'var(--ds-text)' }}>
          {overdue ? '+' : ''}
          {pad(h)}:{pad(m)}:{pad(s)}
        </span>
        <span className="text-[12px] font-medium text-[var(--ds-text-2)]">{overdue ? 'past deadline' : 'to Board intimation'}</span>
      </span>
      <span
        role="meter"
        aria-label="Time left in the 72-hour window"
        aria-valuemin={0}
        aria-valuemax={windowHours}
        aria-valuenow={Math.round(left * windowHours)}
        className={`block h-1.5 w-full max-w-md overflow-hidden rounded-full ${overdue ? 'bg-[var(--ds-danger-border)]' : 'bg-[var(--ds-subtle-2)]'}`}
      >
        <span
          className="block h-full rounded-full transition-[width] duration-1000"
          style={{ width: `${left * 100}%`, background: urgent ? 'var(--ds-danger)' : 'var(--ds-accent)' }}
        />
      </span>
    </span>
  );
}
