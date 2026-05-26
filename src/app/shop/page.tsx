import { api } from '@/lib/woocommerce';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const BAD = ['non-classe', 'other-categories', 'uncategorized', 'autre'];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; cat?: string; on_sale?: string }>;
}) {
  const params = await searchParams;

  // Fetch categories + resolve category slug to ID in parallel
  const [categories, catForFilter] = await Promise.all([
    api.categories.top(20).catch(() => []),
    params.cat ? api.categories.bySlug(params.cat).catch(() => null) : Promise.resolve(null),
  ]);

  // Clean categories for sidebar (remove garbage slugs/names)
  const cleanCategories = categories.filter(c =>
    !BAD.some(b => c.slug.startsWith(b)) && !c.name.includes('|') && c.count > 0
  );

  // Fetch products based on URL params
  const products = await (
    params.s
      ? api.products.search(params.s, 48)
      : catForFilter
      ? api.products.byCategory(catForFilter.id, 48)
      : params.on_sale
      ? api.products.onSale(48)
      : api.products.latest(48)
  ).catch(() => []);

  const title = params.s
    ? `Résultats pour "${params.s}"`
    : catForFilter
    ? catForFilter.name
    : params.on_sale
    ? 'Offres & Promotions'
    : 'Tous les produits';

  return (
    <Suspense>
      <ShopClient
        products={products}
        categories={cleanCategories}
        title={title}
        total={products.length}
      />
    </Suspense>
  );
}
