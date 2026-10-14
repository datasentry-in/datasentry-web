import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowMap from '@/modules/app/dpdp/components/DataFlowMap';
import { FlowFacts, FlowFindings } from '@/modules/app/dpdp/components/FlowSections';
import { demoPath } from '@/modules/app/dpdp/routes';
import { Button, PageHeader, Panel } from '@/modules/app/ui/ui';

/**
 * HIDDEN — the earlier hand-placed data flow map, kept for reference while the
 * auto-laid-out map at `flows` settles in. Nothing links here; reach it by URL.
 * Remove this route and `DataFlowMap`'s drawing once it is no longer needed
 * (the shared colours, icons, legend and FlowSheet in DataFlowMap.tsx stay).
 */
export default async function FlowsHandPlaced({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map — hand-placed (earlier version)"
        sub={`Kept for reference; the data flow map is now laid out automatically. ${org.name}.`}
        right={<Button as="link" href={demoPath(org.slug, 'flows')}>Current map</Button>}
      />

      <FlowFacts org={org.slug} />

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it"
        flush
      >
        <DataFlowMap org={org.slug} />
      </Panel>

      <FlowFindings org={org.slug} />
    </div>
  );
}
