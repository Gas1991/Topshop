import { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.toprix.tn';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Pages privées / transactionnelles
          '/checkout',
          '/cart',
          '/account',
          '/account/login',
          '/account/register',
          '/suivi-commande',
          // Routes internes
          '/api/',
          // Recherche, filtres et tris (la pagination ?page= reste explorable)
          '/*?*s=',
          '/*?*cat=',
          '/*?*on_sale=',
          '/*?*orderby=',
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
