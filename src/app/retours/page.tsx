export default function RetoursPage() {
  const conditions = [
    { motif: 'Défaut de fabrication', delai: '30 jours', remb: '100% + frais retour offerts' },
    { motif: 'Erreur de commande', delai: '15 jours', remb: '100%' },
    { motif: 'Changement d\'avis', delai: '7 jours', remb: '90% (frais retour déduits)' },
  ];

  const excluded = [
    'Produits d\'hygiène (rasoirs, épilateurs, etc.)',
    'Logiciels déballés ou activés',
    'Consommables (cartouches, piles, etc.)',
    'Produits personnalisés ou sur mesure',
    'Produits avec scellé brisé',
  ];

  const steps = [
    { icon: '📞', title: 'Contactez-nous', desc: 'Appelez le +216 70 100 200 ou envoyez un email à contact@toprix.tn' },
    { icon: '📦', title: 'Retournez le produit', desc: 'Emballez soigneusement le produit avec tous ses accessoires et sa facture' },
    { icon: '🔍', title: 'Inspection', desc: 'Notre équipe vérifie le produit dans les 48h après réception' },
    { icon: '💰', title: 'Remboursement', desc: 'Remboursement sous 5-7 jours ouvrés sur votre moyen de paiement' },
  ];

  return (
    <>
      <style>{`
        .rt-wrap { max-width: 900px; margin: 0 auto; padding: 0 16px 60px; }
        .rt-breadcrumb { padding: 14px 0 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
        .rt-breadcrumb a { color: #888; text-decoration: none; }
        .rt-breadcrumb a:hover { color: #111; }
        .rt-breadcrumb .sep { color: #ccc; }

        /* Hero */
        .rt-hero { background: linear-gradient(135deg, #dcfce7, #f0fdf4); border-radius: 16px; padding: 36px 28px; margin: 20px 0 32px; text-align: center; }
        .rt-hero h1 { font-size: 28px; font-weight: 900; margin: 0 0 8px; }
        .rt-hero p { color: #16a34a; font-size: 16px; font-weight: 700; margin: 0; }

        /* Steps */
        .rt-steps-card { background: #fff; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.07); }
        .rt-steps-title { font-size: 16px; font-weight: 800; margin-bottom: 24px; display: flex; align-items: center; gap: 10px; }
        .rt-steps-title::before { content: ""; display: block; width: 5px; height: 20px; background: #FFB800; border-radius: 3px; }
        .rt-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
        .rt-steps::before { content: ""; position: absolute; top: 28px; left: 12.5%; right: 12.5%; height: 2px; background: linear-gradient(to right, #FFB800, #FFB800 70%, #ddd 70%); z-index: 0; }
        .rt-step { text-align: center; padding: 0 8px; position: relative; z-index: 1; }
        .rt-step-icon { width: 56px; height: 56px; border-radius: 50%; background: #FFF9E0; border: 2px solid #FFB800; display: flex; align-items: center; justify-content: center; font-size: 22px; margin: 0 auto 12px; }
        .rt-step-num { position: absolute; top: -4px; right: calc(50% - 36px); background: #FFB800; color: #111; width: 18px; height: 18px; border-radius: 50%; font-size: 10px; font-weight: 900; display: flex; align-items: center; justify-content: center; }
        .rt-step-title { font-size: 13px; font-weight: 700; color: #111; margin-bottom: 4px; }
        .rt-step-desc { font-size: 12px; color: #666; line-height: 1.5; }

        /* Conditions table */
        .rt-table-card { background: #fff; border-radius: 14px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 10px rgba(0,0,0,.07); }
        .rt-table-title { font-size: 16px; font-weight: 800; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
        .rt-table-title::before { content: ""; display: block; width: 5px; height: 20px; background: #FFB800; border-radius: 3px; }
        .rt-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .rt-table th { background: #F8F9FA; font-weight: 700; color: #555; font-size: 12px; text-transform: uppercase; letter-spacing: .05em; padding: 10px 14px; text-align: left; border-bottom: 2px solid #ececec; }
        .rt-table td { padding: 12px 14px; border-bottom: 1px solid #f3f3f3; color: #555; }
        .rt-table tr:last-child td { border-bottom: 0; }
        .rt-table .motif { font-weight: 700; color: #111; }
        .rt-table .remb { color: #16a34a; font-weight: 600; }

        /* Excluded */
        .rt-excluded { background: #fff5f5; border: 1px solid #fee2e2; border-radius: 14px; padding: 24px; margin-bottom: 24px; }
        .rt-excluded-title { font-size: 15px; font-weight: 800; color: #dc2626; margin-bottom: 14px; }
        .rt-excluded ul { margin: 0; padding-left: 20px; }
        .rt-excluded li { font-size: 14px; color: #555; line-height: 1.7; }

        /* CTA */
        .rt-cta { background: linear-gradient(135deg, #FFF8E1, #FFFDE7); border-radius: 14px; padding: 28px; text-align: center; }
        .rt-cta p { font-size: 16px; color: #555; margin: 0 0 16px; }
        .rt-cta a { display: inline-block; background: #FFB800; color: #111; font-weight: 800; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-size: 14px; }
        .rt-cta a:hover { background: #F2A900; }

        @media (max-width: 640px) {
          .rt-steps { grid-template-columns: repeat(2, 1fr); gap: 20px; }
          .rt-steps::before { display: none; }
          .rt-table { font-size: 13px; }
          .rt-table th, .rt-table td { padding: 9px 10px; }
        }
      `}</style>

      <div className="rt-wrap">
        <nav className="rt-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span>Retours & Remboursements</span>
        </nav>

        <div className="rt-hero">
          <h1>Retours & Remboursements</h1>
          <p>✓ Satisfait ou remboursé sous 30 jours</p>
        </div>

        {/* Steps */}
        <div className="rt-steps-card">
          <div className="rt-steps-title">Comment retourner un produit ?</div>
          <div className="rt-steps">
            {steps.map((s, i) => (
              <div key={i} className="rt-step">
                <div className="rt-step-icon">
                  {s.icon}
                  <span className="rt-step-num">{i + 1}</span>
                </div>
                <div className="rt-step-title">{s.title}</div>
                <div className="rt-step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="rt-table-card">
          <div className="rt-table-title">Conditions de retour</div>
          <table className="rt-table">
            <thead>
              <tr>
                <th>Motif</th>
                <th>Délai</th>
                <th>Remboursement</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map((c, i) => (
                <tr key={i}>
                  <td className="motif">{c.motif}</td>
                  <td>{c.delai}</td>
                  <td className="remb">{c.remb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Excluded */}
        <div className="rt-excluded">
          <div className="rt-excluded-title">✗ Produits non retournables</div>
          <ul>
            {excluded.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>

        {/* CTA */}
        <div className="rt-cta">
          <p>Une question sur votre retour ? Notre équipe est là pour vous aider.</p>
          <a href="/contact">Contacter le service client →</a>
        </div>
      </div>
    </>
  );
}
