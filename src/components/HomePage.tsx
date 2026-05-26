'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { I, CatIcon } from './icons';
// @ts-ignore
import ProductArt from './product-art.jsx';
import type { WCProduct, WCCategory } from '@/lib/woocommerce';
import { getDiscount, getBrand, getProductImage } from '@/lib/woocommerce';
import SpotlightDeals from './SpotlightDeals';
import PromoBanners from './PromoBanners';
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
  freeShip: boolean;
  badge: string;
  img: string | null;
  link: string;
}

interface HomePageProps {
  newProducts: WCProduct[];
  deals: WCProduct[];
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
    express: false, freeShip: true,
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
const CAT_ICONS: Record<string, React.ReactNode> = {
  phone: CatIcon.phone, laptop: CatIcon.laptop, audio: CatIcon.audio,
  gaming: CatIcon.gaming, tv: CatIcon.tv, home: CatIcon.home,
};
const CAT_SUBS: Record<string, string> = {
  phone: 'iPhone, Samsung', laptop: 'MacBook, Asus', audio: 'Casques, AirPods',
  gaming: 'PS5, Xbox, PC', tv: 'QLED, OLED 4K', home: 'Électroménager',
};

function CategoryBar({ cats, active, setActive }: {
  cats: WCCategory[]; active: string; setActive: (k: string) => void;
}) {
  return (
    <section className="cat-bar">
      <div className="inner">
        {cats.map((c) => (
          <Link key={c.slug} href={`/shop?cat=${c.slug}`}
            className={'cat-tile' + (active === c.slug ? ' active' : '')}
            onClick={() => setActive(c.slug)}>
            <span className="cat-circle">
              {c.image?.src
                ? <Image src={c.image.src} alt={c.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                : (CAT_ICONS[c.slug] || CatIcon.home)}
            </span>
            <span className="lbl">{c.name}</span>
            <span className="sub">{CAT_SUBS[c.slug] || `${c.count} produits`}</span>
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
        <span><I.truck s={14} /> Livraison <strong>gratuite</strong> dès 99 TND</span>
        <span><I.shield s={14} /> Paiement <strong>à la livraison</strong> disponible</span>
        <span><I.ret s={14} /> Retour <strong>15 jours</strong> sans condition</span>
        <span><I.bolt s={14} /> <strong>Express 2h</strong> Grand Tunis</span>
      </div>
    </div>
  );
}

/* ── Hero ─────────────────────────────────────────────────────── */
function Hero({ featured }: { featured: Product | null }) {
  return (
    <>
      <section className="hero">
        <div className="pattern" />
        <div className="left">
          <span className="eyebrow">Marketplace Électroménager — Tunisie</span>
          <h1>Meilleures<br /><span className="hl">Offres</span> du Marché.</h1>
          <p>Les meilleurs prix sur réfrigérateurs, friteuses, lave-vaisselle, climatiseurs et plus. Livraison rapide partout en Tunisie.</p>
          <div className="meta">
            <div className="m"><span className="k">Jusqu'à</span><span className="v">50<span>%</span></span></div>
            <div className="m"><span className="k">Produits</span><span className="v">+44 000</span></div>
          </div>
          <div className="actions">
            <Link className="btn-yellow" href="/shop">Voir les produits <I.chevR s={14} /></Link>
            <Link className="btn-ghost" href="/shop?on_sale=1">Bons plans</Link>
          </div>
        </div>
        <div className="right">
          <div className="stage">
            {featured?.img
              ? <img className="laptop" src={featured.img} alt={featured.title} style={{ objectFit: 'contain' }} />
              : <div className="laptop">{ProductArt.laptop}</div>}
          </div>
        </div>
        <div className="price-burst">
          <span className="top">DÈS</span>
          <span className="big">75</span>
          <span className="sub">TND</span>
        </div>
      </section>

      <div className="side-banners">
        <div className="side-card a">
          <div className="text">
            <div className="sm">Xiaomi Days</div>
            <div className="lg">Air Fryer dès<br />379 TND</div>
            <div className="cta">Découvrir <I.chevR s={12} /></div>
          </div>
          <div className="ic" style={{ width: 100, height: 100, flexShrink: 0 }}>
            <img src="https://spacenet.tn/245605-large_default/air-fryer-xiaomi-55031-smart-55l-1600w-blanc.jpg" alt="Xiaomi Air Fryer" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        <div className="side-card b">
          <div className="text">
            <div className="sm">Promo Cuisson</div>
            <div className="lg">Friteuses jusqu'à -40%</div>
            <div className="cta">Voir <I.chevR s={12} /></div>
          </div>
          <div className="ic" style={{ width: 100, height: 100, flexShrink: 0 }}>
            <img src="https://spacenet.tn/59737-large_default/-friteuse-gold-master-1200w-silver-gm-419.jpg" alt="Friteuse" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
        <div className="side-card c">
          <div className="text">
            <div className="sm">Réfrigération</div>
            <div className="lg">Frigos NoFrost — Promo</div>
            <div className="cta">Acheter <I.chevR s={12} /></div>
          </div>
          <div className="ic" style={{ width: 100, height: 100, flexShrink: 0 }}>
            <img src="https://spacenet.tn/242428-large_default/refrigerateur-telefunken-frig-543n-524l-nofrost-noir.jpg" alt="Réfrigérateur" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        </div>
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
      <button className={'wish' + (wished ? ' on' : '')} onClick={() => onWish(p.id)}>
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
          <span className="price"><span className="cur">TND </span>{price.int}<span className="frac">.{price.frac}</span></span>
        </div>
        {p.disc >= 2 && (
          <div className="price-row" style={{ marginTop: -4 }}>
            <span className="old">{p.old.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f')}</span>
            <span className="disc">{p.disc}% off</span>
          </div>
        )}
        {p.freeShip && <div className="ship"><I.truck s={12} /> Livraison gratuite</div>}
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

/* ── Countdown ────────────────────────────────────────────────── */
function Countdown() {
  const [t, setT] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const id = setInterval(() => {
      setT((p) => {
        let s = p.s - 1, m = p.m, h = p.h;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 9, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    <div className="countdown">
      <span className="lbl">Se termine dans</span>
      <span className="cell">{pad(t.h)}</span><span className="sep">:</span>
      <span className="cell">{pad(t.m)}</span><span className="sep">:</span>
      <span className="cell">{pad(t.s)}</span>
    </div>
  );
}

/* ── HomePage ─────────────────────────────────────────────────── */
export default function HomePage({ newProducts, deals, categories }: HomePageProps) {
  const nouveautes = useMemo(() => newProducts.map(mapProduct), [newProducts]);
  const bonsPlans  = useMemo(() => deals.map(mapProduct), [deals]);

  const spotlightData = useMemo(() => {
    const prods = [...newProducts, ...deals].map(p => ({
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
  }, [newProducts, deals]);

  const { addItem, removeItem, updateQty, items: cartItems } = useCart();
  const [activeCat, setActiveCat] = useState(categories[0]?.slug || 'phone');
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
      <CategoryBar cats={categories} active={activeCat} setActive={setActiveCat} />
      <PromoStrip />
      <main className="page">
        <Hero featured={nouveautes[0] || null} />

        {/* Nouveautés */}
        {nouveautes.length > 0 && (
          <section className="section">
            <div className="section-head">
              <div>
                <h2><span className="accent" />Nouveautés</h2>
                <div className="sub">Les dernières sorties tech — sélectionnées pour vous</div>
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
                <div className="sub">De -20% à -50% — pendant que les stocks durent</div>
              </div>
              <div className="right">
                <Countdown />
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
              title="Meilleures Offres"
              currency="TND"
            />
          </div>
        )}

        {/* Promo Banners — real deals */}
        {deals.length > 0 && (
          <div style={{ padding: '8px 0 32px' }}>
            <PromoBanners
              heading="Offres exclusives"
              banners={deals.slice(0, 3).map((p, i) => {
                const bgs = [
                  'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
                  'linear-gradient(135deg, #0b3b8c 0%, #1a56c4 100%)',
                  'linear-gradient(135deg, #4a0e8f 0%, #7b2ff7 100%)',
                ];
                const disc = getDiscount(p);
                const img = getProductImage(p);
                return {
                  title: p.name,
                  eyebrow: p.categories[0]?.name || 'Promo',
                  discount: disc > 0 ? `${disc}%` : undefined,
                  code: p.sku || p.slug.slice(0, 10).toUpperCase(),
                  image: img,
                  bg: bgs[i % bgs.length],
                  cta: 'Voir le produit',
                  link: `/produit/${p.slug}`,
                };
              })}
            />
          </div>
        )}

        {/* Brand strip */}
        <div className="brand-strip">
          <h3>Marques officielles</h3>
          <div className="logos">
            {['Apple', 'SAMSUNG', 'Sony', 'HUAWEI', 'XIAOMI', 'JBL', 'DELL', 'ASUS', 'LG', 'HP']
              .map((b) => <span key={b}>{b}</span>)}
          </div>
        </div>
      </main>

      {toast && (
        <div className="toast">
          <span className="ic"><I.check s={12} /></span> {toast}
        </div>
      )}
    </>
  );
}
