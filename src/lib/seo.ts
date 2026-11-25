export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.toprix.tn';

const ENTITES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

/** HTML WooCommerce -> texte simple (descriptions des balises meta et des donnees structurees). */
export function stripHtml(html: string | undefined, max = 500): string {
  return (html || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&([a-z]+);/gi, (m, n) => ENTITES[n.toLowerCase()] ?? m)
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

/** Fil d'Ariane au format schema.org. `path` vide pour la page courante sans lien. */
export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

/** JSON.stringify pour injection dans un <script> : echappe '<' pour qu'un nom
 * ou une description contenant "</script>" ne puisse jamais casser le tag et
 * injecter du HTML/JS (XSS). \u003c reste un JSON valide identique une fois
 * reparse. */
export function toJsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
