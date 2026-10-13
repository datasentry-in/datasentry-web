import { CHECK_IN, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import CheckInForm from '@/modules/app/dpdp/components/CheckInForm';
import { DemoNote, PageHeader, Stat } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function CheckIn({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Quarterly check-in"
        sub={`How ${org.name}'s register stays current without a connector watching its systems. Six questions, each against what the register says today; anything new becomes a proposed change for the consultant.`}
      />

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--ds-border)] bg-[var(--ds-border)] lg:grid-cols-4">
        <Stat label="This check-in" value="Due" note={`${CHECK_IN.label} · ${CHECK_IN.due}`} tone="warn" />
        <Stat label="Sent to" value="1" note={CHECK_IN.sentTo} />
        <Stat label="Last check-in" value={CHECK_IN.last.on.slice(0, 6)} note={`${CHECK_IN.last.changes} changes flagged`} />
        <Stat label="Questions" value={CHECK_IN.questions.length} note="answered in about ten minutes" />
      </div>

      <CheckInForm />

      <DemoNote>
        This is what catches drift between walkthroughs: a new vendor, a tool switched off, a new use of old data, or a
        request that reached HR by phone. It cannot catch what the client doesn&rsquo;t mention — that is the honest
        limit of intake without integrations, and the reason walkthroughs continue alongside it.
      </DemoNote>
    </div>
  );
}
