import { FLOW_EDGES, FLOW_NODES, GAPS, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import DataFlowMap from '@/modules/app/dpdp/components/DataFlowMap';
import { Card, CiteLink, DemoNote, PageHeader, Panel, Stat, Tag } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Flows({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  const node = (id: string) => FLOW_NODES.find((n) => n.id === id)!;
  const thirdParties = FLOW_NODES.filter((n) => n.zone !== 'internal');
  const noContract = thirdParties.filter((n) => n.safeguard === 'No DPA' || n.safeguard === 'Terms only');
  const abroad = FLOW_EDGES.filter((e) => node(e.to).zone === 'abroad');
  const flagged = FLOW_EDGES.filter((e) => e.finding);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Data flow map"
        sub={`Derived from the register — no separate authoring step. ${org.name}, RoPA v4.`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="Own systems" value={FLOW_NODES.filter((n) => n.zone === 'internal').length} note="holding personal data" />
        <Stat label="Third parties" value={thirdParties.length} note={`${noContract.length} without a DPA`} tone={noContract.length ? 'bad' : 'plain'} />
        <Stat label="Cross-border flows" value={abroad.length} note="United States, United Kingdom" tone="warn" />
        <Stat label="Flows with a finding" value={flagged.length} note={flagged.map((e) => e.finding).join(', ')} tone="bad" />
      </div>

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it"
        flush
      >
        <DataFlowMap />
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Flagged flows" sub="Each links back to a gap finding">
          <ul className="space-y-4">
            {flagged.map((e) => {
              const g = GAPS.find((x) => x.id === e.finding)!;
              return (
                <li key={e.id}>
                  <Card tone={g.severity === 'High' ? 'danger' : 'warn'}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-[13px] font-semibold tracking-[-0.01em]">
                        {node(e.from).label} → {node(e.to).label}
                      </p>
                      <Tag tone={g.severity === 'High' ? 'alert' : 'watch'}>{g.id}</Tag>
                    </div>
                    <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">{g.title}.</p>
                    <p className="mt-2">
                      <CiteLink provision={g.provision} />
                    </p>
                  </Card>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Cross-border position" sub="Record destinations; do not assess them yet">
          <ul className="space-y-4">
            <li>
              <Card>
                <p className="text-[13px] font-semibold tracking-[-0.01em]">United States — 4 transfers</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  Mapped: Mailchimp (PA-12), Forcepoint (PA-15). Also on the register: client LMS (PA-08), HubSpot (PA-18).
                </p>
              </Card>
            </li>
            <li>
              <Card tone="ok">
                <p className="text-[13px] font-semibold tracking-[-0.01em]">United Kingdom — exempt</p>
                <p className="mt-1 text-[13px] leading-relaxed text-[var(--ds-text-2)]">
                  PA-17 client delivery. Principals are outside India under contract with a person outside India.
                </p>
              </Card>
            </li>
            <li>
              <DemoNote>
                The product records destinations and stops there. The s.16 restricted-country list has not been
                notified, so any transfer-permissibility verdict would be invented. Categories are named as they
                are — the DPDP Act has no &ldquo;sensitive personal data&rdquo; class, so nothing is labelled sensitive.
              </DemoNote>
            </li>
          </ul>
        </Panel>
      </div>
    </div>
  );
}
