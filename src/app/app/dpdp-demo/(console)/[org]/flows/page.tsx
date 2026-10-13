import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import DataFlowMap from '@/modules/app/dpdp/components/DataFlowMap';
import { FlowFacts, FlowFindings } from '@/modules/app/dpdp/components/FlowSections';
import { demoPath } from '@/modules/app/dpdp/routes';
import { Button, PageHeader, Panel } from '@/modules/app/ui/ui';


export default async function Flows({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Data flow map" what="The data flow map" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Data flow map"
        sub={`Derived from the register — no separate authoring step. ${org.name}.`}
        right={<Button as="link" href={demoPath(org.slug, 'flows', 'elk')}>Try the auto layout</Button>}
      />

      <FlowFacts d={d} />

      <Panel
        title="Where personal data moves"
        sub="Hover a system to trace its flows; click a system or a flow for the record behind it"
        flush
      >
        <DataFlowMap org={org.slug} />
      </Panel>

      <FlowFindings d={d} />
    </div>
  );
}
