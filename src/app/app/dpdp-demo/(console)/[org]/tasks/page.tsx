import { clientData } from '@/modules/app/dpdp/mock/clients';
import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { parseDisplayDate } from '@/modules/app/dpdp/time';
import ModulePending from '@/modules/app/dpdp/components/ModulePending';
import TaskBoard from '@/modules/app/dpdp/components/TaskBoard';
import RemindButton from '@/modules/app/dpdp/components/RemindButton';
import { DemoNote, NextStep, PageHeader } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Tasks({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const d = clientData(slug);
  // The next step: an overdue task first, else the open task due soonest.
  const due = (x: string) => parseDisplayDate(x)?.getTime() ?? 0;
  const next = d.tasks.find((t) => t.status === 'Overdue') ?? [...d.tasks].filter((t) => t.status === 'Open').sort((a, b) => due(a.due) - due(b.due))[0];
  const person = next ? d.owners[next.owner] ?? next.owner : '';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Tasks & attestations"
        sub={`An erasure request, a consent withdrawal, an expired retention clock or a finding becomes one task per system ${org.name}'s register lists. The owner does the work in that system and attests it — who, when, what.`}
      />

      {!d.registerBuilt ? (
        <ModulePending org={org.slug} what="Fulfilment work per system" />
      ) : (
        <>
          {next && (
            <NextStep
              title={`${next.status === 'Overdue' ? 'Chase' : 'Get'} ${person} on ${next.id} — ${next.action.charAt(0).toLowerCase()}${next.action.slice(1)}`}
              action={<RemindButton person={person} what={`${next.id} — ${next.action}`} />}
            >
              {next.status === 'Overdue'
                ? `Overdue since ${next.due}. Until it is attested, the work it stands for is not done on record.`
                : `Due ${next.due} in ${next.system}. ${person} does the work there and attests it here.`}
            </NextStep>
          )}
          <TaskBoard org={org.slug} />
        </>
      )}


      <DemoNote>
        This is the only way work in a client&rsquo;s systems gets recorded without a connector, and it matches how SMBs
        delete data today — by hand. The evidence pack shows each of these as <em>attested</em>, never <em>verified</em>;
        the next walkthrough&rsquo;s agenda picks up attested fixes so a consultant looks at them on screen.
      </DemoNote>
    </div>
  );
}
