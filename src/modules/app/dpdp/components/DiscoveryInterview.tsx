'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Org } from '@/modules/app/dpdp/mock/data';
import {
  CALL_META, SECTION_1, buildSection2, buildSection3, fireRules, proposeActivities,
} from '@/modules/app/dpdp/mock/interview';
import type { Answers, Question, Section } from '@/modules/app/dpdp/mock/interview';
import { demoPath } from '@/modules/app/dpdp/routes';
import { Box, Button, Card, CiteLink, DemoNote, Panel, ProvenanceTag, Tag } from '@/modules/app/ui/ui';

/* --------------------------------------------------------------- controls */

type Update = Answers[string] | ((prev: Answers[string] | undefined) => Answers[string]);

function Field({ q, value, onChange }: { q: Question; value: Answers[string] | undefined; onChange: (v: Update) => void }) {
  const input =
    'w-full rounded-md border border-[var(--ds-border-strong)] bg-[var(--ds-panel)] px-3 py-2 text-[13px] text-[var(--ds-text)] outline-none transition-colors placeholder:text-[var(--ds-text-3)] focus:border-[var(--ds-accent)] focus:ring-2 focus:ring-[var(--ds-accent-weak)]';

  if (q.kind === 'text') {
    return (
      <textarea
        rows={3}
        className={input}
        placeholder={q.placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  if (q.kind === 'number') {
    return (
      <input
        type="number"
        inputMode="numeric"
        className={`${input} tnum max-w-[12rem]`}
        placeholder={q.placeholder}
        value={typeof value === 'string' ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  const selected = Array.isArray(value) ? value : typeof value === 'string' ? [value] : [];
  // Resolve against the previous state rather than the rendered value: two
  // clicks inside one render pass would otherwise both read the same list and
  // the first selection would be lost.
  const toggle = (v: string) => {
    if (q.kind === 'single') return onChange(v);
    return onChange((prev) => {
      const cur = Array.isArray(prev) ? prev : [];
      return cur.includes(v) ? cur.filter((s) => s !== v) : [...cur, v];
    });
  };

  return (
    <div className="flex flex-wrap gap-1.5">
      {q.options?.map((o) => {
        const on = selected.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => toggle(o.value)}
            aria-pressed={on}
            title={o.hint}
            className={`rounded-md border px-2.5 py-1.5 text-left text-[13px] transition-colors ${
              on
                ? 'border-[var(--ds-accent)] bg-[var(--ds-accent-weak)] font-medium text-[var(--ds-accent-hover)]'
                : 'border-[var(--ds-border-strong)] bg-[var(--ds-panel)] text-[var(--ds-text-2)] hover:bg-[var(--ds-subtle)]'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2 w-2 shrink-0 ${q.kind === 'single' ? 'rounded-full' : 'rounded-sm'} border ${
                  on ? 'border-[var(--ds-accent)] bg-[var(--ds-accent)]' : 'border-[var(--ds-border-strong)]'
                }`}
                aria-hidden
              />
              {o.label}
            </span>
            {o.hint && <span className="mt-0.5 block text-[11px] text-[var(--ds-text-3)]">{o.hint}</span>}
          </button>
        );
      })}
    </div>
  );
}

function QuestionBlock({
  q, n, value, onChange,
}: { q: Question; n: number; value: Answers[string] | undefined; onChange: (v: Update) => void }) {
  const answered =
    (typeof value === 'string' && value.trim() !== '') || (Array.isArray(value) && value.length > 0);
  return (
    <li className="border-b border-[var(--ds-border)] p-4 last:border-b-0 sm:p-5">
      <div className="flex gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-medium ${
            answered ? 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]' : 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-3)]'
          }`}
        >
          {answered ? '✓' : n}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium leading-snug tracking-[-0.01em]">{q.text}</p>

          {q.because && (
            <p className="mt-1 inline-flex flex-wrap items-center gap-1 rounded border border-[var(--ds-accent-border)] bg-[var(--ds-accent-weak)] px-1.5 py-px text-[11px] text-[var(--ds-accent-hover)]">
              <Sparkle />
              Asked because {q.because}
            </p>
          )}

          <p className="mt-1.5 border-l-2 border-[var(--ds-border-strong)] pl-2.5 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
            <span className="font-medium text-[var(--ds-text)]">Why this is asked — </span>
            {q.why}
          </p>

          <div className="mt-3">
            <Field q={q} value={value} onChange={onChange} />
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {q.populates && <Tag tone="info">Fills: {q.populates}</Tag>}
            {q.provision && <CiteLink provision={q.provision} />}
            <Tag>
              {q.source === 'pack' ? 'ITES domain pack' : q.source === 'proposed' ? 'Proposed from your answer' : 'Generated follow-up'}
            </Tag>
          </div>
        </div>
      </div>
    </li>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden fill="currentColor">
      <path d="M6 0l1.2 3.4L10.6 4.6 7.2 5.8 6 9.2 4.8 5.8 1.4 4.6 4.8 3.4z" />
      <path d="M10 7.6l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4L8.1 9.5l1.4-.5z" opacity="0.6" />
    </svg>
  );
}

/* ------------------------------------------------------- reasoning trace */

/** Reveals the trace a line at a time, so the generation step is legible. */
function Trace({ lines, done, onDone }: { lines: string[]; done: boolean; onDone: () => void }) {
  const [shown, setShown] = useState(0);
  const finished = useRef(false);

  useEffect(() => {
    if (done) return;
    if (shown >= lines.length) {
      if (!finished.current) {
        finished.current = true;
        const t = setTimeout(onDone, 420);
        return () => clearTimeout(t);
      }
      return;
    }
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 260 : 520);
    return () => clearTimeout(t);
  }, [shown, lines.length, done, onDone]);

  const visible = done ? lines : lines.slice(0, shown);

  return (
    <Box>
    <div className="ds-bar ds-bar-accent">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[12px] font-medium text-[var(--ds-accent-hover)]">
          <span className={done ? '' : 'animate-pulse'}>
            <Sparkle />
          </span>
          {done ? 'Question engine — how this section was chosen' : 'Question engine is reading your answers…'}
        </p>
        <p className="ds-figure text-[11px] text-[var(--ds-text-2)]">
          {CALL_META.model} · effort {CALL_META.effort} · cached prefix {CALL_META.cachedPrefix}
        </p>
      </div>

      <ul className="mt-2.5 space-y-1.5">
        {visible.map((l) => (
          <li key={l} className="flex gap-2 text-[13px] leading-relaxed text-[var(--ds-text)]">
            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[var(--ds-accent)]" aria-hidden />
            {l}
          </li>
        ))}
        {!done && shown < lines.length && (
          <li className="flex gap-2 text-[13px] text-[var(--ds-text-3)]">
            <span className="mt-[7px] h-1 w-1 shrink-0 animate-pulse rounded-full bg-[var(--ds-text-3)]" aria-hidden />
            thinking…
          </li>
        )}
      </ul>
    </div>
    </Box>
  );
}

/* ------------------------------------------------------------- the screen */

type Phase = 's1' | 'gen2' | 's2' | 'gen3' | 's3' | 'done';

export default function DiscoveryInterview({ org }: { org: Org }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>('s1');
  const [section2, setSection2] = useState<Section | null>(null);
  const [section3, setSection3] = useState<Section | null>(null);
  const [showSkipped, setShowSkipped] = useState(false);

  const set = (id: string) => (v: Update) =>
    setAnswers((a) => ({ ...a, [id]: typeof v === 'function' ? v(a[id]) : v }));
  const answeredCount = (qs: Question[]) =>
    qs.filter((q) => {
      const v = answers[q.id];
      return (typeof v === 'string' && v.trim() !== '') || (Array.isArray(v) && v.length > 0);
    }).length;

  const s1Done = answeredCount(SECTION_1) >= 4 && Boolean(answers.systems) && Boolean(answers.offshore);
  const s2Done = section2 ? answeredCount(section2.questions) >= Math.ceil(section2.questions.length / 2) : false;

  const proposed = useMemo(() => proposeActivities(answers), [answers]);
  const rules = useMemo(() => fireRules(answers), [answers]);
  const findings = rules.filter((r) => r.kind === 'finding');
  const exemptions = rules.filter((r) => r.kind === 'exemption');

  const generate2 = () => {
    setSection2(buildSection2(answers));
    setPhase('gen2');
  };
  const generate3 = () => {
    setSection3(buildSection3(answers));
    setPhase('gen3');
  };

  const reset = () => {
    setAnswers({});
    setSection2(null);
    setSection3(null);
    setShowSkipped(false);
    setPhase('s1');
  };

  const totalAsked = SECTION_1.length + (section2?.questions.length ?? 0) + (section3?.questions.length ?? 0);

  return (
    <div className="space-y-5">
      {/* Progress rail */}
      <Panel flush>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-5">
          {[
            { n: 1, label: 'Company & scope', active: phase === 's1', done: phase !== 's1' },
            { n: 2, label: 'Generated by the engine', active: phase === 'gen2' || phase === 's2', done: ['gen3', 's3', 'done'].includes(phase) },
            { n: 3, label: 'Targeted follow-ups', active: phase === 'gen3' || phase === 's3', done: phase === 'done' },
            { n: 4, label: 'Register draft', active: phase === 'done', done: false },
          ].map((s) => (
            <div key={s.n} className="flex items-center gap-2">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium ${
                  s.done
                    ? 'bg-[var(--ds-ok-weak)] text-[var(--ds-ok)]'
                    : s.active
                      ? 'bg-[var(--ds-accent)] text-white'
                      : 'bg-[var(--ds-subtle-2)] text-[var(--ds-text-3)]'
                }`}
              >
                {s.done ? '✓' : s.n}
              </span>
              <span className={`text-[13px] ${s.active ? 'font-medium' : 'text-[var(--ds-text-2)]'}`}>{s.label}</span>
            </div>
          ))}
          <span className="ml-auto text-[12px] text-[var(--ds-text-3)]">
            {totalAsked} questions asked so far · nothing is pre-filled
          </span>
        </div>
      </Panel>

      {/* Section 1 */}
      <Panel
        title="Section 1 — Company & scope"
        sub="Six seed questions. Everything after this section is chosen from what you answer here."
        right={<Tag tone="info">{answeredCount(SECTION_1)}/{SECTION_1.length} answered</Tag>}
        flush
      >
        <ul>
          {SECTION_1.map((q, i) => (
            <QuestionBlock key={q.id} q={q} n={i + 1} value={answers[q.id]} onChange={set(q.id)} />
          ))}
        </ul>
        {phase === 's1' && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ds-border)] p-4 sm:p-5">
            <p className="text-[12px] text-[var(--ds-text-2)]">
              {s1Done
                ? 'Enough to work with. The engine will pick the next section from these answers.'
                : 'Answer the systems and offshore questions at least — they drive most of the branching.'}
            </p>
            <button
              type="button"
              disabled={!s1Done}
              onClick={generate2}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                s1Done
                  ? 'border-transparent bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]'
                  : 'cursor-not-allowed border-[var(--ds-border)] bg-[var(--ds-subtle)] text-[var(--ds-text-3)]'
              }`}
            >
              <Sparkle />
              Generate section 2
            </button>
          </div>
        )}
      </Panel>

      {/* What section 1 already produced */}
      {phase !== 's1' && proposed.length > 0 && (
        <Panel
          title="Register draft so far"
          sub="Proposed by the model from section 1 — every row is AI suggested until a consultant reviews it"
          right={<ProvenanceTag p="ai_suggested" />}
          flush
        >
          <ul>
            {proposed.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5"
              >
                <span className="ds-figure w-12 shrink-0 text-[11px] text-[var(--ds-text-3)]">{r.id}</span>
                <span className="min-w-0 flex-1 text-[13px] font-medium">{r.name}</span>
                <span className="text-[12px] text-[var(--ds-text-2)]">{r.principals}</span>
                {r.source === 'proposed' && <Tag tone="watch">Not in the pack</Tag>}
                <span className="w-full text-[12px] text-[var(--ds-text-3)] sm:w-auto sm:basis-full sm:pl-[3.75rem]">
                  {r.note}
                </span>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--ds-border)] p-4 sm:p-5">
            <DemoNote>
              The model proposes rows and fills fields. It never decides role or lawful basis — that is the rule
              engine&rsquo;s job, which is what makes each line in the eventual gap report explainable to an auditor.
            </DemoNote>
          </div>
        </Panel>
      )}

      {/* Generation step 2 */}
      {(phase === 'gen2' || phase === 's2' || phase === 'gen3' || phase === 's3' || phase === 'done') && section2 && (
        <Trace lines={section2.trace} done={phase !== 'gen2'} onDone={() => setPhase('s2')} />
      )}

      {/* Section 2 */}
      {section2 && phase !== 'gen2' && (
        <Panel
          title={`Section 2 — ${section2.name}`}
          sub="Generated from your section 1 answers. A different answer there produces a different section here."
          right={<Tag tone="info">{answeredCount(section2.questions)}/{section2.questions.length} answered</Tag>}
          flush
        >
          <ul>
            {section2.questions.map((q, i) => (
              <QuestionBlock key={q.id} q={q} n={i + 1} value={answers[q.id]} onChange={set(q.id)} />
            ))}
          </ul>

          {section2.skipped.length > 0 && (
            <div className="border-t border-[var(--ds-border)] px-4 py-3 sm:px-5">
              <button
                type="button"
                onClick={() => setShowSkipped(!showSkipped)}
                className="text-[13px] font-medium text-[var(--ds-accent-hover)]"
                aria-expanded={showSkipped}
              >
                {showSkipped ? 'Hide' : 'Show'} the {section2.skipped.length} questions the engine decided not to ask
              </button>
              {showSkipped && (
                <ul className="mt-2 space-y-1.5">
                  {section2.skipped.map((s) => (
                    <li key={s.text} className="text-[12px] leading-snug text-[var(--ds-text-3)]">
                      <span className="line-through">{s.text}</span>
                      <span className="block text-[12px]">Skipped because {s.reason}.</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {phase === 's2' && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ds-border)] p-4 sm:p-5">
              <p className="text-[12px] text-[var(--ds-text-2)]">
                {s2Done ? 'The rule engine has something to work with.' : 'Answer a few of these to see the follow-ups change.'}
              </p>
              <button
                type="button"
                disabled={!s2Done}
                onClick={generate3}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  s2Done
                    ? 'border-transparent bg-[var(--ds-accent)] text-white hover:bg-[var(--ds-accent-hover)]'
                    : 'cursor-not-allowed border-[var(--ds-border)] bg-[var(--ds-subtle)] text-[var(--ds-text-3)]'
                }`}
              >
                <Sparkle />
                Generate section 3
              </button>
            </div>
          )}
        </Panel>
      )}

      {/* Live rule-engine output */}
      {rules.length > 0 && phase !== 's1' && (
        <Panel
          title="Rule engine"
          sub="Deterministic, versioned, run over the structured answers — not model output"
          right={
            <div className="flex flex-wrap gap-1.5">
              {exemptions.length > 0 && <Tag tone="ok">{exemptions.length} exemption</Tag>}
              <Tag tone="alert">{findings.length} finding{findings.length === 1 ? '' : 's'}</Tag>
            </div>
          }
          flush
        >
          <ul>
            {rules.map((r) => (
              <li key={r.rule} className="border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 text-[13px] font-medium tracking-[-0.01em]">{r.title}</p>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <CiteLink provision={r.provision} />
                    <Tag>{r.rule}</Tag>
                    <Tag tone={r.kind === 'finding' ? 'alert' : r.kind === 'exemption' ? 'ok' : 'watch'}>
                      {r.kind === 'finding' ? 'Finding' : r.kind === 'exemption' ? 'Exemption' : 'Note'}
                    </Tag>
                  </div>
                </div>
                <p className="mt-1 max-w-3xl text-[13px] leading-relaxed text-[var(--ds-text-2)]">{r.detail}</p>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* Generation step 3 */}
      {(phase === 'gen3' || phase === 's3' || phase === 'done') && section3 && (
        <Trace lines={section3.trace} done={phase !== 'gen3'} onDone={() => setPhase('s3')} />
      )}

      {/* Section 3 */}
      {section3 && (phase === 's3' || phase === 'done') && (
        <Panel
          title={`Section 3 — ${section3.name}`}
          sub="Each of these exists because of a specific answer you gave in section 2"
          right={<Tag tone="info">{answeredCount(section3.questions)}/{section3.questions.length} answered</Tag>}
          flush
        >
          <ul>
            {section3.questions.map((q, i) => (
              <QuestionBlock key={q.id} q={q} n={i + 1} value={answers[q.id]} onChange={set(q.id)} />
            ))}
          </ul>
          {phase === 's3' && (
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--ds-border)] p-4 sm:p-5">
              <p className="text-[12px] text-[var(--ds-text-2)]">
                In the product the interview continues to section 7. This mock stops here.
              </p>
              <button
                type="button"
                onClick={() => setPhase('done')}
                className="inline-flex items-center gap-1.5 rounded-md border border-transparent bg-[var(--ds-accent)] px-3 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[var(--ds-accent-hover)]"
              >
                Close the interview
              </button>
            </div>
          )}
        </Panel>
      )}

      {/* Wrap-up */}
      {phase === 'done' && (
        <Panel title="What this produced" sub={`${org.name} · discovery, phase 1 of 3`}>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['Activities proposed', String(proposed.length), 'all AI suggested, none reviewed'],
              ['Exemptions identified', String(exemptions.length), 's.17(1)(d) candidates'],
              ['Findings raised', String(findings.length), 'each citing a provision'],
            ].map(([k, v, note]) => (
              <Card key={k} tone="subtle">
                <p className="text-[12px] font-medium text-[var(--ds-text-2)]">{k}</p>
                <p className="ds-figure mt-1 text-[26px] leading-none tracking-[-0.03em]">{v}</p>
                <p className="mt-1 text-[12px] text-[var(--ds-text-3)]">{note}</p>
              </Card>
            ))}
          </div>
          <div className="mt-4 space-y-3">
            <DemoNote>
              Not one field here is ready for an evidence pack. Every row carries the AI suggested chip until a
              consultant reviews it and the client confirms it — that progression is the audit trail and the
              professional-liability control, and it is the reason the generated pack is defensible at all.
            </DemoNote>
            <div className="flex flex-wrap items-center gap-3">
              <Button as="link" href={demoPath('northstar', 'ropa')}>
                See a completed register
              </Button>
              <button type="button" onClick={reset} className="text-[13px] font-medium text-[var(--ds-accent-hover)]">
                Run the interview again with different answers
              </button>
            </div>
          </div>
        </Panel>
      )}
    </div>
  );
}
