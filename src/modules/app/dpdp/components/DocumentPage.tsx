'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PEOPLE, type ComplianceDoc, type DocSection } from '@/modules/app/dpdp/mock/data';
import { formatIst } from '@/modules/app/dpdp/time';
import { useToast } from '@/modules/app/ui/Toast';
import { Avatar, CiteLink, Person, ProvenanceTag } from '@/modules/app/ui/ui';
import Discussion from './Discussion';
import When from './When';

/**
 * A compliance document as a page, not a table row: title, properties, the
 * text in sections, comments and versions beside it, and the sign-off flow at
 * the top. Each section says where its text came from; editing an AI-drafted
 * section marks it reviewed. The consultant drafts, the client's approver
 * signs off, and only then can it be sent — the platform never sends on its own.
 */

type Status = 'Draft' | 'Awaiting sign-off' | 'Signed off' | 'Sent to the Board';
const STATUS_TONE: Record<Status, string> = {
  Draft: 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-2)]',
  'Awaiting sign-off': 'bg-[var(--ds-warn-weak)] text-[var(--ds-warn)]',
  'Signed off': 'bg-[var(--ds-accent-weak)] text-[var(--ds-accent-hover)]',
  'Sent to the Board': 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]',
};

function Prop({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[8.5rem_1fr] items-center gap-3 py-1.5 text-[14px]">
      <dt className="text-[var(--ds-text-3)]">{label}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}

function Section({ n, s, onSave, locked }: { n: number; s: DocSection; onSave: (text: string) => void; locked: boolean }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(s.text);
  const ai = s.provenance === 'ai_suggested';
  return (
    <section className="group">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[17px] font-semibold tracking-[-0.015em]">
          <span className="mr-2 text-[var(--ds-text-3)]">{n}.</span>
          {s.heading}
        </h2>
        <span className="flex items-center gap-2">
          <ProvenanceTag p={s.provenance} />
          {!editing && !locked && (
            <button
              type="button"
              onClick={() => {
                setDraft(s.text);
                setEditing(true);
              }}
              className="rounded px-1.5 py-0.5 text-[12px] font-medium text-[var(--ds-text-3)] opacity-0 transition-opacity hover:bg-[var(--ds-subtle)] hover:text-[var(--ds-text)] focus-visible:opacity-100 group-hover:opacity-100"
            >
              Edit
            </button>
          )}
        </span>
      </div>
      {editing ? (
        <div className="mt-2">
          <textarea
            autoFocus
            rows={5}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            aria-label={`Edit section ${n}`}
            className="w-full rounded-md border border-[var(--ds-accent)] px-3 py-2 text-[15px] leading-relaxed outline-none"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => {
                onSave(draft.trim());
                setEditing(false);
              }}
              className="rounded-md bg-[var(--ds-accent)] px-3 py-1.5 text-[13px] font-medium text-white hover:bg-[var(--ds-accent-hover)]"
            >
              Save section
            </button>
            <button type="button" onClick={() => setEditing(false)} className="rounded-md px-3 py-1.5 text-[13px] text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={`mt-2 text-[15px] leading-[1.7] text-[var(--ds-text)] ${ai ? 'border-l-2 border-[#d9d5f3] pl-3' : ''}`}>{s.text}</p>
      )}
      {ai && !editing && <p className="mt-1.5 text-[12px] text-[var(--ds-text-3)]">{s.source} — check it before sign-off.</p>}
    </section>
  );
}

