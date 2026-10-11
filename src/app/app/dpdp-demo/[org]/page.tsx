import Link from 'next/link';
import {
  ACTIVITIES, CONSENT_SUMMARY, DSRS, EVIDENCE_PACK, GAPS, INCIDENTS, ORGS, QUESTIONNAIRE, getOrg,
} from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import {
  Button, Card, CiteLink, DemoNote, Meter, PageHeader, Panel, ScoreBlock, SeverityTag, Stat, Tag,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Overview({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const openIncident = INCIDENTS.find((i) => i.status === 'Open');
  const topGaps = GAPS.filter((g) => g.severity === 'High');
  const generated = EVIDENCE_PACK.filter((e) => e.status === 'Generated').length;

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="M0 · Overview"
        title="Readiness overview"
        muted={org.name}
        sub={`${org.engagement} · last reviewed ${org.lastReview}`}
      />

      {openIncident && (
        <Link
          href={demoPath(org.slug, 'breach')}
          className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--ds-danger-border)] bg-[var(--ds-danger-weak)] px-4 py-3 transition-colors hover:border-[var(--ds-danger)]"
        >
          <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--ds-danger)]" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="ds-label text-[var(--ds-danger)]">
              Action required · Rule 7
            </p>
            <p className="mt-0.5 text-[13.5px] font-semibold tracking-[-0.01em]">
              {openIncident.id} — Board intimation not yet sent
            </p>
            <p className="text-[12px] text-[var(--ds-text-2)]">
              {openIncident.affected} data principals affected · deadline {openIncident.deadline}
            </p>
          </div>
          <span className="text-[12.5px] font-medium text-[var(--ds-danger)]">Open breach register →</span>
        </Link>
      )}

      <div className="grid gap-3 lg:grid-cols-[13rem_1fr]">
        <ScoreBlock score={org.score} trend={org.trend} />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Processing activities" value={org.activities} note={`${org.exemptActivities} exempt s.17(1)(d)`} />
          <Stat label="High gaps" value={org.openGaps.high} note={`${org.openGaps.medium} medium, ${org.openGaps.low} low`} tone="bad" />
          <Stat label="Open DSRs" value={org.dsrOpen} note="none past SLA" tone="warn" />
          <Stat label="Evidence artefacts" value={`${generated}/${EVIDENCE_PACK.length}`} note="generated" tone="warn" />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Where this client stands" sub="Module completion across the engagement">
          <ul className="space-y-3.5">
            {[
              { m: 'M1 Scope & role register', pct: 86, note: `${ACTIVITIES.length} activities mapped, ${QUESTIONNAIRE.total - QUESTIONNAIRE.answered} questions open` },
              { m: 'M2 Notice & consent', pct: 54, note: `notice ${CONSENT_SUMMARY.noticeVersion}, candidate capture live` },
              { m: 'M3 DSR & grievance desk', pct: 40, note: 'intake live, no grievance contact published' },
              { m: 'M4 Breach register', pct: 25, note: 'register opened, SOP not signed off' },
              { m: 'M5 Evidence & audit pack', pct: 69, note: `${generated} of ${EVIDENCE_PACK.length} artefacts generated` },
            ].map((r) => (
              <li key={r.m}>
                <Meter label={r.m} pct={r.pct} note={r.note} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Role determination" sub="Decided per activity, never per department">
          <div className="space-y-3">
            <Card>
              <p className="text-[13px] font-semibold tracking-[-0.01em]">17 activities — Data Fiduciary</p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">
                Employee, candidate, ex-employee, dependant, visitor, vendor and prospect data. Obligations apply
                in full.
              </p>
            </Card>
            <Card tone="ok">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">2 activities — exempt</p>
                <CiteLink provision="s.17(1)(d)" />
              </div>
              <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">
                Offshore delivery for the US payer and the UK retailer. Principals are outside India under
                contract with a person outside India.
              </p>
            </Card>
            <DemoNote>
              This is the panel that changes the sales conversation: it tells the client which processing they can
              stop worrying about. Security safeguards and processor contracts still survive the exemption.
            </DemoNote>
          </div>
        </Panel>
      </div>

      <Panel
        title="High-severity findings"
        sub="Each finding cites a provision and carries an owner and a date"
        right={<Button as="link" href={demoPath(org.slug, 'gaps')}>Full gap report</Button>}
        flush
      >
        <ul>
          {topGaps.map((g) => (
            <li
              key={g.id}
              className="flex flex-wrap items-start gap-x-3 gap-y-1.5 border-b border-[var(--ds-border)] px-4 py-3 last:border-b-0 sm:px-5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium tracking-[-0.01em]">{g.title}</p>
                <p className="mt-0.5 text-[12px] text-[var(--ds-text-2)]">
                  {g.owner} · due {g.due}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                <CiteLink provision={g.provision} />
                <Tag>{g.id}</Tag>
                <SeverityTag s={g.severity} />
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Recent activity" sub="Every entry is written to an append-only audit log" flush>
        <ul>
          {[
            ['10 Oct 2026, 14:22', 'Incident INC-2026-003 opened — 72-hour clock started', 'CISO, Northstar'],
            ['10 Oct 2026, 11:42', 'Candidate consent recorded — notice v3, English', 'Careers portal'],
            ['09 Oct 2026, 18:05', 'ATS export reconciled — 4,812 over-retained records found', 'Dharita Gada'],
            ['09 Oct 2026, 17:20', 'Drive sharing report uploaded — 2 findings raised', 'Dharita Gada'],
            ['08 Oct 2026, 16:40', `RoPA v4 confirmed — ${DSRS.length} DSR history imported`, 'HR Operations Manager'],
            ['08 Oct 2026, 15:55', 'Basis for PA-12 Alumni communications set to Not determined', 'Dharita Gada'],
          ].map(([ts, what, who]) => (
            <li
              key={ts + what}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5"
            >
              <span className="ds-figure w-36 shrink-0 text-[11px] text-[var(--ds-text-3)]">{ts}</span>
              <span className="min-w-0 flex-1 text-[12.5px]">{what}</span>
              <span className="text-[11.5px] text-[var(--ds-text-3)]">{who}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
