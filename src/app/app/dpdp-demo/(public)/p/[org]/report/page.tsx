import type { Metadata } from 'next';
import { ORGS, getOrg } from '@/modules/app/dpdp/mock/data';
import IncidentReport from '@/modules/app/dpdp/components/IncidentReport';

export function generateStaticParams() {
  return ORGS.map((o) => ({ org: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ org: string }> }): Promise<Metadata> {
  const { org } = await params;
  return { title: `Report a data incident — ${getOrg(org).name}` };
}

export default async function Report({ params }: { params: Promise<{ org: string }> }) {
  const { org: slug } = await params;
  const org = getOrg(slug);
  return <IncidentReport orgName={org.name} orgSlug={org.slug} />;
}
