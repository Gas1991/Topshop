import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Suivi de commande — shop.toprix.tn',
  description: 'Suivez votre commande shop.toprix.tn.',
  robots: { index: false, follow: true },
};

export default function TrackingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
