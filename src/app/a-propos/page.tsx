export default function AProposPage() {
  const stats = [
    { icon: '📦', num: '44 000+', label: 'Produits' },
    { icon: '😊', num: '10 000+', label: 'Clients satisfaits' },
    { icon: '🚚', num: '48h', label: 'Livraison moyenne' },
    { icon: '⭐', num: '4.8/5', label: 'Satisfaction client' },
  ];

  const values = [
    { icon: '🤝', title: 'Confiance', desc: 'Produits 100% authentiques, sélectionnés avec soin pour vous garantir qualité et fiabilité.' },
    { icon: '💰', title: 'Meilleur prix', desc: 'Nous sélectionnons les meilleures offres pour vous proposer les prix les plus compétitifs du marché tunisien.' },
    { icon: '🚀', title: 'Rapidité', desc: 'Livraison express partout en Tunisie sous 48h, avec suivi en temps réel.' },
  ];

  return (
    <>
      <style>{`
        .ap-wrap { max-width: 1100px; margin: 0 auto; padding: 0 16px 60px; }
        .ap-breadcrumb { padding: 14px 0 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
        .ap-breadcrumb a { color: #888; text-decoration: none; }
        .ap-breadcrumb a:hover { color: #111; }
        .ap-breadcrumb .sep { color: #ccc; }

        /* Hero */
        .ap-hero { background: linear-gradient(135deg, #1a1a1a 60%, #2d2d2d); border-radius: 16px; padding: 56px 40px; margin: 20px 0 40px; position: relative; overflow: hidden; }
        .ap-hero::before { content: ""; position: absolute; inset: 0; background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="80" cy="20" r="40" fill="rgba(255,184,0,.06)"/><circle cx="10" cy="80" r="30" fill="rgba(255,184,0,.04)"/></svg>') no-repeat center; background-size: cover; }
        .ap-hero-inner { position: relative; z-index: 1; }
        .ap-hero h1 { font-size: 40px; font-weight: 900; color: #fff; margin: 0 0 12px; }
        .ap-hero p { color: rgba(255,255,255,.75); font-size: 17px; margin: 0; }

        /* Stats */
        .ap-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 48px; }
        .ap-stat { background: #fff; border-radius: 14px; padding: 24px 16px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
        .ap-stat .icon { font-size: 28px; margin-bottom: 10px; }
        .ap-stat .num { font-size: 28px; font-weight: 900; color: #FFB800; line-height: 1; margin-bottom: 6px; }
        .ap-stat .label { font-size: 13px; color: #666; }

        /* Story */
        .ap-story { display: grid; grid-template-columns: 1fr 380px; gap: 32px; margin-bottom: 48px; align-items: center; }
        .ap-story-text h2 { font-size: 24px; font-weight: 900; margin: 0 0 16px; display: flex; align-items: center; gap: 10px; }
        .ap-story-text h2::before { content: ""; display: block; width: 6px; height: 28px; background: #FFB800; border-radius: 3px; }
        .ap-story-text p { font-size: 15px; color: #555; line-height: 1.8; margin-bottom: 16px; }
        .ap-story-text p:last-child { margin-bottom: 0; }
        .ap-story-img { background: linear-gradient(135deg, #FFF8E1, #FFFDE7); border-radius: 16px; padding: 32px; text-align: center; font-size: 80px; min-height: 200px; display: flex; align-items: center; justify-content: center; }

        /* Values */
        .ap-values { margin-bottom: 48px; }
        .ap-values-head { font-size: 22px; font-weight: 900; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
        .ap-values-head::before { content: ""; display: block; width: 6px; height: 26px; background: #FFB800; border-radius: 3px; }
        .ap-values-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .ap-value-card { background: #fff; border-radius: 14px; padding: 24px 20px; box-shadow: 0 2px 8px rgba(0,0,0,.06); }
        .ap-value-card .icon { font-size: 32px; margin-bottom: 14px; }
        .ap-value-card h3 { font-size: 16px; font-weight: 800; margin: 0 0 8px; }
        .ap-value-card p { font-size: 14px; color: #555; line-height: 1.6; margin: 0; }

        @media (max-width: 900px) {
          .ap-stats { grid-template-columns: repeat(2, 1fr); }
          .ap-story { grid-template-columns: 1fr; }
          .ap-values-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .ap-hero { padding: 36px 20px; }
          .ap-hero h1 { font-size: 28px; }
        }
      `}</style>

      <div className="ap-wrap">
        <nav className="ap-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span>À propos</span>
        </nav>

        <div className="ap-hero">
          <div className="ap-hero-inner">
            <h1>Notre histoire</h1>
            <p>Votre marketplace tunisienne de confiance depuis 2023</p>
          </div>
        </div>

        <div className="ap-stats">
          {stats.map((s, i) => (
            <div key={i} className="ap-stat">
              <div className="icon">{s.icon}</div>
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="ap-story">
          <div className="ap-story-text">
            <h2>Qui sommes-nous ?</h2>
            <p>
              shop.toprix.tn est né d&apos;une idée simple : vous offrir un accès rapide aux meilleurs
              produits tech et électroménager en Tunisie, réunis en un seul endroit.
            </p>
            <p>
              Notre mission : vous offrir le meilleur prix, la meilleure qualité, et la meilleure expérience
              d&apos;achat en Tunisie. Nous sélectionnons rigoureusement chaque produit pour vous
              garantir authenticité et livraison rapide.
            </p>
            <p>
              Depuis notre lancement en 2023, nous avons servi des milliers de clients satisfaits à travers
              tout le territoire tunisien, et nous continuons à grandir chaque jour.
            </p>
          </div>
          <div className="ap-story-img">🏪</div>
        </div>

        <div className="ap-values">
          <div className="ap-values-head">Nos valeurs</div>
          <div className="ap-values-grid">
            {values.map((v, i) => (
              <div key={i} className="ap-value-card">
                <div className="icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
