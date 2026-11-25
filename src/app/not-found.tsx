import Link from 'next/link';
import { api } from '@/lib/woocommerce';

export default async function NotFound() {
  const categories = await api.categories.top(6).catch(() => []);
  return (
    <main className="nf">
      <h1>Page introuvable</h1>
      <p>Ce produit ou cette page n’est plus disponible. Cherchez un autre produit :</p>
      <form action="/shop" role="search" className="nf-search">
        <input type="search" name="s" placeholder="Rechercher un produit…" aria-label="Rechercher un produit" />
        <button type="submit">Rechercher</button>
      </form>
      <div className="nf-cats">
        {categories.map(c => (
          <Link key={c.slug} href={`/categorie/${decodeURIComponent(c.slug)}`}>{c.icon} {c.name}</Link>
        ))}
      </div>
      <Link href="/shop" className="nf-all">Voir tous les produits</Link>
    </main>
  );
}
