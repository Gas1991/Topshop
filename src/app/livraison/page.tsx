'use client';
import { useState } from 'react';

export default function LivraisonPage() {
  const [open, setOpen] = useState<number | null>(0);

  const sections = [
    {
      title: 'Comment est calculée la livraison ?',
      content: 'Les frais de livraison sont calculés en fonction du mode choisi : Livraison standard à 7.000 TND pour tout le pays, ou Livraison express à 12.000 TND pour le Grand Tunis. La livraison est GRATUITE pour toute commande supérieure à 99 TND avec la livraison standard.',
    },
    {
      title: 'Zones de livraison',
      content: `Nous livrons dans tous les gouvernorats de Tunisie :\n• Grand Tunis (Tunis, Ariana, Ben Arous, Manouba) : 24-48h\n• Sfax, Sousse, Monastir, Nabeul : 2-3 jours\n• Bizerte, Kairouan, Gafsa, Gabès : 3-4 jours\n• Régions éloignées (Tataouine, Kébili, Tozeur) : 4-5 jours`,
    },
    {
      title: 'Suivi de commande',
      content: 'Après confirmation de votre commande, vous recevrez un SMS avec un numéro de suivi. Vous pouvez suivre votre colis en temps réel via votre espace client ou en contactant notre service client au +216 70 100 200.',
    },
    {
      title: 'En cas de retard',
      content: 'Si votre colis ne vous a pas été livré dans les délais annoncés, contactez-nous immédiatement par téléphone ou email. Nous localiserons votre colis et vous fournirons une mise à jour. En cas de retard de plus de 2 jours ouvrés, vous bénéficierez d\'un bon de réduction sur votre prochaine commande.',
    },
  ];

  const zones = [
    { gov: 'Grand Tunis', delay: '24-48h' },
    { gov: 'Sfax', delay: '2-3 jours' },
    { gov: 'Sousse', delay: '2-3 jours' },
    { gov: 'Monastir', delay: '2-3 jours' },
    { gov: 'Nabeul', delay: '2-3 jours' },
    { gov: 'Bizerte', delay: '3-4 jours' },
    { gov: 'Kairouan', delay: '3-4 jours' },
    { gov: 'Gabès', delay: '3-4 jours' },
    { gov: 'Gafsa', delay: '3-4 jours' },
    { gov: 'Autres régions', delay: '4-5 jours' },
  ];

  return (
    <>
      <style>{`
        .lv-wrap { max-width: 900px; margin: 0 auto; padding: 0 16px 60px; }
        .lv-breadcrumb { padding: 14px 0 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
        .lv-breadcrumb a { color: #888; text-decoration: none; }
        .lv-breadcrumb a:hover { color: #111; }
        .lv-breadcrumb .sep { color: #ccc; }

        /* Hero */
        .lv-hero { margin: 20px 0 32px; }
        .lv-hero h1 { font-size: 28px; font-weight: 900; margin: 0 0 8px; }
        .lv-hero p { color: #666; font-size: 15px; margin: 0; }

        /* Options table */
        .lv-table-card { background: #fff; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.07); }
        .lv-table-card h2 { font-size: 16px; font-weight: 800; margin: 0 0 16px; display: flex; align-items: center; gap: 10px; }
        .lv-table-card h2::before { content: ""; display: block; width: 5px; height: 20px; background: #FFB800; border-radius: 3px; }
        .lv-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .lv-table th { background: #F8F9FA; font-weight: 700; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; padding: 10px 14px; text-align: left; border-bottom: 2px solid #ececec; }
        .lv-table td { padding: 12px 14px; border-bottom: 1px solid #f3f3f3; color: #555; }
        .lv-table tr:last-child td { border-bottom: 0; }
        .lv-table tr:hover td { background: #FAFAFA; }
        .lv-table .mode { font-weight: 700; color: #111; }
        .lv-table .free { color: #16a34a; font-weight: 800; }
        .lv-badge { display: inline-block; padding: 2px 8px; border-radius: 100px; font-size: 11px; font-weight: 700; }
        .lv-badge.express { background: #FFF9E0; color: #B8860B; }
        .lv-badge.free { background: #dcfce7; color: #16a34a; }

        /* Zones */
        .lv-zones { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
        .lv-zone-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: #F8F9FA; border-radius: 8px; font-size: 13px; }
        .lv-zone-row .gov { font-weight: 600; color: #111; }
        .lv-zone-row .delay { color: #555; background: #fff; border: 1px solid #ececec; padding: 2px 8px; border-radius: 100px; font-size: 12px; }

        /* Accordion */
        .lv-accordion { background: #fff; border-radius: 14px; overflow: hidden; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
        .lv-acc-header { padding: 16px 18px; cursor: pointer; display: flex; align-items: center; justify-content: space-between; font-size: 14px; font-weight: 700; color: #111; transition: background .1s; }
        .lv-acc-header:hover { background: #FFFCEF; }
        .lv-acc-header.open { background: #FFFCEF; }
        .lv-acc-arrow { font-size: 16px; color: #FFB800; transition: transform .2s; flex-shrink: 0; }
        .lv-acc-header.open .lv-acc-arrow { transform: rotate(180deg); }
        .lv-acc-body { display: none; padding: 0 18px 16px; font-size: 13px; color: #555; line-height: 1.75; white-space: pre-line; }
        .lv-acc-body.open { display: block; }

        @media (max-width: 640px) {
          .lv-zones { grid-template-columns: 1fr; }
          .lv-table { font-size: 13px; }
          .lv-table th, .lv-table td { padding: 9px 10px; }
        }
      `}</style>

      <div className="lv-wrap">
        <nav className="lv-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span>Politique de livraison</span>
        </nav>

        <div className="lv-hero">
          <h1>Politique de livraison</h1>
          <p>Tout ce que vous devez savoir sur la livraison de vos commandes</p>
        </div>

        {/* Options table */}
        <div className="lv-table-card">
          <h2>Modes de livraison</h2>
          <table className="lv-table">
            <thead>
              <tr>
                <th>Mode</th>
                <th>Délai</th>
                <th>Prix</th>
                <th>Zones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="mode">Standard <span className="lv-badge">📦</span></td>
                <td>3-5 jours ouvrés</td>
                <td>7.000 TND</td>
                <td>Tout le pays</td>
              </tr>
              <tr>
                <td className="mode">Express <span className="lv-badge express">⚡ Rapide</span></td>
                <td>24-48h</td>
                <td>12.000 TND</td>
                <td>Grand Tunis</td>
              </tr>
              <tr>
                <td className="mode">Gratuite <span className="lv-badge free">✓ Offerte</span></td>
                <td>3-5 jours ouvrés</td>
                <td className="free">GRATUIT</td>
                <td>Commandes &gt; 99 TND</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Zones */}
        <div className="lv-table-card">
          <h2>Délais par gouvernorat</h2>
          <div className="lv-zones">
            {zones.map((z, i) => (
              <div key={i} className="lv-zone-row">
                <span className="gov">📍 {z.gov}</span>
                <span className="delay">{z.delay}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Accordion sections */}
        {sections.map((s, i) => (
          <div key={i} className="lv-accordion">
            <div
              className={`lv-acc-header${open === i ? ' open' : ''}`}
              onClick={() => setOpen(open === i ? null : i)}
            >
              {s.title}
              <span className="lv-acc-arrow">▾</span>
            </div>
            <div className={`lv-acc-body${open === i ? ' open' : ''}`}>{s.content}</div>
          </div>
        ))}
      </div>
    </>
  );
}
