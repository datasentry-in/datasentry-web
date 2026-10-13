'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { clientData, personFor } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { formatIst, parseDisplayDate } from '@/modules/app/dpdp/time';
import type { FulfilmentTask } from '@/modules/app/dpdp/types';
import { BasisTag } from '@/modules/app/dpdp/components/Tags';
import { TASK_LABEL, TASK_STATUS } from '@/modules/app/dpdp/workStatus';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import { useToast } from '@/modules/app/ui/Toast';
import { StatusIcon, WorkGroup, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import BulkBar, { BulkAction } from '@/modules/app/ui/BulkBar';
import FilterBar from '@/modules/app/ui/FilterBar';
import { useMenu } from '@/modules/app/ui/Menu';
import { useListKeys } from '@/modules/app/ui/useListKeys';
import { useTableView, type Field, type Grouping, type Sort, type View } from '@/modules/app/ui/useTableView';
import { Panel, Person } from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/**
 * Fulfilment without integrations: the platform turns a request, withdrawal,
 * expiry or finding into one task per system the RoPA lists; the owner does
 * the work in their own system and attests it here. Nothing is machine-verified,
 * and every attested row says so.
 */

/** Still waiting on its owner — the only state that can be reminded or attested. */
const live = (t: FulfilmentTask) => t.status === 'Open' || t.status === 'Overdue';
const SHORT: Record<FulfilmentTask['status'], string> = { Open: 'Open', Overdue: 'Overdue', Attested: 'Attested', Retained: 'Kept — statutory' };
const due = (t: FulfilmentTask) => parseDisplayDate(t.due)?.getTime() ?? 0;
const RANK: Record<FulfilmentTask['status'], number> = { Overdue: 0, Open: 1, Attested: 2, Retained: 3 };

const VIEWS: View<FulfilmentTask>[] = [
  { id: 'active', label: 'Active', test: live },
  { id: 'overdue', label: 'Overdue', test: (t) => t.status === 'Overdue' },
  { id: 'done', label: 'Attested or kept', test: (t) => !live(t) },
  { id: 'all', label: 'All', test: () => true },
];
const SORTS: Sort<FulfilmentTask>[] = [
  { id: 'due', label: 'Due date', compare: (a, b) => due(a) - due(b) },
  { id: 'status', label: 'Status', compare: (a, b) => RANK[a.status] - RANK[b.status] || due(a) - due(b) },
  { id: 'id', label: 'ID', compare: (a, b) => a.id.localeCompare(b.id) },
];
const GROUPINGS: Grouping<FulfilmentTask>[] = [
  { id: 'source', label: 'What raised it', key: (t) => t.source.ref },
  { id: 'owner', label: 'Owner', key: (t) => t.owner },
  { id: 'status', label: 'Status', key: (t) => t.status, order: ['Overdue', 'Open', 'Attested', 'Retained'] },
  { id: 'system', label: 'System', key: (t) => t.system },
];

const sourceHref = (org: string, t: FulfilmentTask) =>
  t.source.kind === 'Request' ? demoPath(org, 'dsr')
    : t.source.kind === 'Finding' ? demoPath(org, 'gaps')
      : demoPath(org, 'consent');

function AttestForm({ task, owners: OWNERS, onAttest }: { task: FulfilmentTask; owners: Record<string, string>; onAttest: (note: string, proof: string | null) => void }) {
  const [note, setNote] = useState('');
  const [proof, setProof] = useState<string | null>(null);
  const [sure, setSure] = useState(false);
  const person = personFor(OWNERS, task.owner).name;
  return (
    <div className="space-y-3">
      <label className="block">
        <span className="mb-1 block text-[12px] font-medium">What did you do in {task.system}?</span>
        <textarea
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={`e.g. ${task.action}. Done from the admin screen.`}
          className="w-full rounded-md border border-[var(--ds-border-strong)] px-3 py-2 text-[13px] outline-none placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]"
        />
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <label className="cursor-pointer rounded-md border border-[var(--ds-border-strong)] bg-white px-2.5 py-1.5 text-[12px] text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]">
          {proof ? 'Replace screenshot' : 'Add a screenshot (optional)'}
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => setProof(e.target.files?.[0]?.name ?? null)} />
        </label>
        {proof && <span className="ds-figure text-[12px] text-[var(--ds-text-2)]">{proof}</span>}
        <span className="text-[12px] text-[var(--ds-text-3)]">In this mock the file never leaves your device.</span>
      </div>
      <label className="flex items-start gap-2 text-[13px] text-[var(--ds-text-2)]">
        <input type="checkbox" checked={sure} onChange={(e) => setSure(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--ds-accent)]" />
        I, {person}, did this in {task.system}, and this record is accurate.
      </label>
      <button
        type="button"
        disabled={!note.trim() || !sure}
        onClick={() => onAttest(note.trim(), proof)}
        className="rounded-md bg-[var(--ds-accent)] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
      >
        Attest
      </button>
    </div>
  );
}

