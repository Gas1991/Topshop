import { api, getProductImage, getBrand } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/ProductPageClient';
import JsonLd from '@/components/JsonLd';
import { SITE_URL, stripHtml, breadcrumbLd } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) return {};
  const image = getProductImage(product);
  const canonical = `${SITE_URL}/produit/${slug}`;
  return {
    title: `${product.name} — Topshop.tn`,
    description: stripHtml(product.short_description || product.description, 160)
      || `Achetez ${product.name} en Tunisie. Paiement à la livraison.`,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: `${product.name} à ${parseFloat(product.price).toFixed(3)} TND — Topshop.tn`,
      url: canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) notFound();

  const category = product.categories[0];
  const similar = category
    ? (await api.products.byCategory(category.id, 7).catch(() => []))
        .filter(p => p.id !== product.id)
        .slice(0, 6)
    : [];

  const image = getProductImage(product);
  const price = parseFloat(product.price) || 0;
  const regular = parseFloat(product.regular_price) || price;
  const brand = getBrand(product);
  const rating = parseFloat(product.average_rating) || 0;

  const canonical = `${SITE_URL}/produit/${product.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(image ? { image: [image] } : {}),
    description: stripHtml(product.description || product.short_description) || product.name,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'TND',
      price: price.toFixed(3),
      ...(regular > price ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] } : {}),
      availability: product.stock_status === 'instock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Topshop.tn' },
    },
    ...(rating > 0 && product.rating_count > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toFixed(1),
        reviewCount: product.rating_count,
      },
    } : {}),
  };

  const fil = breadcrumbLd([
    { name: 'Accueil', path: '/' },
    { name: 'Boutique', path: '/shop' },
    ...(category ? [{ name: category.name, path: `/categorie/${category.slug}` }] : []),
    { name: product.name, path: `/produit/${product.slug}` },
  ]);

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={fil} />
      <ProductPageClient product={product} similar={similar} />
    </>
  );
}
