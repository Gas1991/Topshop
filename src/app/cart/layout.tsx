import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon panier — Topshop.tn',
  description: 'Votre panier Topshop.tn.',
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
