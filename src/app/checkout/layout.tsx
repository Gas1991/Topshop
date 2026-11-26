import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Finaliser ma commande — shop.toprix.tn',
  description: 'Commande avec paiement à la livraison.',
  robots: { index: false, follow: true },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
