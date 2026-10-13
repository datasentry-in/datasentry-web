'use client';

import { useRef, useState } from 'react';
import { CHECK_IN, OWNERS } from '@/modules/app/dpdp/mock/data';
import { formatIst } from '@/modules/app/dpdp/time';
import { BasisTag, Box, Panel, ProvenanceTag, Tag } from '@/modules/app/ui/ui';

/**
 * The quarterly re-attestation, as the client's owner sees it. Six questions,
 * each shown against what the register says today. On submit the answers are
 * compared with the register: anything new becomes a proposed change for the
 * consultant to review — the model proposes, the rule engine and the consultant
 * decide. Nothing here reads a client system.
 */

type Answer = { yes: boolean | null; detail: string };
type Change = { title: string; detail: string; next: string; proposed: boolean };

const BASE_HEADCOUNT = 240;

function compare(answers: Record<string, Answer>, headcount: string): Change[] {
  const out: Change[] = [];
  const a = (id: string) => answers[id] ?? { yes: null, detail: '' };
  const quote = (s: string) => (s.trim() ? `“${s.trim()}”` : 'no detail given');

  if (a('tools').yes) out.push({ title: 'New system or processor', detail: quote(a('tools').detail), next: 'Proposed as a register row. The consultant confirms role, lawful basis and DPA status; rule R-12 then checks for a processor contract.', proposed: true });
  if (a('retired').yes) out.push({ title: 'System replaced or switched off', detail: quote(a('retired').detail), next: 'The register row is marked for review. Data still held there gets an erasure or retention task.', proposed: true });
  const n = Number(headcount);
  if (headcount && n !== BASE_HEADCOUNT) {
    const big = Math.abs(n - BASE_HEADCOUNT) / BASE_HEADCOUNT > 0.1;
    out.push({ title: 'Headcount changed', detail: `${BASE_HEADCOUNT} → ${n}`, next: big ? 'More than a 10% change: register scale and the Internal Committee position are reviewed.' : 'Scope updated.', proposed: false });
  }
  if (a('purposes').yes) out.push({ title: 'New purpose for existing data', detail: quote(a('purposes').detail), next: 'Lawful basis is “not determined” until reviewed — the rule engine raises a finding until it is.', proposed: true });
  if (a('clients').yes) out.push({ title: 'Client or contracting change', detail: quote(a('clients').detail), next: 'The s.17(1)(d) exemption is re-assessed for the affected delivery activity.', proposed: true });
  if (a('offplatform').yes) out.push({ title: 'Request or incident outside the platform', detail: quote(a('offplatform').detail), next: 'Logged now. Its SLA or 72-hour clock runs from when it was first received, not from today.', proposed: false });
  return out;
}

const TRACE = [
  'Reading your answers against the register (v4, confirmed 08 Oct 2026).',
  'Matching named tools against the 11 systems and 10 processors on record.',
  'Checking new purposes and client changes against the rule set (v1.4).',
];

