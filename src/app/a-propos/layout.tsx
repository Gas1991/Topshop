import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Qui sommes-nous — Topshop.tn',
  description: 'Topshop.tn, boutique en ligne en Tunisie avec paiement à la livraison.',
  alternates: { canonical: '/a-propos' },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
