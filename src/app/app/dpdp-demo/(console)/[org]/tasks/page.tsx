import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import TaskBoard from '@/modules/app/dpdp/components/TaskBoard';
import { DemoNote, PageHeader } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function Tasks({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Tasks & attestations"
        sub={`An erasure request, a consent withdrawal, an expired retention clock or a finding becomes one task per system ${org.name}'s register lists. The owner does the work in that system and attests it — who, when, what.`}
      />

      <TaskBoard org={org.slug} />

      <DemoNote>
        This is the only way work in a client&rsquo;s systems gets recorded without a connector, and it matches how SMBs
        delete data today — by hand. The evidence pack shows each of these as <em>attested</em>, never <em>verified</em>;
        the next walkthrough&rsquo;s agenda picks up attested fixes so a consultant looks at them on screen.
      </DemoNote>
    </div>
  );
}
