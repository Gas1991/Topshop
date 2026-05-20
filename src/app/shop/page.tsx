import { api, getProductImage } from '@/lib/woocommerce';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ s?: string; cat?: string; on_sale?: string; orderby?: string }>;
}) {
  const params = await searchParams;
  const products = await (params.s
    ? api.products.search(params.s, 24)
    : params.cat
    ? api.categories.top(1).then(async (cats) => {
        const cat = cats.find((c) => c.slug === params.cat);
        return cat ? api.products.byCategory(cat.id, 24) : api.products.latest(24);
      })
    : api.products.latest(24)
  ).catch(() => []);

  return (
    <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        {params.s ? `Résultats pour "${params.s}"` : params.cat ? params.cat : 'Tous les produits'}
      </h1>

      {products.length === 0 ? (
        <p style={{ color: '#888' }}>Aucun produit trouvé.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {products.map((p) => {
            const img = getProductImage(p);
            const disc = p.regular_price && parseFloat(p.regular_price) > parseFloat(p.price)
              ? Math.round((parseFloat(p.regular_price) - parseFloat(p.price)) / parseFloat(p.regular_price) * 100)
              : 0;
            return (
              <Link key={p.id} href={`/product/${p.slug}`}
                style={{ textDecoration: 'none', color: 'inherit', background: '#fff', borderRadius: 12, border: '1px solid #eee', overflow: 'hidden', display: 'block' }}>
                <div style={{ height: 200, background: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {disc > 0 && <span style={{ position: 'absolute', top: 8, left: 8, background: '#E2231A', color: '#fff', fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 4 }}>-{disc}%</span>}
                  {img
                    ? <img src={img} alt={p.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', padding: 12 }} />
                    : <span style={{ fontSize: 48 }}>📦</span>}
                </div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, marginBottom: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#111' }}>{parseFloat(p.price).toFixed(3)} TND</div>
                  {disc > 0 && <div style={{ fontSize: 12, color: '#aaa', textDecoration: 'line-through' }}>{parseFloat(p.regular_price).toFixed(3)} TND</div>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
