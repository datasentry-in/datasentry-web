import { GAPS, ORGS, OWNERS, getOrg } from '@/modules/app/dpdp/mock/data';
import When from '@/modules/app/dpdp/components/When';
import { BasisTag, CiteLink, DemoNote, PageHeader, Panel, Person, SeverityTag, Stat, Tag } from '@/modules/app/ui/ui';

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

      <Panel title="Findings" sub="Produced by the rule engine, not by the model — each cites a provision" flush>
        <ul>
          {GAPS.map((g) => (
            <li key={g.id} className="border-b border-[var(--ds-border)] p-4 last:border-b-0 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 className="min-w-0 text-[14px] font-semibold tracking-[-0.01em]">{g.title}</h3>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <CiteLink provision={g.provision} />
                  <Tag>{g.id}</Tag>
                  <SeverityTag s={g.severity} />
                </div>
              </div>
              <p className="mt-1.5 max-w-3xl text-[13px] leading-relaxed text-[var(--ds-text-2)]">{g.detail}</p>

              <dl className="mt-3 grid gap-3 border-t border-[var(--ds-border)] pt-3 sm:grid-cols-3">
                <div>
                  <dt className="ds-meta text-[var(--ds-text-3)]">Activity</dt>
                  <dd className="mt-1 text-[13px]">{g.activity}</dd>
                </div>
                <div>
                  <dt className="ds-meta text-[var(--ds-text-3)]">Owner</dt>
                  <dd className="mt-1">
                    <Person name={OWNERS[g.owner] ?? g.owner} role={OWNERS[g.owner] ? g.owner : undefined} />
                  </dd>
                </div>
                <div>
                  <dt className="ds-meta text-[var(--ds-text-3)]">Target date</dt>
                  <dd className="mt-1 text-[13px] font-medium">
                    {g.due} <When date={g.due} className="ml-1 text-[12px] font-normal" tone={false} />
                  </dd>
                </div>
              </dl>

              {g.evidence && (
                <div className="ds-bar ds-bar-plain mt-3 flex flex-wrap items-start gap-x-2.5 gap-y-1.5">
                  {g.basis && <BasisTag b={g.basis} />}
                  <p className="min-w-0 flex-1 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
                    <span className="font-medium text-[var(--ds-text)]">Evidence — </span>
                    {g.evidence}
                  </p>
                </div>
              )}
            </li>
          ))}
        </ul>
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
