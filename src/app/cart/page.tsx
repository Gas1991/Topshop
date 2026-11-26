'use client';
import { useEffect, useState } from 'react';
import { useCart, type CartItem } from '@/lib/cart';
import Link from 'next/link';

const LIVRAISON = 10;

export default function CartPage() {
  const { items, count, total, ready, removeItem, restoreItem, updateQty } = useCart();
  /* Dernier produit retire, pour pouvoir annuler */
  const [removed, setRemoved] = useState<{ item: CartItem; index: number } | null>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  function retirer(item: CartItem, index: number) {
    removeItem(item.id);
    setRemoved({ item, index });
  }

  function annuler() {
    if (removed) restoreItem(removed.item, removed.index);
    setRemoved(null);
  }

  const undo = removed && (
    <div className="cart-undo" role="status">
      <span><strong>{removed.item.name}</strong> a été retiré.</span>
      <button type="button" onClick={annuler}>Annuler</button>
    </div>
  );

  const styles = (
    <style>{`
      *, *::before, *::after { box-sizing: border-box; }
      .cart-wrap { max-width: 1000px; margin: 0 auto; padding: 0 16px 40px; }
      .cart-title { font-size: 24px; font-weight: 900; padding: 24px 0 16px; margin: 0; }
      .cart-layout { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: 20px; align-items: flex-start; }

      .cart-undo { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: #111; color: #fff; border-radius: 10px; padding: 6px 8px 6px 14px; font-size: 13px; margin-bottom: 12px; text-align: left; }
      .cart-undo span { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      .cart-undo button { flex-shrink: 0; min-height: 44px; padding: 0 14px; border: 0; border-radius: 8px; background: #FFB800; color: #111; font-weight: 800; cursor: pointer; }

      .cart-items { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); overflow: hidden; }
      .cart-item { display: grid; grid-template-columns: 88px minmax(0, 1fr); gap: 14px; align-items: start; padding: 14px 16px; border-bottom: 1px solid #f3f3f3; }
      .cart-item:last-child { border-bottom: 0; }
      .cart-item-img { display: block; width: 88px; height: 88px; object-fit: contain; border-radius: 10px; background: #F8F9FA; border: 1px solid #ececec; padding: 6px; mix-blend-mode: multiply; }
      .cart-item-name { font-size: 14px; font-weight: 600; color: #111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-decoration: none; }
      .cart-item-line { display: flex; align-items: baseline; flex-wrap: wrap; gap: 4px 10px; margin-top: 6px; }
      .cart-item-price { font-size: 16px; font-weight: 900; color: #111; }
      .cart-item-unit { font-size: 12px; color: #777; }
      .cart-item-actions { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 8px; }
      .cart-qty { display: inline-flex; align-items: center; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
      .cart-qty-btn { background: #fff; border: 0; width: 44px; height: 44px; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .1s; }
      .cart-qty-btn:hover { background: #FFF5D6; }
      .cart-qty-btn:disabled { color: #ccc; cursor: not-allowed; }
      .cart-qty-num { width: 40px; text-align: center; font-size: 14px; font-weight: 700; border-left: 1px solid #eee; border-right: 1px solid #eee; height: 44px; display: flex; align-items: center; justify-content: center; }
      .cart-remove { background: transparent; border: 0; color: #b91c1c; font-size: 13px; font-weight: 700; cursor: pointer; min-height: 44px; padding: 0 6px; }

      .cart-summary { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); position: sticky; top: 16px; padding: 20px; }
      .cart-summary-title { font-size: 16px; font-weight: 800; margin-bottom: 16px; }
      .cart-summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #555; margin-bottom: 10px; }
      .cart-summary-total { display: flex; justify-content: space-between; font-size: 18px; font-weight: 900; color: #111; padding-top: 14px; border-top: 2px solid #ececec; margin-top: 4px; }
      .cart-checkout-btn { display: block; width: 100%; margin-top: 16px; background: #FFB800; color: #111; font-weight: 800; font-size: 15px; padding: 14px; border-radius: 10px; text-align: center; text-decoration: none; box-shadow: 0 4px 0 #F2A900; transition: background .1s; }
      .cart-checkout-btn:hover { background: #F2A900; }
      .cart-continue { display: block; text-align: center; margin-top: 12px; padding: 12px 0; font-size: 13px; color: #666; text-decoration: none; }
      .cart-continue:hover { color: #111; }
      .cart-badges { display: flex; justify-content: space-around; margin-top: 16px; padding-top: 16px; border-top: 1px solid #f3f3f3; }
      .cart-trust { font-size: 12px; color: #777; font-weight: 600; text-align: center; }
      .cart-mobile-cta { display: none; }

      @media (max-width: 768px) {
        .cart-layout { grid-template-columns: minmax(0, 1fr); }
        .cart-summary { position: static; }
        .cart-title { font-size: 21px; padding: 16px 0 12px; }
        .cart-mobile-cta { display: flex; align-items: center; justify-content: space-between; gap: 12px; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: #fff; border-top: 1px solid #ececec; box-shadow: 0 -4px 12px rgba(0,0,0,.08); padding: 10px 14px calc(12px + env(safe-area-inset-bottom, 0px)); }
        .cart-mobile-total small { display: block; font-size: 12px; color: #666; }
        .cart-mobile-total strong { font-size: 18px; font-weight: 900; white-space: nowrap; }
        .cart-mobile-cta .cart-checkout-btn { width: auto; flex: 1; max-width: 220px; margin: 0; }
        body:has(.cart-mobile-cta) .footer { padding-bottom: 90px; }
      }
      @media (max-width: 420px) {
        .cart-item { grid-template-columns: 72px minmax(0, 1fr); gap: 10px; padding: 12px; }
        .cart-item-img { width: 72px; height: 72px; }
      }
    `}</style>
  );

  if (!ready) {
    return <main style={{ minHeight: '60vh', textAlign: 'center', paddingTop: 80, color: '#888' }}>Chargement…</main>;
  }

  if (items.length === 0) {
    return (
      <main style={{ maxWidth: 600, margin: '48px auto', padding: '0 16px', textAlign: 'center' }}>
        {styles}
        {undo}
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

  const grandTotal = (total + LIVRAISON).toFixed(3);

  return (
    <>
      {styles}
      <div className="cart-wrap">
        <h1 className="cart-title">Mon panier ({count} article{count > 1 ? 's' : ''})</h1>
        {undo}
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, index) => (
              <div key={item.id} className="cart-item">
                <Link href={`/produit/${item.slug}`} tabIndex={-1} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.img || 'https://placehold.co/88x88/F8F9FA/555?text=P'}
                    alt=""
                    className="cart-item-img"
                  />
                </Link>
                <div>
                  <Link href={`/produit/${item.slug}`} className="cart-item-name">{item.name}</Link>
                  <div className="cart-item-line">
                    <span className="cart-item-price">{(item.price * item.qty).toFixed(3)} TND</span>
                    {item.qty > 1 && <span className="cart-item-unit">{item.price.toFixed(3)} TND / unité</span>}
                  </div>
                  <div className="cart-item-actions">
                    <div className="cart-qty">
                      <button className="cart-qty-btn" aria-label="Diminuer la quantité" onClick={() => updateQty(item.id, item.qty - 1)} disabled={item.qty <= 1}>−</button>
                      <div className="cart-qty-num">{item.qty}</div>
                      <button className="cart-qty-btn" aria-label="Augmenter la quantité" onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                    </div>
                    <button className="cart-remove" onClick={() => retirer(item, index)} aria-label={`Retirer ${item.name}`}>🗑 Retirer</button>
                  </div>
                </div>
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
              <span>{LIVRAISON.toFixed(3)} TND</span>
            </div>
            <div className="cart-summary-total">
              <span>Total</span>
              <span>{grandTotal} TND</span>
            </div>
            <Link href="/checkout" className="cart-checkout-btn">
              Passer la commande →
            </Link>
            <Link href="/shop" className="cart-continue">
              ← Continuer mes achats
            </Link>
            <div className="cart-badges">
              <div className="cart-trust">💵 Paiement à la livraison</div>
              <Link className="cart-trust" href="/retours">🔄 Retour 15 jours</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="cart-mobile-cta">
        <div className="cart-mobile-total">
          <small>Total avec livraison</small>
          <strong>{grandTotal} TND</strong>
        </div>
        <Link href="/checkout" className="cart-checkout-btn">Commander →</Link>
      </div>
    </>
  );
}
