import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retours et remboursements — Topshop.tn',
  description: 'Conditions de retour et de remboursement.',
  alternates: { canonical: '/retours' },
};

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
