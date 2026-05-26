'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth, StoredOrder } from '@/lib/auth';

type Tab = 'profile' | 'orders' | 'tracking';

const STATUS_LABEL: Record<StoredOrder['status'], string> = {
  en_attente:     'En attente',
  confirmee:      'Confirmée',
  en_preparation: 'En préparation',
  en_livraison:   'En livraison',
  livree:         'Livrée',
};
const STATUS_COLOR: Record<StoredOrder['status'], string> = {
  en_attente:     '#888',
  confirmee:      '#2563eb',
  en_preparation: '#d97706',
  en_livraison:   '#7c3aed',
  livree:         '#16a34a',
};
const STATUS_BG: Record<StoredOrder['status'], string> = {
  en_attente:     '#f3f4f6',
  confirmee:      '#dbeafe',
  en_preparation: '#fef3c7',
  en_livraison:   '#ede9fe',
  livree:         '#dcfce7',
};
const STEPS: StoredOrder['status'][] = ['en_attente', 'confirmee', 'en_preparation', 'en_livraison', 'livree'];

export default function AccountPage() {
  const { user, logout, getOrders } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState<Tab>('profile');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [trackingOrder, setTrackingOrder] = useState<StoredOrder | null>(null);
  const [trackInput, setTrackInput] = useState('');
  const [trackError, setTrackError] = useState('');

  useEffect(() => {
    if (!user) { router.replace('/account/login'); return; }
    setOrders(getOrders());
  }, [user]);

  if (!user) return null;

  function handleLogout() {
    logout();
    router.replace('/');
  }

  function handleTrackSearch() {
    const q = trackInput.trim().toUpperCase();
    if (!q) { setTrackError('Entrez un numéro de commande'); return; }
    const found = orders.find(o => o.id.toUpperCase() === q);
    if (!found) { setTrackError('Aucune commande trouvée avec ce numéro'); setTrackingOrder(null); return; }
    setTrackError('');
    setTrackingOrder(found);
  }

  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  const stepIndex = (o: StoredOrder) => STEPS.indexOf(o.status);

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .ac-wrap { max-width: 1000px; margin: 0 auto; padding: 28px 16px 80px; }

        /* Header */
        .ac-header { display: flex; align-items: center; gap: 16px; background: #fff; border-radius: 16px; padding: 20px 24px; box-shadow: 0 2px 12px rgba(0,0,0,.07); margin-bottom: 24px; }
        .ac-avatar { width: 56px; height: 56px; border-radius: 50%; background: #FFB800; color: #111; font-size: 20px; font-weight: 900; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .ac-hello { font-size: 13px; color: #888; }
        .ac-name { font-size: 20px; font-weight: 900; color: #111; }
        .ac-logout { margin-left: auto; background: transparent; border: 1.5px solid #e0e0e0; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 700; color: #555; cursor: pointer; transition: all .12s; }
        .ac-logout:hover { border-color: #dc2626; color: #dc2626; }

        /* Tabs */
        .ac-tabs { display: flex; gap: 4px; background: #fff; border-radius: 12px; padding: 6px; box-shadow: 0 2px 8px rgba(0,0,0,.06); margin-bottom: 20px; }
        .ac-tab { flex: 1; padding: 10px; border: 0; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; background: transparent; color: #888; transition: all .15s; }
        .ac-tab.active { background: #FFB800; color: #111; box-shadow: 0 2px 6px rgba(255,184,0,.3); }
        .ac-tab:hover:not(.active) { background: #F8F9FA; color: #111; }

        /* Card */
        .ac-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); padding: 24px; }
        .ac-section-title { font-size: 16px; font-weight: 800; color: #111; margin: 0 0 20px; display: flex; align-items: center; gap: 8px; }

        /* Profile */
        .ac-profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .ac-profile-field { background: #F8F9FA; border-radius: 10px; padding: 14px 16px; }
        .ac-profile-label { font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 4px; }
        .ac-profile-value { font-size: 15px; font-weight: 700; color: #111; }

        /* Orders list */
        .ac-orders-empty { text-align: center; padding: 48px 20px; color: #888; }
        .ac-orders-empty-icon { font-size: 52px; margin-bottom: 12px; }
        .ac-order-card { border: 1.5px solid #ececec; border-radius: 12px; padding: 16px 18px; margin-bottom: 12px; transition: border-color .12s, box-shadow .12s; cursor: pointer; }
        .ac-order-card:hover { border-color: #FFB800; box-shadow: 0 2px 10px rgba(255,184,0,.15); }
        .ac-order-card:last-child { margin-bottom: 0; }
        .ac-order-top { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
        .ac-order-id { font-size: 14px; font-weight: 900; color: #111; }
        .ac-order-date { font-size: 12px; color: #888; margin-left: auto; }
        .ac-status-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; white-space: nowrap; }
        .ac-order-items { display: flex; gap: 8px; overflow: hidden; margin-bottom: 10px; }
        .ac-order-img { width: 44px; height: 44px; object-fit: contain; border-radius: 6px; border: 1px solid #ececec; background: #F8F9FA; flex-shrink: 0; }
        .ac-order-total { font-size: 15px; font-weight: 900; color: #111; }
        .ac-order-count { font-size: 12px; color: #888; }
        .ac-order-footer { display: flex; justify-content: space-between; align-items: center; }
        .ac-track-link { font-size: 12px; font-weight: 700; color: #7c3aed; text-decoration: none; }
        .ac-track-link:hover { text-decoration: underline; }

        /* Tracking */
        .ac-track-search { display: flex; gap: 10px; margin-bottom: 16px; }
        .ac-track-input { flex: 1; border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; }
        .ac-track-input:focus { border-color: #FFB800; }
        .ac-track-btn { background: #111; color: #fff; border: 0; border-radius: 10px; padding: 12px 20px; font-size: 14px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .ac-track-btn:hover { background: #000; }
        .ac-track-error { font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; }
        .ac-track-result { border: 1.5px solid #FFB800; border-radius: 14px; padding: 20px; background: #FFFCEF; }
        .ac-track-id { font-size: 18px; font-weight: 900; color: #111; margin-bottom: 4px; }
        .ac-track-address { font-size: 13px; color: #666; margin-bottom: 20px; }

        /* Progress steps */
        .ac-steps { display: flex; align-items: flex-start; position: relative; margin-bottom: 24px; }
        .ac-step { flex: 1; display: flex; flex-direction: column; align-items: center; position: relative; z-index: 1; }
        .ac-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2px solid #ddd; background: #fff; color: #aaa; margin-bottom: 6px; transition: all .2s; }
        .ac-step.done .ac-step-circle { background: #FFB800; border-color: #FFB800; color: #111; }
        .ac-step.active .ac-step-circle { background: #7c3aed; border-color: #7c3aed; color: #fff; box-shadow: 0 0 0 4px rgba(124,58,237,.15); }
        .ac-step-label { font-size: 11px; color: #aaa; font-weight: 600; text-align: center; line-height: 1.3; }
        .ac-step.done .ac-step-label, .ac-step.active .ac-step-label { color: #111; }
        .ac-steps-line { position: absolute; top: 15px; left: 0; right: 0; height: 2px; background: #e0e0e0; z-index: 0; }
        .ac-steps-progress { height: 100%; background: #FFB800; transition: width .4s; }

        /* Order items in tracking */
        .ac-track-items { display: flex; flex-direction: column; gap: 8px; }
        .ac-track-item { display: flex; align-items: center; gap: 10px; background: #fff; border-radius: 8px; padding: 10px 12px; }
        .ac-track-item-img { width: 40px; height: 40px; object-fit: contain; border-radius: 6px; border: 1px solid #ececec; }
        .ac-track-item-name { flex: 1; font-size: 13px; font-weight: 600; color: #111; line-height: 1.3; }
        .ac-track-item-price { font-size: 13px; font-weight: 800; white-space: nowrap; }

        @media (max-width: 640px) {
          .ac-profile-grid { grid-template-columns: 1fr; }
          .ac-steps .ac-step-label { font-size: 10px; }
          .ac-header { padding: 16px; }
        }
      `}</style>

      <div className="ac-wrap">
        {/* Header */}
        <div className="ac-header">
          <div className="ac-avatar">{initials}</div>
          <div>
            <div className="ac-hello">Bonjour,</div>
            <div className="ac-name">{user.firstName} {user.lastName}</div>
          </div>
          <button className="ac-logout" onClick={handleLogout}>Déconnexion</button>
        </div>

        {/* Tabs */}
        <div className="ac-tabs">
          {([
            { id: 'profile' as Tab, label: '👤 Mon profil' },
            { id: 'orders'  as Tab, label: `📦 Commandes${orders.length ? ` (${orders.length})` : ''}` },
            { id: 'tracking' as Tab, label: '🚚 Suivi commande' },
          ]).map(t => (
            <button
              key={t.id}
              className={`ac-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ─── Mon profil ─── */}
        {tab === 'profile' && (
          <div className="ac-card">
            <div className="ac-section-title">👤 Informations personnelles</div>
            <div className="ac-profile-grid">
              <div className="ac-profile-field">
                <div className="ac-profile-label">Prénom</div>
                <div className="ac-profile-value">{user.firstName}</div>
              </div>
              <div className="ac-profile-field">
                <div className="ac-profile-label">Nom</div>
                <div className="ac-profile-value">{user.lastName}</div>
              </div>
              <div className="ac-profile-field" style={{ gridColumn: '1 / -1' }}>
                <div className="ac-profile-label">Adresse email</div>
                <div className="ac-profile-value">{user.email}</div>
              </div>
              <div className="ac-profile-field">
                <div className="ac-profile-label">Téléphone</div>
                <div className="ac-profile-value">+216 {user.phone}</div>
              </div>
              <div className="ac-profile-field">
                <div className="ac-profile-label">Membre depuis</div>
                <div className="ac-profile-value">{new Date().toLocaleDateString('fr-TN', { month: 'long', year: 'numeric' })}</div>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #f3f3f3', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/shop" style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
                Continuer mes achats →
              </Link>
              <Link href="/cart" style={{ background: '#F8F9FA', color: '#111', fontWeight: 700, padding: '10px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
                Mon panier
              </Link>
            </div>
          </div>
        )}

        {/* ─── Mes commandes ─── */}
        {tab === 'orders' && (
          <div className="ac-card">
            <div className="ac-section-title">📦 Historique des commandes</div>

            {orders.length === 0 ? (
              <div className="ac-orders-empty">
                <div className="ac-orders-empty-icon">📭</div>
                <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>Aucune commande pour l&apos;instant</div>
                <div style={{ marginBottom: 20 }}>Vos commandes apparaîtront ici après votre premier achat.</div>
                <Link href="/shop" style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontSize: 14 }}>
                  Découvrir nos produits →
                </Link>
              </div>
            ) : (
              orders.map(order => (
                <div
                  key={order.id}
                  className="ac-order-card"
                  onClick={() => { setTrackingOrder(order); setTrackInput(order.id); setTab('tracking'); }}
                >
                  <div className="ac-order-top">
                    <div className="ac-order-id">#{order.id}</div>
                    <span
                      className="ac-status-badge"
                      style={{ background: STATUS_BG[order.status], color: STATUS_COLOR[order.status] }}
                    >
                      {STATUS_LABEL[order.status]}
                    </span>
                    <div className="ac-order-date">{new Date(order.date).toLocaleDateString('fr-TN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <div className="ac-order-items">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.img || 'https://placehold.co/44x44/F8F9FA/555?text=P'}
                        alt={item.name}
                        className="ac-order-img"
                        style={{ mixBlendMode: 'multiply' }}
                      />
                    ))}
                    {order.items.length > 4 && (
                      <div className="ac-order-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#888' }}>
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="ac-order-footer">
                    <div>
                      <div className="ac-order-total">{order.total.toFixed(3)} TND</div>
                      <div className="ac-order-count">{order.items.reduce((s, i) => s + i.qty, 0)} article{order.items.reduce((s, i) => s + i.qty, 0) > 1 ? 's' : ''}</div>
                    </div>
                    <span className="ac-track-link">Suivre la commande →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ─── Suivi commande ─── */}
        {tab === 'tracking' && (
          <div className="ac-card">
            <div className="ac-section-title">🚚 Suivi de commande</div>

            <div className="ac-track-search">
              <input
                className="ac-track-input"
                placeholder="Ex: TP-2026-45821"
                value={trackInput}
                onChange={e => { setTrackInput(e.target.value); setTrackError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleTrackSearch()}
              />
              <button className="ac-track-btn" onClick={handleTrackSearch}>Rechercher</button>
            </div>
            {trackError && <div className="ac-track-error">✗ {trackError}</div>}

            {trackingOrder && (() => {
              const si = stepIndex(trackingOrder);
              const progress = si === 0 ? 0 : (si / (STEPS.length - 1)) * 100;
              return (
                <div className="ac-track-result">
                  <div className="ac-track-id">#{trackingOrder.id}</div>
                  <div className="ac-track-address">
                    📍 {trackingOrder.rue}{trackingOrder.localite ? `, ${trackingOrder.localite}` : ''}, {trackingOrder.delegation}, {trackingOrder.governorat}<br />
                    📞 +216 {trackingOrder.tel} — {trackingOrder.prenom} {trackingOrder.nom}
                  </div>

                  {/* Progress bar */}
                  <div className="ac-steps">
                    <div className="ac-steps-line">
                      <div className="ac-steps-progress" style={{ width: `${progress}%` }} />
                    </div>
                    {STEPS.map((s, i) => (
                      <div key={s} className={`ac-step${i < si ? ' done' : i === si ? ' active' : ''}`}>
                        <div className="ac-step-circle">{i < si ? '✓' : i + 1}</div>
                        <div className="ac-step-label">{STATUS_LABEL[s]}</div>
                      </div>
                    ))}
                  </div>

                  {/* Current status message */}
                  <div style={{
                    background: STATUS_BG[trackingOrder.status],
                    border: `1px solid ${STATUS_COLOR[trackingOrder.status]}30`,
                    borderRadius: 10,
                    padding: '12px 16px',
                    marginBottom: 20,
                    fontSize: 14,
                    fontWeight: 700,
                    color: STATUS_COLOR[trackingOrder.status],
                  }}>
                    {trackingOrder.status === 'en_attente'     && '⏳ Votre commande est en attente de confirmation par notre équipe.'}
                    {trackingOrder.status === 'confirmee'      && '✅ Votre commande a été confirmée ! Nous préparons votre colis.'}
                    {trackingOrder.status === 'en_preparation' && '📦 Votre colis est en cours de préparation dans notre entrepôt.'}
                    {trackingOrder.status === 'en_livraison'   && '🚚 Votre colis est en route ! Le livreur vous contactera sous peu.'}
                    {trackingOrder.status === 'livree'         && '🎉 Votre commande a été livrée avec succès. Merci pour votre confiance !'}
                  </div>

                  {/* Order items */}
                  <div style={{ fontWeight: 800, fontSize: 14, marginBottom: 10 }}>Articles commandés</div>
                  <div className="ac-track-items">
                    {trackingOrder.items.map((item, i) => (
                      <div key={i} className="ac-track-item">
                        <img
                          src={item.img || 'https://placehold.co/40x40/F8F9FA/555?text=P'}
                          alt={item.name}
                          className="ac-track-item-img"
                          style={{ mixBlendMode: 'multiply' }}
                        />
                        <div className="ac-track-item-name">{item.name} <span style={{ color: '#888', fontWeight: 400 }}>× {item.qty}</span></div>
                        <div className="ac-track-item-price">{(item.price * item.qty).toFixed(3)} TND</div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div style={{ marginTop: 14, borderTop: '1px solid #ececec', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                      <span>Sous-total</span><span>{trackingOrder.subtotal.toFixed(3)} TND</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                      <span>Livraison</span><span>{trackingOrder.delivery.toFixed(3)} TND</span>
                    </div>
                    {trackingOrder.discount > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#16a34a', fontWeight: 700 }}>
                        <span>Réduction</span><span>-{trackingOrder.discount.toFixed(3)} TND</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 900, color: '#111', paddingTop: 8, borderTop: '1px solid #ececec', marginTop: 2 }}>
                      <span>TOTAL</span><span>{trackingOrder.total.toFixed(3)} TND</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {!trackingOrder && orders.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>Ou sélectionnez une commande récente :</div>
                {orders.slice(0, 3).map(o => (
                  <button
                    key={o.id}
                    onClick={() => { setTrackingOrder(o); setTrackInput(o.id); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', background: '#F8F9FA', border: '1.5px solid #e0e0e0', borderRadius: 8, padding: '10px 14px', marginBottom: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700 }}
                  >
                    #{o.id} — {new Date(o.date).toLocaleDateString('fr-TN')} — {o.total.toFixed(3)} TND
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
