import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import FindingsList from '@/modules/app/dpdp/components/FindingsList';
import ListHeader from '@/modules/app/ui/ListHeader';
import { DemoNote, Panel } from '@/modules/app/ui/ui';
import PresenterOnly from '@/modules/app/ui/PresenterOnly';


/** A worklist page: a compact header, then the list — the next step lives on the overview. */
export default async function Gaps({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  if (!d.registerBuilt) return <ModulePending org={org} title="Gap report" what="The gap report" />;

  return (
    <div className="space-y-5">
      <ListHeader
        title="Gap report"
        meta={`Rule set v1.4 · ${org.activities} activities evaluated · generated ${org.lastReview}`}
        about={
          <>
            Produced by the rule engine, not by the model: every finding is a register field plus a rule, and cites the
            provision it rests on. Each has an owner and a date. Open one for its evidence, discussion and history.
          </>
        }
      />

      <Panel flush>
        <FindingsList org={org.slug} />
      </Panel>

      <PresenterOnly>
      <Panel title="What this report is not">
        <DemoNote>
          Every finding above is a computed consequence of a register field plus a rule, so it can be explained
          line by line to a client or an auditor. The rule set itself is the thing that needs legal review against
          the Gazette text before this report is issued under DataSentry&rsquo;s name — commentary disagrees on
          whether s.7(i) survives the end of employment, and on the grievance response timeline, and both feed
          rules here.
        </DemoNote>
      </Panel>
      </PresenterOnly>
    </div>
  );
}
