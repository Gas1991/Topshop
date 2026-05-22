export default function ConfidentialitePage() {
  const sections = [
    {
      title: '1. Données collectées',
      content: `Nous collectons les informations suivantes lorsque vous utilisez Toprix.tn :\n\n• Informations d'identification : nom, prénom, adresse email, numéro de téléphone\n• Informations de livraison : adresse postale, gouvernorat, délégation\n• Données de transaction : historique des commandes, modes de paiement (sans numéros de carte)\n• Données de navigation : adresse IP, cookies, pages visitées, produits consultés\n• Données de compte : identifiants de connexion (mots de passe chiffrés)`,
    },
    {
      title: '2. Utilisation des données',
      content: `Vos données sont utilisées exclusivement pour :\n\n• Traiter et livrer vos commandes\n• Vous envoyer des confirmations de commande et notifications de livraison\n• Améliorer votre expérience d'achat (recommandations personnalisées)\n• Répondre à vos demandes de service client\n• Prévenir les fraudes et sécuriser vos transactions\n• Envoyer des offres promotionnelles (avec votre consentement)`,
    },
    {
      title: '3. Partage avec des tiers',
      content: `Toprix.tn ne vend jamais vos données personnelles. Nous partageons uniquement :\n\n• Avec nos partenaires logistiques (Aramex, GLS) pour assurer la livraison\n• Avec nos boutiques partenaires (Mytek, Tunisianet, Spacenet) pour traiter vos commandes\n• Avec les autorités judiciaires si requis par la loi tunisienne\n\nTous nos partenaires sont soumis à des accords de confidentialité stricts.`,
    },
    {
      title: '4. Cookies',
      content: `Nous utilisons plusieurs types de cookies :\n\n• Cookies essentiels : nécessaires au fonctionnement du site (panier, connexion)\n• Cookies analytiques : mesure d'audience via des outils anonymisés\n• Cookies de préférences : mémorisation de vos paramètres (langue, devise)\n• Cookies marketing : personnalisation des publicités (avec consentement)\n\nVous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur.`,
    },
    {
      title: '5. Vos droits',
      content: `Conformément à la réglementation tunisienne sur la protection des données, vous disposez des droits suivants :\n\n• Droit d'accès : obtenir une copie de vos données personnelles\n• Droit de rectification : corriger des données inexactes\n• Droit à l'effacement : demander la suppression de vos données\n• Droit à la portabilité : recevoir vos données dans un format structuré\n• Droit d'opposition : vous opposer au traitement de vos données\n\nPour exercer ces droits, contactez notre DPO à l'adresse ci-dessous.`,
    },
    {
      title: '6. Contact DPO',
      content: `Notre Délégué à la Protection des Données (DPO) est joignable à :\n\n• Email : dpo@toprix.tn\n• Adresse : Rue de la Liberté, Tunis 1002, Tunisie\n• Téléphone : +216 70 100 200 (demander le service DPO)\n\nVous pouvez également contacter l'Autorité Nationale de Protection des Données Personnelles (ANPDP) si vous estimez que vos droits n'ont pas été respectés.`,
    },
  ];

  return (
    <>
      <style>{`
        .cp-wrap { max-width: 800px; margin: 0 auto; padding: 0 16px 60px; }
        .cp-breadcrumb { padding: 14px 0 0; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; }
        .cp-breadcrumb a { color: #888; text-decoration: none; }
        .cp-breadcrumb a:hover { color: #111; }
        .cp-breadcrumb .sep { color: #ccc; }

        /* Header */
        .cp-header { margin: 24px 0 32px; }
        .cp-header h1 { font-size: 28px; font-weight: 900; margin: 0 0 8px; }
        .cp-header .updated { font-size: 13px; color: #888; }

        /* TOC */
        .cp-toc { background: #F8F9FA; border-radius: 12px; padding: 20px; margin-bottom: 32px; }
        .cp-toc h3 { font-size: 13px; font-weight: 800; color: #555; text-transform: uppercase; letter-spacing: .06em; margin: 0 0 12px; }
        .cp-toc ol { margin: 0; padding-left: 20px; }
        .cp-toc li { font-size: 14px; margin-bottom: 6px; }
        .cp-toc a { color: #111; text-decoration: none; font-weight: 600; }
        .cp-toc a:hover { color: #FFB800; }

        /* Sections */
        .cp-section { background: #fff; border-radius: 14px; padding: 24px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
        .cp-section h2 { font-size: 16px; font-weight: 800; margin: 0 0 14px; color: #111; padding-bottom: 12px; border-bottom: 2px solid #FFB800; display: inline-block; }
        .cp-section p { font-size: 14px; color: #555; line-height: 1.8; white-space: pre-line; margin: 0; }

        /* Footer note */
        .cp-footer-note { background: #FFF8E1; border-radius: 12px; padding: 16px 20px; font-size: 13px; color: #666; line-height: 1.6; border-left: 4px solid #FFB800; }

        @media (max-width: 640px) {
          .cp-header h1 { font-size: 22px; }
          .cp-section { padding: 18px 16px; }
        }
      `}</style>

      <div className="cp-wrap">
        <nav className="cp-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span>Politique de confidentialité</span>
        </nav>

        <div className="cp-header">
          <h1>Politique de confidentialité</h1>
          <div className="updated">Mis à jour le 1er janvier 2026</div>
        </div>

        {/* Table of contents */}
        <div className="cp-toc">
          <h3>Sommaire</h3>
          <ol>
            {sections.map((s, i) => (
              <li key={i}>
                <a href={`#section-${i}`}>{s.title}</a>
              </li>
            ))}
          </ol>
        </div>

        {/* Sections */}
        {sections.map((s, i) => (
          <div key={i} id={`section-${i}`} className="cp-section">
            <h2>{s.title}</h2>
            <p>{s.content}</p>
          </div>
        ))}

        <div className="cp-footer-note">
          Cette politique de confidentialité est régie par la loi organique tunisienne n° 2004-63 du 27 juillet 2004 relative à la protection des données à caractère personnel. En utilisant Toprix.tn, vous acceptez les termes de cette politique.
        </div>
      </div>
    </>
  );
}
