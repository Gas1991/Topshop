import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="inner">
        <div className="grid">
          <div className="brand-block">
            <div className="logo">topshop<span className="dot">.</span></div>
            <p style={{ marginTop: 14 }}>
              Le marketplace tech en Tunisie. Smartphones, laptops, audio, gaming,
              maison — livrés chez vous.
            </p>
            <div className="pay-row">
              <span className="pay">VISA</span>
              <span className="pay">MASTERCARD</span>
              <span className="pay">D17</span>
              <span className="pay">POSTE TN</span>
              <span className="pay" style={{ background: '#FFB800' }}>CASH</span>
            </div>
          </div>
          <div>
            <h4>Service client</h4>
            <ul>
              <li><Link href="#">Suivre ma commande</Link></li>
              <li><Link href="#">Retours &amp; remboursements</Link></li>
              <li><Link href="#">Modes de paiement</Link></li>
              <li><Link href="#">FAQ</Link></li>
              <li><Link href="#">Contactez-nous</Link></li>
            </ul>
          </div>
          <div>
            <h4>À propos de Topshop</h4>
            <ul>
              <li><Link href="#">Qui sommes-nous</Link></li>
              <li><Link href="/shop">Nos produits</Link></li>
              <li><Link href="#">Conditions générales</Link></li>
              <li><Link href="#">Politique de confidentialité</Link></li>
            </ul>
          </div>
          <div>
            <h4>Suivez-nous</h4>
            <ul>
              <li><Link href="#">Facebook</Link></li>
              <li><Link href="#">Instagram</Link></li>
              <li><Link href="#">TikTok</Link></li>
              <li><Link href="#">YouTube</Link></li>
            </ul>
          </div>
        </div>
        <div className="bottom">
          <div>© {new Date().getFullYear()} Topshop — Tous droits réservés. Tunisie.</div>
          <div className="links">
            <Link href="#">Confidentialité</Link>
            <Link href="#">Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
