'use client';

import { useRef } from 'react';
import { INBOX_READ, inboxItems, unreadByDefault, type InboxItem } from '@/modules/app/dpdp/inbox';
import { ORGS } from '@/modules/app/dpdp/mock/clients';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import FilterBar from '@/modules/app/ui/FilterBar';
import ListHeader from '@/modules/app/ui/ListHeader';
import { addToStoredSet, useStoredSet } from '@/modules/app/ui/storedSet';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { useTableView, type Field, type Grouping, type Sort, type View } from '@/modules/app/ui/useTableView';
import { WorkGroup, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import { Change, EmptyState, Panel } from '@/modules/app/ui/ui';
import ClientMark from './ClientMark';
import When from './When';

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? '' : 's'}`;
const time = (i: InboxItem) => parseDisplayDate(i.at)?.getTime() ?? 0;
const SORTS: Sort<InboxItem>[] = [
  { id: 'newest', label: 'Newest first', compare: (a, b) => time(b) - time(a) },
  { id: 'client', label: 'Client', compare: (a, b) => a.client.localeCompare(b.client) || time(b) - time(a) },
];
const FIELDS: Field<InboxItem>[] = [
  { id: 'client', label: 'Client', value: (i) => i.org, display: (slug) => ORGS.find((o) => o.slug === slug)?.name ?? slug },
  { id: 'kind', label: 'Type', value: (i) => i.kind, display: (k) => (k === 'comment' ? 'Comments' : 'Changes') },
];
const GROUPINGS: Grouping<InboxItem>[] = [
  { id: 'client', label: 'Client', key: (i) => i.org },
];

/**
 * What changed on your clients' records and what people said, across the
 * portfolio — the consultant's day starts here, not at a module. Opening an
 * item marks it read; read state is per viewer (localStorage).
 */
export default function Inbox() {
  const items = inboxItems();
  const fresh = unreadByDefault(items);
  const read = useStoredSet(INBOX_READ);
  const unread = (i: InboxItem) => fresh.has(i.id) && !read.has(i.id);
  const markRead = (ids: string[]) => addToStoredSet(INBOX_READ, ids);
  const list = useRef<HTMLUListElement>(null);
  useListKeys(list);

  const VIEWS: View<InboxItem>[] = [
    { id: 'unread', label: 'Unread', test: unread },
    { id: 'all', label: 'All', test: () => true },
  ];
  const t = useTableView({
    rows: items, views: VIEWS, sorts: SORTS, fields: FIELDS, groupings: GROUPINGS,
    search: (i) => `${i.client} ${i.who} ${i.ref} ${i.title} ${i.detail ?? ''}`,
  });
  const waiting = items.filter(unread);

  const row = (i: InboxItem) => {
    const isNew = unread(i);
    return (
      <WorkRow
        key={i.id}
        rowId={i.id}
        priority={<ClientMark slug={i.org} />}
        status={
          <span className="flex w-2 shrink-0 justify-center" aria-label={isNew ? 'Unread' : undefined}>
            {isNew && <span className="h-1.5 w-1.5 rounded-full bg-[var(--ds-accent)]" />}
          </span>
        }
        id={i.ref}
        title={i.kind === 'comment' ? `${i.who}: ${i.detail}` : i.title}
        href={i.href}
        onOpen={() => markRead([i.id])}
        muted={!isNew}
        meta={
          i.change ? <Change {...i.change} />
            : i.kind === 'comment' ? `${i.internal ? 'Internal comment' : 'Comment'} on ${i.ref}`
              : i.client
        }
        actions={isNew && (
          <button
            type="button"
            onClick={() => markRead([i.id])}
            className="rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-2.5 py-1 text-[12px] font-medium text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)]"
          >
            Mark read
          </button>
        )}
        due={<When date={i.at} kind="event" />}
        owner={{ name: i.who }}
      />
    );
  };

  return (
    <div className="space-y-5">
      <ListHeader
        title="Inbox"
        meta={waiting.length ? `${waiting.length} unread · ${plural(new Set(waiting.map((i) => i.org)).size, 'client')}` : 'Nothing new'}
        about={
          <>
            What other people changed on your clients&rsquo; records — an owner attesting a task, a request logged, a finding
            raised — and what they said on them. Your own changes are not news, so they are left out. Running clocks stay
            in the bell.
          </>
        }
        right={waiting.length > 0 && (
          <button
            type="button"
            onClick={() => markRead(waiting.map((i) => i.id))}
            className="rounded-md border border-[var(--ds-border-strong)] px-2.5 py-1.5 text-[13px] text-[var(--ds-text-2)] transition-colors hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)]"
          >
            Mark all read
          </button>
        )}
      />
      <Panel flush>
        <FilterBar t={t} views={VIEWS} fields={FIELDS} orders={SORTS} groupings={GROUPINGS} placeholder="Search the inbox…" />
        {t.shown.length === 0 ? (
          <EmptyState title={t.view === 'unread' ? 'You are all caught up' : 'Nothing matches'}>
            {t.view === 'unread' ? 'Everything new has been read. Older items are under All.' : 'Try another filter or search.'}
          </EmptyState>
        ) : (
          <WorkList ref={list} idWidth="6.75rem">
            {t.groups
              ? t.groups.map((g) => (
                <WorkGroup
                  key={g.key}
                  title={<span className="inline-flex items-center gap-2"><ClientMark slug={g.key} />{ORGS.find((o) => o.slug === g.key)?.name}</span>}
                  count={g.rows.length}
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
