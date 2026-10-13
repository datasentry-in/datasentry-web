'use client';

import Link from 'next/link';
import { workFor } from '@/modules/app/dpdp/attention';
import { clientData } from '@/modules/app/dpdp/mock/clients';
import { useNow } from '@/modules/app/dpdp/useNow';
import { EmptyState, Panel, Person } from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/**
 * One client's worklist — what needs attention, then its high-severity
 * findings — from the same derivation as the header bell: what it is, who has
 * to act, when it is due, and a reminder on hover. `exclude` drops items
 * the page already shows more prominently (the running breach clock).
 */
export default function AttentionList({ org, exclude = [] }: { org: string; exclude?: string[] }) {
  const now = useNow(30_000);
  const items = workFor(org, now).filter((a) => !exclude.includes(a.id));
  const owners = clientData(org).owners;
  return (
    <Panel
      title="What needs doing"
      sub={items.length ? `${items.length} item${items.length === 1 ? '' : 's'} — what is late or due first, then high-severity findings` : undefined}
      flush
    >
      {items.length === 0 ? (
        <EmptyState title="Nothing needs attention">
          No clocks are running, no requests are past their deadline and no tasks are waiting on an owner.
        </EmptyState>
      ) : (
        <ul>
          {items.map((a) => {
            const person = a.owner ? owners[a.owner] ?? a.owner : null;
            return (
              <li
                key={a.id}
                className="ds-row grid items-center gap-x-6 gap-y-1.5 border-b border-[var(--ds-border)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[var(--ds-subtle)] sm:px-5 md:grid-cols-[minmax(0,1fr)_13rem_9rem_4.5rem]"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${a.tone === 'danger' ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-warn)]'}`}
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <Link href={a.href} className="ds-row-link block truncate text-[13px] font-medium text-[var(--ds-text)]">
                      {a.title}
                    </Link>
                    <p className="truncate text-[12px] text-[var(--ds-text-3)]">{a.meta}</p>
                  </div>
                </div>
                <div className="min-w-0 pl-4 md:pl-0">
                  {person ? (
                    <Person name={person} role={owners[a.owner!] ? a.owner : undefined} />
                  ) : (
                    <span className="text-[12px] text-[var(--ds-text-3)]">{a.owners ? `${a.owners} owner${a.owners === 1 ? '' : 's'}` : 'Consultant'}</span>
                  )}
                </div>
                <p className="pl-4 text-[12px] font-medium md:pl-0 md:text-right">
                  {a.due ? <When date={a.due} /> : <span className="text-[var(--ds-danger)]">now</span>}
                </p>
                <div className="ds-row-actions pl-4 md:pl-0 md:text-right">
                  {person && <RemindButton person={person} what={a.title} />}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}
