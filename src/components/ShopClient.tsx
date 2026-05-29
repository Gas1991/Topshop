'use client';
import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { WCProduct, WCCategory } from '@/lib/woocommerce';
import { getProductImage, getDiscount, getBrand } from '@/lib/woocommerce';
import { useCart } from '@/lib/cart';

/* ── Product Card ──────────────────────────────────────────────── */
function ProductCard({ p }: { p: WCProduct }) {
  const { addItem } = useCart();
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const img = getProductImage(p);
  const disc = getDiscount(p);
  const price = parseFloat(p.price) || 0;
  const regular = parseFloat(p.regular_price) || price;
  const rating = parseFloat(p.average_rating) || 0;
  const brand = getBrand(p);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem({ id: Number(p.id), slug: p.slug, name: p.name, price, img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Link href={`/produit/${p.slug}`} className="sc-card">
      <div className="sc-card-img">
        {disc > 0 && <span className="sc-badge">-{disc}%</span>}
        <button
          className={`sc-wish${wished ? ' on' : ''}`}
          onClick={e => { e.preventDefault(); setWished(!wished); }}
          aria-label="Favoris"
        >
          {wished ? '❤' : '♡'}
        </button>
        {img
          ? <img src={img} alt={p.name} />
          : <span className="sc-no-img">📦</span>}
      </div>
      <div className="sc-card-info">
        {brand && <div className="sc-brand">{brand}</div>}
        <div className="sc-name">{p.name}</div>
        {rating > 0 && (
          <div className="sc-rating">
            <span className="sc-stars">{'★'.repeat(Math.floor(rating))}<span className="sc-stars-empty">{'★'.repeat(5 - Math.floor(rating))}</span></span>
            <span className="sc-rating-num">{rating.toFixed(1)}</span>
            <span className="sc-rating-ct">({p.rating_count})</span>
          </div>
        )}
        <div className="sc-price-row">
          <span className="sc-price">{price.toFixed(3)}<span className="sc-cur"> TND</span></span>
          {disc > 0 && <span className="sc-old">{regular.toFixed(3)} TND</span>}
        </div>
        <button
          className={`sc-add${added ? ' added' : ''}`}
          onClick={handleAdd}
        >
          {added ? '✓ Ajouté !' : '+ Ajouter au panier'}
        </button>
      </div>
    </Link>
  );
}

/* ── Pagination ─────────────────────────────────────────────────── */
function Pagination({ currentPage, totalPages, baseUrl }: { currentPage: number; totalPages: number; baseUrl: string }) {
  if (totalPages <= 1) return null;

  function pageUrl(p: number) {
    if (p === 1) return baseUrl;
    return baseUrl.includes('?') ? `${baseUrl}&page=${p}` : `${baseUrl}?page=${p}`;
  }

  // Build visible page numbers with smart ellipsis
  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 32, flexWrap: 'wrap' }}>
      {/* Précédent */}
      {currentPage > 1 ? (
        <a href={pageUrl(currentPage - 1)} style={pgStyle(false, false)}>← Précédent</a>
      ) : (
        <span style={{ ...pgStyle(false, false), opacity: 0.35, pointerEvents: 'none', cursor: 'default' }}>← Précédent</span>
      )}

      {/* Pages */}
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ padding: '0 4px', color: '#aaa', fontSize: 14 }}>…</span>
          : <a key={p} href={pageUrl(p as number)} style={pgStyle(p === currentPage, false)}>{p}</a>
      )}

      {/* Suivant */}
      {currentPage < totalPages ? (
        <a href={pageUrl(currentPage + 1)} style={pgStyle(false, false)}>Suivant →</a>
      ) : (
        <span style={{ ...pgStyle(false, false), opacity: 0.35, pointerEvents: 'none', cursor: 'default' }}>Suivant →</span>
      )}
    </nav>
  );
}

