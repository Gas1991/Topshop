'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { I } from './icons';
// @ts-ignore
import ProductArt from './product-art.jsx';
import type { WCProduct, WCCategory } from '@/lib/woocommerce';
import { getDiscount, getBrand, getProductImage } from '@/lib/woocommerce';
import SpotlightDeals from './SpotlightDeals';
import CategoryRail from './CategoryRail';
import { useCart } from '@/lib/cart';

/* ── Types ────────────────────────────────────────────────────── */
interface Product {
  id: string;
  wcId: number;
  slug: string;
  art: string;
  brand: string;
  title: string;
  rating: number;
  reviews: number;
  price: number;
  old: number;
  disc: number;
  express: boolean;
  badge: string;
  img: string | null;
  link: string;
}

interface HomePageProps {
  newProducts: WCProduct[];
  deals: WCProduct[];
  selection: WCProduct[];
  categories: WCCategory[];
}

/* ── Helpers ──────────────────────────────────────────────────── */
function formatPrice(n: number) {
  const [int, frac] = n.toFixed(3).split('.');
  return { int: int.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f'), frac };
}

function mapProduct(p: WCProduct): Product {
  const price = parseFloat(p.price) || 0;
  const regular = parseFloat(p.regular_price) || price;
  const disc = getDiscount(p);
  const brand = getBrand(p);
  const img = getProductImage(p) || null;
  return {
    id: `wc_${p.id}`, wcId: Number(p.id), slug: p.slug,
    art: 'phone', brand,
    title: p.name,
    rating: parseFloat(p.average_rating) || 0,
    reviews: p.rating_count || 0,
    price, old: regular, disc,
    express: false,
    badge: disc >= 30 ? 'PROMO' : disc >= 20 ? 'BON PLAN' : '',
    img, link: `/produit/${p.slug}`,
  };
}

/* ── Stars ────────────────────────────────────────────────────── */
function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.4;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="stars">
      {Array.from({ length: full }).map((_, i) => <I.star key={'f' + i} />)}
      {half && <I.starHalf />}
      {Array.from({ length: empty }).map((_, i) => (
        <span key={'e' + i} style={{ color: '#e6e6e6' }}><I.star /></span>
      ))}
    </span>
  );
}

