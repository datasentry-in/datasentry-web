'use client';

import { useState } from 'react';
import { CONSULTANT, WALKTHROUGH, WALKTHROUGH_AGENDA } from '@/modules/app/dpdp/mock/data';
import { formatIst } from '@/modules/app/dpdp/time';
import { BasisTag, Panel, Tag } from '@/modules/app/ui/ui';

/**
 * The consultant's side of a walkthrough: the register generates an agenda —
 * per system, what to look at and what the register currently says — and the
 * consultant records what the client shows on screen. Nothing is exported.
 */

type Result = 'matches' | 'differs' | 'new';
type Saved = { observed: string; result: Result; at: string };

const RESULTS: { value: Result; label: string }[] = [
  { value: 'matches', label: 'Matches the register' },
  { value: 'differs', label: 'Differs' },
  { value: 'new', label: 'Something new' },
];

const resultTag = (r: Result) =>
  r === 'matches' ? <Tag tone="ok">Matches</Tag> : r === 'differs' ? <Tag tone="watch">Differs</Tag> : <Tag tone="info">New</Tag>;

function consequence(r: Result, finding?: string) {
  if (r === 'matches') return finding ? `Matches — ${finding} can be closed once reviewed.` : 'Register confirmed.';
  if (r === 'differs') return finding ? `${finding} stays open; the rule engine re-runs on save.` : 'The register is corrected; the rule engine re-runs on save.';
  return 'Added to the register as an observed fact; the rule engine re-runs on save.';
}

export default function WalkthroughAgenda() {
  const [open, setOpen] = useState<string | null>(WALKTHROUGH_AGENDA[0].id);
  const [drafts, setDrafts] = useState<Record<string, { observed: string; result: Result | null }>>({});
  const [saved, setSaved] = useState<Record<string, Saved>>({});

  const draft = (id: string) => drafts[id] ?? { observed: '', result: null };
  const setDraft = (id: string, patch: Partial<{ observed: string; result: Result | null }>) =>
    setDrafts((d) => ({ ...d, [id]: { ...draft(id), ...patch } }));

  const save = (id: string) => {
    const d = draft(id);
    if (!d.observed.trim() || !d.result) return;
    setSaved((s) => ({ ...s, [id]: { observed: d.observed.trim(), result: d.result as Result, at: formatIst(new Date()) } }));
    const next = WALKTHROUGH_AGENDA.find((a) => a.id !== id && !saved[a.id]);
    setOpen(next ? next.id : null);
  };

  const undo = (id: string) => {
    setSaved((s) => {
      const rest = { ...s };
      delete rest[id];
      return rest;
    });
    setOpen(id);
  };

  const done = Object.keys(saved).length;
  const field =
    'h-9 w-full rounded-md border border-[var(--ds-border-strong)] bg-white px-3 text-[13px] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)]';

  return (
    <Panel
      title={`Next walkthrough — ${WALKTHROUGH.next}`}
      sub="Agenda generated from the register. Try it: record what the client would show you on screen."
      right={<Tag tone={done === WALKTHROUGH_AGENDA.length ? 'ok' : 'info'}>{done}/{WALKTHROUGH_AGENDA.length} recorded</Tag>}
      flush
    >
      <ol>
        {WALKTHROUGH_AGENDA.map((a, i) => {
          const s = saved[a.id];
          const isOpen = open === a.id && !s;
          const d = draft(a.id);
          return (
            <li key={a.id} className={`border-b border-[var(--ds-border)] last:border-b-0 ${isOpen ? 'bg-[var(--ds-subtle)]' : ''}`}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : a.id)}
                className="grid w-full gap-x-6 gap-y-1 px-4 py-3 text-left sm:px-5 lg:grid-cols-[1.6rem_minmax(0,1fr)_minmax(0,1.1fr)_14rem] lg:items-center"
                aria-expanded={isOpen}
              >
                <span className="ds-figure text-[11px] text-[var(--ds-text-3)]">{String(i + 1).padStart(2, '0')}</span>
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold tracking-[-0.01em]">{a.system}</span>
                  <span className="block text-[13px] text-[var(--ds-text-2)]">{a.looked}</span>
                </span>
                <span className="min-w-0">
                  <span className="ds-meta block text-[var(--ds-text-3)]">Register says</span>
                  <span className="block text-[13px] text-[var(--ds-text-2)]">{a.register}</span>
                </span>
                <span className="flex flex-wrap items-center gap-1.5 lg:justify-end">
                  {a.finding && <Tag>{a.finding}</Tag>}
                  {s ? (
                    <>
                      <BasisTag b="observed" />
                      {resultTag(s.result)}
                    </>
                  ) : (
                    <Tag tone="plain">{a.why}</Tag>
                  )}
                </span>
              </button>

              {s && (
                <div className="px-4 pb-3 sm:px-5 lg:pl-[calc(1.6rem+2.75rem)]">
                  <p className="text-[13px]">
                    <span className="text-[var(--ds-text-3)]">Observed — </span>
                    {s.observed}
                  </p>
                  <p className="mt-0.5 text-[12px] text-[var(--ds-text-3)]">
                    {consequence(s.result, a.finding)} · by {CONSULTANT.name}, {s.at} ·{' '}
                    <button type="button" onClick={() => undo(a.id)} className="font-medium text-[var(--ds-accent-hover)] hover:underline">
                      Undo
                    </button>
                  </p>
                </div>
              )}

              {isOpen && (
                <div className="space-y-3 px-4 pb-4 sm:px-5 lg:pl-[calc(1.6rem+2.75rem)]">
                  <label className="block">
                    <span className="mb-1 block text-[12px] font-medium">What the client shows you</span>
                    <input
                      className={field}
                      value={d.observed}
                      placeholder="e.g. 212 fewer records; oldest now created Apr 2026"
                      onChange={(e) => setDraft(a.id, { observed: e.target.value })}
                    />
                  </label>
                  <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Compared with the register">
                    {RESULTS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        role="radio"
                        aria-checked={d.result === r.value}
                        onClick={() => setDraft(a.id, { result: r.value })}
                        className={`rounded-md border px-2.5 py-1.5 text-[13px] transition-colors ${
                          d.result === r.value
                            ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                            : 'border-[var(--ds-border-strong)] bg-white text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => save(a.id)}
                      disabled={!d.observed.trim() || !d.result}
                      className="rounded-md bg-[var(--ds-accent)] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
                    >
                      Record observation
                    </button>
                    <span className="text-[12px] text-[var(--ds-text-3)]">
                      Saved as observed by {CONSULTANT.name}, with the time. No file, no credential.
                    </span>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}
