import { NextResponse } from 'next/server';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.toprix.tn';

export const revalidate = 86400;

const STATIC_PAGES = [
  { path: '/',                priority: '1.0', changefreq: 'daily'   },
  { path: '/shop',            priority: '0.9', changefreq: 'hourly'  },
  { path: '/a-propos',        priority: '0.5', changefreq: 'monthly' },
  { path: '/contact',         priority: '0.6', changefreq: 'monthly' },
  { path: '/livraison',       priority: '0.6', changefreq: 'monthly' },
  { path: '/retours',         priority: '0.5', changefreq: 'monthly' },
  { path: '/confidentialite', priority: '0.3', changefreq: 'yearly'  },
];

export async function GET() {
  const now = new Date().toISOString();

  const urls = STATIC_PAGES.map(p => `
  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
    },
  });
}
