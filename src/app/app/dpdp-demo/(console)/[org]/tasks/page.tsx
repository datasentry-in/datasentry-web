import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import TaskBoard from '@/modules/app/dpdp/components/TaskBoard';
import ListHeader from '@/modules/app/ui/ListHeader';
import { DemoNote } from '@/modules/app/ui/ui';


/** A worklist page: a compact header, then the tasks — the next step lives on the overview. */
export default async function Tasks({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);

  return (
    <div className="space-y-5">
      <ListHeader
        title="Tasks & attestations"
        meta={d.registerBuilt ? `${d.tasks.length} tasks · one per system the register lists` : undefined}
        about={
          <>
            An erasure request, a consent withdrawal, an expired retention clock or a finding becomes one task per
            system {org.name}&rsquo;s register lists. The owner does the work in that system and attests it here — who,
            when, what. Nothing is machine-verified, and every attested task says so.
          </>
        }
      />

      {!d.registerBuilt ? (
        <ModulePending org={org} what="Fulfilment work per system" />
      ) : (
        <TaskBoard org={org.slug} />
      )}

      <DemoNote>
        This is the only way work in a client&rsquo;s systems gets recorded without a connector, and it matches how SMBs
        delete data today — by hand. The evidence pack shows each of these as <em>attested</em>, never <em>verified</em>;
        the next walkthrough&rsquo;s agenda picks up attested fixes so a consultant looks at them on screen.
      </DemoNote>
    </div>
  );
}
