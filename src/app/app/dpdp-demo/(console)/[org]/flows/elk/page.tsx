import { redirect } from 'next/navigation';
import { demoPath } from '@/modules/app/dpdp/routes';

/** The auto-laid-out map was trialled here; it is now the data flow map itself. */
export default async function FlowsElk({ params }: { params: Promise<{ org: string }> }) {
  const { org } = await params;
  redirect(demoPath(org, 'flows'));
}
