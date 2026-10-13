import type { Metadata } from 'next';
import Link from 'next/link';
import { getOrg } from '@/modules/app/dpdp/mock/data';
import { demoPath } from '@/modules/app/dpdp/routes';
import { RIGHTS, type RightType } from '@/modules/app/dpdp/statute';
import RequestForm from '@/modules/app/dpdp/components/RequestForm';

export async function generateMetadata({ params }: { params: Promise<{ org: string }> }): Promise<Metadata> {
  const { org } = await params;
  return { title: `Make a request — ${getOrg(org).name}` };
}

export default async function Request({
  params, searchParams,
}: { params: Promise<{ org: string }>; searchParams: Promise<{ type?: string }> }) {
  const { org: slug } = await params;
  const { type } = await searchParams;
  const org = getOrg(slug);
  const initial = RIGHTS.some((r) => r.type === type) ? (type as RightType) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <Link href={demoPath('p', org.slug)} className="text-[13px] font-medium text-[var(--ds-text-2)] hover:text-[var(--ds-text)]">
        ← Privacy centre
      </Link>
      <RequestForm orgName={org.name} orgSlug={org.slug} initialType={initial} />
    </div>
  );
}
