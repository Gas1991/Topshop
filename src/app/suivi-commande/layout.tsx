import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suivi de commande — Topshop.tn',
  description: 'Suivez votre commande Topshop.tn.',
  robots: { index: false, follow: true },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
