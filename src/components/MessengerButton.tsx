'use client';
/**
 * Bouton flottant "Discuter sur Messenger". Simple lien vers m.me, sans SDK
 * Facebook (le widget Customer Chat integre a ete retire : xfbml.customerchat.js
 * renvoyait une erreur 500 cote serveurs Meta en continu).
 * Sur mobile : icone seule, et rien sur les pages d'achat (il couvrait les boutons).
 */
import { usePathname } from 'next/navigation';
import { MESSENGER_URL } from '@/lib/messenger';

export default function MessengerButton() {
  const path = usePathname() || '';
  const pageAchat = ['/produit', '/cart', '/checkout'].some(p => path.startsWith(p));

  return (
    <a
      href={MESSENGER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec nous sur Messenger"
      className={`msgr${pageAchat ? ' msgr-achat' : ''}`}
    >
      <svg width="24" height="24" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M18 0C8.06 0 0 7.44 0 16.62c0 5.23 2.63 9.9 6.74 12.95V36l6.16-3.38c1.64.45 3.38.7 5.1.7 9.94 0 18-7.44 18-16.62S27.94 0 18 0Z"
          fill="#fff"
        />
        <path
          d="M18 1.4C8.83 1.4 1.4 8.28 1.4 16.62c0 4.77 2.42 9.02 6.2 11.8l.62.46v6.2l5.67-3.11.5.14c1.15.32 2.36.5 3.61.5 9.17 0 16.6-6.88 16.6-15.99C34.6 8.28 27.17 1.4 18 1.4Z"
          fill="#0084FF"
        />
        <path
          d="m8.4 21.6 5.4-8.4 4.3 4.32 5.62-4.32-5.5 8.3-4.27-4.3-5.55 4.4Z"
          fill="#fff"
        />
      </svg>
      <span>Discuter sur Messenger</span>
    </a>
  );
}
