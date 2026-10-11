import type { Metadata } from 'next';
import DemoShell from '@/modules/app/dpdp/components/DemoShell';

export const metadata: Metadata = {
  title: 'DPDP Console — Interactive Mock | DataSentry',
  description:
    'Clickable mock of the DataSentry DPDP compliance platform for ITES SMBs. Illustrative data only.',
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
