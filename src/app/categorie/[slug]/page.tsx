import { api } from '@/lib/woocommerce';
import ShopClient from '@/components/ShopClient';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import JsonLd from '@/components/JsonLd';
import { breadcrumbLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await api.categories.top(50).catch(() => []);
  return categories.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const page = Math.max(1, parseInt((await searchParams).page || '1', 10));
  const category = await api.categories.bySlug(slug).catch(() => null);
  if (!category) return {};
  return {
    title: `${category.name}${page > 1 ? ` — page ${page}` : ''} — Topshop.tn`,
    description: `Découvrez nos produits ${category.name} en Tunisie. Livraison partout dans le pays, paiement à la livraison.`,
    alternates: { canonical: `/categorie/${slug}${page > 1 ? `?page=${page}` : ''}` },
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

  const { data: products, total, totalPages } = await api.products
    .byCategoryPaged(category.id, currentPage)
    .catch(() => ({ data: [], total: 0, totalPages: 1 }));

  return (
    <Suspense>
      <JsonLd data={breadcrumbLd([
        { name: 'Accueil', path: '/' },
        { name: 'Boutique', path: '/shop' },
        { name: category.name, path: `/categorie/${slug}` },
      ])} />
      <ShopClient
        products={products}
        categories={categories}
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
