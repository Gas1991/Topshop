import { NextResponse } from 'next/server';

const SITE      = process.env.NEXT_PUBLIC_SITE_URL   || 'https://shop.toprix.tn';
const WC_URL    = process.env.NEXT_PUBLIC_WC_URL     || 'https://shop.toprix.tn';
const WC_KEY    = process.env.WC_CONSUMER_KEY         || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET      || '';

export const revalidate = 3600; // 1h

interface WCProduct { slug: string; date_modified: string; }

async function fetchAllProducts(): Promise<WCProduct[]> {
  const products: WCProduct[] = [];
  let page = 1;

  while (true) {
    const url = new URL(`${WC_URL}/wp-json/wc/v3/products`);
    url.searchParams.set('consumer_key', WC_KEY);
    url.searchParams.set('consumer_secret', WC_SECRET);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('status', 'publish');
    url.searchParams.set('_fields', 'slug,date_modified');

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) break;

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const data: WCProduct[] = await res.json();
    products.push(...data);

    if (page >= totalPages) break;
    page++;
  }

  return products;
}

export async function GET() {
  const products = await fetchAllProducts().catch(() => []);

  const urls = products.map(p => `
  <url>
    <loc>${SITE}/produit/${p.slug}</loc>
    <lastmod>${p.date_modified ? new Date(p.date_modified).toISOString() : new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=600',
    },
  });
}
