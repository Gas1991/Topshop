import { api, getProductImage, getBrand } from '@/lib/woocommerce';
import { notFound } from 'next/navigation';
import ProductPageClient from '@/components/ProductPageClient';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) return {};
  const image = getProductImage(product);
  const canonical = `https://shop.toprix.tn/produit/${slug}`;
  return {
    title: `${product.name} — Toprix.tn`,
    description: product.short_description?.replace(/<[^>]*>/g, '').slice(0, 160)
      || `Achetez ${product.name} au meilleur prix en Tunisie. Livraison rapide partout en Tunisie.`,
    alternates: { canonical },
    openGraph: {
      title: product.name,
      description: `${product.name} à ${parseFloat(product.price).toFixed(3)} TND — Toprix.tn`,
      url: canonical,
      ...(image ? { images: [{ url: image }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) notFound();

  const image = getProductImage(product);
  const price = parseFloat(product.price) || 0;
  const regular = parseFloat(product.regular_price) || price;
  const brand = getBrand(product);
  const rating = parseFloat(product.average_rating) || 0;

  const canonical = `https://shop.toprix.tn/produit/${product.slug}`;
  const stockText = product.stock_status === 'instock' ? 'Oui, ce produit est actuellement en stock et disponible à la livraison partout en Tunisie.' : 'Ce produit est temporairement en rupture de stock. Revenez bientôt pour vérifier sa disponibilité.';

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Quel est le prix de ${product.name} en Tunisie ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: regular > price
            ? `Le ${product.name} est disponible à ${price.toFixed(3)} TND au lieu de ${regular.toFixed(3)} TND, soit une réduction de ${Math.round((regular - price) / regular * 100)}%. Livraison disponible partout en Tunisie.`
            : `Le ${product.name} est disponible à ${price.toFixed(3)} TND sur Toprix.tn avec livraison partout en Tunisie.`,
        },
      },
      {
        '@type': 'Question',
        name: `Est-ce que ${product.name} est disponible en stock ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: stockText,
        },
      },
      {
        '@type': 'Question',
        name: `Quelles sont les conditions de livraison pour ${product.name} ?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Le ${product.name} est livré sous 48 à 72h partout en Tunisie. Paiement à la livraison (COD) disponible. Retour gratuit sous 30 jours si le produit ne vous convient pas.`,
        },
      },
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(image ? { image: [image] } : {}),
    description: product.short_description?.replace(/<[^>]*>/g, '').slice(0, 500)
      || `${product.name} — Toprix.tn`,
    ...(product.sku ? { sku: product.sku } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    offers: {
      '@type': 'Offer',
      url: canonical,
      priceCurrency: 'TND',
      price: price.toFixed(2),
      ...(regular > price ? { priceValidUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0] } : {}),
      availability: product.stock_status === 'instock'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'Toprix' },
    },
    ...(rating > 0 && product.rating_count > 0 ? {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: rating.toFixed(1),
        reviewCount: product.rating_count,
      },
    } : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <ProductPageClient product={product} />
    </>
  );
}
