import { orgParams } from '@/modules/app/dpdp/routeData';

/** Every client page is prerendered; a slug outside the client list is a 404. */
export const generateStaticParams = orgParams;
export const dynamicParams = false;

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return children;
}
