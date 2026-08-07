import { api } from '@/lib/woocommerce';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const BAD = ['non-clause', 'other-categories', 'uncategorized', 'autre'];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; cat?: string; on_sale?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));

  // Fetch categories + resolve category slug in parallel
  const [categories, catForFilter] = await Promise.all([
    api.categories.top(20).catch(() => []),
    params.cat ? api.categories.bySlug(params.cat).catch(() => null) : Promise.resolve(null),
  ]);

  const cleanCategories = categories.filter(c =>
    !BAD.some(b => c.slug.startsWith(b)) && !c.name.includes('|') && c.count > 0
  );

  // Fetch products (paginées — 24/page via X-WP-Total headers)
  const { data: products, total, totalPages } = await (
    params.s       ? api.products.searchPaged(params.s, currentPage)           :
    catForFilter   ? api.products.byCategoryPaged(catForFilter.id, currentPage) :
    params.on_sale ? api.products.onSalePaged(currentPage)                      :
                     api.products.latestPaged(currentPage)
  ).catch(() => ({ data: [], total: 0, totalPages: 1 }));

  const title = params.s
    ? `Résultats pour "${params.s}"`
    : catForFilter
    ? catForFilter.name
    : params.on_sale
    ? 'Offres & Promotions'
    : 'Tous les produits';

  // Base URL (tous les params sauf page, pour construire les liens de pagination)
  const baseParams = new URLSearchParams();
  if (params.s)       baseParams.set('s', params.s);
  if (params.cat)     baseParams.set('cat', params.cat);
  if (params.on_sale) baseParams.set('on_sale', '1');
  const baseQs  = baseParams.toString();
  const baseUrl = baseQs ? `/shop?${baseQs}` : '/shop';

  return (
    <Suspense>
      <ShopClient
        products={products}
        categories={cleanCategories}
        title={title}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={baseUrl}
      />
    </Suspense>
  );
}
