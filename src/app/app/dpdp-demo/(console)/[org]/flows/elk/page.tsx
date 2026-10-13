import { loadClient } from '@/modules/app/dpdp/routeData';
import { demoPath } from '@/modules/app/dpdp/routes';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowElk from '@/modules/app/dpdp/components/DataFlowElk';
import { Button, DemoNote, PageHeader, Panel } from '@/modules/app/ui/ui';

/**
 * Experiment: the data flow map with no hand-placed coordinates — the same
 * register-derived graph, laid out by ELK and drawn with React Flow — to judge
 * whether auto layout is good enough for clients with many more systems.
 */
export default async function FlowsElk({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map — auto layout"
        sub="Experiment: the same register, laid out by ELK and drawn with React Flow. Nothing is placed by hand."
        right={<Button as="link" href={demoPath(org.slug, 'flows')}>Hand-placed map</Button>}
      />

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it. Drag to pan, scroll to zoom, drag a system to move it."
        flush
      >
        <DataFlowElk org={org.slug} />
      </Panel>

      <DemoNote>
        This page is an experiment. The hand-placed map needs coordinates for every system, which does not scale past
        a dozen or so; here ELK (layered algorithm, trust zones as groups pinned left to right, orthogonal routing,
        labels sized so they stay clear of boxes) places everything from the register alone, so a client with forty
        systems lays out the same way. React Flow adds pan, zoom, a minimap and dragging. Compare the two before
        choosing one for the live app.
      </DemoNote>
    </div>
  );
}
