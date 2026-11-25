/**
 * WooCommerce REST API client
 * Docs: https://woocommerce.github.io/woocommerce-rest-api-docs/
 */

import { categorieFr, CATEGORIES_EN_DERNIER } from './categories';

const WC_URL    = process.env.NEXT_PUBLIC_WC_URL    || 'https://shop.toprix.tn';
const WC_KEY    = process.env.WC_CONSUMER_KEY        || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET     || '';

async function wcFetch<T>(endpoint: string, params: Record<string, string | number> = {}, revalidate = 60): Promise<T> {
  const url = new URL(`${WC_URL}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.set('consumer_key', WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), { next: { revalidate } });
  if (!res.ok) throw new Error(`WC API error: ${res.status} ${endpoint}`);
  return franciser(await res.json());
}

export interface PagedResult<T> {
  data: T;
  total: number;
  totalPages: number;
}

async function wcFetchPaged<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<PagedResult<T>> {
  const url = new URL(`${WC_URL}/wp-json/wc/v3/${endpoint}`);
  url.searchParams.set('consumer_key', WC_KEY);
  url.searchParams.set('consumer_secret', WC_SECRET);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`WC API error: ${res.status} ${endpoint}`);

  const total      = parseInt(res.headers.get('X-WP-Total')      || '0', 10);
  const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1', 10);
  const data       = franciser(await res.json() as T);
  return { data, total, totalPages };
}

/* ── Types ─────────────────────────────────────────────────────── */
export interface WCImage {
  id: number;
  src: string;
  alt: string;
}

export interface WCProduct {
  id: number;
  name: string;
  slug: string;
  sku: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  rating_count: number;
  images: WCImage[];
  categories: { id: number; name: string; slug: string }[];
  tags: { id: number; name: string; slug: string }[];
  stock_status: string;
  short_description: string;
  description: string;
  meta_data: { key: string; value: string }[];
}

export interface WCCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
  image: WCImage | null;
  parent: number;
  icon?: string;
}

/** Remplace les noms de categories (arabe) par leur nom francais, dans les produits comme dans les categories. */
function franciser<T>(data: T): T {
  if (!Array.isArray(data)) return data;
  return data.map(item => {
    if (item && Array.isArray(item.categories)) {
      return { ...item, categories: item.categories.map((c: { name: string }) => ({ ...c, name: categorieFr(c.name).name })) };
    }
    if (item && typeof item.count === 'number' && 'parent' in item) {
      return { ...item, ...categorieFr(item.name) };
    }
    return item;
  }) as T;
}

/* ── Helpers ────────────────────────────────────────────────────── */
export function getProductImage(p: WCProduct): string {
  if (p.images?.[0]?.src) return p.images[0].src;
  const meta = p.meta_data?.find(m => m.key === '_toprix_image_url');
  return meta?.value || '';
}

export function getDiscount(p: WCProduct): number {
  const price   = parseFloat(p.price);
  const regular = parseFloat(p.regular_price);
  if (!regular || !price || price >= regular) return 0;
  return Math.round((regular - price) / regular * 100);
}

export function getBrand(p: WCProduct): string {
  const boutiques = ['mytek', 'spacenet', 'tunisianet', 'topshop'];
  return p.tags.find(t => !boutiques.includes(t.slug))?.name || '';
}

/* ── API calls ──────────────────────────────────────────────────── */
const PER_PAGE = 24;

export const api = {
  products: {
    latest: (limit = 8) =>
      wcFetch<WCProduct[]>('products', { orderby: 'date', order: 'desc', per_page: limit, status: 'publish' }),

    onSale: (limit = 8) =>
      wcFetch<WCProduct[]>('products', { on_sale: 1, orderby: 'date', order: 'desc', per_page: limit, status: 'publish' }),

    byCategory: (categoryId: number, limit = 48) =>
      wcFetch<WCProduct[]>('products', { category: categoryId, per_page: limit, status: 'publish', orderby: 'popularity', order: 'desc' }),

    search: (query: string, limit = 20) =>
      wcFetch<WCProduct[]>('products', { search: query, per_page: limit, status: 'publish' }),

    bySlug: async (slug: string) => {
      // status=publish : un produit masque (brouillon, ex. rupture Shipper) ne doit pas etre accessible par son URL
      const products = await wcFetch<WCProduct[]>('products', { slug, status: 'publish' });
      return products[0] || null;
    },

    /* ── Paginées (pour /shop) ── */
    latestPaged: (page = 1) =>
      wcFetchPaged<WCProduct[]>('products', { orderby: 'date', order: 'desc', per_page: PER_PAGE, page, status: 'publish' }),

    onSalePaged: (page = 1) =>
      wcFetchPaged<WCProduct[]>('products', { on_sale: 1, orderby: 'date', order: 'desc', per_page: PER_PAGE, page, status: 'publish' }),

    byCategoryPaged: (categoryId: number, page = 1) =>
      wcFetchPaged<WCProduct[]>('products', { category: categoryId, per_page: PER_PAGE, page, status: 'publish', orderby: 'popularity', order: 'desc' }),

    searchPaged: (query: string, page = 1) =>
      wcFetchPaged<WCProduct[]>('products', { search: query, per_page: PER_PAGE, page, status: 'publish' }),
  },

  categories: {
    /** Les plus grandes categories ; les fourre-tout passent a la fin, les doublons et "Non classe" sont ecartes. */
    top: async (limit = 10) => {
      const cats = await wcFetch<WCCategory[]>('products/categories', {
        hide_empty: 1, per_page: Math.min(100, limit + 10), orderby: 'count', order: 'desc',
      }, 3600);
      const vues = new Set<string>();
      const propres = cats.filter(c => {
        if (c.slug === 'non-classe' || c.slug === 'uncategorized' || vues.has(c.name)) return false;
        vues.add(c.name);
        return c.count > 0;
      });
      const rang = (c: WCCategory) => (CATEGORIES_EN_DERNIER.includes(c.name) ? 1 : 0);
      return propres.sort((a, b) => rang(a) - rang(b)).slice(0, limit);
    },
    bySlug: (slug: string) =>
      wcFetch<WCCategory[]>('products/categories', { slug, per_page: 1 }, 3600)
        .then(cats => cats[0] ?? null),
  },
};
