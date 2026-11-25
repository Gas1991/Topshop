import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Livraison — Topshop.tn',
  description: 'Tarif et délais de livraison partout en Tunisie.',
  alternates: { canonical: '/livraison' },
};

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
