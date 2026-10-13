import type { ClientData } from '@/modules/app/dpdp/types';
import {
  Card, CiteLink, DemoNote, Fact, Facts, Panel, Tag,
} from '@/modules/app/ui/ui';

/**
 * What sits around a data flow map, whichever way it is drawn: the properties
 * row under the title, and the flagged flows and cross-border position under
 * the map. Both map pages render these, so they never drift apart.
 */

const derive = (d: ClientData) => {
  const node = (id: string) => d.flowNodes.find((n) => n.id === id)!;
  const thirdParties = d.flowNodes.filter((n) => n.zone !== 'internal');
  return {
    node,
    thirdParties,
    noContract: thirdParties.filter((n) => n.safeguard === 'No DPA' || n.safeguard === 'Terms only'),
    abroad: d.flowEdges.filter((e) => node(e.to).zone === 'abroad'),
    flagged: d.flowEdges.filter((e) => e.finding),
  };
};

/** The map's headline properties: systems, third parties, cross-border flows, flows with a finding. */
export function FlowFacts({ d }: { d: ClientData }) {
  const { node, thirdParties, noContract, abroad, flagged } = derive(d);
  return (
    <Facts>
      <Fact label="Own systems" value={d.flowNodes.filter((n) => n.zone === 'internal').length} note="holding personal data" />
      <Fact label="Third parties" value={thirdParties.length} note={`${noContract.length} without a DPA`} tone={noContract.length ? 'bad' : 'plain'} />
      <Fact label="Cross-border flows" value={abroad.length} note={[...new Set(abroad.map((e) => node(e.to).region))].join(', ')} tone={abroad.length ? 'warn' : 'plain'} />
      <Fact label="Flows with a finding" value={flagged.length} note={flagged.map((e) => e.finding).join(', ')} tone={flagged.length ? 'bad' : 'plain'} />
    </Facts>
  );
}

/** Under the map: the flows a finding was raised against, and where data leaves India. */
export function FlowFindings({ d }: { d: ClientData }) {
  const { node, flagged } = derive(d);
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Panel title="Flagged flows" sub="Each links back to a gap finding">
        {flagged.length === 0 && <p className="text-[14px] text-[var(--ds-text-3)]">No flow has a finding against it.</p>}
        <ul className="space-y-4">
          {flagged.map((e) => {
            const g = d.gaps.find((x) => x.id === e.finding)!;
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
  );
}
