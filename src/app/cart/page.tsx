'use client';
import { useCart } from '@/lib/cart';
import Link from 'next/link';

export default function CartPage() {
  const { items, count, total, removeItem, updateQty } = useCart();

  if (items.length === 0) {
    return (
      <main style={{ maxWidth: 600, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 20 }}>🛒</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 12 }}>Votre panier est vide</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>
          Découvrez nos meilleures offres et ajoutez des produits à votre panier.
        </p>
        <Link
          href="/shop"
          style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}
        >
          Découvrir nos produits
        </Link>
      </main>
    );
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .cart-wrap { max-width: 1000px; margin: 0 auto; padding: 0 16px 80px; }
        .cart-title { font-size: 24px; font-weight: 900; padding: 28px 0 20px; }
        .cart-layout { display: grid; grid-template-columns: 1fr 340px; gap: 20px; align-items: flex-start; }

        .cart-items { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); overflow: hidden; }
        .cart-item { display: grid; grid-template-columns: 80px 1fr auto; gap: 14px; align-items: center; padding: 16px 20px; border-bottom: 1px solid #f3f3f3; }
        .cart-item:last-child { border-bottom: 0; }
        .cart-item-img { width: 80px; height: 80px; object-fit: contain; border-radius: 10px; background: #F8F9FA; border: 1px solid #ececec; padding: 6px; mix-blend-mode: multiply; }
        .cart-item-name { font-size: 14px; font-weight: 600; color: #111; line-height: 1.35; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .cart-item-price { font-size: 15px; font-weight: 900; color: #111; }
        .cart-item-unit { font-size: 12px; color: #888; margin-top: 2px; }
        .cart-qty { display: inline-flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; margin-top: 8px; }
        .cart-qty-btn { background: #fff; border: 0; width: 34px; height: 34px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .1s; }
        .cart-qty-btn:hover { background: #FFF5D6; }
        .cart-qty-btn:disabled { color: #ccc; cursor: not-allowed; }
        .cart-qty-num { width: 40px; text-align: center; font-size: 14px; font-weight: 700; border-left: 1px solid #eee; border-right: 1px solid #eee; height: 34px; display: flex; align-items: center; justify-content: center; }
        .cart-remove { background: transparent; border: 0; color: #bbb; font-size: 18px; cursor: pointer; padding: 4px; line-height: 1; display: flex; align-items: center; justify-content: center; transition: color .1s; align-self: flex-start; }
        .cart-remove:hover { color: #dc2626; }

        .cart-summary { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); position: sticky; top: 16px; padding: 20px; }
        .cart-summary-title { font-size: 16px; font-weight: 800; margin-bottom: 16px; }
        .cart-summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 10px; }
        .cart-summary-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #111; padding-top: 14px; border-top: 2px solid #ececec; margin-top: 4px; }
        .cart-checkout-btn { display: block; width: 100%; margin-top: 16px; background: #FFB800; color: #111; font-weight: 800; font-size: 15px; padding: 14px; border-radius: 10px; text-align: center; text-decoration: none; box-shadow: 0 4px 0 #F2A900; transition: background .1s; }
        .cart-checkout-btn:hover { background: #F2A900; }
        .cart-continue { display: block; text-align: center; margin-top: 12px; font-size: 13px; color: #888; text-decoration: none; }
        .cart-continue:hover { color: #111; }
        .cart-badges { display: flex; justify-content: space-around; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f3f3f3; }
        .cart-badge { font-size: 11px; color: #888; font-weight: 600; text-align: center; }

        @media (max-width: 768px) {
          .cart-layout { grid-template-columns: 1fr; }
          .cart-summary { position: static; }
        }
        @media (max-width: 480px) {
          .cart-item { grid-template-columns: 64px 1fr auto; gap: 10px; }
          .cart-item-img { width: 64px; height: 64px; }
        }
      `}</style>

      <div className="cart-wrap">
        <h1 className="cart-title">Mon panier ({count} article{count > 1 ? 's' : ''})</h1>
        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.img || 'https://placehold.co/80x80/F8F9FA/555?text=P'}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">{(item.price * item.qty).toFixed(3)} TND</div>
                  {item.qty > 1 && (
                    <div className="cart-item-unit">{item.price.toFixed(3)} TND / unité</div>
                  )}
                  <div className="cart-qty">
                    <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                    <div className="cart-qty-num">{item.qty}</div>
                    <button className="cart-qty-btn" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-remove" onClick={() => removeItem(item.id)} aria-label="Supprimer">✕</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-title">Récapitulatif</div>
            <div className="cart-summary-row">
              <span>Sous-total ({count} article{count > 1 ? 's' : ''})</span>
              <span>{total.toFixed(3)} TND</span>
            </div>
            <div className="cart-summary-row">
              <span>Livraison</span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>À calculer</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>{total.toFixed(3)} TND</span>
            </div>
            <Link href="/checkout" className="cart-checkout-btn">
              Passer la commande →
            </Link>
            <Link href="/shop" className="cart-continue">
              ← Continuer mes achats
            </Link>
            <div className="cart-badges">
              <div className="cart-badge">🔒 SSL</div>
              <div className="cart-badge">🔄 Retour 30j</div>
              <div className="cart-badge">📦 Livraison</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
