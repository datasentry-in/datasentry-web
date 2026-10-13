import { loadClient } from '@/modules/app/dpdp/routeData';
import { demoPath } from '@/modules/app/dpdp/routes';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowElk from '@/modules/app/dpdp/components/DataFlowElk';
import { FlowFacts, FlowFindings } from '@/modules/app/dpdp/components/FlowSections';
import { Button, DemoNote, PageHeader, Panel } from '@/modules/app/ui/ui';

/**
 * The data flow map with no hand-placed coordinates — the same register-derived
 * graph, laid out by ELK and drawn with React Flow (the standard; see CLAUDE.md).
 * It is to replace the hand-placed map at `flows`.
 */
export default async function FlowsElk({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map — auto layout"
        sub={`Laid out from the register by ELK and drawn with React Flow — nothing is placed by hand. ${org.name}.`}
        right={<Button as="link" href={demoPath(org.slug, 'flows')}>Hand-placed map</Button>}
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
        Nothing on this map is positioned by hand: ELK lays out whatever the register holds, so a client with forty
        systems comes out the same way as one with twelve. The zones are columns ordered own systems → India →
        outside India, flows are routed so their labels stay clear of the boxes, and a filter re-runs the layout for
        just the flows in view.
      </DemoNote>
    </div>
  );
}
