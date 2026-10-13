import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowMap from '@/modules/app/dpdp/components/DataFlowMap';
import {
  Card, CiteLink, DemoNote, Fact, Facts, PageHeader, Panel, Tag,
} from '@/modules/app/ui/ui';


export default async function Flows({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);

  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;
  const FLOW_NODES = d.flowNodes;
  const FLOW_EDGES = d.flowEdges;
  const GAPS = d.gaps;
  const node = (id: string) => FLOW_NODES.find((n) => n.id === id)!;
  const thirdParties = FLOW_NODES.filter((n) => n.zone !== 'internal');
  const noContract = thirdParties.filter((n) => n.safeguard === 'No DPA' || n.safeguard === 'Terms only');
  const abroad = FLOW_EDGES.filter((e) => node(e.to).zone === 'abroad');
  const flagged = FLOW_EDGES.filter((e) => e.finding);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map"
        sub={`Derived from the register — no separate authoring step. ${org.name}.`}
      />

      <Facts>
        <Fact label="Own systems" value={FLOW_NODES.filter((n) => n.zone === 'internal').length} note="holding personal data" />
        <Fact label="Third parties" value={thirdParties.length} note={`${noContract.length} without a DPA`} tone={noContract.length ? 'bad' : 'plain'} />
        <Fact label="Cross-border flows" value={abroad.length} note={[...new Set(abroad.map((e) => node(e.to).region))].join(', ')} tone={abroad.length ? 'warn' : 'plain'} />
        <Fact label="Flows with a finding" value={flagged.length} note={flagged.map((e) => e.finding).join(', ')} tone={flagged.length ? 'bad' : 'plain'} />
      </Facts>

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it"
        flush
      >
        <DataFlowMap org={org.slug} />
      </Panel>

      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Flagged flows" sub="Each links back to a gap finding">
          {flagged.length === 0 && <p className="text-[14px] text-[var(--ds-text-3)]">No flow has a finding against it.</p>}
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
                    <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{g.title}.</p>
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
            {d.crossBorder.map((c) => (
              <li key={c.title}>
                <Card tone={c.tone === 'ok' ? 'ok' : 'plain'}>
                  <p className="text-[13px] font-semibold tracking-[-0.01em]">{c.title}</p>
                  <p className="mt-1 text-[14px] leading-relaxed text-[var(--ds-text-2)]">{c.text}</p>
                </Card>
              </li>
            ))}
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
