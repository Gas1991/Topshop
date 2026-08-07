'use client';
import { useState } from 'react';

export default function ContactPage() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Comment suivre ma commande ?',
      a: 'Après confirmation de votre commande, vous recevrez un SMS avec un numéro de suivi. Vous pouvez également vous connecter à votre compte Toprix et consulter la section "Mes commandes".',
    },
    {
      q: 'Quel est le délai de livraison ?',
      a: 'La livraison standard prend 3-5 jours ouvrés sur tout le territoire tunisien. La livraison express est disponible pour le Grand Tunis avec une livraison le lendemain avant 18h.',
    },
    {
      q: 'Comment retourner un produit ?',
      a: 'Contactez notre service client dans les 30 jours suivant la réception. Nous vous enverrons une étiquette de retour. Le remboursement est effectué sous 5-7 jours ouvrés après réception et inspection du produit.',
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', name, email, subject, message }),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      setError('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement par email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        .ct-wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px 60px; }
        .ct-breadcrumb { padding: 14px 0 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
        .ct-breadcrumb a { color: #888; text-decoration: none; }
        .ct-breadcrumb a:hover { color: #111; }
        .ct-breadcrumb .sep { color: #ccc; }

        /* Hero */
        .ct-hero { background: linear-gradient(135deg, #FFF8E1, #FFFDE7); border-radius: 16px; padding: 40px 32px; text-align: center; margin: 20px 0 32px; }
        .ct-hero h1 { font-size: 32px; font-weight: 900; margin: 0 0 10px; }
        .ct-hero p { color: #666; font-size: 16px; margin: 0; }

        /* Cards row */
        .ct-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
        .ct-info-card { background: #fff; border-radius: 14px; border: 1px solid #ececec; padding: 24px 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.05); }
        .ct-info-card .icon { font-size: 32px; margin-bottom: 12px; }
        .ct-info-card h3 { font-size: 15px; font-weight: 800; margin: 0 0 8px; }
        .ct-info-card p { font-size: 14px; color: #555; margin: 0 0 4px; }
        .ct-info-card .sub { font-size: 12px; color: #888; }
        .ct-chat-btn { background: #FFB800; color: #111; border: 0; border-radius: 8px; padding: 9px 20px; font-size: 13px; font-weight: 700; cursor: pointer; margin-top: 10px; }
        .ct-chat-btn:hover { background: #F2A900; }

        /* 2-col */
        .ct-2col { display: grid; grid-template-columns: 1fr 340px; gap: 24px; margin-bottom: 40px; align-items: flex-start; }

        /* Form */
        .ct-form-card { background: #fff; border-radius: 14px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,.07); }
        .ct-form-card h2 { font-size: 18px; font-weight: 800; margin: 0 0 20px; }
        .ct-field { margin-bottom: 16px; }
        .ct-label { display: block; font-size: 12px; font-weight: 700; color: #555; margin-bottom: 6px; }
        .ct-input { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; }
        .ct-input:focus { border-color: #FFB800; }
        .ct-select { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; background: #fff; cursor: pointer; }
        .ct-select:focus { border-color: #FFB800; }
        .ct-textarea { width: 100%; border: 1px solid #ddd; border-radius: 8px; padding: 10px 12px; font-size: 14px; font-family: inherit; outline: none; resize: vertical; min-height: 120px; transition: border-color .12s; }
        .ct-textarea:focus { border-color: #FFB800; }
        .ct-submit { width: 100%; background: #FFB800; color: #111; border: 0; border-radius: 10px; height: 48px; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; }
        .ct-submit:hover { background: #F2A900; transform: translateY(-1px); }
        .ct-sent { background: #dcfce7; border-radius: 10px; padding: 16px; text-align: center; color: #16a34a; font-weight: 700; font-size: 15px; }
        .ct-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px 14px; font-size: 13px; color: #dc2626; font-weight: 600; margin-top: 12px; }
        .ct-submit:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }

        /* Info side */
        .ct-info-side { background: #fff; border-radius: 14px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,.07); }
        .ct-info-side h2 { font-size: 16px; font-weight: 800; margin: 0 0 16px; }
        .ct-addr { font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px; }
        .ct-addr strong { color: #111; display: block; margin-bottom: 4px; }
        .ct-hours { font-size: 13px; color: #555; }
        .ct-hours-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #f3f3f3; }
        .ct-hours-row:last-child { border-bottom: 0; }
        .ct-hours-day { font-weight: 600; color: #111; }
        .ct-hours-time { color: #555; }
        .ct-hours-time.closed { color: #dc2626; }
        .ct-socials { display: flex; gap: 10px; margin-top: 20px; }
        .ct-social { width: 40px; height: 40px; border-radius: 10px; border: 1px solid #ececec; display: flex; align-items: center; justify-content: center; font-size: 18px; cursor: pointer; text-decoration: none; transition: all .12s; }
        .ct-social:hover { border-color: #FFB800; background: #FFF9E0; }

        /* FAQ */
        .ct-faq { background: #fff; border-radius: 14px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,.07); }
        .ct-faq h2 { font-size: 20px; font-weight: 900; margin: 0 0 20px; display: flex; align-items: center; gap: 10px; }
        .ct-faq h2::before { content: ""; display: block; width: 6px; height: 24px; background: #FFB800; border-radius: 3px; flex-shrink: 0; }
        .ct-accordion { border: 1px solid #ececec; border-radius: 12px; overflow: hidden; margin-bottom: 10px; }
        .ct-accordion:last-child { margin-bottom: 0; }
        .ct-accordion-header { padding: 16px 18px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: #111; background: #fff; transition: background .1s; }
        .ct-accordion-header:hover { background: #FFFCEF; }
        .ct-accordion-header.open { background: #FFFCEF; color: #111; }
        .ct-accordion-arrow { font-size: 18px; color: #FFB800; transition: transform .2s; flex-shrink: 0; }
        .ct-accordion-header.open .ct-accordion-arrow { transform: rotate(180deg); }
        .ct-accordion-body { font-size: 13px; color: #555; line-height: 1.7; padding: 0 18px 16px; display: none; }
        .ct-accordion-body.open { display: block; }

        @media (max-width: 900px) {
          .ct-2col { grid-template-columns: 1fr; }
          .ct-cards { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ct-hero { padding: 28px 20px; }
          .ct-hero h1 { font-size: 24px; }
          .ct-form-card, .ct-faq { padding: 20px 16px; }
        }
      `}</style>

      <div className="ct-wrap">
        <nav className="ct-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span>Contact</span>
        </nav>

        {/* Hero */}
        <div className="ct-hero">
          <h1>Contactez-nous</h1>
          <p>Notre équipe est disponible 7j/7 pour vous aider</p>
        </div>

        {/* Contact cards */}
        <div className="ct-cards">
          <div className="ct-info-card">
            <div className="icon">📞</div>
            <h3>Téléphone</h3>
            <p>+216 70 100 200</p>
            <span className="sub">Lun-Sam 8h-20h</span>
          </div>
          <div className="ct-info-card">
            <div className="icon">📧</div>
            <h3>Email</h3>
            <p>contact@toprix.tn</p>
            <span className="sub">Réponse sous 2h</span>
          </div>
          <div className="ct-info-card">
            <div className="icon">💬</div>
            <h3>Chat en live</h3>
            <p>Disponible maintenant</p>
            <button className="ct-chat-btn">Démarrer le chat</button>
          </div>
        </div>

        {/* Form + Info */}
        <div className="ct-2col">
          <div className="ct-form-card">
            <h2>Envoyez-nous un message</h2>
            {sent ? (
              <div className="ct-sent">
                ✓ Message envoyé ! Nous vous répondrons dans les 2h.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="ct-field">
                  <label className="ct-label">Nom complet *</label>
                  <input className="ct-input" required placeholder="Votre nom" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Email *</label>
                  <input className="ct-input" type="email" required placeholder="votre@email.tn" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="ct-field">
                  <label className="ct-label">Sujet *</label>
                  <select className="ct-select" required value={subject} onChange={e => setSubject(e.target.value)}>
                    <option value="">Sélectionner un sujet</option>
                    <option value="commande">Commande</option>
                    <option value="livraison">Livraison</option>
                    <option value="remboursement">Remboursement</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="ct-field">
                  <label className="ct-label">Message *</label>
                  <textarea className="ct-textarea" required placeholder="Décrivez votre demande..." value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="ct-submit" disabled={loading}>
                  {loading ? 'Envoi en cours…' : 'Envoyer le message →'}
                </button>
                {error && <div className="ct-error">✗ {error}</div>}
              </form>
            )}
          </div>

          <div className="ct-info-side">
            <h2>Nos informations</h2>
            <div className="ct-addr">
              <strong>📍 Adresse</strong>
              Rue de la Liberté, Tunis 1002, Tunisie
            </div>
            <div>
              <div className="ct-hours">
                <div className="ct-hours-row"><span className="ct-hours-day">Lun — Ven</span><span className="ct-hours-time">8h00 - 20h00</span></div>
                <div className="ct-hours-row"><span className="ct-hours-day">Samedi</span><span className="ct-hours-time">9h00 - 17h00</span></div>
                <div className="ct-hours-row"><span className="ct-hours-day">Dimanche</span><span className="ct-hours-time closed">Fermé</span></div>
              </div>
            </div>
            <div className="ct-socials">
              <a className="ct-social" href="#" title="Facebook">📘</a>
              <a className="ct-social" href="#" title="Instagram">📸</a>
              <a className="ct-social" href="#" title="WhatsApp">📱</a>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="ct-faq">
          <h2>Questions fréquentes</h2>
          {faqs.map((f, i) => (
            <div key={i} className="ct-accordion">
              <div
                className={`ct-accordion-header${open === i ? ' open' : ''}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <span className="ct-accordion-arrow">▾</span>
              </div>
              <div className={`ct-accordion-body${open === i ? ' open' : ''}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
