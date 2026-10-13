import { clientData } from '@/modules/app/dpdp/mock/clients';
import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import DocumentPage from '@/modules/app/dpdp/components/DocumentPage';
import { Button, EmptyState } from '@/modules/app/ui/ui';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function BoardIntimation({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  const doc = clientData(slug).boardIntimation;
  if (!doc) {
    return (
      <EmptyState
        title="No Board intimation in progress"
        action={<Button as="link" href={demoPath(org.slug, 'breach')}>Back to the breach register</Button>}
      >
        An intimation is drafted from an open incident. {org.name} has none open.
      </EmptyState>
    );
  }
  return (
    <DocumentPage
      org={org.slug}
      doc={doc}
      backHref={demoPath(org.slug, 'breach')}
      backLabel="Breach register"
      client={org.name.split(' ')[0]}
    />
  );
}
