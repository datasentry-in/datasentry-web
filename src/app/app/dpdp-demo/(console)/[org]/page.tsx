import {
  ACTIVITIES, CONSENT_SUMMARY, EVIDENCE_PACK, GAPS, INCIDENTS, ORGS, OWNERS, QUESTIONNAIRE, getOrg,
} from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import AttentionList from '@/modules/app/dpdp/components/AttentionList';
import When from '@/modules/app/dpdp/components/When';
import {
  Button, Callout, CiteLink, DemoNote, Person, Meter, PageHeader, Panel, ScoreBlock, SeverityTag, Stat, Tag,
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
        title="Readiness overview"
        sub={`${org.engagement} · last reviewed ${org.lastReview}`}
      />

      {openIncident && (
        <Callout
          boxed
          tone="danger"
          title={`${openIncident.id} — Board intimation not yet sent`}
          action={<Button as="link" href={demoPath(org.slug, 'breach')}>Open breach register</Button>}
        >
          {openIncident.affected} data principals affected · Rule 7 deadline{' '}
          <span className="font-medium text-[var(--ds-danger)]">{openIncident.deadline}</span>
        </Callout>
      )}

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-5">
        <div className="col-span-2 grid lg:col-span-1">
          <ScoreBlock score={org.score} trend={org.trend} />
        </div>
        <Stat label="Processing activities" value={org.activities} note={`${org.exemptActivities} exempt s.17(1)(d)`} />
        <Stat label="High gaps" value={org.openGaps.high} note={`${org.openGaps.medium} medium, ${org.openGaps.low} low`} tone="bad" />
        <Stat label="Open DSRs" value={org.dsrOpen} note="none past SLA" />
        <Stat label="Evidence artefacts" value={`${generated}/${EVIDENCE_PACK.length}`} note="generated" />
      </div>

      <AttentionList org={org.slug} exclude={openIncident ? [openIncident.id] : []} />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Where this client stands" sub="Module completion across the engagement">
          <ul className="space-y-3.5">
            {[
              { m: 'Scope & role register', pct: 86, note: `${ACTIVITIES.length} activities mapped, ${QUESTIONNAIRE.total - QUESTIONNAIRE.answered} questions open` },
              { m: 'Notice & consent', pct: 54, note: `notice ${CONSENT_SUMMARY.noticeVersion}, candidate capture live` },
              { m: 'DSR & grievance desk', pct: 40, note: 'intake live, no grievance contact published' },
              { m: 'Breach register', pct: 25, note: 'register opened, SOP not signed off' },
              { m: 'Evidence & audit pack', pct: 69, note: `${generated} of ${EVIDENCE_PACK.length} artefacts generated` },
            ].map((r) => (
              <li key={r.m}>
                <Meter label={r.m} pct={r.pct} note={r.note} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Role determination" sub="Decided per activity, never per department">
          <ul className="-mt-1 divide-y divide-[var(--ds-border)]">
            <li className="py-3">
              <p className="flex items-baseline justify-between gap-3 text-[13px] font-semibold tracking-[-0.01em]">
                Data Fiduciary <span className="ds-figure text-[13px] font-normal text-[var(--ds-text-2)]">17 activities</span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                Employee, candidate, ex-employee, dependant, visitor, vendor and prospect data. Obligations apply
                in full.
              </p>
            </li>
            <li className="py-3">
              <p className="flex items-baseline justify-between gap-3 text-[13px] font-semibold tracking-[-0.01em]">
                <span className="flex items-center gap-2">Exempt <CiteLink provision="s.17(1)(d)" /></span>
                <span className="ds-figure text-[13px] font-normal text-[var(--ds-ok)]">2 activities</span>
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                Offshore delivery for the US payer and the UK retailer. Principals are outside India under
                contract with a person outside India.
              </p>
            </li>
          </ul>
          <div className="mt-3">
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
              </div>
              <div className="flex w-full items-center gap-4 sm:w-auto">
                <Person name={OWNERS[g.owner] ?? g.owner} role={OWNERS[g.owner] ? g.owner : undefined} compact />
                <When date={g.due} className="ds-figure text-[12px]" />
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
            ['10 Oct 2026, 16:05', 'Erasure attested — Keka HR personnel file, DSR-2026-0041', 'Meera Joshi'],
            ['10 Oct 2026, 14:22', 'Incident INC-2026-003 opened — 72-hour clock started', 'CISO'],
            ['10 Oct 2026, 11:42', 'Candidate consent recorded — notice v3, English', 'Careers portal'],
            ['09 Oct 2026, 17:20', 'Walkthrough recorded — 4,812 CVs past 180 days observed in Zoho Recruit', 'Dharita Gada'],
            ['08 Oct 2026, 16:40', `RoPA v4 confirmed — ${ACTIVITIES.length} activities`, 'Meera Joshi'],
            ['08 Oct 2026, 15:55', 'Basis for PA-12 Alumni communications set to Not determined', 'Dharita Gada'],
          ].map(([ts, what, who]) => (
            <li
              key={ts + what}
              className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5 border-b border-[var(--ds-border)] px-4 py-2.5 last:border-b-0 sm:px-5"
            >
              <span className="min-w-0 flex-1 text-[13px]">{what}</span>
              <Person name={who} compact />
              <When date={ts} kind="event" className="w-24 shrink-0 text-right text-[12px] text-[var(--ds-text-3)]" />
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
