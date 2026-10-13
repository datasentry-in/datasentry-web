'use client';

import { useRef, useState, type ReactNode } from 'react';
import { auditFor, clientData, getOrg, personFor } from '@/modules/app/dpdp/mock/clients';
import { formatIst, parseDisplayDate } from '@/modules/app/dpdp/time';
import type { Gap, GapStatus, Severity } from '@/modules/app/dpdp/types';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import AuditTimeline from './AuditTimeline';
import Discussion from './Discussion';
import { useTableView, type Field, type Grouping, type Sort, type View } from '@/modules/app/ui/useTableView';
import { BasisTag } from '@/modules/app/dpdp/components/Tags';
import { FINDING_STATUS, SEVERITY_PRIORITY } from '@/modules/app/dpdp/workStatus';
import BulkBar, { BulkAction } from '@/modules/app/ui/BulkBar';
import FilterBar from '@/modules/app/ui/FilterBar';
import { useMenu, type MenuItem } from '@/modules/app/ui/Menu';
import { useToast } from '@/modules/app/ui/Toast';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { PriorityIcon, StatusIcon, WorkGroup, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import { CiteLink, Person } from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/**
 * The gap report as a worklist: saved views, filters (owner, severity, status,
 * evidence), grouping and order, one row per finding — severity, ID, status,
 * title, citation, due, owner — and each finding opened beside the list with
 * its evidence, provision and history.
 */

const RANK: Record<Severity, number> = { High: 0, Medium: 1, Low: 2 };
const due = (g: Gap) => parseDisplayDate(g.due)?.getTime() ?? 0;
const statusOf = (g: Gap): GapStatus => g.status ?? 'Open';
const DAY = 86_400_000;
const BASIS: Record<string, string> = { observed: 'Observed on a walkthrough', declared: 'Declared', attested: 'Attested', none: 'No evidence yet' };

/**
 * Saved views for one client. "Due in 30 days" is measured from the client's
 * last review, so the view is stable in a prerendered page (the relative labels
 * use the real clock). Anything narrower — one owner, one status — is a filter.
 */
function viewsFor(reviewed: number): View<Gap>[] {
  return [
    { id: 'all', label: 'All', test: () => true },
    { id: 'high', label: 'High', test: (g) => g.severity === 'High' },
    { id: 'soon', label: 'Due in 30 days', test: (g) => due(g) - reviewed <= 30 * DAY },
    { id: 'unobserved', label: 'Not yet observed', test: (g) => g.basis !== 'observed' },
  ];
}
const SORTS: Sort<Gap>[] = [
  { id: 'severity', label: 'Severity', compare: (a, b) => RANK[a.severity] - RANK[b.severity] || due(a) - due(b) },
  { id: 'due', label: 'Due date', compare: (a, b) => due(a) - due(b) },
  { id: 'id', label: 'ID', compare: (a, b) => a.id.localeCompare(b.id) },
];
const GROUPINGS: Grouping<Gap>[] = [
  { id: 'severity', label: 'Severity', key: (g) => g.severity, order: ['High', 'Medium', 'Low'] },
  { id: 'status', label: 'Status', key: statusOf, order: ['Open', 'In progress', 'Resolved'] },
  { id: 'owner', label: 'Owner', key: (g) => g.owner },
];

export default function FindingsList({ org }: { org: string }) {
  const d = clientData(org);
  const GAPS = d.gaps;
  const OWNERS = d.owners;
  const VIEWS = viewsFor(parseDisplayDate(getOrg(org).lastReview)?.getTime() ?? 0);
  const ownerName = (role: string) => personFor(OWNERS, role).name;
  const FIELDS: Field<Gap>[] = [
    { id: 'owner', label: 'Owner', value: (g) => g.owner, display: ownerName },
    { id: 'severity', label: 'Severity', value: (g) => g.severity },
    { id: 'status', label: 'Status', value: statusOf },
    { id: 'basis', label: 'Evidence', value: (g) => g.basis ?? 'none', display: (v) => BASIS[v] ?? v },
  ];
  const search = (g: Gap) => `${g.id} ${g.title} ${g.provision} ${g.activity} ${g.owner} ${OWNERS[g.owner] ?? ''}`;
  const toast = useToast();
  const menu = useMenu();
  const list = useRef<HTMLUListElement>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  // Status changes made here (s, the row menu, the bulk bar). A live app writes
  // them to the register and the audit trail; the mock keeps them for the visit.
  const [changed, setChanged] = useState<Record<string, GapStatus>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const rows = GAPS.map((g) => (changed[g.id] ? { ...g, status: changed[g.id] } : g));
  const t = useTableView({ rows, views: VIEWS, sorts: SORTS, search, fields: FIELDS, groupings: GROUPINGS });
  const open = rows.find((g) => g.id === openId) ?? null;
  const byId = (id: string) => rows.find((g) => g.id === id)!;

  const setStatus = (ids: string[], to: GapStatus) => {
    setChanged((c) => ({ ...c, ...Object.fromEntries(ids.map((id) => [id, to])) }));
    toast(
      ids.length === 1 ? `${ids[0]} → ${to}` : `${ids.length} findings → ${to}`,
      to === 'Resolved'
        ? 'Resolved once the consultant has seen the fix — the next walkthrough confirms it on screen. In the live app this is logged to the audit trail.'
        : 'In the live app this is logged to the audit trail, old → new.',
    );
  };
  const statusItems = (ids: string[]): MenuItem[] => [
    { heading: ids.length === 1 ? 'Status' : `Status of ${ids.length} findings` },
    ...(['Open', 'In progress', 'Resolved'] as GapStatus[]).map((s) => ({
      label: s,
      icon: <StatusIcon status={FINDING_STATUS[s]} label={s} />,
      checked: ids.length === 1 ? statusOf(byId(ids[0])) === s : undefined,
      onSelect: () => setStatus(ids, s),
    })),
  ];
  const toggle = (id: string) => setSelected((x) => {
    const next = new Set(x);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  const remind = (ids: string[]) => {
    const owners = new Set(ids.map((id) => byId(id).owner));
    toast(
      ids.length === 1 ? `Reminder sent to ${ownerName(byId(ids[0]).owner)}` : `Reminders sent to ${owners.size} owner${owners.size === 1 ? '' : 's'}`,
      `${ids.join(', ')} · ${formatIst(new Date())} · in this mock nothing is emailed`,
    );
  };

  useListKeys(list, {
    onSelect: toggle,
    onStatus: (id, el) => menu.openBelow(el, statusItems([id]), `Status of ${id}`),
    onClear: () => setSelected(new Set()),
    hasSelection: selected.size > 0,
  });

  const row = (g: Gap) => {
    const status = statusOf(g);
    return (
      <WorkRow
        key={g.id}
        priority={<PriorityIcon level={SEVERITY_PRIORITY[g.severity]} />}
        id={g.id}
        status={<StatusIcon status={FINDING_STATUS[status]} label={status} />}
        title={g.title}
        onOpen={() => setOpenId(g.id)}
        current={openId === g.id}
        selected={selected.has(g.id)}
        onSelect={() => toggle(g.id)}
        onContextMenu={(e) => {
          e.preventDefault();
          menu.openAt(e.clientX, e.clientY, [
            { label: 'Open', hint: '↵', onSelect: () => setOpenId(g.id) },
            { label: selected.has(g.id) ? 'Deselect' : 'Select', hint: 'X', onSelect: () => toggle(g.id) },
            { label: `Remind ${ownerName(g.owner)}`, onSelect: () => remind([g.id]) },
            { label: 'Copy ID', onSelect: () => { void navigator.clipboard?.writeText(g.id); toast(`Copied ${g.id}`); } },
            'separator',
            ...statusItems([g.id]),
          ], `Actions for ${g.id}`);
        }}
        meta={<><CiteLink provision={g.provision} /> · {g.activity}</>}
        actions={<RemindButton person={ownerName(g.owner)} what={`${g.id} — ${g.title}`} />}
        due={<When date={g.due} />}
        owner={personFor(OWNERS, g.owner)}
      />
    );
  };
  const groupTitle = (key: string): ReactNode =>
    t.grouping === 'severity' ? <span className="inline-flex items-center gap-2"><PriorityIcon level={SEVERITY_PRIORITY[key as Severity]} />{key}</span>
      : t.grouping === 'status' ? <span className="inline-flex items-center gap-2"><StatusIcon status={FINDING_STATUS[key as GapStatus]} label={key} />{key}</span>
        : `${ownerName(key)}${OWNERS[key] ? ` · ${key}` : ''}`;
  const picked = [...selected];

  return (
    <>
      <FilterBar t={t} views={VIEWS} fields={FIELDS} orders={SORTS} groupings={GROUPINGS} placeholder="Search findings…" />
      <WorkList ref={list} selecting={selected.size > 0}>
        {t.groups
          ? t.groups.map((g) => (
            <WorkGroup key={g.key} title={groupTitle(g.key)} count={g.rows.length}>
              {g.rows.map(row)}
            </WorkGroup>
          ))
          : t.shown.map(row)}
        {t.shown.length === 0 && (
          <li className="px-4 py-10 text-center text-[13px] text-[var(--ds-text-3)]">No findings match this view.</li>
        )}
      </WorkList>
      {menu.element}
      <BulkBar count={selected.size} onClear={() => setSelected(new Set())}>
        <BulkAction onClick={() => remind(picked)}>Remind owners</BulkAction>
        <BulkAction onClick={(e) => menu.openBelow(e.currentTarget, statusItems(picked), 'Set status')}>Set status</BulkAction>
      </BulkBar>

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.title}
        meta={open && (
          <>
            <span className="ds-id text-[12px] text-[var(--ds-text-3)]">{open.id}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ds-text-2)]"><PriorityIcon level={SEVERITY_PRIORITY[open.severity]} />{open.severity}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ds-text-2)]"><StatusIcon status={FINDING_STATUS[statusOf(open)]} label={statusOf(open)} />{statusOf(open)}</span>
            <CiteLink provision={open.provision} />
          </>
        )}
        footer={open && <RemindButton person={ownerName(open.owner)} what={`${open.id} — ${open.title}`} />}
      >
        {open && (
          <>
            <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.detail}</p>
            <SheetSection title="Ownership">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Person {...personFor(OWNERS, open.owner)} />
                <p className="text-right text-[13px]">
                  <span className="block font-medium">{open.due}</span>
                  <When date={open.due} className="text-[12px]" />
                </p>
              </div>
            </SheetSection>
            <SheetSection title="Activity">
              <p className="text-[13px]">{open.activity}</p>
            </SheetSection>
            {open.evidence && (
              <SheetSection title="Evidence">
                <div className="ds-bar ds-bar-plain">
                  {open.basis && <BasisTag b={open.basis} />}
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.evidence}</p>
                </div>
              </SheetSection>
            )}
            <SheetSection title="Why this is a finding">
              <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">
                Raised by rule set v1.4 from a register field, citing {open.provision}. The model does not draw this
                conclusion; it can be traced line by line to the register and the rule.
              </p>
            </SheetSection>
            <SheetSection title="Discussion">
              <Discussion org={org} refId={open.id} />
            </SheetSection>
            <SheetSection title="History">
              <AuditTimeline entries={auditFor(d, open.id)} empty={`Raised ${getOrg(org).lastReview} by rule engine v1.4. No changes since.`} />
            </SheetSection>
          </>
        )}
      </Sheet>
    </>
  );
}
