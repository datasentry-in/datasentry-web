'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ORGS, currentUser } from '@/modules/app/dpdp/mock/clients';
import { assignedAt, type AssignedItem, type WorkKind } from '@/modules/app/dpdp/assigned';
import { demoPath } from '@/modules/app/dpdp/routes';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import { useNow } from '@/modules/app/dpdp/useNow';
import FilterBar from '@/modules/app/ui/FilterBar';
import ListHeader from '@/modules/app/ui/ListHeader';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { useTableView, type Field, type Grouping, type Sort, type View } from '@/modules/app/ui/useTableView';
import { StatusIcon, WorkGroup, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import { EmptyState, Panel } from '@/modules/app/ui/ui';
import ClientMark from './ClientMark';
import When from './When';

const KINDS: WorkKind[] = ['Board intimation', 'Request', 'Check-in', 'Discovery', 'Evidence', 'Walkthrough'];
const due = (i: AssignedItem) => (i.due ? parseDisplayDate(i.due)?.getTime() ?? Infinity : Infinity);
const SORTS: Sort<AssignedItem>[] = [
  { id: 'due', label: 'Due date', compare: (a, b) => due(a) - due(b) },
  { id: 'client', label: 'Client', compare: (a, b) => a.client.localeCompare(b.client) || due(a) - due(b) },
];
const FIELDS: Field<AssignedItem>[] = [
  { id: 'client', label: 'Client', value: (i) => i.org, display: (slug) => ORGS.find((o) => o.slug === slug)?.name ?? slug },
  { id: 'kind', label: 'Type', value: (i) => i.kind },
];
const GROUPINGS: Grouping<AssignedItem>[] = [
  { id: 'client', label: 'Client', key: (i) => i.org },
  { id: 'kind', label: 'Type', key: (i) => i.kind, order: KINDS },
];
const WEEK = 7 * 86_400_000;

/**
 * Everything on the consultant's side across clients — requests to answer, the
 * Board intimation to send, artefacts to review, check-ins to read, interviews
 * to run and attested fixes to look at — in one list, grouped by client.
 */
export default function Assigned() {
  const now = useNow(60_000);
  const items = assignedAt(now);
  const list = useRef<HTMLUListElement>(null);
  useListKeys(list);

  const VIEWS: View<AssignedItem>[] = [
    { id: 'all', label: 'All', test: () => true },
    { id: 'week', label: 'Due this week', test: (i) => now !== null && due(i) - now <= WEEK },
    { id: 'overdue', label: 'Overdue', test: (i) => i.status === 'overdue' },
  ];
  const t = useTableView({
    rows: items, views: VIEWS, sorts: SORTS, fields: FIELDS, groupings: GROUPINGS, initialGrouping: 'client',
    search: (i) => `${i.client} ${i.kind} ${i.title} ${i.ref ?? ''} ${i.context ?? ''}`,
  });
  const byClient = t.grouping === 'client';

  const row = (i: AssignedItem) => (
    <WorkRow
      key={i.id}
      rowId={i.id}
      priority={byClient ? undefined : <ClientMark slug={i.org} />}
      id={i.ref}
      status={<StatusIcon status={i.status} label={i.statusLabel} />}
      title={i.title}
      href={i.href}
      meta={i.context}
      due={i.due ? <When date={i.due} /> : null}
    />
  );

  return (
    <div className="space-y-5">
      <ListHeader
        title="Assigned to me"
        meta={`${currentUser.name} · ${items.length} items · ${new Set(items.map((i) => i.org)).size} clients`}
        about={
          <>
            The consultant&rsquo;s side of every engagement, in one list: requests to answer, the Board intimation to send,
            artefacts to review, check-ins to read, interviews to run and attested fixes to look at on the next walkthrough.
            Owners&rsquo; work in their own systems is on each client&rsquo;s Tasks page.
          </>
        }
      />
      <Panel flush>
        <FilterBar t={t} views={VIEWS} fields={FIELDS} orders={SORTS} groupings={GROUPINGS} placeholder="Search assigned work…" />
        {t.shown.length === 0 ? (
          <EmptyState title="Nothing here">Nothing in this view. Try All, or clear the filters.</EmptyState>
        ) : (
          <WorkList ref={list} idWidth="6.75rem">
            {t.groups
              ? t.groups.map((g) => (
                <WorkGroup
                  key={g.key}
                  title={byClient
                    ? <span className="inline-flex items-center gap-2"><ClientMark slug={g.key} />{ORGS.find((o) => o.slug === g.key)?.name}</span>
                    : g.key}
                  count={g.rows.length}
                  right={byClient && (
                    <Link href={demoPath(g.key)} className="text-[12px] text-[var(--ds-text-2)] hover:text-[var(--ds-accent-hover)]">Overview →</Link>
                  )}
                >
                  {g.rows.map(row)}
                </WorkGroup>
              ))
              : t.shown.map(row)}
          </WorkList>
        )}
      </Panel>
    </div>
  );
}
