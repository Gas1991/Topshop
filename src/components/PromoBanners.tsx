import React from 'react';
// PromoBanners.tsx — horizontal promo banners strip
// Note: served via Babel-standalone in the browser. TypeScript-flavored JSX;
// type annotations are stripped at runtime.

type Banner = {
  title: string;
  image: string;       // URL or data: URI
  code: string;        // promo code, e.g. "SAMSUNG15"
  bg: string;          // any CSS background value (gradient, solid, image)
  eyebrow?: string;    // small label above title, e.g. "Smartphones"
  discount?: string;   // big number, e.g. "15%"
  cta?: string;        // optional button label, defaults to "Shop now"
  link?: string;       // product URL
};

type PromoBannersProps = {
  banners: Banner[];
  heading?: string;
};

function CopyableCode({ code, accent }: { code: string; accent: string }) {
  const [copied, setCopied] = React.useState(false);

  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      navigator.clipboard.writeText(code);
    } catch (_) {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <button
      onClick={onClick}
      className="group/code relative flex w-full items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 text-left shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] backdrop-blur transition active:scale-[0.98]"
      style={{ color: accent }}
      aria-label={`Copy promo code ${code}`}
    >
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
          Use code
        </span>
        <span className="font-mono text-base font-extrabold tracking-wider">
          {code}
        </span>
      </span>
      <span className="flex items-center gap-1.5 text-xs font-semibold">
        {copied ? (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied
          </>
        ) : (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            Copy
          </>
        )}
      </span>
    </button>
  );
}

function BannerCard({ banner, index }: { banner: Banner; index: number }) {
  const { title, image, code, bg, eyebrow, discount, cta, link } = banner;

  // Accent color for the copied-code button text, derived per index.
  const accents = ["#0f172a", "#0b3b8c", "#5b21b6"];
  const accent = accents[index % accents.length];

  return (
    <a
      href={link || '#'}
      className="group relative block overflow-hidden rounded-2xl ring-1 ring-black/5 transition-all duration-500 ease-out will-change-transform hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      style={{ background: bg }}
    >
      {/* Soft glow blob */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
        style={{ background: "radial-gradient(circle, rgba(255,255,255,0.6), rgba(255,255,255,0))" }}
        aria-hidden="true"
      />
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col p-5 sm:p-6">
        {/* Top row: eyebrow + discount */}
        <div className="flex items-start justify-between gap-3">
          {eyebrow && (
            <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/95 ring-1 ring-inset ring-white/20 backdrop-blur">
              {eyebrow}
            </span>
          )}
          {discount && (
            <span className="font-display text-2xl font-black leading-none tracking-tight text-white drop-shadow-sm sm:text-3xl">
              {discount}
              <span className="ml-0.5 align-top text-xs font-bold tracking-normal opacity-80">OFF</span>
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mt-3 max-w-[14ch] text-balance font-display text-2xl font-bold leading-[1.05] tracking-tight text-white sm:text-[28px]">
          {title}
        </h3>

        {/* Product image */}
        <div className="relative mt-4 flex h-44 items-center justify-center sm:h-52">
          {/* Floor shadow */}
          <div
            className="absolute bottom-0 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-full bg-black/30 blur-xl transition-all duration-500 group-hover:w-3/5 group-hover:opacity-80"
            aria-hidden="true"
          />
          {image ? (
            <div className="relative z-10 flex h-[85%] w-[85%] items-center justify-center rounded-2xl bg-white/95 p-4 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]">
              <img
                src={image}
                alt={title}
                className="max-h-full max-w-full object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>
          ) : (
            <span className="relative z-10 text-6xl opacity-80">📦</span>
          )}
        </div>

        {/* CTA + code */}
        <div className="mt-5 flex flex-col gap-2.5">
          <CopyableCode code={code} accent={accent} />
          <div className="flex items-center justify-between px-1 text-white/90">
            <span className="text-xs font-medium">{cta ?? "Shop now"}</span>
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 ring-1 ring-inset ring-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

function PromoBanners({ banners, heading }: PromoBannersProps) {
  return (
    <section className="w-full">
      {heading && (
        <div className="mb-5 flex items-end justify-between px-1">
          <h2 className="font-display text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            {heading}
          </h2>
          <a href="#" className="text-sm font-semibold text-neutral-500 hover:text-neutral-900">
            View all →
          </a>
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
        {banners.map((b, i) => (
          <BannerCard key={b.code} banner={b} index={i} />
        ))}
      </div>
    </section>
  );
}


export default PromoBanners;
export { BannerCard };
