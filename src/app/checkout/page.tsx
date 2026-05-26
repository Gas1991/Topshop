'use client';
import { useState, useMemo } from 'react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';
import locationsRaw from '@/data/tunisia_locations.json';

type LocationEntry = { delegation: string; localite: string; cp: string };
const LOCATIONS = locationsRaw as Record<string, LocationEntry[]>;
const GOVERNORATS = Object.keys(LOCATIONS).sort();

type Step = 1 | 2 | 3 | 4;

export default function CheckoutPage() {
  const { items: cartItems, count: cartCount, total: cartSubtotal, clearCart } = useCart();
  const { saveOrder } = useAuth();
  const [step, setStep] = useState<Step>(2);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState('');

  /* Form state */
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [tel, setTel] = useState('');
  const [email, setEmail] = useState('');
  const [governorat, setGovernorat] = useState('');
  const [delegation, setDelegation] = useState('');
  const [localite, setLocalite] = useState('');
  const [codePostal, setCodePostal] = useState('');
  const [rue, setRue] = useState('');
  const [note, setNote] = useState('');
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoMsg, setPromoMsg] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const deliveryPrice = 10.000;
  const subtotal = cartSubtotal;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + deliveryPrice - discount;

  /* Derived location lists */
  const delegations = useMemo(() => {
    if (!governorat) return [];
    const all = LOCATIONS[governorat] ?? [];
    return [...new Set(all.map(e => e.delegation))].sort();
  }, [governorat]);

  const localities = useMemo(() => {
    if (!governorat || !delegation) return [];
    return (LOCATIONS[governorat] ?? [])
      .filter(e => e.delegation === delegation)
      .map(e => e.localite);
  }, [governorat, delegation]);

  function handleGovernoratChange(val: string) {
    setGovernorat(val);
    setDelegation('');
    setLocalite('');
    setCodePostal('');
    setErrors(x => ({ ...x, governorat: '' }));
  }

  function handleDelegationChange(val: string) {
    setDelegation(val);
    setLocalite('');
    setCodePostal('');
    setErrors(x => ({ ...x, delegation: '' }));
  }

  function handleLocaliteChange(val: string) {
    setLocalite(val);
    const entry = (LOCATIONS[governorat] ?? []).find(
      e => e.delegation === delegation && e.localite === val
    );
    setCodePostal(entry?.cp ?? '');
  }

  function applyPromo() {
    if (promo.toUpperCase() === 'TOPRIX10') {
      setPromoApplied(true);
      setPromoMsg('Code appliqué ! -10% sur votre commande');
    } else {
      setPromoApplied(false);
      setPromoMsg('Code invalide ou expiré');
    }
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!prenom.trim()) e.prenom = 'Requis';
    if (!nom.trim()) e.nom = 'Requis';
    if (!tel.trim()) e.tel = 'Requis';
    if (!governorat) e.governorat = 'Requis';
    if (!delegation) e.delegation = 'Requis';
    if (!rue.trim()) e.rue = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const orderId = `TP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
      saveOrder({
        id: orderId,
        date: new Date().toISOString(),
        status: 'en_attente',
        items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price, img: i.img })),
        subtotal,
        delivery: deliveryPrice,
        discount,
        total,
        prenom,
        nom,
        tel,
        governorat,
        delegation,
        localite,
        rue,
      });
      setOrderId(orderId);
      setLoading(false);
      clearCart();
      setStep(4);
    }, 1800);
  }

  if (cartCount === 0 && step !== 4) {
    return (
      <main style={{ maxWidth: 520, margin: '80px auto', padding: '0 16px', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Votre panier est vide</h1>
        <p style={{ color: '#888', marginBottom: 28 }}>Ajoutez des produits avant de passer commande.</p>
        <Link href="/shop" style={{ background: '#FFB800', color: '#111', fontWeight: 700, padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>
          Voir les produits
        </Link>
      </main>
    );
  }

  if (step === 4) {
    return (
      <>
        <style>{`
          .ck-success { max-width: 520px; margin: 60px auto; padding: 0 16px; text-align: center; }
          .ck-check { width: 80px; height: 80px; border-radius: 50%; background: #dcfce7; color: #16a34a; font-size: 36px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
          .ck-s-title { font-size: 26px; font-weight: 900; margin-bottom: 12px; }
          .ck-s-ref { background: #F8F9FA; border-radius: 10px; padding: 14px 20px; font-size: 14px; color: #555; margin-bottom: 16px; }
          .ck-s-ref strong { color: #111; font-size: 18px; }
          .ck-s-info { font-size: 14px; color: #666; line-height: 1.7; margin-bottom: 24px; }
          .ck-s-btn { display: inline-block; background: #FFB800; color: #111; font-weight: 800; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-size: 15px; box-shadow: 0 4px 0 #F2A900; }
          .ck-s-btn:hover { background: #F2A900; }
        `}</style>
        <div className="ck-success">
          <div className="ck-check">✓</div>
          <div className="ck-s-title">Commande confirmée ! 🎉</div>
          <div className="ck-s-ref">
            Numéro de commande :<br />
            <strong>#{orderId}</strong>
          </div>
          <div className="ck-s-info">
            Vous recevrez un SMS de confirmation au <strong>+216 {tel || 'XX XXX XXX'}</strong>.<br />
            Notre équipe vous contactera dans les <strong>24h</strong> pour confirmer la livraison.
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/account" className="ck-s-btn">Suivre ma commande →</a>
            <a href="/shop" style={{ display: 'inline-block', background: '#F8F9FA', color: '#111', fontWeight: 800, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', fontSize: 15 }}>Continuer mes achats</a>
          </div>
        </div>
      </>
    );
  }

  const orderSummary = (
    <div className="ck-summary">
      <div className="ck-summary-title">Votre commande ({cartCount} article{cartCount > 1 ? 's' : ''})</div>
      <div className="ck-items">
        {cartItems.map((item) => (
          <div key={item.id} className="ck-item">
            <img
              src={item.img || 'https://placehold.co/56x56/F8F9FA/555?text=P'}
              alt={item.name}
              className="ck-item-img"
              style={{ mixBlendMode: 'multiply' }}
            />
            <div className="ck-item-info">
              <div className="ck-item-name">{item.name}</div>
              <div className="ck-item-qty">Qté : {item.qty}</div>
            </div>
            <div className="ck-item-price">{(item.price * item.qty).toFixed(3)} TND</div>
          </div>
        ))}
      </div>
      <div className="ck-totals">
        <div className="ck-total-row">
          <span>Sous-total</span>
          <span>{subtotal.toFixed(3)} TND</span>
        </div>
        <div className="ck-total-row">
          <span>Livraison</span>
          <span>{deliveryPrice.toFixed(3)} TND</span>
        </div>
        {promoApplied && (
          <div className="ck-total-row green">
            <span>Réduction (-10%)</span>
            <span>-{discount.toFixed(3)} TND</span>
          </div>
        )}
        <div className="ck-total-row total">
          <span>TOTAL</span>
          <span>{total.toFixed(3)} TND</span>
        </div>
      </div>
      <div className="ck-badges">
        <div className="ck-badge-item">🔒 SSL</div>
        <div className="ck-badge-item">🔄 Retour 30j</div>
        <div className="ck-badge-item">📦 Livraison</div>
        <div className="ck-badge-item">☎ 7j/7</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .ck-wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px 60px; }

        /* Progress */
        .ck-progress { padding: 24px 0 20px; }
        .ck-steps { display: flex; align-items: center; justify-content: center; gap: 0; }
        .ck-step { display: flex; align-items: center; gap: 8px; }
        .ck-step-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; border: 2px solid #ddd; background: #fff; color: #aaa; flex-shrink: 0; transition: all .2s; }
        .ck-step.done .ck-step-circle { background: #FFB800; border-color: #FFB800; color: #111; }
        .ck-step.active .ck-step-circle { background: #111; border-color: #111; color: #fff; }
        .ck-step-label { font-size: 13px; color: #aaa; font-weight: 600; white-space: nowrap; }
        .ck-step.done .ck-step-label, .ck-step.active .ck-step-label { color: #111; }
        .ck-step-line { width: 40px; height: 2px; background: #ddd; flex-shrink: 0; }
        .ck-step-line.done { background: #FFB800; }

        /* Layout */
        .ck-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; align-items: flex-start; }

        /* Form card */
        .ck-card { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); padding: 22px; margin-bottom: 16px; }
        .ck-section-title { font-size: 16px; font-weight: 800; margin: 0 0 16px; display: flex; align-items: center; gap: 8px; }
        .ck-section-num { width: 26px; height: 26px; border-radius: 50%; background: #FFB800; color: #111; font-size: 12px; font-weight: 900; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }

        /* Form fields */
        .ck-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .ck-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
        .ck-field:last-child { margin-bottom: 0; }
        .ck-label { font-size: 12px; font-weight: 700; color: #555; }
        .ck-input { border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; background: #fff; width: 100%; }
        .ck-input:focus { border-color: #FFB800; }
        .ck-input.err { border-color: #dc2626; background: #fff5f5; }
        .ck-input:read-only { background: #F8F9FA; color: #666; cursor: default; }
        .ck-err-msg { font-size: 11px; color: #dc2626; font-weight: 600; }
        .ck-tel-wrap { display: flex; }
        .ck-tel-prefix { border: 1px solid #ddd; border-right: 0; border-radius: 8px 0 0 8px; padding: 10px 12px; font-size: 14px; background: #F8F9FA; color: #555; white-space: nowrap; display: flex; align-items: center; gap: 6px; }
        .ck-tel-input { flex: 1; border: 1px solid #ddd; border-radius: 0 8px 8px 0; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; }
        .ck-tel-input:focus { border-color: #FFB800; z-index: 1; }
        .ck-textarea { border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; resize: vertical; min-height: 80px; width: 100%; transition: border-color .12s; }
        .ck-textarea:focus { border-color: #FFB800; }
        .ck-select { border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; background: #fff; width: 100%; cursor: pointer; appearance: auto; }
        .ck-select:focus { border-color: #FFB800; }
        .ck-select.err { border-color: #dc2626; }
        .ck-select:disabled { background: #F8F9FA; color: #aaa; cursor: not-allowed; }

        /* COD static card */
        .ck-cod-card { border: 2px solid #FFB800; border-radius: 12px; padding: 16px; background: #FFFCEF; display: flex; align-items: center; gap: 14px; }
        .ck-cod-icon { width: 44px; height: 44px; border-radius: 10px; background: #FFB800; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .ck-cod-label { font-size: 15px; font-weight: 800; color: #111; }
        .ck-cod-sub { font-size: 12px; color: #666; margin-top: 3px; }
        .ck-cod-badge { margin-left: auto; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; background: #dcfce7; color: #16a34a; white-space: nowrap; }

        /* Delivery static card */
        .ck-delivery-card { border: 2px solid #FFB800; border-radius: 12px; padding: 14px; background: #FFFCEF; display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; }
        .ck-radio-icon { width: 38px; height: 38px; border-radius: 8px; background: #F8F9FA; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
        .ck-radio-label { font-size: 14px; font-weight: 700; color: #111; }
        .ck-radio-sub { font-size: 12px; color: #888; margin-top: 2px; }
        .ck-radio-price { font-size: 14px; font-weight: 800; color: #111; white-space: nowrap; }

        /* Promo */
        .ck-promo { display: flex; gap: 10px; margin-top: 16px; }
        .ck-promo-input { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; }
        .ck-promo-input:focus { border-color: #FFB800; }
        .ck-promo-btn { background: #111; color: #fff; border: 0; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 700; cursor: pointer; white-space: nowrap; }
        .ck-promo-btn:hover { background: #000; }
        .ck-promo-msg { font-size: 12px; font-weight: 700; margin-top: 8px; }
        .ck-promo-msg.ok { color: #16a34a; }
        .ck-promo-msg.err { color: #dc2626; }

        /* CTA */
        .ck-cta { margin-top: 20px; }
        .ck-cta-btn { width: 100%; height: 56px; background: #FFB800; color: #111; border: 0; border-radius: 12px; font-size: 17px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .ck-cta-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .ck-cta-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #F2A900; }
        .ck-cta-btn:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }
        .ck-secure { text-align: center; font-size: 12px; color: #888; margin-top: 10px; }

        /* Summary */
        .ck-summary { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); position: sticky; top: 16px; }
        .ck-summary-title { font-size: 15px; font-weight: 800; padding: 16px 18px; border-bottom: 1px solid #ececec; }
        .ck-items { padding: 12px 18px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px solid #f3f3f3; }
        .ck-item { display: flex; align-items: center; gap: 10px; }
        .ck-item-img { width: 56px; height: 56px; object-fit: contain; border-radius: 8px; background: #F8F9FA; border: 1px solid #ececec; flex-shrink: 0; }
        .ck-item-info { flex: 1; min-width: 0; }
        .ck-item-name { font-size: 12px; font-weight: 600; color: #111; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .ck-item-qty { font-size: 11px; color: #888; margin-top: 2px; }
        .ck-item-price { font-size: 13px; font-weight: 800; white-space: nowrap; flex-shrink: 0; }
        .ck-totals { padding: 14px 18px; border-bottom: 1px solid #f3f3f3; display: flex; flex-direction: column; gap: 8px; }
        .ck-total-row { display: flex; justify-content: space-between; font-size: 13px; color: #555; }
        .ck-total-row.green { color: #16a34a; font-weight: 700; }
        .ck-total-row.total { font-size: 16px; font-weight: 900; color: #111; padding-top: 10px; border-top: 1px solid #ececec; margin-top: 4px; }
        .ck-badges { padding: 12px 18px; display: flex; justify-content: space-around; }
        .ck-badge-item { font-size: 11px; color: #888; font-weight: 600; text-align: center; }

        /* Mobile summary toggle */
        .ck-mobile-summary { display: none; background: #FFFCEF; border-bottom: 1px solid #FFE08A; padding: 12px 16px; cursor: pointer; font-size: 14px; font-weight: 700; color: #111; align-items: center; justify-content: space-between; margin-bottom: 16px; border-radius: 12px; }
        .ck-mobile-summary-total { color: #FFB800; }

        /* Mobile fixed CTA */
        .ck-mobile-cta { display: none; }

        /* Responsive */
        @media (max-width: 900px) {
          .ck-layout { grid-template-columns: 1fr; }
          .ck-summary { position: static; }
          .ck-steps .ck-step-label { display: none; }
        }
        @media (max-width: 640px) {
          .ck-wrap { padding: 0 12px 80px; }
          .ck-row2 { grid-template-columns: 1fr; }
          .ck-mobile-summary { display: flex; }
          .ck-mobile-cta { display: block; position: fixed; bottom: 0; left: 0; right: 0; padding: 10px 14px; background: #fff; border-top: 1px solid #ececec; box-shadow: 0 -4px 12px rgba(0,0,0,.08); z-index: 50; }
          .ck-cta { display: none; }
        }
      `}</style>

      <div className="ck-wrap">
        {/* Progress bar */}
        <div className="ck-progress">
          <div className="ck-steps">
            {(['Panier', 'Livraison', 'Paiement', 'Confirmation'] as const).map((label, idx) => {
              const n = (idx + 1) as Step;
              const done = step > n;
              const active = step === n;
              return (
                <>
                  {idx > 0 && <div key={`line-${idx}`} className={`ck-step-line${done || active ? ' done' : ''}`} />}
                  <div key={n} className={`ck-step${done ? ' done' : active ? ' active' : ''}`}>
                    <div className="ck-step-circle">{done ? '✓' : n}</div>
                    <div className="ck-step-label">{label}</div>
                  </div>
                </>
              );
            })}
          </div>
        </div>

        {/* Mobile summary toggle */}
        <div className="ck-mobile-summary" onClick={() => setSummaryOpen(!summaryOpen)}>
          <span>Voir le récapitulatif ({cartCount} article{cartCount > 1 ? 's' : ''}) {summaryOpen ? '▲' : '▼'}</span>
          <span className="ck-mobile-summary-total">{total.toFixed(3)} TND</span>
        </div>

        <div className="ck-layout">
          {/* Left column — form */}
          <div>
            {/* Coordonnées */}
            <div className="ck-card">
              <div className="ck-section-title">
                <span className="ck-section-num">1</span>
                Coordonnées
              </div>
              <div className="ck-row2">
                <div className="ck-field">
                  <label className="ck-label">Prénom *</label>
                  <input
                    className={`ck-input${errors.prenom ? ' err' : ''}`}
                    placeholder="Ex: Ahmed"
                    value={prenom}
                    onChange={e => { setPrenom(e.target.value); setErrors(x => ({ ...x, prenom: '' })); }}
                  />
                  {errors.prenom && <span className="ck-err-msg">{errors.prenom}</span>}
                </div>
                <div className="ck-field">
                  <label className="ck-label">Nom *</label>
                  <input
                    className={`ck-input${errors.nom ? ' err' : ''}`}
                    placeholder="Ex: Ben Ali"
                    value={nom}
                    onChange={e => { setNom(e.target.value); setErrors(x => ({ ...x, nom: '' })); }}
                  />
                  {errors.nom && <span className="ck-err-msg">{errors.nom}</span>}
                </div>
              </div>
              <div className="ck-field">
                <label className="ck-label">Téléphone *</label>
                <div className="ck-tel-wrap">
                  <div className="ck-tel-prefix">🇹🇳 +216</div>
                  <input
                    className={`ck-tel-input${errors.tel ? ' err' : ''}`}
                    placeholder="XX XXX XXX"
                    value={tel}
                    onChange={e => { setTel(e.target.value); setErrors(x => ({ ...x, tel: '' })); }}
                    maxLength={9}
                  />
                </div>
                {errors.tel && <span className="ck-err-msg">{errors.tel}</span>}
              </div>
              <div className="ck-field" style={{ marginBottom: 0 }}>
                <label className="ck-label">Email</label>
                <input
                  className="ck-input"
                  type="email"
                  placeholder="votre@email.tn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Adresse de livraison */}
            <div className="ck-card">
              <div className="ck-section-title">
                <span className="ck-section-num">2</span>
                Adresse de livraison
              </div>

              {/* Gouvernorat + Délégation */}
              <div className="ck-row2">
                <div className="ck-field">
                  <label className="ck-label">Gouvernorat *</label>
                  <select
                    className={`ck-select${errors.governorat ? ' err' : ''}`}
                    value={governorat}
                    onChange={e => handleGovernoratChange(e.target.value)}
                  >
                    <option value="">Sélectionner...</option>
                    {GOVERNORATS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  {errors.governorat && <span className="ck-err-msg">{errors.governorat}</span>}
                </div>
                <div className="ck-field">
                  <label className="ck-label">Délégation *</label>
                  <select
                    className={`ck-select${errors.delegation ? ' err' : ''}`}
                    value={delegation}
                    onChange={e => handleDelegationChange(e.target.value)}
                    disabled={!governorat}
                  >
                    <option value="">Sélectionner...</option>
                    {delegations.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  {errors.delegation && <span className="ck-err-msg">{errors.delegation}</span>}
                </div>
              </div>

              {/* Localité + Code postal */}
              <div className="ck-row2">
                <div className="ck-field">
                  <label className="ck-label">Localité</label>
                  <select
                    className="ck-select"
                    value={localite}
                    onChange={e => handleLocaliteChange(e.target.value)}
                    disabled={!delegation}
                  >
                    <option value="">Sélectionner...</option>
                    {localities.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="ck-field">
                  <label className="ck-label">Code postal</label>
                  <input
                    className="ck-input"
                    value={codePostal}
                    readOnly
                    placeholder="—"
                  />
                </div>
              </div>

              {/* Rue — saisie manuelle */}
              <div className="ck-field">
                <label className="ck-label">Rue / Adresse *</label>
                <input
                  className={`ck-input${errors.rue ? ' err' : ''}`}
                  placeholder="Ex: 12 Rue de la République, Appt 3"
                  value={rue}
                  onChange={e => { setRue(e.target.value); setErrors(x => ({ ...x, rue: '' })); }}
                />
                {errors.rue && <span className="ck-err-msg">{errors.rue}</span>}
              </div>

              {/* Note livreur */}
              <div className="ck-field" style={{ marginBottom: 0 }}>
                <label className="ck-label">Note pour le livreur</label>
                <textarea
                  className="ck-textarea"
                  placeholder="Ex: Sonner 2 fois, code porte 1234"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
            </div>

            {/* Livraison */}
            <div className="ck-card">
              <div className="ck-section-title">
                <span className="ck-section-num">3</span>
                Mode de livraison
              </div>
              <div className="ck-delivery-card">
                <div className="ck-radio-icon">📦</div>
                <div>
                  <div className="ck-radio-label">Livraison standard</div>
                  <div className="ck-radio-sub">48–72h — Partout en Tunisie</div>
                </div>
                <div className="ck-radio-price">10.000 TND</div>
              </div>
            </div>

            {/* Paiement */}
            <div className="ck-card">
              <div className="ck-section-title">
                <span className="ck-section-num">4</span>
                Mode de paiement
              </div>
              <div className="ck-cod-card">
                <div className="ck-cod-icon">💵</div>
                <div>
                  <div className="ck-cod-label">Paiement à la livraison</div>
                  <div className="ck-cod-sub">Payez en cash à la réception de votre commande</div>
                </div>
                <span className="ck-cod-badge">Recommandé</span>
              </div>

              {/* Code promo */}
              <div className="ck-promo">
                <input
                  className="ck-promo-input"
                  placeholder="Code promo"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                />
                <button className="ck-promo-btn" onClick={applyPromo}>Appliquer</button>
              </div>
              {promoMsg && (
                <div className={`ck-promo-msg${promoApplied ? ' ok' : ' err'}`}>
                  {promoApplied ? '✓ ' : '✗ '}{promoMsg}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="ck-cta">
              <button
                className="ck-cta-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span style={{ display: 'inline-block', width: 18, height: 18, border: '3px solid rgba(0,0,0,.3)', borderTopColor: '#111', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                    Traitement en cours...
                  </>
                ) : 'Confirmer la commande →'}
              </button>
              <div className="ck-secure">🔒 Paiement 100% sécurisé — Données chiffrées SSL</div>
            </div>
          </div>

          {/* Right column — order summary */}
          {orderSummary}
        </div>
      </div>

      {/* Mobile fixed CTA */}
      <div className="ck-mobile-cta">
        <button
          className="ck-cta-btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{ margin: 0 }}
        >
          {loading ? 'Traitement...' : `Confirmer — ${total.toFixed(3)} TND →`}
        </button>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}
