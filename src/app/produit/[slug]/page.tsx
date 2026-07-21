import { api, getProductImage } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/ProductPageClient';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) return {};
  const image = getProductImage(product);
  return {
    title: `${product.name} — Toprix.tn`,
    description: product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160)
      || `Achetez ${product.name} au meilleur prix en Tunisie. Livraison rapide partout en Tunisie.`,
    openGraph: {
      title: product.name,
      description: `${product.name} à ${parseFloat(product.price).toFixed(3)} TND — Toprix.tn`,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) notFound();

  return <ProductPageClient product={product} />;
}
