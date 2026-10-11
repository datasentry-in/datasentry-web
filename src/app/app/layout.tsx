import type { Metadata } from 'next';
import '@/modules/app/ui/console.css';

/**
 * The product, datasentry.in/app/*. Everything here loads the console theme
 * and stays out of search results. Each product mounts as its own segment:
 * /app/dpdp-demo is the clickable mock; the live DPDP app goes alongside it
 * at /app/dpdp, reusing @/modules/app.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return children;
}
