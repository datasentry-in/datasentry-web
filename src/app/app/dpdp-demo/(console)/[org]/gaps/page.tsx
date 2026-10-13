import { clientData } from '@/modules/app/dpdp/mock/clients';
import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import FindingsList from '@/modules/app/dpdp/components/FindingsList';
import RemindButton from '@/modules/app/dpdp/components/RemindButton';
import {
  DemoNote, Fact, Facts, NextStep, PageHeader, Panel,
} from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Gaps({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const d = clientData(slug);
  if (!d.registerBuilt) {
    return (
      <div className="space-y-8">
        <PageHeader title="Gap report" sub={org.name} />
        <ModulePending org={org.slug} what="The gap report" />
      </div>
    );
  }
  const GAPS = d.gaps;
  // The next step is the most severe finding that falls due first.
  const rank = { High: 0, Medium: 1, Low: 2 } as const;
  const top = [...GAPS].sort((a, b) => rank[a.severity] - rank[b.severity] || (parseDisplayDate(a.due)?.getTime() ?? 0) - (parseDisplayDate(b.due)?.getTime() ?? 0))[0];
  const topOwner = top ? d.owners[top.owner] ?? top.owner : '';
  const counts = {
    High: GAPS.filter((g) => g.severity === 'High').length,
    Medium: GAPS.filter((g) => g.severity === 'Medium').length,
    Low: GAPS.filter((g) => g.severity === 'Low').length,
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Gap report"
        sub={`Rule set v1.4 · ${org.activities} activities evaluated · generated ${org.lastReview}`}
      />

      <Facts>
        <Fact label="Findings" value={GAPS.length} note="all with an owner and a date" />
        <Fact label="High" value={counts.High} note="remediate before Dec 2026" tone="bad" />
        <Fact label="Medium" value={counts.Medium} note="remediate by Jan 2027" tone="warn" />
        <Fact label="Low" value={counts.Low} note="remediate by Mar 2027" />
      </Facts>

      {top && (
        <NextStep
          title={`Close ${top.id} — ${top.title.charAt(0).toLowerCase()}${top.title.slice(1)}`}
          action={<RemindButton person={topOwner} what={`${top.id} — ${top.title}`} />}
        >
          {top.detail.split('. ')[0]}. {topOwner} ({top.owner}) owns it, due {top.due}.
        </NextStep>
      )}

      <Panel title="Findings" sub="Produced by the rule engine, not by the model — each cites a provision. Open one for its evidence and history." flush>
        <FindingsList org={org.slug} />
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
