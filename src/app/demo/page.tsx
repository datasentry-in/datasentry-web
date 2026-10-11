import Link from 'next/link';
import { DEADLINE, ORGS } from './_data/mock';
import { DemoNote, Panel, Stat, Tag } from './_components/ui';

function daysTo(iso: string) {
  const ms = new Date(iso).getTime() - new Date('2026-10-11').getTime();
  return Math.ceil(ms / 86_400_000);
}

export default function Portfolio() {
  const totalHigh = ORGS.reduce((n, o) => n + o.openGaps.high, 0);
  const totalDsr = ORGS.reduce((n, o) => n + o.dsrOpen, 0);
  const breaching = ORGS.reduce((n, o) => n + o.dsrBreaching, 0);
  const incidents = ORGS.reduce((n, o) => n + o.incidentOpen, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          Consultant console
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Client portfolio</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          One login across every engagement. This is the screen a consultant opens on a Monday morning.
        </p>
      </div>

      {/* The clock everyone is working against */}
      <div className="border-[3px] border-black bg-background-dark p-4 shadow-[6px_6px_0px_0px_#000] sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase text-white">{DEADLINE.label}</p>
            <p className="font-display text-3xl font-bold uppercase text-white sm:text-4xl">
              {daysTo(DEADLINE.date)} days
            </p>
            <p className="font-mono text-[11px] text-neutral-400">
              13 May 2027 · {DEADLINE.rulesNote}
            </p>
          </div>
          <div className="border-2 border-white px-3 py-2">
            <p className="font-mono text-[10px] font-bold uppercase text-white">Next dated milestone</p>
            <p className="font-mono text-xs text-white">
              Rule 4 — Consent Manager framework · 13 Nov 2026 ({daysTo(DEADLINE.consentManager)} days)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Clients engaged" value={ORGS.length} note="2 in assessment, 1 in discovery" />
        <Stat label="High-severity gaps" value={totalHigh} note="across all clients" tone="bad" />
        <Stat label="Open DSRs" value={totalDsr} note={`${breaching} past SLA`} tone={breaching ? 'bad' : 'warn'} />
        <Stat label="Open incidents" value={incidents} note="72-hour clock running" tone="bad" />
      </div>

      <Panel title="Engagements" sub="Readiness score is recomputed whenever the register or evidence changes">
        <div className="space-y-3">
          {ORGS.map((o) => {
            const tone =
              o.score < 40 ? 'bg-black text-white' : o.score < 70 ? 'bg-neutral-500 text-white' : 'bg-neutral-200 text-black';
            return (
              <Link
                key={o.slug}
                href={`/demo/${o.slug}`}
                className="block border-[3px] border-black bg-white p-3 transition-all hover:shadow-[6px_6px_0px_0px_#a3a3a3] sm:p-4"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div className={`shrink-0 border-2 border-black px-3 py-2 text-center ${tone}`}>
                    <p className="font-display text-2xl font-bold leading-none">{o.score}</p>
                    <p className="font-mono text-[9px] font-bold uppercase">score</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-sm font-bold uppercase leading-tight sm:text-base">{o.name}</h3>
                    <p className="font-mono text-[11px] text-neutral-600">
                      {o.sector} · {o.headcount} employees · {o.locations}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Tag tone="alert">{o.openGaps.high} high</Tag>
                      <Tag tone="watch">{o.openGaps.medium} medium</Tag>
                      <Tag>{o.openGaps.low} low</Tag>
                      <Tag tone="info">{o.activities} activities</Tag>
                      {o.exemptActivities > 0 && <Tag tone="ok">{o.exemptActivities} exempt s.17(1)(d)</Tag>}
                      {o.dsrOpen > 0 && <Tag tone="dark">{o.dsrOpen} open DSR</Tag>}
                      {o.incidentOpen > 0 && <Tag tone="alert">incident open</Tag>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-mono text-[10px] uppercase text-neutral-500">Last reviewed</p>
                    <p className="font-mono text-[11px] font-bold">{o.lastReview}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-4">
          <DemoNote>
            Northstar BPO is the fully worked example — open it to see every module populated. The other two
            engagements carry realistic headline numbers only.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
