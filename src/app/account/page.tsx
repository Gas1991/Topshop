import Link from 'next/link';

const WC_URL = process.env.NEXT_PUBLIC_WC_URL || 'https://shop.toprix.tn';

export default function AccountPage() {
  return (
    <main style={{ maxWidth: 800, margin: '60px auto', padding: '0 16px', textAlign: 'center' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>👤</div>
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 12 }}>Mon compte</h1>
      <p style={{ color: '#888', marginBottom: 32 }}>
        La gestion du compte est assurée par WooCommerce.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={`${WC_URL}/mon-compte/`}
          style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>
          Se connecter
        </a>
        <Link href="/shop"
          style={{ background: '#111', color: '#fff', fontWeight: 700, padding: '12px 28px', borderRadius: 8, textDecoration: 'none', fontSize: 15 }}>
          Voir les produits
        </Link>
      </div>
    </main>
  );
}