export default function DocumentPage({ doc, backHref, backLabel, client }: { doc: ComplianceDoc; backHref: string; backLabel: string; client: string }) {
  const toast = useToast();
  const [sections, setSections] = useState(doc.sections);
  const [versions, setVersions] = useState(doc.versions);
  const [status, setStatus] = useState<Status>('Draft');
  const approver = PEOPLE.find((p) => p.name === doc.approver);
  const drafted = sections.filter((s) => s.provenance === 'ai_suggested').length;

  const save = (i: number, text: string) => {
    if (!text || text === sections[i].text) return;
    setSections((ss) => ss.map((s, j) => (j === i ? { ...s, text, provenance: 'consultant_reviewed' } : s)));
    const v = versions[0].v + 1;
    setVersions((vs) => [{ v, at: formatIst(new Date()).replace(' IST', ''), who: 'Dharita Gada', note: `Section ${i + 1} edited — now consultant-reviewed` }, ...vs]);
    if (status !== 'Draft') setStatus('Draft');
    toast(`Saved as v${v}`, status === 'Draft' ? 'Section marked consultant-reviewed' : 'Edited after review — sign-off is needed again');
  };

  const advance = () => {
    const at = formatIst(new Date());
    if (status === 'Draft') {
      setStatus('Awaiting sign-off');
      toast(`Sent to ${doc.approver} for sign-off`, `${at} · in this mock nothing is emailed`);
    } else if (status === 'Awaiting sign-off') {
      setStatus('Signed off');
      toast(`Signed off by ${doc.approver}`, `${at} · simulated for the demo`);
    } else if (status === 'Signed off') {
      setStatus('Sent to the Board');
      toast('Intimation sent to the Data Protection Board', `${at} · recorded on ${doc.ref} with this version`);
    }
  };

  const action =
    status === 'Draft' ? `Send to ${doc.approver.split(' ')[0]} for sign-off`
      : status === 'Awaiting sign-off' ? `Simulate ${doc.approver.split(' ')[0]}’s sign-off`
        : status === 'Signed off' ? 'Send to the Board' : null;

  return (
    <div className="space-y-8">
      {/* Top bar: where you came from, who else is here, and the one action. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={backHref} className="text-[13px] font-medium text-[var(--ds-text-2)] hover:text-[var(--ds-text)]">
          ← {backLabel}
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[12px] text-[var(--ds-text-3)]" title={`${doc.approver} is viewing`}>
            <span className="flex -space-x-1.5">
              <span className="rounded-full ring-2 ring-white"><Avatar name={doc.approver} size={24} /></span>
              <span className="rounded-full ring-2 ring-white"><Avatar name="Dharita Gada" size={24} /></span>
            </span>
            {doc.approver.split(' ')[0]} is viewing
          </span>
          {status === 'Sent to the Board' && (
            <span className="text-[13px] text-[var(--ds-text-2)]">Sent — locked at v{versions[0].v}. A correction goes as a follow-up intimation.</span>
          )}
          {action && (
            <button
              type="button"
              onClick={advance}
              className="rounded-md bg-[var(--ds-accent)] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)]"
            >
              {action}
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <article className="min-w-0 max-w-[46rem]">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--ds-accent-weak)] text-[var(--ds-accent)]" aria-hidden>
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h4" />
            </svg>
          </div>
          <h1 className="ds-display text-[32px] text-[var(--ds-text)]">{doc.title}</h1>

          <dl className="mt-4 border-y border-[var(--ds-border)] py-2">
            <Prop label="Status"><span className={`rounded px-2 py-0.5 text-[13px] font-medium ${STATUS_TONE[status]}`}>{status}</span></Prop>
            <Prop label="Incident"><span className="ds-id text-[13px]">{doc.ref}</span> <span className="text-[var(--ds-text-2)]">· {doc.kind}</span></Prop>
            <Prop label="Required by"><CiteLink provision={doc.provision} /></Prop>
            <Prop label="Due"><span className="font-medium">{doc.due} IST</span> <When date={doc.due} className="text-[13px]" /></Prop>
            <Prop label="Drafted by"><Person name={doc.owner} role="DataSentry consultant" /></Prop>
            <Prop label="Signs off"><Person name={doc.approver} role={approver?.role} /></Prop>
            <Prop label="Version"><span className="tnum">v{versions[0].v}</span> <span className="text-[var(--ds-text-3)]">· {drafted ? `${drafted} section${drafted === 1 ? '' : 's'} still AI-drafted` : 'every section reviewed'}</span></Prop>
            <Prop label="Visible to"><span className="text-[var(--ds-text-2)]">DataSentry team and {client}</span></Prop>
          </dl>

          <div className="mt-8 space-y-8">
            {sections.map((s, i) => (
              <Section key={s.heading} n={i + 1} s={s} onSave={(t) => save(i, t)} locked={status === 'Sent to the Board'} />
            ))}
          </div>
        </article>

        <aside className="min-w-0 space-y-8 xl:border-l xl:border-[var(--ds-border)] xl:pl-8">
          <section>
            <h2 className="mb-3 text-[15px] font-semibold">Comments</h2>
            <Discussion refId={doc.ref} client={client} />
          </section>
          <section>
            <h2 className="mb-3 text-[15px] font-semibold">Versions</h2>
            <ol className="space-y-3 border-l border-[var(--ds-border)] pl-4">
              {versions.map((v) => (
                <li key={v.v} className="relative">
                  <span aria-hidden className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-[var(--ds-border-strong)] bg-[var(--ds-panel)]" />
                  <p className="text-[13px] font-medium">v{v.v}</p>
                  <p className="text-[13px] text-[var(--ds-text-2)]">{v.note}</p>
                  <p className="text-[11px] text-[var(--ds-text-3)]">{v.who} · {v.at}</p>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </div>
  );
}
