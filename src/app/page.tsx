import { api } from '@/lib/woocommerce';
import HomePage from '@/components/HomePage';
import JsonLd from '@/components/JsonLd';
import { SITE_URL } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const SITE_LD = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Topshop.tn',
    url: SITE_URL,
    sameAs: [
      'https://www.facebook.com/profile.php?id=61594466673346',
      'https://www.instagram.com/topshop.tn',
      'https://www.tiktok.com/@topshop.tn',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Topshop.tn',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shop?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  },
];

export const dynamic = 'force-dynamic'; // render at request time, not build time
export const revalidate = 60;           // cache 60s on Netlify

export default async function Page() {
  const [latest, deals, categories] = await Promise.all([
    api.products.latest(18).catch(() => []),
    api.products.onSale(6).catch(() => []),
    api.categories.top(20).catch(() => []),
  ]);

  return (
    <>
      <JsonLd data={SITE_LD} />
      <HomePage
        newProducts={latest.slice(0, 6)}
        deals={deals}
        selection={latest.slice(6)}
        categories={categories}
      />
    </>
  );
}