export default function TaskBoard({ org }: { org: string }) {
  const d = clientData(org);
  const TASKS = d.tasks;
  const OWNERS = d.owners;
  const toast = useToast();
  const [tasks, setTasks] = useState<FulfilmentTask[]>(TASKS);
  const [openId, setOpenId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const list = useRef<HTMLUListElement>(null);
  const menu = useMenu();
  const open = tasks.find((t) => t.id === openId) ?? null;
  const nameOf = (t: FulfilmentTask) => personFor(OWNERS, t.owner).name;
  const ownerName = (role: string) => personFor(OWNERS, role).name;

  const attest = (id: string, note: string, proof: string | null) => {
    const t = tasks.find((x) => x.id === id)!;
    setTasks((ts) =>
      ts.map((x) =>
        x.id === id
          ? { ...x, status: 'Attested', attestation: { by: `${nameOf(x)}, ${x.owner}`, at: formatIst(new Date()), note, proof } }
          : x,
      ),
    );
    toast(`${id} attested`, `Recorded as attested by ${nameOf(t)} — not machine-verified. The next walkthrough looks at it on screen.`);
  };

  const toggle = (id: string) => setSelected((x) => {
    const next = new Set(x);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
  /** Remind the owners of the tasks still waiting on them; attested and kept ones need nothing. */
  const remind = (ids: string[]) => {
    const waiting = tasks.filter((x) => ids.includes(x.id) && live(x));
    const owners = new Set(waiting.map((x) => x.owner));
    if (!waiting.length) {
      toast('Nothing to remind', 'Every selected task is already attested or kept.');
      return;
    }
    toast(
      waiting.length === 1 ? `Reminder sent to ${nameOf(waiting[0])}` : `Reminders sent to ${owners.size} owner${owners.size === 1 ? '' : 's'}`,
      `${waiting.map((x) => x.id).join(', ')} · ${formatIst(new Date())} · in this mock nothing is emailed`,
    );
  };
  // A task's status changes one way only — the owner attests it — so "s" opens the task to attest.
  useListKeys(list, {
    onSelect: toggle,
    onStatus: (id) => setOpenId(id),
    onClear: () => setSelected(new Set()),
    hasSelection: selected.size > 0,
  });

  // Who a task waits on is a filter ("Owner is Ritu Sharma") — the view an owner sees of their own work.
  const FIELDS: Field<FulfilmentTask>[] = [
    { id: 'owner', label: 'Owner', value: (t) => t.owner, display: ownerName },
    { id: 'status', label: 'Status', value: (t) => t.status, display: (v) => SHORT[v as FulfilmentTask['status']] },
    { id: 'system', label: 'System', value: (t) => t.system },
    { id: 'source', label: 'Raised by', value: (t) => t.source.kind },
  ];
  const t = useTableView({
    rows: tasks, views: VIEWS, sorts: SORTS, fields: FIELDS, groupings: GROUPINGS, initialGrouping: 'source',
    search: (x) => `${x.id} ${x.action} ${x.system} ${x.owner} ${nameOf(x)} ${x.source.ref} ${x.source.label}`,
  });

  const row = (x: FulfilmentTask) => (
    <WorkRow
      key={x.id}
      id={x.id}
      status={<StatusIcon status={TASK_STATUS[x.status]} label={TASK_LABEL[x.status]} />}
      title={x.action}
      onOpen={() => setOpenId(x.id)}
      current={openId === x.id}
      selected={selected.has(x.id)}
      onSelect={() => toggle(x.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        menu.openAt(e.clientX, e.clientY, [
          { label: live(x) ? 'Open to attest' : 'Open', hint: '↵', onSelect: () => setOpenId(x.id) },
          { label: selected.has(x.id) ? 'Deselect' : 'Select', hint: 'X', onSelect: () => toggle(x.id) },
          { label: `Remind ${nameOf(x)}`, disabled: !live(x), onSelect: () => remind([x.id]) },
          { label: 'Copy ID', onSelect: () => { void navigator.clipboard?.writeText(x.id); toast(`Copied ${x.id}`); } },
        ], `Actions for ${x.id}`);
      }}
      meta={t.grouping === 'system' ? x.source.label : x.system}
      actions={live(x) && (
        <>
          <RemindButton person={nameOf(x)} what={`${x.id} — ${x.action}`} />
          <button
            type="button"
            onClick={() => setOpenId(x.id)}
            className="rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-[var(--ds-subtle)]"
          >
            Attest
          </button>
        </>
      )}
      due={
        live(x) ? <When date={x.due} />
          : x.attestation ? <When date={x.attestation.at} kind="event" className="text-[var(--ds-text-3)]" />
            : <span className="text-[var(--ds-text-3)]">kept</span>
      }
      owner={personFor(OWNERS, x.owner)}
    />
  );

  const group = (key: string, rows: FulfilmentTask[]) => {
    if (t.grouping === 'source') {
      const src = rows[0].source;
      return (
        <WorkGroup
          key={key}
          title={<><span className="ds-id mr-1.5 text-[var(--ds-text-3)]">{src.ref}</span>{src.label}</>}
          count={rows.length}
          right={
            <Link href={sourceHref(org, rows[0])} className="text-[12px] text-[var(--ds-text-2)] hover:text-[var(--ds-accent-hover)]">
              {src.kind === 'Finding' ? 'Finding' : src.kind === 'Request' ? 'Request' : 'Consent ledger'} →
            </Link>
          }
        >
          {rows.map(row)}
        </WorkGroup>
      );
    }
    const title = t.grouping === 'owner' ? `${ownerName(key)}${OWNERS[key] ? ` · ${key}` : ''}`
      : t.grouping === 'status' ? (
        <span className="inline-flex items-center gap-2">
          <StatusIcon status={TASK_STATUS[key as FulfilmentTask['status']]} label={TASK_LABEL[key as FulfilmentTask['status']]} />
          {SHORT[key as FulfilmentTask['status']]}
        </span>
      ) : key;
    return <WorkGroup key={key} title={title} count={rows.length}>{rows.map(row)}</WorkGroup>;
  };

  return (
    <>
      <Panel flush>
        <FilterBar t={t} views={VIEWS} fields={FIELDS} orders={SORTS} groupings={GROUPINGS} placeholder="Search tasks…" />
        <WorkList ref={list} selecting={selected.size > 0}>
          {t.groups ? t.groups.map((g) => group(g.key, g.rows)) : t.shown.map(row)}
          {t.shown.length === 0 && (
            <li className="px-4 py-10 text-center text-[13px] text-[var(--ds-text-3)]">No tasks match this view.</li>
          )}
        </WorkList>
      </Panel>
      {menu.element}
      <BulkBar count={selected.size} onClear={() => setSelected(new Set())}>
        <BulkAction onClick={() => remind([...selected])}>Remind owners</BulkAction>
      </BulkBar>

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.action}
        meta={open && (
          <>
            <span className="ds-id text-[12px] text-[var(--ds-text-3)]">{open.id}</span>
            <span className="inline-flex items-center gap-1.5 text-[12px] text-[var(--ds-text-2)]">
              <StatusIcon status={TASK_STATUS[open.status]} label={TASK_LABEL[open.status]} />{SHORT[open.status]}
            </span>
          </>
        )}
        footer={open && live(open) && <RemindButton person={nameOf(open)} what={`${open.id} — ${open.action}`} />}
      >
        {open && (
          <>
            <SheetSection title="Where">
              <p className="text-[14px]">{open.system}</p>
            </SheetSection>
            <SheetSection title="Ownership">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Person {...personFor(OWNERS, open.owner)} />
                <p className="text-right text-[13px]">
                  <span className="block font-medium">{open.due}</span>
                  {live(open) && <When date={open.due} className="text-[12px]" />}
                </p>
              </div>
            </SheetSection>
            <SheetSection title="Raised by">
              <p className="text-[13px]">
                <span className="text-[var(--ds-text-2)]">{open.source.kind} · </span>
                <span className="ds-id text-[12px] text-[var(--ds-text-3)]">{open.source.ref}</span> {open.source.label}
              </p>
              <Link href={sourceHref(org, open)} className="mt-1 inline-block text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
                Open the {open.source.kind === 'Finding' ? 'finding' : open.source.kind === 'Request' ? 'request' : 'consent ledger'} →
              </Link>
            </SheetSection>
            {open.retainedFor && (
              <SheetSection title="Lawful ground to keep">
                <p className="text-[14px] leading-relaxed text-[var(--ds-text-2)]">{open.retainedFor}</p>
              </SheetSection>
            )}
            {open.attestation ? (
              <SheetSection title="Attestation">
                <div className="ds-bar ds-bar-ok space-y-1.5">
                  <BasisTag b="attested" />
                  <p className="text-[14px] leading-relaxed">{open.attestation.note}</p>
                  <p className="text-[12px] text-[var(--ds-text-2)]">
                    {open.attestation.by} · {open.attestation.at} · {open.attestation.proof ? <span className="ds-figure">{open.attestation.proof}</span> : 'no screenshot'} · not machine-verified
                  </p>
                </div>
              </SheetSection>
            ) : live(open) && (
              <SheetSection title="Attest">
                <AttestForm key={open.id} task={open} owners={OWNERS} onAttest={(n, p) => attest(open.id, n, p)} />
              </SheetSection>
            )}
          </>
        )}
      </Sheet>
    </>
  );
}
