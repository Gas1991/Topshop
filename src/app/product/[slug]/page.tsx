import { api } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/ProductPageClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