/* ── Category bar ─────────────────────────────────────────────── */
function CategoryBar({ cats }: { cats: WCCategory[] }) {
  return (
    <section className="cat-bar">
      <div className="inner">
        {cats.map((c) => (
          <Link key={c.slug} href={`/categorie/${decodeURIComponent(c.slug)}`} className="cat-tile">
            <span className="cat-circle">
              {c.image?.src
                ? <Image src={c.image.src} alt="" width={36} height={36} style={{ objectFit: 'contain' }} />
                : <span aria-hidden="true" style={{ fontSize: 28 }}>{c.icon}</span>}
            </span>
            <span className="lbl">{c.name}</span>
            <span className="sub">{c.count} produits</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Promo strip ──────────────────────────────────────────────── */
function PromoStrip() {
  return (
    <div className="promo-strip">
      <div className="inner">
        <span><I.shield s={14} /> Paiement <strong>à la livraison</strong></span>
        <span><I.truck s={14} /> Livraison <strong>partout en Tunisie</strong> en 48 à 72 h</span>
        <span><I.ret s={14} /> <Link href="/retours">Retours sous <strong>15 jours</strong></Link></span>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */
function Hero({ categories }: { categories: WCCategory[] }) {
  return (
    <>
      <section className="hero">
        <div className="pattern" />
        <div className="left">
          <span className="eyebrow">Boutique en ligne — Tunisie</span>
          <h1>Tout pour la maison,<br /><span className="hl">au meilleur prix</span>.</h1>
          <p>Maison, cuisine, mode, électronique et plus. Vous commandez en ligne et vous payez à la livraison.</p>
          <div className="actions">
            <Link className="btn-yellow" href="/shop">Voir les produits <I.chevR s={14} /></Link>
          </div>
        </div>
      </section>

      <div className="side-banners">
        {categories.slice(0, 3).map((c, i) => (
          <Link key={c.slug} href={`/categorie/${decodeURIComponent(c.slug)}`} className={`side-card ${'abc'[i]}`}>
            <div className="text">
              <div className="sm">{c.count} produits</div>
              <div className="lg">{c.name}</div>
              <div className="cta">Découvrir <I.chevR s={12} /></div>
            </div>
            <div className="ic" aria-hidden="true" style={{ fontSize: 56 }}>{c.icon}</div>
          </Link>
        ))}
      </div>
    </>
  );
}

/* ── Product card ─────────────────────────────────────────────── */
function ProductImage({ p }: { p: Product }) {
  const [err, setErr] = useState(false);
  if (!p.img || err) return (ProductArt as Record<string, React.ReactNode>)[p.art] || ProductArt.phone;
  return <img src={p.img} alt={p.title}
    style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }}
    onError={() => setErr(true)} />;
}

function ProductCard({ p, qty, onAdd, onInc, onDec, onWish, wished }: {
  p: Product; qty: number;
  onAdd: (id: string) => void; onInc: (id: string) => void; onDec: (id: string) => void;
  onWish: (id: string) => void; wished: boolean;
}) {
  const price = formatPrice(p.price);
  return (
    <article className="product-card">
      {p.disc >= 5 && <span className="corner-tag">-{p.disc}%</span>}
      <button className={'wish' + (wished ? ' on' : '')} onClick={() => onWish(p.id)} aria-label="Ajouter aux favoris" aria-pressed={wished}>
        <I.heart fill={wished ? 'currentColor' : 'none'} />
      </button>
      <a href={p.link} className="img-wrap" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ProductImage p={p} />
        {p.express && <span className="express"><I.bolt s={10} /> EXPRESS</span>}
      </a>
      <div className="info">
        <div className="brand">
          {p.brand}
          {p.badge && <span style={{ marginLeft: 6, color: '#E2231A', fontWeight: 800 }}>· {p.badge}</span>}
        </div>
        <a href={p.link} className="title" style={{ textDecoration: 'none', color: 'inherit' }}>{p.title}</a>
        {p.rating > 0 && (
          <div className="rating">
            <Stars value={p.rating} />
            <span className="num">{p.rating.toFixed(1)}</span>
            <span>({p.reviews.toLocaleString('fr-FR')})</span>
          </div>
        )}
        <div className="price-row">
          <span className="price">{price.int}.{price.frac}<span className="cur"> TND</span></span>
        </div>
        {p.disc >= 2 && (
          <div className="price-row" style={{ marginTop: -4 }}>
            <span className="old">{p.old.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')}</span>
            <span className="disc">{p.disc}% off</span>
          </div>
        )}
        {qty > 0 ? (
          <button className="add added">
            <span className="qty">
              <button onClick={(e) => { e.stopPropagation(); onDec(p.id); }}>−</button>
              <span>{qty} dans le panier</span>
              <button onClick={(e) => { e.stopPropagation(); onInc(p.id); }}>+</button>
            </span>
          </button>
        ) : (
          <button className="add" onClick={() => onAdd(p.id)}>
            <I.plus s={12} /> Ajouter
          </button>
        )}
      </div>
    </article>
  );
}

/* ── HomePage ─────────────────────────────────────────────────── */
export default function HomePage({ newProducts, deals, selection, categories }: HomePageProps) {
  const nouveautes = useMemo(() => newProducts.map(mapProduct), [newProducts]);
  const bonsPlans  = useMemo(() => deals.map(mapProduct), [deals]);

  const spotlightData = useMemo(() => {
    const prods = selection.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      images: p.images,
      meta_data: p.meta_data,
      price: p.price,
      regular_price: p.regular_price,
      categories: p.categories,
      rating: parseFloat(p.average_rating) || 0,
      rating_count: p.rating_count,
    }));
    const catMap = new Map<string, string>();
    prods.forEach(p => p.categories.forEach((c: { slug: string; name: string }) => catMap.set(c.slug, c.name)));
    const tabs = [...catMap.entries()].slice(0, 6).map(([slug, label]) => ({ slug, label }));
    return { prods, tabs };
  }, [selection]);

  const { addItem, removeItem, updateQty, items: cartItems } = useCart();
  const [wishlist,  setWishlist]  = useState<Record<string, boolean>>({});
  const [toast,     setToast]     = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  const getQty = (wcId: number) => cartItems.find(i => i.id === wcId)?.qty ?? 0;

  const onAdd = (id: string) => {
    const p = [...nouveautes, ...bonsPlans].find((x) => x.id === id);
    if (!p) return;
    addItem({ id: p.wcId, slug: p.slug, name: p.title, price: p.price, img: p.img || '' });
    showToast(`Ajouté: ${p.title.slice(0, 36)}…`);
  };
  const onInc = (id: string) => {
    const p = [...nouveautes, ...bonsPlans].find((x) => x.id === id);
    if (!p) return;
    const cur = getQty(p.wcId);
    if (cur > 0) updateQty(p.wcId, cur + 1);
    else addItem({ id: p.wcId, slug: p.slug, name: p.title, price: p.price, img: p.img || '' });
  };
  const onDec = (id: string) => {
    const p = [...nouveautes, ...bonsPlans].find((x) => x.id === id);
    if (!p) return;
    const cur = getQty(p.wcId);
    if (cur <= 1) removeItem(p.wcId);
    else updateQty(p.wcId, cur - 1);
  };
  const onWish = (id: string) => setWishlist((w) => ({ ...w, [id]: !w[id] }));

  return (
    <>
      <CategoryBar cats={categories} />
      <PromoStrip />
      <main className="page">
        <Hero categories={categories} />

        {/* Nouveautés */}
        {nouveautes.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2><span className="accent" />Nouveautés</h2>
                <div className="sub">Les derniers produits ajoutés</div>
              </div>
              <div className="right">
                <Link className="see-all" href="/shop?orderby=date">Voir tout <I.chevR s={12} /></Link>
              </div>
            </div>
            <div className="product-row">
              {nouveautes.map((p) => (
                <ProductCard key={p.id} p={p} qty={getQty(p.wcId)}
                  onAdd={onAdd} onInc={onInc} onDec={onDec}
                  onWish={onWish} wished={!!wishlist[p.id]} />
              ))}
            </div>
          </section>
        )}

        {/* Bons Plans */}
        {bonsPlans.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2><span className="accent" style={{ background: '#E2231A' }} />
                  Bons Plans <span style={{ color: '#E2231A', fontSize: 14, marginLeft: 6 }}>🔥</span>
                </h2>
                <div className="sub">Les produits en promotion en ce moment</div>
              </div>
              <div className="right">
                <Link className="see-all" href="/shop?on_sale=1">Voir tout <I.chevR s={12} /></Link>
              </div>
            </div>
            <div className="product-row deals">
              {bonsPlans.map((p) => (
                <ProductCard key={p.id} p={p} qty={getQty(p.wcId)}
                  onAdd={onAdd} onInc={onInc} onDec={onDec}
                  onWish={onWish} wished={!!wishlist[p.id]} />
              ))}
            </div>
          </section>
        )}

        {/* Category Rail */}
        {categories.length > 0 && (
          <div style={{ padding: '32px 0' }}>
            <CategoryRail categories={categories} title="Toutes les catégories" />
          </div>
        )}

        {/* Spotlight Deals */}
        {spotlightData.prods.length > 0 && (
          <div style={{ padding: '8px 0 32px' }}>
            <SpotlightDeals
              products={spotlightData.prods}
              tabs={spotlightData.tabs}
              title="Notre sélection"
              currency="TND"
            />
          </div>
        )}

      </main>

      {toast && (
        <div className="toast">
          <span className="ic"><I.check s={12} /></span> {toast}
        </div>
      )}
    </>
  );
}
