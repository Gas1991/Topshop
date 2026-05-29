'use client';
import { useState } from 'react';
import Link from 'next/link';
import { StoredOrder } from '@/lib/auth';

type Status = StoredOrder['status'];

const STATUS_LABEL: Record<Status, string> = {
  en_attente:     'En attente',
  confirmee:      'Confirmée',
  en_preparation: 'En préparation',
  en_livraison:   'En livraison',
  livree:         'Livrée',
};
const STATUS_COLOR: Record<Status, string> = {
  en_attente:     '#888',
  confirmee:      '#2563eb',
  en_preparation: '#d97706',
  en_livraison:   '#7c3aed',
  livree:         '#16a34a',
};
const STATUS_BG: Record<Status, string> = {
  en_attente:     '#f3f4f6',
  confirmee:      '#dbeafe',
  en_preparation: '#fef3c7',
  en_livraison:   '#ede9fe',
  livree:         '#dcfce7',
};
const STEPS: Status[] = ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree'];

function getOrders(): StoredOrder[] {
  try { return JSON.parse(localStorage.getItem('toprix_orders') || '[]'); }
  catch { return []; }
}

export default function SuiviCommandePage() {
  const [input, setInput] = useState('');
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = input.trim().toUpperCase().replace(/^#/, '');
    if (!q) { setError('Entrez votre numéro de commande'); return; }
    const orders = getOrders();
    const found = orders.find(o => o.id.toUpperCase() === q);
    setSearched(true);
    if (!found) {
      setOrder(null);
      setError('Aucune commande trouvée avec ce numéro sur cet appareil.');
    } else {
      setOrder(found);
      setError('');
    }
  }

  const si = order ? STEPS.indexOf(order.status) : 0;
  const progress = si === 0 ? 0 : (si / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .sv-wrap { max-width: 760px; margin: 0 auto; padding: 40px 16px 80px; }
        .sv-hero { text-align: center; margin-bottom: 36px; }
        .sv-icon { font-size: 52px; margin-bottom: 12px; }
        .sv-title { font-size: 28px; font-weight: 900; color: #111; margin-bottom: 8px; }
        .sv-sub { font-size: 15px; color: #888; }

        .sv-form-card { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,.08); padding: 28px; margin-bottom: 24px; }
        .sv-form { display: flex; gap: 12px; }
        .sv-input { flex: 1; border: 2px solid #e0e0e0; border-radius: 12px; padding: 14px 16px; font-size: 16px; font-family: inherit; outline: none; transition: border-color .12s; }
        .sv-input:focus { border-color: #FFB800; }
        .sv-btn { background: #FFB800; color: #111; border: 0; border-radius: 12px; padding: 14px 24px; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; white-space: nowrap; transition: all .12s; }
        .sv-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .sv-hint { font-size: 12px; color: #aaa; margin-top: 10px; }
        .sv-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 10px; padding: 14px 16px; font-size: 14px; color: #dc2626; font-weight: 600; margin-top: 12px; }

        .sv-result { background: #fff; border-radius: 16px; box-shadow: 0 2px 16px rgba(0,0,0,.08); overflow: hidden; }
        .sv-result-header { background: linear-gradient(135deg, #111 0%, #333 100%); padding: 20px 24px; color: #fff; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .sv-result-id { font-size: 20px; font-weight: 900; }
        .sv-result-date { font-size: 13px; color: #aaa; }
        .sv-status-badge { font-size: 12px; font-weight: 800; padding: 5px 14px; border-radius: 100px; }
        .sv-result-body { padding: 24px; }

        /* Progress */
        .sv-steps { display: flex; align-items: flex-start; position: relative; margin-bottom: 24px; }
        .sv-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
        .sv-step-circle { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2px solid #ddd; background: #fff; color: #aaa; margin-bottom: 6px; transition: all .2s; flex-shrink: 0; }
        .sv-step.done .sv-step-circle { background: #FFB800; border-color: #FFB800; color: #111; }
        .sv-step.active .sv-step-circle { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 0 0 4px rgba(124,58,237,.15); }
        .sv-step-label { font-size: 10px; color: #aaa; font-weight: 600; text-align: center; line-height: 1.3; }
        .sv-step.done .sv-step-label, .sv-step.active .sv-step-label { color: #111; font-weight: 700; }
        .sv-steps-line { position: absolute; top: 16px; left: 0; right: 0; height: 2px; background: #e0e0e0; z-index: 0; }
        .sv-steps-progress { height: 100%; background: #FFB800; transition: width .4s; }

        /* Status message */
        .sv-status-msg { border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; font-size: 14px; font-weight: 700; }

        /* Address */
        .sv-address { background: #F8F9FA; border-radius: 10px; padding: 14px 16px; margin-bottom: 20px; font-size: 13px; color: #555; line-height: 1.8; }

        /* Items */
        .sv-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .sv-item { display: flex; align-items: center; gap: 10px; background: #F8F9FA; border-radius: 8px; padding: 10px 12px; }
        .sv-item-img { width: 44px; height: 44px; object-fit: contain; border-radius: 6px; border: 1px solid #ececec; background: #fff; flex-shrink: 0; }
        .sv-item-name { flex: 1; font-size: 13px; font-weight: 600; color: #111; line-height: 1.3; }
        .sv-item-price { font-size: 13px; font-weight: 800; white-space: nowrap; }

        /* Totals */
        .sv-totals { border-top: 1px solid #ececec; padding-top: 14px; display: flex; flex-direction: column; gap: 7px; }
        .sv-total-row { display: flex; justify-content: space-between; font-size: 13px; color: #666; }
        .sv-total-row.final { font-size: 16px; font-weight: 900; color: #111; padding-top: 8px; border-top: 1px solid #ececec; margin-top: 4px; }

        /* No account notice */
        .sv-notice { background: #FFFCEF; border: 1px solid #FFE08A; border-radius: 10px; padding: 14px 16px; font-size: 13px; color: #666; margin-top: 20px; display: flex; gap: 10px; align-items: flex-start; }
        .sv-notice-icon { font-size: 18px; flex-shrink: 0; }

        @media (max-width: 540px) {
          .sv-form { flex-direction: column; }
          .sv-btn { width: 100%; }
          .sv-result-header { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="sv-wrap">
        <div className="sv-hero">
          <div className="sv-icon">🚚</div>
          <div className="sv-title">Suivre ma commande</div>
          <div className="sv-sub">Entrez votre numéro de commande pour voir son statut en temps réel</div>
        </div>

        {/* Search form */}
        <div className="sv-form-card">
          <form className="sv-form" onSubmit={handleSearch}>
            <input
              className="sv-input"
              placeholder="Ex: TP-2026-45821"
              value={input}
              onChange={e => { setInput(e.target.value); setError(''); }}
            />
            <button type="submit" className="sv-btn">Rechercher →</button>
          </form>
          <div className="sv-hint">Le numéro de commande vous a été communiqué par SMS après votre achat.</div>
          {error && <div className="sv-error">✗ {error}</div>}
        </div>

        {/* Result */}
        {order && (
          <div className="sv-result">
            <div className="sv-result-header">
              <div>
                <div className="sv-result-id">#{order.id}</div>
                <div className="sv-result-date">
                  Passée le {new Date(order.date).toLocaleDateString('fr-TN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              <span
                className="sv-status-badge"
                style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}
              >
                {STATUS_LABEL[order.status]}
              </span>
            </div>

            <div className="sv-result-body">
              {/* Progression */}
              <div className="sv-steps">
                <div className="sv-steps-line">
                  <div className="sv-steps-progress" style={{ width: `${progress}%` }} />
                </div>
                {STEPS.map((s, i) => (
                  <div key={s} className={`sv-step${i < si ? ' done' : i === si ? ' active' : ''}`}>
                    <div className="sv-step-circle">{i < si ? '✓' : i + 1}</div>
                    <div className="sv-step-label">{STATUS_LABEL[s]}</div>
                  </div>
                ))}
              </div>

              {/* Message statut */}
              <div className="sv-status-msg" style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}>
                {order.status === 'en_attente'     && '⏳ Votre commande est en attente de confirmation par notre équipe.'}
                {order.status === 'confirmee'      && '✅ Votre commande a été confirmée ! Nous préparons votre colis.'}
                {order.status === 'en_preparation' && '📦 Votre colis est en cours de préparation dans notre entrepôt.'}
                {order.status === 'en_livraison'   && '🚚 Votre colis est en route ! Le livreur vous contactera sous peu.'}
                {order.status === 'livree'         && '🎉 Votre commande a été livrée avec succès. Merci pour votre confiance !'}
              </div>

              {/* Adresse */}
              <div className="sv-address">
                <strong>Adresse de livraison</strong><br />
                📍 {order.rue}{order.localite ? `, ${order.localite}` : ''}, {order.delegation}, {order.governorat}<br />
                👤 {order.prenom} {order.nom} — 📞 +216 {order.tel}
              </div>

              {/* Articles */}
              <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
                Articles ({order.items.reduce((s, i) => s + i.qty, 0)})
              </div>
              <div className="sv-items">
                {order.items.map((item, i) => (
                  <div key={i} className="sv-item">
                    <img
                      src={item.img || 'https://placehold.co/44x44/F8F9FA/555?text=P'}
                      alt={item.name}
                      className="sv-item-img"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                    <div className="sv-item-name">
                      {item.name} <span style={{ color: '#888', fontWeight: 400 }}>× {item.qty}</span>
                    </div>
                    <div className="sv-item-price">{(item.price * item.qty).toFixed(3)} TND</div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="sv-totals">
                <div className="sv-total-row"><span>Sous-total</span><span>{order.subtotal.toFixed(3)} TND</span></div>
                <div className="sv-total-row"><span>Livraison</span><span>{order.delivery.toFixed(3)} TND</span></div>
                {order.discount > 0 && (
                  <div className="sv-total-row" style={{ color: '#16a34a', fontWeight: 700 }}>
                    <span>Réduction</span><span>-{order.discount.toFixed(3)} TND</span>
                  </div>
                )}
                <div className="sv-total-row final"><span>TOTAL</span><span>{order.total.toFixed(3)} TND</span></div>
              </div>

              {/* Invite à créer un compte */}
              <div className="sv-notice">
                <span className="sv-notice-icon">💡</span>
                <div>
                  Créez un compte pour retrouver toutes vos commandes facilement et suivre vos achats depuis n&apos;importe quel appareil.{' '}
                  <Link href="/account/register" style={{ color: '#111', fontWeight: 700, textDecoration: 'underline' }}>
                    Créer un compte gratuitement →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not found */}
        {searched && !order && !error && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>Commande introuvable</div>
          </div>
        )}
      </div>
    </>
  );
}
