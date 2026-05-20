// SpotlightDeals.tsx
// React + TypeScript + Tailwind component for a "Meilleures Offres" section
// with category tabs and a horizontally-scrollable, arrow-navigable product row.

import React, { useMemo, useRef, useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type WCImage = { src: string; alt?: string };
export type WCCategory = { id: number | string; name: string; slug: string };

export type WCProduct = {
  id: number | string;
  name: string;
  images: WCImage[];
  meta_data?: { key: string; value: string }[];
  price: string;            // e.g. "999"
  regular_price: string;    // e.g. "1199"
  categories: WCCategory[];
  rating?: number;          // 0-5
  rating_count?: number;
};

export type SpotlightDealsProps = {
  products: WCProduct[];
  title?: string;
  currency?: string;        // default "€"
  /** Ordered list of category slugs to show as tabs. Names auto-derived from products. */
  tabs?: { slug: string; label: string }[];
};

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const DEFAULT_TABS = [
  { slug: "smartphones", label: "Smartphones" },
  { slug: "laptops",     label: "Laptops"     },
  { slug: "audio",       label: "Audio"       },
  { slug: "gaming",      label: "Gaming"      },
  { slug: "tv",          label: "TV"          },
];

function formatPrice(raw: string, currency = "TND") {
  const n = Number(raw);
  if (Number.isNaN(n)) return raw;
  return `${currency}${n.toLocaleString("fr-FR")}`;
}

function discount(price: string, regular: string) {
  const p = Number(price), r = Number(regular);
  if (!r || r <= p) return 0;
  return Math.round(((r - p) / r) * 100);
}

/* -------------------------------------------------------------------------- */
/*  Stars                                                                     */
/* -------------------------------------------------------------------------- */

const Star: React.FC<{ fill: number }> = ({ fill }) => {
  // fill: 0..1
  const id = `g-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" x2="1" y1="0" y2="0">
          <stop offset={`${fill * 100}%`} stopColor="#FFB800" />
          <stop offset={`${fill * 100}%`} stopColor="#E5E7EB" />
        </linearGradient>
      </defs>
      <path
        d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.77 4.8 17.52l.99-5.8L1.58 7.62l5.82-.85L10 1.5z"
        fill={`url(#${id})`}
      />
    </svg>
  );
};

const Stars: React.FC<{ value: number; count?: number }> = ({ value, count }) => (
  <div className="flex items-center gap-1">
    <div className="flex items-center gap-[2px]">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} fill={Math.max(0, Math.min(1, value - i))} />
      ))}
    </div>
    <span className="text-[11px] font-medium text-neutral-500 tabular-nums">
      {value.toFixed(1)}
      {count != null && <span className="text-neutral-400"> ({count})</span>}
    </span>
  </div>
);

/* -------------------------------------------------------------------------- */
/*  Card                                                                      */
/* -------------------------------------------------------------------------- */

