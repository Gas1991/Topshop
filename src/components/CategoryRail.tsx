'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { WCCategory } from '@/lib/woocommerce';

const GRADIENTS: Record<string, [string, string]> = {
  // old slugs
  smartphones:    ['#E9F0FF', '#C8DAFF'],
  laptops:        ['#FFF1E0', '#FFD9B0'],
  audio:          ['#F2E8FF', '#D9C2FF'],
  gaming:         ['#E6F8EC', '#BDEACB'],
  tv:             ['#FFE9EC', '#FFC3CC'],
  electromenager: ['#E2F4FB', '#B7E1F0'],
  tablettes:      ['#FFF6D9', '#FFE89A'],
  montres:        ['#EEEAE3', '#D9CFBE'],
  cameras:        ['#E8F0F5', '#BFD2DD'],
  accessoires:    ['#FBE9F4', '#F2C2DF'],
  // real WC slugs
  smartwatch:                 ['#EEEAE3', '#D9CFBE'],
  'headsets-earphones':       ['#F2E8FF', '#D9C2FF'],
  headphones:                 ['#F2E8FF', '#C8AAFF'],
  'mixers-blenders':          ['#E2F4FB', '#B7E1F0'],
  'phone-tablet':             ['#E9F0FF', '#C8DAFF'],
  fans:                       ['#E6F8EC', '#BDEACB'],
  fryers:                     ['#FFF1E0', '#FFD9B0'],
  'kitchen-tools':            ['#FFF6D9', '#FFE89A'],
  'car-maintenance':          ['#E6EFF5', '#BBCFDD'],
  bathroom:                   ['#E2F4FB', '#B7E1F0'],
  'school-supplies':          ['#FFF1D9', '#FFD9A0'],
  'health-beauty':            ['#FBE9F4', '#F2C2DF'],
  'home-appliance':           ['#E8F0F5', '#BFD2DD'],
  cooking:                    ['#FFF1E0', '#FFCBA0'],
  'makeup-brushes-accessories': ['#FBE9F4', '#EEBBD9'],
  'mens-fashion':             ['#EEEAE3', '#C5BBA8'],
  'outdoor-lamps':            ['#FFFBD9', '#FFEF99'],
  'interior-accessories':     ['#F2EDFF', '#CFBEFF'],
  'clippers-electric-shavers':['#E8F0F5', '#AACFE0'],
  'phone-accessories':        ['#E9F0FF', '#B8D0FF'],
  'automotive-electronics':   ['#E6EFF5', '#AABFD0'],
  'outdoor-light':            ['#FFFBD9', '#FFEF99'],
};

const ICONS: Record<string, string> = {
  smartwatch: '⌚',
  'headsets-earphones': '🎧',
  headphones: '🎧',
  'mixers-blenders': '🥤',
  'phone-tablet': '📱',
  fans: '🌀',
  fryers: '🍳',
  'kitchen-tools': '🔪',
  'car-maintenance': '🔧',
  bathroom: '🛁',
  'school-supplies': '📚',
  'health-beauty': '💆',
  'home-appliance': '🏠',
  cooking: '👨‍🍳',
  'makeup-brushes-accessories': '💄',
  'mens-fashion': '👔',
  'outdoor-lamps': '💡',
  'interior-accessories': '🛋️',
  'clippers-electric-shavers': '✂️',
  'phone-accessories': '🔌',
  'automotive-electronics': '🚗',
  'outdoor-light': '🌟',
};

const CAT_LABELS: Record<string, string> = {
  smartwatch: 'Smartwatch',
  'headsets-earphones': 'Casques & Écouteurs',
  headphones: 'Casques Audio',
  'mixers-blenders': 'Mixeurs & Blenders',
  'phone-tablet': 'Téléphones & Tablettes',
  fans: 'Ventilateurs',
  fryers: 'Friteuses',
  'kitchen-tools': 'Ustensiles cuisine',
  'car-maintenance': 'Auto',
  bathroom: 'Salle de bain',
  'school-supplies': 'Fournitures scolaires',
  'health-beauty': 'Santé & Beauté',
  'home-appliance': 'Électroménager',
  cooking: 'Cuisine',
  'makeup-brushes-accessories': 'Maquillage',
  'mens-fashion': 'Mode homme',
  'outdoor-lamps': 'Lampes extérieur',
  'interior-accessories': 'Décoration',
  'clippers-electric-shavers': 'Tondeuses & Rasoirs',
  'phone-accessories': 'Accessoires téléphone',
  'automotive-electronics': 'Électronique auto',
  'outdoor-light': 'Éclairage extérieur',
};

function CategoryTile({ c }: { c: WCCategory }) {
  const [g1, g2] = GRADIENTS[c.slug] ?? ['#F1F5F9', '#E2E8F0'];
  const icon = ICONS[c.slug];
  const label = CAT_LABELS[c.slug] || c.name;
  return (
    <a data-tile href={`/shop?cat=${c.slug}`}
      className="snap-start shrink-0 w-[140px] sm:w-[156px] group/tile" style={{ textDecoration: 'none' }}>
      <div className="relative w-full aspect-square overflow-hidden rounded-[28px] border-2 border-transparent group-hover/tile:border-[#FFB800] transition-[border-color,transform] duration-200 group-hover/tile:-translate-y-0.5"
        style={{ background: `linear-gradient(160deg, ${g1} 0%, ${g2} 100%)` }}>
        <div className="absolute inset-0 rounded-[28px] ring-1 ring-black/[0.04] pointer-events-none" />
        {c.image?.src
          ? <img src={c.image.src} alt={label} loading="lazy"
              className="absolute inset-0 w-full h-full object-contain p-4 sm:p-5 mix-blend-multiply"
              onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          : <div className="absolute inset-0 flex items-center justify-center text-5xl">
              {icon || label.slice(0, 1)}
            </div>
        }
      </div>
      <div className="mt-3 px-0.5">
        <div className="font-bold text-[15px] text-slate-900 leading-tight">{label}</div>
        <div className="text-[13px] text-slate-500 mt-1">{c.count} produit{c.count > 1 ? 's' : ''}</div>
      </div>
    </a>
  );
}

export default function CategoryRail({ categories, title = 'Catégories' }: {
  categories: WCCategory[];
  title?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    update();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-tile]');
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 156) * 3 + 24), behavior: 'smooth' });
  };

  return (
    <section className="w-full" aria-label={title}>
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-slate-900">{title}</h2>
        <a href="/shop" className="shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold tracking-wider uppercase text-slate-900 border border-slate-300 rounded-md px-3 py-1.5 hover:border-[#FFB800] transition-colors">
          Voir tout
        </a>
      </div>
      <div className="relative group/rail">
        <button aria-label="Précédent" onClick={() => scrollBy(-1)} disabled={!canLeft}
          className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all hover:bg-[#FFB800] hover:text-white ${canLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
        </button>
        <button aria-label="Suivant" onClick={() => scrollBy(1)} disabled={!canRight}
          className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all hover:bg-[#FFB800] hover:text-white ${canRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
        </button>
        <div ref={scrollerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((c) => <CategoryTile key={c.slug} c={c} />)}
        </div>
      </div>
    </section>
  );
}
