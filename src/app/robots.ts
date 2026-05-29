import { MetadataRoute } from 'next';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://topshop.tn';

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
          '/_next/',
          // URLs avec paramètres de requête
          '/*?*',
        ],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
