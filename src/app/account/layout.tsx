import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mon compte — Topshop.tn',
  description: 'Votre espace client Topshop.tn.',
  robots: { index: false, follow: true },
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
