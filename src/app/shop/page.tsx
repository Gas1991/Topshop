import { api } from '@/lib/woocommerce';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; cat?: string }>;
}) {
  const params = await searchParams;

  const [categories, products] = await Promise.all([
    api.categories.top(20).catch(() => []),
    (params.s
      ? api.products.search(params.s, 48)
      : params.cat
      ? api.categories.top(20).then(async cats => {
          const cat = cats.find(c => c.slug === params.cat);
          return cat ? api.products.byCategory(cat.id, 48) : api.products.latest(48);
        })
      : api.products.latest(48)
    ).catch(() => []),
  ]);

  const title = params.s
    ? `Résultats pour "${params.s}"`
    : params.cat
    ? categories.find(c => c.slug === params.cat)?.name || params.cat
    : 'Tous les produits';

  return (
    <Suspense>
      <ShopClient
        products={products}
        categories={categories}
        title={title}
        total={products.length}
      />
    </Suspense>
  );
}
