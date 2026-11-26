'use client';
/** Notification affichee apres un ajout au panier, sur toutes les pages sauf panier et commande. */
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';

const DUREE_MS = 5000;

export default function CartNotice() {
  const { notice, closeNotice, count, total } = useCart();
  const path = usePathname() || '';
  const pageAchat = path.startsWith('/cart') || path.startsWith('/checkout');

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(closeNotice, DUREE_MS);
    return () => clearTimeout(t);
  }, [notice, closeNotice]);

  useEffect(() => { if (pageAchat) closeNotice(); }, [pageAchat, closeNotice]);

  return (
    <div className="cn-zone" role="status" aria-live="polite">
      {notice && !pageAchat && (
        <div className="cn" key={notice.key}>
          <div className="cn-head">
            <span className="cn-ic" aria-hidden="true">✓</span>
            Ajouté au panier
            <button type="button" className="cn-close" onClick={closeNotice} aria-label="Fermer">✕</button>
          </div>
          <div className="cn-body">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {notice.img && <img src={notice.img} alt="" />}
            <div>
              <div className="cn-name">{notice.name}</div>
              <div className="cn-price">{notice.qty > 1 ? `${notice.qty} × ` : ''}{notice.price.toFixed(3)} TND</div>
            </div>
          </div>
          <div className="cn-total">Panier : {count} article{count > 1 ? 's' : ''} · {total.toFixed(3)} TND (hors livraison)</div>
          <div className="cn-actions">
            <Link href="/cart" className="cn-view" onClick={closeNotice}>Voir le panier</Link>
            <Link href="/checkout" className="cn-buy" onClick={closeNotice}>Commander</Link>
          </div>
        </div>
      )}
    </div>
  );
}
