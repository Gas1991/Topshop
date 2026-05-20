import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './topshop.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/woocommerce';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Topshop — Meilleurs prix tech en Tunisie',
  description: 'Marketplace tech n°1 en Tunisie. Meilleurs prix sur smartphones, laptops, audio et gaming.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await api.categories.top(8).catch(() => []);

  return (
    <html lang="fr" className={inter.className}>
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        <Header categories={categories} />
        {children}
        <Footer />
      </body>
    </html>
  );
}
