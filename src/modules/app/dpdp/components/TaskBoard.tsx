'use client';

import Link from 'next/link';
import { useState } from 'react';
import { clientData, personFor } from '@/modules/app/dpdp/mock/clients';
import { demoPath } from '@/modules/app/dpdp/routes';
import { formatIst } from '@/modules/app/dpdp/time';
import type { FulfilmentTask } from '@/modules/app/dpdp/types';
import { BasisTag } from '@/modules/app/dpdp/components/Tags';
import {
  Fact, Facts, Panel, Person, Tag,
} from '@/modules/app/ui/ui';
import RemindButton from './RemindButton';
import When from './When';

/**
 * Fulfilment without integrations: the platform turns a request, withdrawal,
 * expiry or finding into one task per system the RoPA lists; the owner does
 * the work in their own system and attests it here. Nothing is machine-verified,
 * and every attested row says so.
 */

const statusTag = (s: FulfilmentTask['status']) =>
  s === 'Attested' ? <Tag tone="ok">Attested</Tag>
    : s === 'Overdue' ? <Tag tone="alert">Overdue</Tag>
      : s === 'Retained' ? <Tag tone="dark">Kept — statutory</Tag>
        : <Tag tone="watch">Open</Tag>;

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
    <div className="mt-3 space-y-3 rounded-md border border-[var(--ds-border)] bg-white p-3.5">
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
  const [tasks, setTasks] = useState<FulfilmentTask[]>(TASKS);
  const [viewer, setViewer] = useState<string>('all');
  const [attesting, setAttesting] = useState<string | null>(null);

  const attest = (id: string, note: string, proof: string | null) => {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id
          ? { ...t, status: 'Attested', attestation: { by: `${personFor(OWNERS, t.owner).name}, ${t.owner}`, at: formatIst(new Date()), note, proof } }
          : t,
      ),
    );
    setAttesting(null);
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

      {groups.map((g) => {
        const src = g[0].source;
        return (
          <Panel
            key={src.ref}
            title={`${src.ref} — ${src.label}`}
            sub={`${src.kind} · ${g.length} task${g.length === 1 ? '' : 's'}, one per system the register lists`}
            right={
              <Link href={sourceHref(org, g[0])} className="text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
                Open {src.kind === 'Finding' ? 'finding' : src.kind === 'Request' ? 'request' : 'consent ledger'} →
              </Link>
            }
            flush
          >
            <ul>
              {g.map((t) => (
                <li key={t.id} className="ds-row border-b border-[var(--ds-border)] px-4 py-3.5 last:border-b-0 sm:px-5">
                  <div className="grid gap-x-6 gap-y-1.5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_8rem_14rem] lg:items-center">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-[13px] font-semibold tracking-[-0.01em]">
                        {t.system}
                        <span className="ds-id text-[11px] font-normal text-[var(--ds-text-3)]">{t.id}</span>
                      </p>
                      <p className="mt-0.5 text-[13px] text-[var(--ds-text-2)]">{t.action}</p>
                    </div>
                    <Person {...personFor(OWNERS, t.owner)} />
                    <p className="text-[12px] font-medium text-[var(--ds-text-2)]">
                      {t.status === 'Open' || t.status === 'Overdue' ? <When date={t.due} /> : t.due}
                    </p>
                    <div className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                      {(t.status === 'Open' || t.status === 'Overdue') && (
                        <span className="ds-row-actions">
                          <RemindButton person={personFor(OWNERS, t.owner).name} what={`${t.id} — ${t.action}`} />
                        </span>
                      )}
                      {statusTag(t.status)}
                      {(t.status === 'Open' || t.status === 'Overdue') && attesting !== t.id && (
                        <button
                          type="button"
                          onClick={() => setAttesting(t.id)}
                          className="rounded-md border border-[var(--ds-border-strong)] bg-white px-2.5 py-1 text-[12px] font-medium hover:bg-[var(--ds-subtle)]"
                        >
                          Attest
                        </button>
                      )}
                    </div>
                  </div>

                  {t.attestation && (
                    <div className="ds-bar ds-bar-ok mt-2.5 flex flex-wrap items-start gap-x-3 gap-y-1.5">
                      <BasisTag b="attested" />
                      <p className="min-w-0 flex-1 text-[13px]">
                        {t.attestation.note}
                        <span className="block text-[12px] text-[var(--ds-text-2)]">
                          {t.attestation.by} · {t.attestation.at} · {t.attestation.proof ? <span className="ds-figure">{t.attestation.proof}</span> : 'no screenshot'} · not machine-verified
                        </span>
                      </p>
                    </div>
                  )}

                  {t.retainedFor && (
                    <p className="mt-2 text-[12px] text-[var(--ds-text-2)]">
                      <span className="text-[var(--ds-text-3)]">Lawful ground to keep — </span>
                      {t.retainedFor}
                    </p>
                  )}

                  {attesting === t.id && <AttestForm task={t} owners={OWNERS} onAttest={(n, p) => attest(t.id, n, p)} />}
                </li>
              ))}
            </ul>
          </Panel>
        );
      })}
    </div>
  );
}
