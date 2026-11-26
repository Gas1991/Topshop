import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon compte — shop.toprix.tn',
  description: 'Votre espace client shop.toprix.tn.',
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
