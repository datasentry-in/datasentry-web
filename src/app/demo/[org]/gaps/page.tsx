import { GAPS, ORGS, getOrg } from '../../_data/mock';
import { CiteLink, DemoNote, Panel, SeverityTag, Stat, Tag } from '../../_components/ui';

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
    <div className="space-y-6">
      <div>
        <p className="mb-2 inline-block border-2 border-black bg-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-white">
          M1 · Findings
        </p>
        <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">Gap report</h1>
        <p className="mt-1 font-mono text-xs text-neutral-700">
          Rule set v1.4 · {org.activities} activities evaluated · generated 08 Oct 2026
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Findings" value={GAPS.length} note="all with an owner and a date" />
        <Stat label="High" value={counts.High} note="remediate before Dec 2026" tone="bad" />
        <Stat label="Medium" value={counts.Medium} note="remediate by Jan 2027" tone="warn" />
        <Stat label="Low" value={counts.Low} note="remediate by Mar 2027" />
      </div>

      <Panel title="Findings" sub="Produced by the rule engine, not by the model — each cites a provision">
        <ul className="space-y-3">
          {GAPS.map((g) => (
            <li
              key={g.id}
              className={`border-[3px] border-black p-3 sm:p-4 ${
                g.severity === 'High' ? 'bg-neutral-200' : g.severity === 'Medium' ? 'bg-neutral-100' : 'bg-white'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <SeverityTag s={g.severity} />
                <Tag tone="dark">{g.id}</Tag>
                <CiteLink provision={g.provision} />
              </div>
              <h3 className="mt-2 font-display text-sm font-bold sm:text-base">{g.title}</h3>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-neutral-800">{g.detail}</p>
              <dl className="mt-3 grid gap-2 border-t-2 border-black pt-2 sm:grid-cols-3">
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase text-neutral-600">Activity</dt>
                  <dd className="font-mono text-[11px]">{g.activity}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase text-neutral-600">Owner</dt>
                  <dd className="font-mono text-[11px]">{g.owner}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[10px] font-bold uppercase text-neutral-600">Target date</dt>
                  <dd className="font-mono text-[11px] font-bold">{g.due}</dd>
                </div>
              </dl>
              {g.evidence && (
                <p className="mt-2 border-l-4 border-black pl-2 font-mono text-[10px] text-neutral-700">
                  <span className="font-bold uppercase">Evidence · </span>
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