export default function CheckInForm() {
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [headcount, setHeadcount] = useState('');
  const [phase, setPhase] = useState<'form' | 'checking' | 'done'>('form');
  const [shown, setShown] = useState(0);
  const [at, setAt] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const results = useRef<HTMLDivElement>(null);

  const set = (id: string, patch: Partial<Answer>) =>
    setAnswers((s) => ({ ...s, [id]: { ...(s[id] ?? { yes: null, detail: '' }), ...patch } }));

  const answered = CHECK_IN.questions.filter((q) => (q.kind === 'number' ? headcount !== '' : answers[q.id]?.yes != null)).length;
  const ready = answered === CHECK_IN.questions.length;

  const submit = () => {
    setPhase('checking');
    setShown(0);
    setAt(formatIst(new Date()));
    TRACE.forEach((_, i) => timers.current.push(setTimeout(() => setShown(i + 1), 450 * (i + 1))));
    timers.current.push(setTimeout(() => setPhase('done'), 450 * (TRACE.length + 1)));
    // The results land below a long form — bring them into view as the comparison starts.
    timers.current.push(setTimeout(() => results.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60));
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setAnswers({});
    setHeadcount('');
    setPhase('form');
  };

  const changes = phase === 'done' ? compare(answers, headcount) : [];
  const owner = OWNERS[CHECK_IN.sentTo] ?? CHECK_IN.sentTo;

  return (
    <div className="space-y-5">
      <Panel
        title={`${CHECK_IN.label} — as ${owner} sees it`}
        sub={`Sent ${CHECK_IN.sentOn} to the ${CHECK_IN.sentTo} · due ${CHECK_IN.due}`}
        right={<Tag tone={ready ? 'ok' : 'info'}>{answered}/{CHECK_IN.questions.length} answered</Tag>}
        flush
      >
        <ol>
          {CHECK_IN.questions.map((q, i) => {
            const a = answers[q.id] ?? { yes: null, detail: '' };
            return (
              <li key={q.id} className="border-b border-[var(--ds-border)] px-4 py-4 last:border-b-0 sm:px-5">
                <div className="flex gap-3">
                  <span className="ds-figure mt-0.5 text-[11px] text-[var(--ds-text-3)]">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium leading-snug tracking-[-0.01em]">{q.text}</p>
                    <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">
                      <span className="ds-meta mr-1.5">Register says</span>
                      {q.register}
                    </p>
                    <div className="mt-2.5">
                      {q.kind === 'number' ? (
                        <input
                          type="number"
                          inputMode="numeric"
                          disabled={phase !== 'form'}
                          value={headcount}
                          placeholder={q.placeholder}
                          onChange={(e) => setHeadcount(e.target.value)}
                          className="ds-figure h-9 w-40 rounded-md border border-[var(--ds-border-strong)] px-3 text-[13px] outline-none focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)] disabled:bg-[var(--ds-subtle)]"
                        />
                      ) : (
                        <div className="space-y-2">
                          <div className="flex gap-1.5" role="radiogroup" aria-label={q.text}>
                            {[
                              { v: false, l: 'No' },
                              { v: true, l: 'Yes' },
                            ].map((o) => (
                              <button
                                key={o.l}
                                type="button"
                                role="radio"
                                aria-checked={a.yes === o.v}
                                disabled={phase !== 'form'}
                                onClick={() => set(q.id, { yes: o.v })}
                                className={`min-w-14 rounded-md border px-3 py-1.5 text-[13px] transition-colors disabled:cursor-default ${
                                  a.yes === o.v
                                    ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                                    : 'border-[var(--ds-border-strong)] bg-white text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
                                }`}
                              >
                                {o.l}
                              </button>
                            ))}
                          </div>
                          {a.yes && (
                            <input
                              disabled={phase !== 'form'}
                              value={a.detail}
                              placeholder={q.placeholder}
                              onChange={(e) => set(q.id, { detail: e.target.value })}
                              className="h-9 w-full rounded-md border border-[var(--ds-border-strong)] px-3 text-[13px] outline-none placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:shadow-[0_0_0_3px_var(--ds-accent-weak)] disabled:bg-[var(--ds-subtle)]"
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
        {phase === 'form' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ds-border)] px-4 py-3.5 sm:px-5">
            <p className="text-[12px] text-[var(--ds-text-2)]">Submitting records these answers as declared by {owner}, with the time.</p>
            <button
              type="button"
              disabled={!ready}
              onClick={submit}
              className="rounded-md bg-[var(--ds-accent)] px-3.5 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)] disabled:cursor-not-allowed disabled:bg-[var(--ds-subtle-2)] disabled:text-[var(--ds-text-3)]"
            >
              Submit check-in
            </button>
          </div>
        )}
      </Panel>

      {phase !== 'form' && (
        <Box>
        <div ref={results} className="ds-bar ds-bar-accent scroll-mt-24">
          <p className="text-[12px] font-medium text-[var(--ds-accent-hover)]">
            {phase === 'checking' ? 'Comparing with the register…' : 'Compared with the register'}
          </p>
          <ul className="mt-2 space-y-1">
            {TRACE.slice(0, phase === 'done' ? TRACE.length : shown).map((l) => (
              <li key={l} className="flex gap-2 text-[13px]">
                <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--ds-accent)]" aria-hidden />
                {l}
              </li>
            ))}
          </ul>
        </div>
        </Box>
      )}

      {phase === 'done' && (
        <Panel
          title={changes.length ? `${changes.length} change${changes.length === 1 ? '' : 's'} flagged for review` : 'No changes — register confirmed'}
          sub={`Declared by ${owner}, ${CHECK_IN.sentTo} · ${at}`}
          right={
            <button type="button" onClick={restart} className="text-[13px] font-medium text-[var(--ds-accent-hover)] hover:underline">
              Answer again
            </button>
          }
          flush
        >
          {changes.length === 0 ? (
            <p className="px-4 py-4 text-[13px] text-[var(--ds-text-2)] sm:px-5">
              The register stands for another quarter. This check-in is filed as {owner}&rsquo;s attestation that nothing changed.
            </p>
          ) : (
            <ul>
              {changes.map((c) => (
                <li key={c.title} className="border-b border-[var(--ds-border)] px-4 py-3.5 last:border-b-0 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[13px] font-semibold tracking-[-0.01em]">{c.title}</p>
                    <BasisTag b="declared" />
                    {c.proposed && <ProvenanceTag p="ai_suggested" />}
                  </div>
                  <p className="mt-1 text-[13px]">{c.detail}</p>
                  <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">{c.next}</p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}
    </div>
  );
}
