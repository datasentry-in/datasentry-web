import { notFound } from 'next/navigation';
import { ORGS, clientData, findOrg } from './mock/clients';

/** Static params for every client route — declared once, in the [org] layouts. */
export const orgParams = () => ORGS.map((o) => ({ org: o.slug }));

/** Resolve a route's client and its data; an unknown slug is a 404, never another client. */
export async function loadClient(params: Promise<{ org: string }>) {
  const { org: slug } = await params;
  const org = findOrg(slug);
  if (!org) notFound();
  return { org, d: clientData(slug) };
}
