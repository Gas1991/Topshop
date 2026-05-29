import { NextResponse } from 'next/server';

const SITE       = process.env.NEXT_PUBLIC_SITE_URL    || 'https://shop.toprix.tn';
const WC_URL     = process.env.NEXT_PUBLIC_WC_URL      || 'https://shop.toprix.tn';
const WC_KEY     = process.env.WC_CONSUMER_KEY          || '';
const WC_SECRET  = process.env.WC_CONSUMER_SECRET       || '';

export const revalidate = 3600; // 1h

interface WCCategory { slug: string; count: number; }

async function fetchAllCategories(): Promise<WCCategory[]> {
  const categories: WCCategory[] = [];
  let page = 1;

  while (true) {
    const url = new URL(`${WC_URL}/wp-json/wc/v3/products/categories`);
    url.searchParams.set('consumer_key', WC_KEY);
    url.searchParams.set('consumer_secret', WC_SECRET);
    url.searchParams.set('per_page', '100');
    url.searchParams.set('page', String(page));
    url.searchParams.set('hide_empty', '1');
    url.searchParams.set('_fields', 'slug,count');

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) break;

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
    const data: WCCategory[] = await res.json();
    categories.push(...data.filter(c => c.count > 0));

    if (page >= totalPages) break;
    page++;
  }

  return categories;
}

export async function GET() {
  const BAD = ['non-clause', 'other-categories', 'uncategorized', 'autre'];
  const categories = await fetchAllCategories().catch(() => []);
  const clean = categories.filter(c => !BAD.some(b => c.slug.startsWith(b)));

  const urls = clean.map(c => `
  <url>
    <loc>${SITE}/categorie/${encodeURIComponent(c.slug)}</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
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
