import Link from 'next/link';
import { ORGS } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import DeadlineCountdown from '@/modules/app/dpdp/components/DeadlineCountdown';
import { DemoNote, PageHeader, Panel, Stat, Tag } from '@/modules/app/ui/ui';

export default function Portfolio() {
  const totalHigh = ORGS.reduce((n, o) => n + o.openGaps.high, 0);
  const totalDsr = ORGS.reduce((n, o) => n + o.dsrOpen, 0);
  const breaching = ORGS.reduce((n, o) => n + o.dsrBreaching, 0);
  const incidents = ORGS.reduce((n, o) => n + o.incidentOpen, 0);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Client portfolio"
        sub={`${ORGS.length} engagements, ${totalHigh} high-severity gaps across them.`}
      />

      {/* The clock everyone is working against */}
      <DeadlineCountdown />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="Clients engaged" value={ORGS.length} note="2 in assessment, 1 in discovery" />
        <Stat label="High-severity gaps" value={totalHigh} note="across all clients" tone="bad" />
        <Stat label="Open DSRs" value={totalDsr} note={`${breaching} past SLA`} tone={breaching ? 'bad' : 'warn'} />
        <Stat label="Open incidents" value={incidents} note="72-hour clock running" tone="bad" />
      </div>

      <Panel
        title="Engagements"
        sub="Readiness score is recomputed whenever the register or evidence changes"
        flush
      >
        <ul>
          {ORGS.map((o) => {
            const fg =
              o.score < 40 ? 'var(--ds-danger)' : o.score < 70 ? 'var(--ds-warn)' : 'var(--ds-ok)';
            return (
              <li key={o.slug} className="border-b border-[var(--ds-border)] last:border-b-0">
                <Link
                  href={demoPath(o.slug)}
                  className="group flex flex-wrap items-start gap-3 px-4 py-3.5 transition-colors hover:bg-[var(--ds-subtle)] sm:px-5"
                >
                  <div className="w-11 shrink-0">
                    <p className="ds-figure text-[24px] leading-none tracking-[-0.03em]" style={{ color: fg }}>
                      {o.score}
                    </p>
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--ds-subtle-2)]">
                      <div className="h-full rounded-full" style={{ width: `${o.score}%`, background: fg }} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[14px] font-semibold leading-tight tracking-[-0.01em] group-hover:text-[var(--ds-accent-hover)]">
                      {o.name}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">
                      {o.sector} · {o.headcount} employees · {o.locations}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Tag tone="alert">{o.openGaps.high} high</Tag>
                      <Tag tone="watch">{o.openGaps.medium} medium</Tag>
                      <Tag>{o.openGaps.low} low</Tag>
                      <Tag tone="info">{o.activities} activities</Tag>
                      {o.exemptActivities > 0 && <Tag tone="ok">{o.exemptActivities} exempt s.17(1)(d)</Tag>}
                      {o.dsrOpen > 0 && <Tag tone="dark">{o.dsrOpen} open DSR</Tag>}
                      {o.incidentOpen > 0 && <Tag tone="alert">Incident open</Tag>}
                      {o.engagement.startsWith('Discovery') && <Tag tone="watch">Interview not started</Tag>}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[11px] text-[var(--ds-text-3)]">Last reviewed</p>
                    <p className="text-[12px] font-medium text-[var(--ds-text-2)]">{o.lastReview}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="border-t border-[var(--ds-border)] p-4 sm:p-5">
          <DemoNote>
            Northstar BPO is the fully worked example — open it to see every module populated. The other two
            engagements carry realistic headline numbers only.
          </DemoNote>
        </div>
      </Panel>
    </div>
  );
}
