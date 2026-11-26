'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { I } from './icons';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/lib/auth';

interface HeaderProps {
  categories?: { name: string; slug: string }[];
}

export default function Header({ categories = [] }: HeaderProps) {
  const { count: cartCount } = useCart();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedCat) params.set('cat', selectedCat);
    if (query.trim()) params.set('s', query.trim());
    const qs = params.toString();
    window.location.href = qs ? `/shop?${qs}` : '/shop';
  };

  return (
    <>
      <div className="utility-bar">
        <div className="inner">
          <div className="left">
            <span className="pill">SHOP.TOPRIX.TN</span>
            <span>Livraison partout en Tunisie</span>
          </div>
          <div className="right">
            <a href="/contact">Aide &amp; Service Client</a>
            <span className="dot" />
            <a href="/account">Mon compte</a>
            <span className="dot" />
            <a href="/suivi-commande">Suivre ma commande</a>
          </div>
        </div>
      </div>

      <header className="header">
        <div className="row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link className="logo" href="/">
              <span>shop<span className="dot">.</span>toprix<span className="dot">.</span>tn</span>
            </Link>
          </div>

          <form className="search-wrap" role="search" action="/shop" onSubmit={handleSearch}>
            <select
              className="cat"
              aria-label="Catégorie"
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              style={{ border: 0, outline: 0, background: '#fafafa', cursor: 'pointer', appearance: 'auto', fontFamily: 'inherit', fontSize: 13, color: 'var(--ink-2)', paddingRight: 8 }}
            >
              <option value="">Toutes catégories</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <input
              type="search"
              name="s"
              enterKeyHint="search"
              autoComplete="off"
              aria-label="Rechercher un produit"
              placeholder="Rechercher un produit…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="go" aria-label="Rechercher">
              <I.search s={16} /> <span className="go-label">Rechercher</span>
            </button>
          </form>

          <div className="header-actions">
            <Link className="h-btn" href="/account" aria-label="Mon compte">
              <I.user s={20} />
              <div className="stack">
                <span className="top">{user ? `Bonjour, ${user.firstName}` : 'Bonjour'}</span>
                <span className="bot">{user ? 'Mon espace' : 'Mon compte'}</span>
              </div>
            </Link>
            <Link className="h-btn cart-btn" href="/cart" aria-label={`Panier (${cartCount})`}>
              <div style={{ position: 'relative', display: 'flex' }}>
                <I.cart s={22} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </div>
              <div className="stack">
                <span className="top">Mon</span>
                <span className="bot">Panier</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <nav className="subnav">
        <div className="inner">
          <Link href="/shop" className="on">
            <I.menu s={14} /> &nbsp;Toutes catégories
          </Link>
          <span className="div" />
          <Link className="hot" href="/shop?on_sale=1">🔥 Offres flash</Link>
          {categories.slice(0, 7).map(c => (
            <Link key={c.slug} href={`/categorie/${decodeURIComponent(c.slug)}`}>{c.name}</Link>
          ))}
        </div>
      </nav>
    </>
  );
}
