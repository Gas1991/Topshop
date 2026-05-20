import { api } from '@/lib/woocommerce';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await api.products.bySlug(slug).catch(() => null);
  if (!product) notFound();

  const img = product.images?.[0]?.src;
  const price = parseFloat(product.price);
  const regular = parseFloat(product.regular_price);
  const disc = regular > price ? Math.round((regular - price) / regular * 100) : 0;

  return (
    <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 16px' }}>
      <Link href="/shop" style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
        ← Retour à la boutique
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Image */}
        <div style={{ background: '#f8f8f8', borderRadius: 16, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          {img
            ? <img src={img} alt={product.name} style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain' }} />
            : <span style={{ fontSize: 80 }}>📦</span>}
        </div>

        {/* Info */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.35, marginBottom: 16 }}>{product.name}</h1>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#111' }}>{price.toFixed(3)} TND</span>
            {disc > 0 && <>
              <span style={{ fontSize: 16, color: '#aaa', textDecoration: 'line-through' }}>{regular.toFixed(3)} TND</span>
              <span style={{ background: '#E2231A', color: '#fff', fontSize: 12, fontWeight: 800, padding: '2px 8px', borderRadius: 4 }}>-{disc}%</span>
            </>}
          </div>

          {product.stock_status === 'instock'
            ? <div style={{ color: '#16a34a', fontWeight: 600, fontSize: 13, marginBottom: 20 }}>✓ En stock</div>
            : <div style={{ color: '#dc2626', fontWeight: 600, fontSize: 13, marginBottom: 20 }}>✗ Rupture de stock</div>}

          <a href={product.permalink} target="_blank" rel="noopener noreferrer"
            style={{ display: 'block', background: '#FFB800', color: '#111', fontWeight: 800, fontSize: 16, padding: '14px 0', borderRadius: 10, textAlign: 'center', textDecoration: 'none', marginBottom: 12 }}>
            Ajouter au panier
          </a>

          {product.short_description && (
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6, marginTop: 24 }}
              dangerouslySetInnerHTML={{ __html: product.short_description }} />
          )}
        </div>
      </div>
    </main>
  );
}
