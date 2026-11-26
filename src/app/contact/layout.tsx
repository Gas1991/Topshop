import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — shop.toprix.tn',
  description: 'Contactez le service client shop.toprix.tn.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
