import { api } from '@/lib/woocommerce';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

const BAD = ['non-clause', 'other-categories', 'uncategorized', 'autre'];

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await api.categories.top(50).catch(() => []);
  return categories
    .filter(c => !BAD.some(b => c.slug.startsWith(b)) && c.count > 0)
    .map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await api.categories.bySlug(slug).catch(() => null);
  if (!category) return {};
  return {
    title: `${category.name} — Topshop.tn`,
    description: `Découvrez nos produits ${category.name} au meilleur prix en Tunisie. Livraison rapide partout en Tunisie.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const currentPage = Math.max(1, parseInt(sp.page || '1', 10));

  const [categories, category] = await Promise.all([
    api.categories.top(20).catch(() => []),
    api.categories.bySlug(slug).catch(() => null),
  ]);

  if (!category) notFound();

  const cleanCategories = categories.filter(c =>
    !BAD.some(b => c.slug.startsWith(b)) && !c.name.includes('|') && c.count > 0
  );

  const { data: products, total, totalPages } = await api.products
    .byCategoryPaged(category.id, currentPage)
    .catch(() => ({ data: [], total: 0, totalPages: 1 }));

  return (
    <Suspense>
      <ShopClient
        products={products}
        categories={cleanCategories}
        title={category.name}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        baseUrl={`/categorie/${slug}`}
        activeCat={slug}
      />
    </Suspense>
  );
}
