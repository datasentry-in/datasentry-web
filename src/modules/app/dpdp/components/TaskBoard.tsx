'use client';

import Link from 'next/link';
import { useState } from 'react';
import { clientData, personFor } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { formatIst } from '@/modules/app/dpdp/time';
import type { FulfilmentTask } from '@/modules/app/dpdp/types';
import { BasisTag } from '@/modules/app/dpdp/components/Tags';
import { TASK_LABEL, TASK_STATUS } from '@/modules/app/dpdp/workStatus';
import Sheet, { SheetSection } from '@/modules/app/ui/Sheet';
import { useToast } from '@/modules/app/ui/Toast';
import { StatusIcon, WorkGroup, WorkList, WorkRow } from '@/modules/app/ui/WorkRow';
import { Fact, Facts, Panel, Person } from '@/modules/app/ui/ui';
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
  const [viewer, setViewer] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const open = tasks.find((t) => t.id === openId) ?? null;
  const nameOf = (t: FulfilmentTask) => personFor(OWNERS, t.owner).name;

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

  const owners = [...new Set(TASKS.map((t) => t.owner))];
  const shown = viewer === 'all' ? tasks : tasks.filter((t) => t.owner === viewer);
  const count = (s: FulfilmentTask['status']) => shown.filter((t) => t.status === s).length;
  const groups = [...new Set(shown.map((t) => t.source.ref))].map((ref) => shown.filter((t) => t.source.ref === ref));

  return (
    <div className="space-y-5">
      <Facts tight={false}>
        <Fact label="Open" value={count('Open')} note="awaiting the owner" tone="warn" />
        <Fact label="Overdue" value={count('Overdue')} note="past due — escalated" tone={count('Overdue') ? 'bad' : 'plain'} />
        <Fact label="Attested" value={count('Attested')} note="by the person who did it" tone="good" />
        <Fact label="Kept — statutory" value={count('Retained')} note="cited in the response" />
      </Facts>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="ds-meta mr-1 text-[var(--ds-text-3)]">Viewing as</span>
        {['all', ...owners].map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={viewer === o}
            onClick={() => setViewer(o)}
            className={`rounded-full border px-2.5 py-1 text-[12px] transition-colors ${
              viewer === o
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                : 'border-[var(--ds-border-strong)] bg-white text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
            }`}
          >
            {o === 'all' ? 'Consultant — all owners' : `${personFor(OWNERS, o).name} · ${o}`}
          </button>
        ))}
      </div>

      <Panel title="Tasks" sub="One per system the register lists, grouped by what raised them. Open one to attest it." flush>
        <WorkList>
          {groups.map((g) => {
            const src = g[0].source;
            return (
              <WorkGroup
                key={src.ref}
                title={<><span className="ds-id mr-1.5 text-[var(--ds-text-3)]">{src.ref}</span>{src.label}</>}
                count={g.length}
                right={
                  <Link href={sourceHref(org, g[0])} className="text-[12px] text-[var(--ds-text-2)] hover:text-[var(--ds-accent-hover)]">
                    {src.kind === 'Finding' ? 'Finding' : src.kind === 'Request' ? 'Request' : 'Consent ledger'} →
                  </Link>
                }
              >
                {g.map((t) => (
                  <WorkRow
                    key={t.id}
                    id={t.id}
                    status={<StatusIcon status={TASK_STATUS[t.status]} label={TASK_LABEL[t.status]} />}
                    title={t.action}
                    onOpen={() => setOpenId(t.id)}
                    current={openId === t.id}
                    meta={t.system}
                    actions={live(t) && (
                      <>
                        <RemindButton person={nameOf(t)} what={`${t.id} — ${t.action}`} />
                        <button
                          type="button"
                          onClick={() => setOpenId(t.id)}
                          className="rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-2.5 py-1 text-[12px] font-medium transition-colors hover:bg-[var(--ds-subtle)]"
                        >
                          Attest
                        </button>
                      </>
                    )}
                    due={
                      live(t) ? <When date={t.due} />
                        : t.attestation ? <When date={t.attestation.at} kind="event" className="text-[var(--ds-text-3)]" />
                          : <span className="text-[var(--ds-text-3)]">kept</span>
                    }
                    owner={personFor(OWNERS, t.owner)}
                  />
                ))}
              </WorkGroup>
            );
          })}
        </WorkList>
      </Panel>

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
    </div>
  );
}
