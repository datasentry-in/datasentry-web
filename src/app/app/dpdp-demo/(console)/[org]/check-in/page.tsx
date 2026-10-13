import { loadClient } from '@/modules/app/dpdp/routeData';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import CheckInForm from '@/modules/app/dpdp/components/CheckInForm';
import {
  DemoNote, Fact, Facts, PageHeader,
} from '@/modules/app/ui/ui';


export default async function CheckIn({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const CHECK_IN = d.checkIn;
  if (!CHECK_IN) return <ModulePending org={org} title="Quarterly check-in" what="The quarterly check-in" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quarterly check-in"
        sub={`How ${org.name}'s register stays current without a connector watching its systems. Six questions, each against what the register says today; anything new becomes a proposed change for the consultant.`}
      />

      <Facts>
        <Fact label="This check-in" value="Due" note={`${CHECK_IN.label} · ${CHECK_IN.due}`} tone="warn" />
        <Fact label="Sent to" value={CHECK_IN.sentTo} />
        <Fact label="Last check-in" value={CHECK_IN.last.on.slice(0, 6)} note={`${CHECK_IN.last.changes} changes flagged`} />
        <Fact label="Questions" value={CHECK_IN.questions.length} note="answered in about ten minutes" />
      </Facts>

      <CheckInForm org={org.slug} />

      <DemoNote>
        This is what catches drift between walkthroughs: a new vendor, a tool switched off, a new use of old data, or a
        request that reached HR by phone. It cannot catch what the client doesn&rsquo;t mention — that is the honest
        limit of intake without integrations, and the reason walkthroughs continue alongside it.
      </DemoNote>
    </div>
  );
}
