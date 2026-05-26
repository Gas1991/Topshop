import type { Metadata } from 'next';
import './globals.css';
import './topshop.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/woocommerce';
import { CartProvider } from '@/lib/cart';

export const metadata: Metadata = {
  title: 'Toprix — Meilleurs prix électroménager en Tunisie',
  description: 'Marketplace électroménager n°1 en Tunisie. Meilleurs prix sur réfrigérateurs, friteuses, lave-vaisselle et plus.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const categories = await api.categories.top(8).catch(() => []);

  return (
    <html lang="fr">
      <body style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        <CartProvider>
          <Header categories={categories} />
          {children}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
