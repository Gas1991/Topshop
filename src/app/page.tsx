// Homepage — remplacer par le composant Claude Design
import { api } from '@/lib/woocommerce';

export default async function HomePage() {
  const [newProducts, deals, categories] = await Promise.all([
    api.products.latest(8),
    api.products.onSale(8),
    api.categories.top(10),
  ]);

  return (
    <main>
      {/* TODO: coller ici le composant Claude Design */}
      <pre style={{ padding: 20, fontFamily: 'monospace', fontSize: 13 }}>
        ✅ API connectée{'\n'}
        Nouveautés : {newProducts.length} produits{'\n'}
        Bons plans  : {deals.length} produits{'\n'}
        Catégories  : {categories.length}
      </pre>
    </main>
  );
}
