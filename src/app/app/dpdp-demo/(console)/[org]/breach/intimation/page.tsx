import { BOARD_INTIMATION, ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import DocumentPage from '@/modules/app/dpdp/components/DocumentPage';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export default async function BoardIntimation({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  return (
    <DocumentPage
      doc={BOARD_INTIMATION}
      backHref={demoPath(org.slug, 'breach')}
      backLabel="Breach register"
      client={org.name.split(' ')[0]}
    />
  );
}
