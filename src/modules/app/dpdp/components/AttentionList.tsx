'use client';

import Link from 'next/link';
import { attentionAt } from '@/modules/app/dpdp/attention';
import { OWNERS } from '@/modules/app/dpdp/mock/data';
import { useNow } from '@/modules/app/dpdp/useNow';
import { Panel, Person } from '@/modules/app/ui/ui';
import When from './When';

/**
 * One client's "needs attention" rows, from the same derivation as the header
 * bell: what it is, who has to act, and when it is due. `exclude` drops items
 * the page already shows more prominently (the running breach clock).
 */
export default function AttentionList({ org, exclude = [] }: { org: string; exclude?: string[] }) {
  const now = useNow(30_000);
  const items = attentionAt(now).filter((a) => a.org === org && !exclude.includes(a.id));
  if (!items.length) return null;

  return (
    <Panel title="Needs attention" sub={`${items.length} item${items.length === 1 ? '' : 's'} with an owner and a date`} flush>
      <ul>
        {items.map((a) => (
          <li key={a.id} className="border-b border-[var(--ds-border)] last:border-b-0">
            <Link
              href={a.href}
              className="group grid items-center gap-x-6 gap-y-1.5 px-4 py-3 transition-colors hover:bg-[var(--ds-subtle)] sm:px-5 md:grid-cols-[minmax(0,1fr)_13rem_9rem]"
            >
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className={`mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full ${a.tone === 'danger' ? 'bg-[var(--ds-danger)]' : 'bg-[var(--ds-warn)]'}`}
                  aria-hidden
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--ds-text)]">{a.title}</p>
                  <p className="truncate text-[12px] text-[var(--ds-text-3)]">{a.meta}</p>
                </div>
              </div>
              <div className="min-w-0 pl-4 md:pl-0">
                {a.owner ? <Person name={OWNERS[a.owner] ?? a.owner} role={OWNERS[a.owner] ? a.owner : undefined} /> : <span className="text-[12px] text-[var(--ds-text-3)]">{a.owners ? `${a.owners} owners` : 'Consultant'}</span>}
              </div>
              <p className="pl-4 text-[12px] font-medium md:pl-0 md:text-right">
                {a.due ? <When date={a.due} /> : <span className="text-[var(--ds-danger)]">now</span>}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
