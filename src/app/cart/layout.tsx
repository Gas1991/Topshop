import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon panier — shop.toprix.tn',
  description: 'Votre panier shop.toprix.tn.',
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
