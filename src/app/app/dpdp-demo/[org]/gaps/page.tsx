import { GAPS, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { CiteLink, DemoNote, PageHeader, Panel, SeverityTag, Stat, Tag } from '@/modules/app/ui/ui';

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
        eyebrow="M1 · Findings"
        title="Gap report"
        sub={`Rule set v1.4 · ${org.activities} activities evaluated · generated 08 Oct 2026`}
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
                <h3 className="min-w-0 text-[13.5px] font-semibold tracking-[-0.01em]">{g.title}</h3>
                <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                  <CiteLink provision={g.provision} />
                  <Tag>{g.id}</Tag>
                  <SeverityTag s={g.severity} />
                </div>
              </div>
              <p className="mt-1.5 max-w-3xl text-[12.5px] leading-relaxed text-[var(--ds-text-2)]">{g.detail}</p>

              <dl className="mt-3 grid gap-3 border-t border-[var(--ds-border)] pt-3 sm:grid-cols-3">
                {[
                  ['Activity', g.activity, ''],
                  ['Owner', g.owner, ''],
                  ['Target date', g.due, 'font-medium'],
                ].map(([k, v, cls]) => (
                  <div key={k}>
                    <dt className="ds-label text-[var(--ds-text-3)]">{k}</dt>
                    <dd className={`mt-0.5 text-[12.5px] ${cls}`}>{v}</dd>
                  </div>
                ))}
              </dl>

              {g.evidence && (
                <p className="mt-3 rounded-md border border-[var(--ds-border)] bg-[var(--ds-subtle)] px-3 py-2 text-[12px] leading-relaxed text-[var(--ds-text-2)]">
                  <span className="font-medium text-[var(--ds-text)]">Evidence — </span>
                  {g.evidence}
                </p>
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
