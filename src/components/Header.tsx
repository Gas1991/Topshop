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
            <span className="pill">TOPSHOP TN</span>
            <span>Livraison express 🇹🇳 partout en Tunisie</span>
          </div>
          <div className="right">
            <a href="#">Aide &amp; Service Client</a>
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
              topshop<span className="dot">.</span><small>tn</small>
            </Link>
          </div>

          <form className="search-wrap" onSubmit={handleSearch}>
            <select
              className="cat"
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
              placeholder="Rechercher des produits, marques et plus encore…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="go">
              <I.search s={14} /> Rechercher
            </button>
          </form>

          <div className="header-actions">
            <Link className="h-btn" href="/account">
              <I.user s={20} />
              <div className="stack">
                <span className="top">{user ? `Bonjour, ${user.firstName}` : 'Bonjour'}</span>
                <span className="bot">{user ? 'Mon espace' : 'Mon compte'}</span>
              </div>
            </Link>
            <Link className="h-btn cart-btn" href="/cart">
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
            <Link key={c.slug} href={`/categorie/${c.slug}`}>{c.name}</Link>
          ))}
        </div>
      </nav>
    </>
  );
}
