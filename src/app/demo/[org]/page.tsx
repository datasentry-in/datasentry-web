import Link from 'next/link';
import {
  ACTIVITIES, CONSENT_SUMMARY, DSRS, EVIDENCE_PACK, GAPS, INCIDENTS, ORGS, QUESTIONNAIRE, getOrg,
} from '../_data/mock';
import { CiteLink, DemoNote, Panel, ScoreBlock, SeverityTag, Stat, Tag } from '../_components/ui';

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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Readiness overview</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          {org.engagement} · last reviewed {org.lastReview}
        </p>
      </div>

      {openIncident && (
        <Link
          href={`/demo/${org.slug}/breach`}
          className="block border-[3px] border-black bg-black p-4 text-white shadow-[6px_6px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#a3a3a3]"
        >
          <p className="font-mono text-[10px] font-bold uppercase">Action required · Rule 7</p>
          <p className="font-display text-base font-bold uppercase sm:text-lg">
            {openIncident.id} — Board intimation not yet sent
          </p>
          <p className="font-mono text-[11px]">
            {openIncident.affected} data principals affected · deadline {openIncident.deadline} · open the breach
            register
          </p>
        </Link>
      )}

      <div className="grid gap-3 lg:grid-cols-[14rem_1fr]">
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
          <ul className="space-y-2">
            {[
              { m: 'M1 Scope & role register', pct: 86, note: `${ACTIVITIES.length} activities mapped, ${QUESTIONNAIRE.total - QUESTIONNAIRE.answered} questions open` },
              { m: 'M2 Notice & consent', pct: 54, note: `notice ${CONSENT_SUMMARY.noticeVersion}, candidate capture live` },
              { m: 'M3 DSR & grievance desk', pct: 40, note: 'intake live, no grievance contact published' },
              { m: 'M4 Breach register', pct: 25, note: 'register opened, SOP not signed off' },
              { m: 'M5 Evidence & audit pack', pct: 69, note: `${generated} of ${EVIDENCE_PACK.length} artefacts generated` },
            ].map((r) => (
              <li key={r.m}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase">{r.m}</span>
                  <span className="font-mono text-[11px] font-bold">{r.pct}%</span>
                </div>
                <div className="h-3 border-2 border-black bg-white">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${r.pct}%` }}
                  />
                </div>
                <p className="font-mono text-[10px] text-neutral-600">{r.note}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Role determination" sub="Decided per activity, never per department">
          <div className="space-y-3">
            <div className="border-2 border-black bg-white p-3">
              <p className="font-display text-sm font-bold uppercase">17 activities — Data Fiduciary</p>
              <p className="font-mono text-[11px] text-neutral-700">
                Employee, candidate, ex-employee, dependant, visitor, vendor and prospect data. Obligations apply
                in full.
              </p>
            </div>
            <div className="border-2 border-black bg-neutral-700 p-3 text-white">
              <p className="font-display text-sm font-bold uppercase">2 activities — exempt</p>
              <p className="font-mono text-[11px]">
                Offshore delivery for the US payer and the UK retailer. Principals are outside India under
                contract with a person outside India.
              </p>
              <p className="mt-1 font-mono text-[11px]">
                <span className="bg-white px-1 text-black">
                  <CiteLink provision="s.17(1)(d)" />
                </span>
              </p>
            </div>
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
        right={
          <Link
            href={`/demo/${org.slug}/gaps`}
            className="border-2 border-black bg-neutral-200 px-3 py-1.5 font-mono text-[10px] font-bold uppercase shadow-[3px_3px_0px_0px_#000]"
          >
            Full gap report
          </Link>
        }
      >
        <ul className="space-y-2">
          {topGaps.map((g) => (
            <li key={g.id} className="border-2 border-black bg-white p-3">
              <div className="flex flex-wrap items-center gap-2">
                <SeverityTag s={g.severity} />
                <Tag tone="dark">{g.id}</Tag>
                <CiteLink provision={g.provision} />
              </div>
              <p className="mt-1 font-display text-sm font-bold">{g.title}</p>
              <p className="font-mono text-[11px] text-neutral-700">
                {g.owner} · due {g.due}
              </p>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel title="Recent activity" sub="Every entry is written to an append-only audit log">
        <ul className="divide-y divide-neutral-300">
          {[
            ['10 Oct 2026, 14:22', 'Incident INC-2026-003 opened — 72-hour clock started', 'CISO, Northstar'],
            ['10 Oct 2026, 11:42', 'Candidate consent recorded — notice v3, English', 'Careers portal'],
            ['09 Oct 2026, 18:05', 'ATS export reconciled — 4,812 over-retained records found', 'Dharita Gada'],
            ['09 Oct 2026, 17:20', 'Drive sharing report uploaded — 2 findings raised', 'Dharita Gada'],
            ['08 Oct 2026, 16:40', `RoPA v4 confirmed — ${DSRS.length} DSR history imported`, 'HR Operations Manager'],
            ['08 Oct 2026, 15:55', 'Basis for PA-12 Alumni communications set to Not determined', 'Dharita Gada'],
          ].map(([ts, what, who]) => (
            <li key={ts + what} className="flex flex-wrap gap-x-3 py-2">
              <span className="font-mono text-[10px] text-neutral-500">{ts}</span>
              <span className="min-w-0 flex-1 font-mono text-[11px]">{what}</span>
              <span className="font-mono text-[10px] text-neutral-600">{who}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
