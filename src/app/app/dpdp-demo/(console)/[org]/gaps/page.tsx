import { GAPS, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import FindingsList from '@/modules/app/dpdp/components/FindingsList';
import RemindButton from '@/modules/app/dpdp/components/RemindButton';
import { DemoNote, NextStep, PageHeader, Panel, Stat } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Gaps({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const counts = {
    High: GAPS.filter((g) => g.severity === 'High').length,
    Medium: GAPS.filter((g) => g.severity === 'Medium').length,
    Low: GAPS.filter((g) => g.severity === 'Low').length,
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Gap report"
        sub={`Rule set v1.4 · ${org.activities} activities evaluated · generated 08 Oct 2026`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="Findings" value={GAPS.length} note="all with an owner and a date" />
        <Stat label="High" value={counts.High} note="remediate before Dec 2026" tone="bad" />
        <Stat label="Medium" value={counts.Medium} note="remediate by Jan 2027" tone="warn" />
        <Stat label="Low" value={counts.Low} note="remediate by Mar 2027" />
      </div>

      <NextStep
        title="Get the 180-day purge switched on in Zoho Recruit"
        action={<RemindButton person="Ritu Sharma" what="G-01 — candidate records past 180 days" />}
      >
        G-01 is the largest exposure: 4,812 candidate records past their purpose, observed on 09 Oct. Ritu Sharma owns it;
        the purge task is already overdue.
      </NextStep>

      <Panel title="Findings" sub="Produced by the rule engine, not by the model — each cites a provision. Open one for its evidence and history." flush>
        <FindingsList />
      </Panel>

      <Panel title="What this report is not">
        <DemoNote>
          Every finding above is a computed consequence of a register field plus a rule, so it can be explained
          line by line to a client or an auditor. The rule set itself is the thing that needs legal review against
          the Gazette text before this report is issued under DataSentry&rsquo;s name — commentary disagrees on
          whether s.7(i) survives the end of employment, and on the grievance response timeline, and both feed
          rules here.
        </DemoNote>
      </Panel>
    </div>
  );
}