const ProductCard: React.FC<{ p: WCProduct; currency: string }> = ({ p, currency }) => {
  const off = discount(p.price, p.regular_price);
  const badge = p.categories[0]?.name ?? "Deal";
  const imgSrc = p.images[0]?.src || p.meta_data?.find(m => m.key === '_toprix_image_url')?.value || '';
  return (
    <article className="group relative w-[244px] shrink-0 snap-start">
      {/* Floating category badge */}
      <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur ring-1 ring-black/5 shadow-[0_2px_8px_rgba(20,20,40,0.08)] text-[11px] font-semibold tracking-wide uppercase text-neutral-700">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
          {badge}
        </span>
      </div>

      <div className="relative rounded-3xl bg-white/70 backdrop-blur-sm ring-1 ring-white/80 shadow-[0_10px_30px_-12px_rgba(20,30,60,0.18)] hover:shadow-[0_18px_40px_-12px_rgba(20,30,60,0.25)] hover:-translate-y-0.5 transition-all duration-300 p-4 pt-7">
        {/* Image - tall, no background */}
        <div className="relative h-[200px] flex items-center justify-center overflow-hidden">
          {off > 0 && (
            <span className="absolute top-1 right-1 px-2 py-0.5 rounded-full bg-[#111] text-white text-[10px] font-bold tracking-tight">
              -{off}%
            </span>
          )}
          {imgSrc ? (
            <img
              src={imgSrc}
              alt={p.name}
              loading="lazy"
              className="max-h-[190px] w-auto object-contain drop-shadow-[0_18px_18px_rgba(20,30,60,0.18)] group-hover:scale-[1.04] transition-transform duration-500 ease-out"
            />
          ) : (
            <div className="h-full w-full rounded-xl bg-neutral-100" />
          )}
        </div>

        {/* Name - 2 lines clamp */}
        <h3 className="mt-3 h-[40px] text-[14px] leading-[20px] font-semibold text-neutral-900 line-clamp-2">
          {p.name}
        </h3>

        {/* Prices */}
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-[18px] font-extrabold text-neutral-900 tracking-tight">
            {formatPrice(p.price, currency)}
          </span>
          {Number(p.regular_price) > Number(p.price) && (
            <span className="text-[12px] font-medium text-neutral-400 line-through tabular-nums">
              {formatPrice(p.regular_price, currency)}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="mt-2">
          <Stars value={p.rating ?? 4.5} count={p.rating_count} />
        </div>
      </div>
    </article>
  );
};

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */

const SpotlightDeals: React.FC<SpotlightDealsProps> = ({
  products,
  title = "Meilleures Offres",
  currency = "TND",
  tabs = DEFAULT_TABS,
}) => {
  const [active, setActive] = useState<string>(tabs[0]?.slug ?? "");
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [pill, setPill] = useState<{ x: number; w: number }>({ x: 0, w: 0 });

  // Filter — fall back to all products if nothing matches the active tab
  const filtered = useMemo(() => {
    const match = products.filter((p) =>
      p.categories.some((c) => c.slug === active)
    );
    return match.length > 0 ? match : products;
  }, [products, active]);

  // Tab pill position
  useEffect(() => {
    const el = tabRefs.current[active];
    if (el) {
      setPill({ x: el.offsetLeft, w: el.offsetWidth });
    }
  }, [active]);

  // Track scroll edges
  const updateEdges = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };
  useEffect(() => {
    updateEdges();
  }, [filtered]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Scroll roughly one card-width per click
    const card = el.querySelector<HTMLElement>("article");
    const step = (card?.offsetWidth ?? 240) + 16;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section
      className="relative rounded-[28px] overflow-hidden font-[Inter] px-6 sm:px-10 py-10 sm:py-12"
      style={{
        background:
          "radial-gradient(120% 100% at 0% 0%, #FFF8D6 0%, #F2FBDC 45%, #E6F6E3 100%)",
      }}
    >
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-16 w-[360px] h-[360px] rounded-full bg-[#FFEFAA] blur-3xl opacity-60" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 w-[320px] h-[320px] rounded-full bg-[#D6F2C2] blur-3xl opacity-70" />

      {/* Title */}
      <div className="relative text-center">
        <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-[#9A7B00]">
          Spotlight
        </p>
        <h2 className="mt-1 text-[34px] sm:text-[42px] leading-[1.05] font-black tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-2 text-[14px] text-neutral-600">
          Sélection du jour · livraison gratuite dès 99 TND
        </p>
      </div>

      {/* Tabs */}
      <div className="relative mt-7 flex justify-center">
        <div className="relative inline-flex items-center gap-1 p-1.5 rounded-full bg-white/70 backdrop-blur ring-1 ring-black/5 shadow-[0_4px_18px_-8px_rgba(20,30,60,0.18)]">
          {/* sliding pill */}
          <span
            className="absolute top-1.5 bottom-1.5 rounded-full bg-[#FFB800] shadow-[0_4px_14px_rgba(255,184,0,0.55)] transition-all duration-500 ease-[cubic-bezier(.6,.2,.1,1)]"
            style={{ transform: `translateX(${pill.x - 6}px)`, width: pill.w }}
          />
          {tabs.map((t) => {
            const isActive = t.slug === active;
            return (
              <button
                key={t.slug}
                ref={(el) => { tabRefs.current[t.slug] = el; }}
                onClick={() => setActive(t.slug)}
                className={
                  "relative z-[1] px-4 sm:px-5 h-9 rounded-full text-[13px] font-semibold tracking-tight transition-colors duration-300 " +
                  (isActive ? "text-neutral-900" : "text-neutral-500 hover:text-neutral-800")
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product row */}
      <div className="relative mt-9">
        {/* Arrows */}
        <button
          aria-label="Précédent"
          onClick={() => scrollBy(-1)}
          disabled={!canLeft}
          className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_-6px_rgba(20,30,60,0.25)] ring-1 ring-black/5 text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFB800] hover:text-white hover:ring-[#FFB800] transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          aria-label="Suivant"
          onClick={() => scrollBy(1)}
          disabled={!canRight}
          className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-11 h-11 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_-6px_rgba(20,30,60,0.25)] ring-1 ring-black/5 text-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFB800] hover:text-white hover:ring-[#FFB800] transition-all"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>

        {/* Crossfade wrapper keyed on tab */}
        <div key={active} className="animate-[fadeUp_.45s_ease-out_both]">
          <div
            ref={scrollerRef}
            onScroll={updateEdges}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pt-4 pb-4 -mx-2 px-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {filtered.length === 0 ? (
              <div className="w-full text-center py-10 text-neutral-500 text-sm">
                Aucun produit dans cette catégorie.
              </div>
            ) : (
              filtered.map((p) => <ProductCard key={p.id} p={p} currency={currency} />)
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default SpotlightDeals;
