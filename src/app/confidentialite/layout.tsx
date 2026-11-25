import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Politique de confidentialité — Topshop.tn',
  description: 'Protection de vos données personnelles.',
  alternates: { canonical: '/confidentialite' },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
