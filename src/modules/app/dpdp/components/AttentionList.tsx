'use client';

import { useRef } from 'react';
import { workFor, type Attention } from '@/modules/app/dpdp/attention';
import { clientData, personFor } from '@/modules/app/dpdp/mock/clients';
import { useNow } from '@/modules/app/dpdp/useNow';
import { FINDING_STATUS } from '@/modules/app/dpdp/workStatus';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { StatusIcon, WorkList, WorkRow, type WorkStatus } from '@/modules/app/ui/WorkRow';
import { EmptyState, Panel } from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/** The glyph for an attention item: red when a clock or a deadline has run out, amber when it waits on someone. */
function statusOf(a: Attention, org: string): { status: WorkStatus; label: string } {
  switch (a.kind) {
    case 'incident': return { status: 'overdue', label: '72-hour clock running' };
    case 'requests': return { status: 'overdue', label: 'Past the response window' };
    case 'task': return { status: 'overdue', label: 'Overdue' };
    case 'tasks': return { status: 'waiting', label: 'Waiting on the owners' };
    case 'check-in': return { status: 'waiting', label: 'Waiting on the client' };
    case 'finding': {
      const s = clientData(org).gaps.find((g) => g.id === a.id)?.status ?? 'Open';
      return { status: FINDING_STATUS[s], label: s };
    }
  }
}

/**
 * One client's worklist — what needs attention, then its high-severity
 * findings — from the same derivation as the header bell, in the same row
 * shape as every other list: status, what it is, why, when, who. `exclude`
 * drops items the page already shows more prominently (the running breach clock).
 */
export default function AttentionList({ org, exclude = [] }: { org: string; exclude?: string[] }) {
  const now = useNow(30_000);
  const list = useRef<HTMLUListElement>(null);
  useListKeys(list);
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
        <WorkList ref={list}>
          {items.map((a) => {
            const person = a.owner ? personFor(owners, a.owner) : null;
            const { status, label } = statusOf(a, org);
            return (
              <WorkRow
                key={a.id}
                status={<StatusIcon status={status} label={label} />}
                title={a.title}
                href={a.href}
                meta={a.owners ? `${a.meta} · ${a.owners} owner${a.owners === 1 ? '' : 's'}` : a.meta}
                actions={person && <RemindButton person={person.name} what={a.title} />}
                due={a.due ? <When date={a.due} /> : <span className="text-[var(--ds-danger)]">now</span>}
                owner={person && { name: person.name, role: owners[a.owner!] ? a.owner : undefined }}
              />
            );
          })}
        </WorkList>
      )}
    </Panel>
  );
}
