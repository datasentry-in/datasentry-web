'use client';

import { useEffect, useState } from 'react';

/**
 * Rule 7 gives 72 hours from awareness to intimate the Board.
 * The clock is the whole point of the module, so it ticks.
 *
 * The page is prerendered, so `now` starts null and is filled from a timer
 * after mount — that keeps the server HTML and the first client paint in
 * agreement, and keeps setState out of the effect body.
 */
export default function Countdown({ deadlineIso }: { deadlineIso: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const every = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, []);

  const digits = 'ds-figure text-[38px] leading-none tracking-[-0.04em] sm:text-[46px]';

  if (now === null) {
    return (
      <span className={`${digits} text-[var(--ds-text-3)]`} aria-hidden>
        --:--:--
      </span>
    );
  }

  const ms = new Date(deadlineIso).getTime() - now;
  const overdue = ms <= 0;
  const abs = Math.abs(ms);
  const h = Math.floor(abs / 3_600_000);
  const m = Math.floor((abs % 3_600_000) / 60_000);
  const s = Math.floor((abs % 60_000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className="flex flex-wrap items-baseline gap-2">
      <span className={digits} style={{ color: overdue ? 'var(--ds-danger)' : 'var(--ds-text)' }}>
        {overdue ? '+' : ''}
        {pad(h)}:{pad(m)}:{pad(s)}
      </span>
      <span className="text-[12px] font-medium text-[var(--ds-text-2)]">
        {overdue ? 'past deadline' : 'to Board intimation'}
      </span>
    </span>
  );
}