function pgStyle(active: boolean, _: boolean): React.CSSProperties {
  return {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    minWidth: 38, height: 38, padding: '0 10px',
    borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: active ? 900 : 600,
    background: active ? '#FFB800' : '#fff',
    color: active ? '#111' : '#555',
    border: `1.5px solid ${active ? '#FFB800' : '#e0e0e0'}`,
    boxShadow: active ? '0 2px 6px rgba(255,184,0,.3)' : 'none',
    transition: 'all .12s',
  };
}

/* ── Main Component ─────────────────────────────────────────────── */
interface ShopClientProps {
  products: WCProduct[];
  categories: WCCategory[];
  title: string;
  total: number;
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

type SortKey = 'date' | 'price_asc' | 'price_desc' | 'rating' | 'name';

export default function ShopClient({ products, categories, title, total, currentPage, totalPages, baseUrl }: ShopClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyOnSale, setOnlyOnSale] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  // Brands derived from products
  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => { const b = getBrand(p); if (b) set.add(b); });
    return Array.from(set).slice(0, 15);
  }, [products]);

  const toggleBrand = useCallback((b: string) => {
    setSelectedBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
  }, []);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (priceMin) list = list.filter(p => parseFloat(p.price) >= parseFloat(priceMin));
    if (priceMax) list = list.filter(p => parseFloat(p.price) <= parseFloat(priceMax));
    if (onlyInStock) list = list.filter(p => p.stock_status === 'instock');
    if (onlyOnSale) list = list.filter(p => p.on_sale);
    if (minRating > 0) list = list.filter(p => parseFloat(p.average_rating) >= minRating);
    if (selectedBrands.length > 0) list = list.filter(p => selectedBrands.includes(getBrand(p)));

    switch (sortBy) {
      case 'price_asc':  list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price)); break;
      case 'price_desc': list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price)); break;
      case 'rating':     list.sort((a, b) => parseFloat(b.average_rating) - parseFloat(a.average_rating)); break;
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    return list;
  }, [products, priceMin, priceMax, onlyInStock, onlyOnSale, minRating, selectedBrands, sortBy]);

  function clearFilters() {
    setPriceMin(''); setPriceMax('');
    setOnlyInStock(false); setOnlyOnSale(false);
    setMinRating(0); setSelectedBrands([]);
  }

  const hasActiveFilters = priceMin || priceMax || onlyInStock || onlyOnSale || minRating > 0 || selectedBrands.length > 0;

  function navigateCat(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set('cat', slug); else params.delete('cat');
    params.delete('s');
    params.delete('page'); // reset pagination
    router.push(`/shop?${params.toString()}`);
  }

  const currentCat = searchParams.get('cat') || '';

  const FilterSidebar = (
    <div className="sc-sidebar">
      <div className="sc-filter-head">
        <h3>⚙ Filtres</h3>
        {hasActiveFilters && (
          <button className="sc-clear" onClick={clearFilters}>Tout effacer</button>
        )}
      </div>

      {/* Categories */}
      <div className="sc-fsec">
        <div className="sc-fsec-title">Catégories</div>
        <div className="sc-cats">
          <button
            className={`sc-cat-btn${!currentCat ? ' active' : ''}`}
            onClick={() => navigateCat('')}
          >
            Tous les produits
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              className={`sc-cat-btn${currentCat === c.slug ? ' active' : ''}`}
              onClick={() => navigateCat(c.slug)}
            >
              {c.name} <span className="sc-cat-count">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="sc-fsec">
        <div className="sc-fsec-title">Prix (TND)</div>
        <div className="sc-price-inputs">
          <input
            className="sc-price-input"
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            min="0"
          />
          <span className="sc-price-sep">—</span>
          <input
            className="sc-price-input"
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            min="0"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="sc-fsec">
        <div className="sc-fsec-title">Note minimale</div>
        <div className="sc-ratings">
          {[4, 3, 2, 1].map(r => (
            <button
              key={r}
              className={`sc-rating-filter${minRating === r ? ' active' : ''}`}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} & +
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      {brands.length > 0 && (
        <div className="sc-fsec">
          <div className="sc-fsec-title">Marques</div>
          <div className="sc-brands">
            {brands.map(b => (
              <label key={b} className="sc-check-row">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                <span>{b}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="sc-fsec sc-fsec-last">
        <div className="sc-fsec-title">Disponibilité</div>
        <label className="sc-toggle-row">
          <input type="checkbox" checked={onlyInStock} onChange={e => setOnlyInStock(e.target.checked)} />
          <span>En stock uniquement</span>
        </label>
        <label className="sc-toggle-row">
          <input type="checkbox" checked={onlyOnSale} onChange={e => setOnlyOnSale(e.target.checked)} />
          <span>En promotion</span>
        </label>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .sc-wrap { max-width: 1280px; margin: 0 auto; padding: 0 16px 48px; }

        /* Breadcrumb */
        .sc-breadcrumb { padding: 14px 0 8px; font-size: 12px; color: #888; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .sc-breadcrumb a { color: #888; text-decoration: none; }
        .sc-breadcrumb a:hover { color: #111; }
        .sc-breadcrumb .sep { color: #ccc; }
        .sc-breadcrumb .cur { color: #111; font-weight: 600; }

        /* Title row */
        .sc-title-row { display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
        .sc-h1 { font-size: 22px; font-weight: 900; margin: 0; }
        .sc-count { font-size: 13px; color: #888; }
        .sc-count strong { color: #111; }

        /* Layout */
        .sc-layout { display: grid; grid-template-columns: 256px 1fr; gap: 20px; align-items: flex-start; }

        /* Sidebar */
        .sc-sidebar { background: #fff; border-radius: 14px; box-shadow: 0 2px 12px rgba(0,0,0,.07); position: sticky; top: 16px; max-height: calc(100vh - 32px); overflow-y: auto; scrollbar-width: thin; }
        .sc-sidebar::-webkit-scrollbar { width: 5px; }
        .sc-sidebar::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
        .sc-filter-head { padding: 14px 16px; border-bottom: 1px solid #ececec; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #fff; z-index: 2; }
        .sc-filter-head h3 { margin: 0; font-size: 14px; font-weight: 800; }
        .sc-clear { background: none; border: 0; color: #dc2626; font-size: 12px; font-weight: 700; cursor: pointer; padding: 0; }
        .sc-clear:hover { text-decoration: underline; }
        .sc-fsec { border-bottom: 1px solid #f3f3f3; padding: 14px 16px; }
        .sc-fsec-last { border-bottom: 0; }
        .sc-fsec-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .06em; color: #555; margin-bottom: 10px; }

        /* Category buttons */
        .sc-cats { display: flex; flex-direction: column; gap: 3px; }
        .sc-cat-btn { background: none; border: 0; text-align: left; padding: 7px 10px; border-radius: 8px; font-size: 13px; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: space-between; transition: background .1s, color .1s; }
        .sc-cat-btn:hover { background: #FFF9E0; color: #111; }
        .sc-cat-btn.active { background: #FFB800; color: #111; font-weight: 700; }
        .sc-cat-count { font-size: 11px; background: #f3f3f3; color: #888; padding: 1px 6px; border-radius: 10px; }
        .sc-cat-btn.active .sc-cat-count { background: rgba(0,0,0,.12); color: #111; }

        /* Price */
        .sc-price-inputs { display: flex; align-items: center; gap: 8px; }
        .sc-price-input { flex: 1; border: 1px solid #ddd; border-radius: 8px; padding: 7px 10px; font-size: 13px; width: 0; outline: none; }
        .sc-price-input:focus { border-color: #FFB800; }
        .sc-price-sep { color: #bbb; font-size: 16px; flex-shrink: 0; }

        /* Ratings */
        .sc-ratings { display: flex; flex-direction: column; gap: 4px; }
        .sc-rating-filter { background: none; border: 1px solid #ddd; border-radius: 8px; padding: 7px 10px; font-size: 13px; cursor: pointer; text-align: left; color: #FFB800; transition: all .1s; }
        .sc-rating-filter:hover, .sc-rating-filter.active { border-color: #FFB800; background: #FFF9E0; color: #111; }

        /* Brands */
        .sc-brands { display: flex; flex-direction: column; gap: 4px; max-height: 180px; overflow-y: auto; }
        .sc-check-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; cursor: pointer; padding: 3px 0; }
        .sc-check-row input[type="checkbox"] { accent-color: #FFB800; width: 15px; height: 15px; }
        .sc-toggle-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #555; cursor: pointer; padding: 4px 0; }
        .sc-toggle-row input[type="checkbox"] { accent-color: #FFB800; width: 15px; height: 15px; }

        /* Main content */
        .sc-content {}

        /* Sort bar */
        .sc-sort-bar { background: #fff; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 16px; box-shadow: 0 1px 4px rgba(0,0,0,.05); flex-wrap: wrap; }
        .sc-sort-label { font-size: 13px; color: #888; white-space: nowrap; }
        .sc-sort-label strong { color: #111; }
        .sc-sort-select { border: 1px solid #ddd; border-radius: 8px; padding: 7px 12px; font-size: 13px; background: #fff; cursor: pointer; outline: none; }
        .sc-sort-select:focus { border-color: #FFB800; }
        .sc-filter-btn { display: none; align-items: center; gap: 6px; background: #111; color: #fff; border: 0; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 700; cursor: pointer; }

        /* Product grid */
        .sc-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }

        /* Product card */
        .sc-card { display: block; background: #fff; border: 1px solid #ececec; border-radius: 14px; overflow: hidden; text-decoration: none; color: inherit; transition: box-shadow .15s, transform .15s; }
        .sc-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.1); transform: translateY(-2px); }
        .sc-card-img { position: relative; aspect-ratio: 1; background: #F8F9FA; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .sc-card-img img { width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform .2s; mix-blend-mode: multiply; }
        .sc-card:hover .sc-card-img img { transform: scale(1.04); }
        .sc-no-img { font-size: 48px; }
        .sc-badge { position: absolute; top: 8px; left: 8px; background: #E2231A; color: #fff; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; z-index: 1; }
        .sc-wish { position: absolute; top: 8px; right: 8px; width: 32px; height: 32px; border-radius: 50%; background: #fff; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; font-size: 15px; cursor: pointer; z-index: 1; transition: all .12s; }
        .sc-wish:hover { border-color: #dc2626; color: #dc2626; }
        .sc-wish.on { border-color: #dc2626; color: #dc2626; background: #fee2e2; }
        .sc-card-info { padding: 12px; }
        .sc-brand { font-size: 11px; color: #888; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 4px; }
        .sc-name { font-size: 13px; font-weight: 600; line-height: 1.4; color: #111; margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
        .sc-rating { display: flex; align-items: center; gap: 4px; margin-bottom: 6px; }
        .sc-stars { color: #FFB800; font-size: 12px; }
        .sc-stars-empty { color: #e0e0e0; }
        .sc-rating-num { font-size: 12px; font-weight: 700; color: #111; }
        .sc-rating-ct { font-size: 11px; color: #aaa; }
        .sc-price-row { display: flex; align-items: baseline; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
        .sc-price { font-size: 16px; font-weight: 900; color: #111; }
        .sc-cur { font-size: 11px; font-weight: 700; color: #555; }
        .sc-old { font-size: 12px; color: #aaa; text-decoration: line-through; }
        .sc-add { width: 100%; background: #FFB800; color: #111; border: 0; border-radius: 8px; height: 36px; font-size: 13px; font-weight: 800; cursor: pointer; transition: all .12s; }
        .sc-add:hover { background: #F2A900; }
        .sc-add.added { background: #16a34a; color: #fff; }

        /* Empty state */
        .sc-empty { text-align: center; padding: 60px 20px; background: #fff; border-radius: 14px; color: #888; grid-column: 1 / -1; }
        .sc-empty-icon { font-size: 56px; margin-bottom: 12px; }

        /* Mobile filter drawer */
        .sc-drawer-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.45); z-index: 100; }
        .sc-drawer-overlay.open { display: block; }
        .sc-drawer { position: fixed; left: 0; top: 0; bottom: 0; width: 300px; max-width: 90vw; background: #fff; z-index: 101; transform: translateX(-100%); transition: transform .25s; overflow-y: auto; }
        .sc-drawer.open { transform: translateX(0); }
        .sc-drawer-close { position: sticky; top: 0; background: #fff; border-bottom: 1px solid #ececec; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; z-index: 2; }
        .sc-drawer-close span { font-size: 15px; font-weight: 800; }
        .sc-drawer-close button { background: none; border: 0; font-size: 22px; cursor: pointer; color: #555; line-height: 1; }

        /* Responsive */
        @media (max-width: 1100px) {
          .sc-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 900px) {
          .sc-layout { grid-template-columns: 1fr; }
          .sc-sidebar { display: none; }
          .sc-filter-btn { display: flex; }
        }
        @media (max-width: 640px) {
          .sc-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .sc-h1 { font-size: 18px; }
        }
        @media (max-width: 360px) {
          .sc-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* Mobile drawer overlay */}
      <div
        className={`sc-drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={() => setDrawerOpen(false)}
      />
      <div className={`sc-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="sc-drawer-close">
          <span>Filtres</span>
          <button onClick={() => setDrawerOpen(false)}>✕</button>
        </div>
        {FilterSidebar}
      </div>

      <div className="sc-wrap">
        {/* Breadcrumb */}
        <nav className="sc-breadcrumb">
          <a href="/">Accueil</a>
          <span className="sep">/</span>
          <span className="cur">{title}</span>
        </nav>

        <div className="sc-title-row">
          <h1 className="sc-h1">{title}</h1>
          <span className="sc-count">
            <strong>{total || filteredProducts.length}</strong> produit{total !== 1 ? 's' : ''}
            {totalPages > 1 && <> — page <strong>{currentPage}</strong> sur <strong>{totalPages}</strong></>}
          </span>
        </div>

        <div className="sc-layout">
          {/* Sidebar (desktop) */}
          {FilterSidebar}

          {/* Main content */}
          <div className="sc-content">
            {/* Sort bar */}
            <div className="sc-sort-bar">
              <div className="sc-sort-label">
                <strong>{filteredProducts.length}</strong> résultats
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button className="sc-filter-btn" onClick={() => setDrawerOpen(true)}>
                  ⚙ Filtres {hasActiveFilters && `(${[priceMin || priceMax ? 1 : 0, onlyInStock ? 1 : 0, onlyOnSale ? 1 : 0, minRating > 0 ? 1 : 0, selectedBrands.length > 0 ? 1 : 0].reduce((a, b) => a + b, 0)})`}
                </button>
                <select
                  className="sc-sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortKey)}
                >
                  <option value="date">Plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                  <option value="rating">Mieux notés</option>
                  <option value="name">A → Z</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="sc-empty">
                <div className="sc-empty-icon">🔍</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#111', marginBottom: 8 }}>Aucun produit trouvé</div>
                <div style={{ fontSize: 14 }}>Essayez de modifier vos filtres</div>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    style={{ marginTop: 16, background: '#FFB800', border: 0, borderRadius: 8, padding: '8px 20px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Effacer les filtres
                  </button>
                )}
              </div>
            ) : (
              <div className="sc-grid">
                {filteredProducts.map(p => <ProductCard key={p.id} p={p} />)}
              </div>
            )}

            {/* Pagination */}
            <Pagination currentPage={currentPage} totalPages={totalPages} baseUrl={baseUrl} />
          </div>
        </div>
      </div>
    </>
  );
}
