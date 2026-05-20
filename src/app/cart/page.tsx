import Link from 'next/link';

export default function CartPage() {
  return (
    <main style={{ maxWidth: 800, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Votre panier</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>
        La gestion du panier sera disponible prochainement.<br />
        En attendant, vous pouvez ajouter des produits directement via WooCommerce.
      </p>
      <Link href="/shop"
        style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>
        Continuer mes achats
      </Link>
    </main>
  );
}
