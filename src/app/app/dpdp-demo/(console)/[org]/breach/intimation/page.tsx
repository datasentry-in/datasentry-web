import { loadClient } from '@/modules/app/dpdp/routeData';
import { demoPath } from '@/modules/app/dpdp/routes';
import DocumentPage from '@/modules/app/dpdp/components/DocumentPage';
import { Button, EmptyState } from '@/modules/app/ui/ui';


export default async function BoardIntimation({ params }: { params: Promise<{ org: string }> }) {
  const { org, d } = await loadClient(params);
  const doc = d.boardIntimation;
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
