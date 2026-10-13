import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowElk from '@/modules/app/dpdp/components/DataFlowElk';
import { FlowFacts, FlowFindings } from '@/modules/app/dpdp/components/FlowSections';
import { DemoNote, PageHeader, Panel } from '@/modules/app/ui/ui';

/**
 * The data flow map: the register-derived graph, laid out by ELK and drawn
 * with React Flow (the standard — see CLAUDE.md). The earlier hand-placed map
 * is kept, unlinked, at `flows/hand-placed`.
 */
export default async function Flows({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map"
        sub={`Derived from the register and laid out automatically — no separate authoring step. ${org.name}.`}
      />

      <FlowFacts d={d} />

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it. Zoom with + and −; drag the map to pan."
        flush
      >
        <DataFlowElk org={org.slug} />
      </Panel>

      <FlowFindings d={d} />

      <DemoNote>
        Nothing on this map is positioned by hand: it is laid out from whatever the register holds, so a client with
        forty systems comes out the same way as one with twelve. Each trust zone is a column — own systems, India,
        outside India — systems line up with what they send to, and a filter re-lays the map for just the flows in view.
      </DemoNote>
    </div>
  );
}
