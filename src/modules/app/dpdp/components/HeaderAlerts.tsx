'use client';

import Link from 'next/link';
import { useState } from 'react';
import { attentionAt } from '@/modules/app/dpdp/attention';
import { demoPath } from '@/modules/app/dpdp/routes';
import { DEADLINE } from '@/modules/app/dpdp/statute';
import { useNow } from '@/modules/app/dpdp/useNow';
import { Skeleton } from '@/modules/app/ui/ui';
import When from './When';

/**
 * The top bar's right side: what needs the consultant's attention across every
 * client, behind one bell. The running breach clock is the first item in it and
 * the page's next step; the header itself stays calm.
 * The list itself comes from `attention.ts`.
 */

const COMMENCES = new Date(`${DEADLINE.date}T00:00:00+05:30`).getTime();

function Bell() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6.5a4 4 0 0 1 8 0c0 3.2 1.3 4.5 1.3 4.5H2.7S4 9.7 4 6.5z" />
      <path d="M6.6 13.2a1.5 1.5 0 0 0 2.8 0" />
    </svg>
  );
}

export default function HeaderAlerts() {
  const now = useNow(1000);
  const [open, setOpen] = useState(false);
  const alerts = attentionAt(now);
  const urgent = alerts.filter((a) => a.tone === 'danger').length;
  const days = now === null ? null : Math.max(0, Math.floor((COMMENCES - now) / 86_400_000));

  return (
    <div className="flex items-center gap-2">

      <Link
        href={demoPath()}
        className="hidden items-center gap-1.5 rounded-full border border-[var(--ds-border)] bg-white px-2.5 py-1 text-[12px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] 2xl:inline-flex"
        title="DPDP substantive obligations commence 13 May 2027"
      >
        {days === null ? <Skeleton className="h-3 w-7" /> : <span className="ds-figure text-[var(--ds-text)]">{days}</span>} days to 13 May 2027
      </Link>

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={`Notifications — ${alerts.length} need attention`}
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
        >
          <Bell />
          <span
            className={`ds-figure absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9.5px] text-white ${
              urgent ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-warn)]'
            }`}
            aria-hidden
          >
            {alerts.length}
          </span>
        </button>

        {open && (
          <>
            <button type="button" aria-label="Close notifications" className="fixed inset-0 z-40 cursor-default" onClick={() => setOpen(false)} />
            <div className="absolute right-0 z-50 mt-2 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-panel)] shadow-[var(--ds-shadow-md)]">
              <div className="flex items-baseline justify-between border-b border-[var(--ds-border)] px-3.5 py-2.5">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">Needs attention</p>
                <p className="ds-meta text-[var(--ds-text-3)]">
                  {urgent} urgent · {alerts.length - urgent} due
                </p>
              </div>
              <ul className="max-h-[60vh] overflow-y-auto">
                {alerts.map((a) => (
                  <li key={a.id} className="border-b border-[var(--ds-border)] last:border-b-0">
                    <Link href={a.href} onClick={() => setOpen(false)} className="flex gap-2.5 px-3.5 py-2.5 transition-colors hover:bg-[var(--ds-subtle)]">
                      <span
                        className={`mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full ${a.tone === 'danger' ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-warn)]'}`}
                        aria-hidden
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium leading-snug">{a.title}</span>
                        <span className="block truncate text-[12px] text-[var(--ds-text-2)]">{a.client}</span>
                        <span className="block text-[12px] leading-snug text-[var(--ds-text-3)]">
                          {a.meta}
                          {a.due && (
                            <>
                              {' · '}
                              <When date={a.due} />
                            </>
                          )}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="border-t border-[var(--ds-border)] px-3.5 py-2 text-[11px] leading-snug text-[var(--ds-text-3)]">
                Computed from the register, the clocks and the tasks — no client system is watched.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
