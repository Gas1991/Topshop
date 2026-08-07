
// SVG product illustrations — bigger and more detailed than icons.
// Each returns an inline SVG (max 240×240 viewBox).

const ProductArt = {
  // Smartphone (iPhone-style)
  phone: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ph-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a2e"/><stop offset="1" stopColor="#0d0d10"/>
        </linearGradient>
        <linearGradient id="ph-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#243861"/><stop offset=".5" stopColor="#0a1633"/><stop offset="1" stopColor="#1a0b34"/>
        </linearGradient>
      </defs>
      <rect x="78" y="22" width="92" height="196" rx="20" fill="url(#ph-body)"/>
      <rect x="83" y="27" width="82" height="186" rx="16" fill="url(#ph-screen)"/>
      <rect x="108" y="33" width="32" height="10" rx="5" fill="#0a0a0a"/>
      <circle cx="134" cy="38" r="2" fill="#1a3a55"/>
      {/* Lock screen icons */}
      <rect x="93" y="58" width="62" height="3" rx="1.5" fill="#ffffff20"/>
      <rect x="110" y="68" width="28" height="3" rx="1.5" fill="#ffffff10"/>
      <text x="124" y="120" textAnchor="middle" fontSize="32" fontWeight="900" fill="#fff">9:41</text>
      <text x="124" y="138" textAnchor="middle" fontSize="9" fill="#ffffff80">Lundi 20 mai</text>
      <rect x="93" y="170" width="62" height="24" rx="8" fill="#ffffff15"/>
      <circle cx="105" cy="182" r="4" fill="#fff"/>
      <rect x="115" y="178" width="32" height="3" rx="1.5" fill="#fff"/>
      <rect x="115" y="184" width="22" height="3" rx="1.5" fill="#ffffff80"/>
      <rect x="116" y="206" width="16" height="3" rx="1.5" fill="#fff"/>
    </svg>
  ),

  // Laptop (MacBook-style)
  laptop: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lp-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0e2a4d"/><stop offset="1" stopColor="#421b6e"/>
        </linearGradient>
        <linearGradient id="lp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dadadd"/><stop offset="1" stopColor="#9a9aa0"/>
        </linearGradient>
      </defs>
      <rect x="34" y="56" width="172" height="110" rx="8" fill="#1c1c1f"/>
      <rect x="40" y="62" width="160" height="98" rx="3" fill="url(#lp-screen)"/>
      {/* Window mockup */}
      <rect x="48" y="70" width="50" height="82" rx="3" fill="#ffffff18"/>
      <circle cx="54" cy="76" r="1.5" fill="#ff5f57"/>
      <circle cx="60" cy="76" r="1.5" fill="#febc2e"/>
      <circle cx="66" cy="76" r="1.5" fill="#28c840"/>
      <rect x="51" y="84" width="44" height="2" rx="1" fill="#ffffff40"/>
      <rect x="51" y="90" width="32" height="2" rx="1" fill="#ffffff25"/>
      <rect x="51" y="96" width="40" height="2" rx="1" fill="#ffffff25"/>
      <rect x="106" y="70" width="86" height="44" rx="3" fill="#ffffff15"/>
      <rect x="110" y="78" width="34" height="3" rx="1.5" fill="#FFB800"/>
      <rect x="110" y="86" width="78" height="2" rx="1" fill="#ffffff40"/>
      <rect x="110" y="92" width="60" height="2" rx="1" fill="#ffffff30"/>
      <rect x="106" y="120" width="86" height="32" rx="3" fill="#ffffff15"/>
      <rect x="112" y="128" width="34" height="16" rx="2" fill="#FFB800"/>
      <rect x="152" y="132" width="36" height="2" rx="1" fill="#ffffff40"/>
      <rect x="152" y="138" width="26" height="2" rx="1" fill="#ffffff30"/>
      {/* Base */}
      <path d="M22 170 L218 170 L208 188 L32 188 Z" fill="url(#lp-body)"/>
      <rect x="100" y="170" width="40" height="4" rx="2" fill="#7a7a80"/>
    </svg>
  ),

  // Headphones (over-ear)
  headphones: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hp-cup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a40"/><stop offset="1" stopColor="#101012"/>
        </linearGradient>
      </defs>
      <path d="M50 130 C50 70, 190 70, 190 130" stroke="#1b1b1e" strokeWidth="14" fill="none" strokeLinecap="round"/>
      <path d="M55 130 C55 75, 185 75, 185 130" stroke="#3a3a40" strokeWidth="4" fill="none"/>
      <rect x="34" y="120" width="44" height="72" rx="20" fill="url(#hp-cup)"/>
      <rect x="162" y="120" width="44" height="72" rx="20" fill="url(#hp-cup)"/>
      <ellipse cx="56" cy="156" rx="14" ry="22" fill="#0a0a0c"/>
      <ellipse cx="184" cy="156" rx="14" ry="22" fill="#0a0a0c"/>
      <circle cx="56" cy="156" r="6" fill="#FFB800"/>
      <circle cx="184" cy="156" r="6" fill="#FFB800"/>
      <rect x="38" y="186" width="36" height="6" rx="3" fill="#1b1b1e"/>
      <rect x="166" y="186" width="36" height="6" rx="3" fill="#1b1b1e"/>
    </svg>
  ),

  // Earbuds / AirPods
  earbuds: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eb-case" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff"/><stop offset="1" stopColor="#d8d8de"/>
        </linearGradient>
      </defs>
      {/* Case */}
      <rect x="60" y="92" width="120" height="78" rx="32" fill="url(#eb-case)" stroke="#cccccf" strokeWidth="1"/>
      <rect x="70" y="100" width="100" height="40" rx="20" fill="#f4f4f6"/>
      <circle cx="120" cy="155" r="3" fill="#FFB800"/>
      {/* Bud 1 */}
      <g transform="translate(80, 56)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#cccccf"/>
        <path d="M-3 8 L-3 32 Q-3 38 3 38 Q9 38 9 32 L9 8" fill="#fff" stroke="#cccccf"/>
        <circle cx="0" cy="0" r="6" fill="#222"/>
      </g>
      {/* Bud 2 */}
      <g transform="translate(160, 56)">
        <circle cx="0" cy="0" r="14" fill="#fff" stroke="#cccccf"/>
        <path d="M-3 8 L-3 32 Q-3 38 3 38 Q9 38 9 32 L9 8" fill="#fff" stroke="#cccccf"/>
        <circle cx="0" cy="0" r="6" fill="#222"/>
      </g>
    </svg>
  ),

  // Smartwatch
  watch: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wt-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a1428"/><stop offset="1" stopColor="#1a0b34"/>
        </linearGradient>
      </defs>
      <path d="M82 0 L158 0 L150 60 L90 60 Z" fill="#1c1c1f" transform="translate(0,28)"/>
      <path d="M82 240 L158 240 L150 180 L90 180 Z" fill="#1c1c1f" transform="translate(0,-28)"/>
      <rect x="68" y="72" width="104" height="98" rx="22" fill="#1c1c1f"/>
      <rect x="74" y="78" width="92" height="86" rx="16" fill="url(#wt-screen)"/>
      <text x="120" y="118" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">10:42</text>
      <circle cx="120" cy="140" r="10" fill="none" stroke="#FFB800" strokeWidth="3"/>
      <circle cx="120" cy="140" r="10" fill="none" stroke="#2dd07d" strokeWidth="3" strokeDasharray="40 100" transform="rotate(-90 120 140)"/>
      <rect x="172" y="100" width="6" height="14" rx="2" fill="#3a3a40"/>
      <rect x="172" y="120" width="6" height="10" rx="2" fill="#3a3a40"/>
    </svg>
  ),

  // TV
  tv: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tv-screen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4d6d"/><stop offset=".5" stopColor="#7a3fb8"/><stop offset="1" stopColor="#1a4eb8"/>
        </linearGradient>
      </defs>
      <rect x="14" y="40" width="212" height="130" rx="6" fill="#1c1c1f"/>
      <rect x="20" y="46" width="200" height="118" rx="3" fill="url(#tv-screen)"/>
      <circle cx="80" cy="100" r="22" fill="#ffffff30"/>
      <polygon points="74,90 74,110 92,100" fill="#fff"/>
      <rect x="124" y="86" width="84" height="6" rx="3" fill="#ffffff40"/>
      <rect x="124" y="98" width="60" height="4" rx="2" fill="#ffffff25"/>
      <rect x="124" y="108" width="74" height="4" rx="2" fill="#ffffff25"/>
      <rect x="100" y="170" width="40" height="6" rx="2" fill="#1c1c1f"/>
      <rect x="74" y="176" width="92" height="6" rx="2" fill="#2a2a2e"/>
    </svg>
  ),

  // Gaming controller (PlayStation-ish)
  controller: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ct-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa"/><stop offset="1" stopColor="#c4c4c8"/>
        </linearGradient>
      </defs>
      <path d="M44 100 Q44 70 76 70 L164 70 Q196 70 196 100 L196 160 Q196 188 168 188 Q150 188 142 174 L98 174 Q90 188 72 188 Q44 188 44 160 Z" fill="url(#ct-body)" stroke="#a8a8ac"/>
      {/* Center pad */}
      <circle cx="120" cy="100" r="6" fill="#FFB800"/>
      <rect x="116" y="118" width="8" height="4" rx="2" fill="#888"/>
      {/* D-pad */}
      <g transform="translate(72,118)">
        <rect x="-3" y="-10" width="6" height="20" rx="1" fill="#2a2a2e"/>
        <rect x="-10" y="-3" width="20" height="6" rx="1" fill="#2a2a2e"/>
      </g>
      {/* Buttons */}
      <g transform="translate(168,118)">
        <circle cx="0" cy="-10" r="6" fill="#2a8ce6"/>
        <circle cx="0" cy="10" r="6" fill="#2a8ce6"/>
        <circle cx="-10" cy="0" r="6" fill="#e8348c"/>
        <circle cx="10" cy="0" r="6" fill="#e23a3a"/>
      </g>
      {/* Sticks */}
      <circle cx="92" cy="148" r="14" fill="#2a2a2e"/>
      <circle cx="92" cy="148" r="9" fill="#3a3a40"/>
      <circle cx="148" cy="148" r="14" fill="#2a2a2e"/>
      <circle cx="148" cy="148" r="9" fill="#3a3a40"/>
    </svg>
  ),

  // Tablet
  tablet: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="tb-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFB800"/><stop offset=".7" stopColor="#FF7A1A"/><stop offset="1" stopColor="#E2231A"/>
        </linearGradient>
      </defs>
      <rect x="44" y="24" width="152" height="192" rx="14" fill="#2a2a2e"/>
      <rect x="50" y="30" width="140" height="180" rx="8" fill="url(#tb-screen)"/>
      <rect x="62" y="46" width="68" height="14" rx="3" fill="#ffffff35"/>
      <rect x="62" y="68" width="116" height="60" rx="6" fill="#ffffff20"/>
      <rect x="62" y="136" width="54" height="54" rx="6" fill="#ffffff20"/>
      <rect x="124" y="136" width="54" height="54" rx="6" fill="#ffffff30"/>
    </svg>
  ),

  // Camera
  camera: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cm-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2e"/><stop offset="1" stopColor="#0e0e10"/>
        </linearGradient>
      </defs>
      <path d="M28 86 L88 86 L100 70 L168 70 L180 86 L212 86 Q220 86 220 94 L220 178 Q220 188 210 188 L30 188 Q20 188 20 178 L20 94 Q20 86 28 86 Z" fill="url(#cm-body)"/>
      <circle cx="120" cy="138" r="42" fill="#0a0a0a" stroke="#3a3a40" strokeWidth="3"/>
      <circle cx="120" cy="138" r="32" fill="#1a1a1c"/>
      <circle cx="120" cy="138" r="20" fill="#0a0a0a" stroke="#FFB800" strokeWidth="2"/>
      <circle cx="120" cy="138" r="10" fill="#2a4060"/>
      <circle cx="114" cy="132" r="3" fill="#ffffff60"/>
      <rect x="180" y="98" width="22" height="6" rx="2" fill="#FFB800"/>
      <rect x="40" y="98" width="14" height="6" rx="2" fill="#3a3a40"/>
    </svg>
  ),

  // Speaker
  speaker: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sp-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3a40"/><stop offset="1" stopColor="#101012"/>
        </linearGradient>
      </defs>
      <rect x="64" y="32" width="112" height="176" rx="56" fill="url(#sp-body)"/>
      <ellipse cx="120" cy="92" rx="36" ry="32" fill="#0a0a0a" stroke="#3a3a40" strokeWidth="2"/>
      <ellipse cx="120" cy="92" rx="20" ry="18" fill="#1a1a1c"/>
      <circle cx="120" cy="92" r="4" fill="#FFB800"/>
      <circle cx="120" cy="160" r="22" fill="#1a1a1c" stroke="#3a3a40"/>
      <rect x="106" y="190" width="28" height="6" rx="3" fill="#1a1a1c"/>
    </svg>
  ),

  // Washing machine (Maison)
  washer: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wm-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa"/><stop offset="1" stopColor="#d4d4d8"/>
        </linearGradient>
      </defs>
      <rect x="38" y="22" width="164" height="196" rx="8" fill="url(#wm-body)" stroke="#a8a8ac"/>
      <rect x="48" y="32" width="144" height="36" rx="4" fill="#fff"/>
      <rect x="56" y="40" width="60" height="6" rx="2" fill="#FFB800"/>
      <rect x="56" y="50" width="40" height="3" rx="1.5" fill="#a8a8ac"/>
      <circle cx="172" cy="50" r="8" fill="#1c1c1f"/>
      <circle cx="172" cy="50" r="2" fill="#FFB800"/>
      <circle cx="120" cy="138" r="58" fill="#1c1c1f"/>
      <circle cx="120" cy="138" r="48" fill="#0a0a0a"/>
      <circle cx="120" cy="138" r="42" fill="#3a3a40"/>
      <circle cx="120" cy="138" r="36" fill="#1a1a1c"/>
      <circle cx="120" cy="138" r="14" fill="#FFB800"/>
    </svg>
  ),

  // Refrigerator
  fridge: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="fr-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e8e8ec"/><stop offset="1" stopColor="#b8b8bc"/>
        </linearGradient>
      </defs>
      <rect x="60" y="20" width="120" height="200" rx="8" fill="url(#fr-body)" stroke="#9a9aa0"/>
      <line x1="60" y1="90" x2="180" y2="90" stroke="#9a9aa0" strokeWidth="2"/>
      <rect x="166" y="40" width="4" height="22" rx="2" fill="#1c1c1f"/>
      <rect x="166" y="120" width="4" height="40" rx="2" fill="#1c1c1f"/>
      <rect x="80" y="50" width="40" height="4" rx="2" fill="#FFB800"/>
      <rect x="80" y="60" width="28" height="3" rx="1.5" fill="#9a9aa0"/>
    </svg>
  ),

  // Sneakers (lifestyle)
  sneaker: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 160 Q40 130 70 122 Q88 116 102 100 Q120 80 144 80 Q170 80 180 110 L200 130 Q214 138 214 156 L214 178 Q214 188 204 188 L40 188 Q30 188 30 178 Z" fill="#fff" stroke="#2a2a2e" strokeWidth="2"/>
      <path d="M30 170 L214 170 L214 178 Q214 188 204 188 L40 188 Q30 188 30 178 Z" fill="#FFB800"/>
      <path d="M70 122 Q100 130 110 158" stroke="#2a2a2e" strokeWidth="3" fill="none"/>
      <path d="M100 105 Q130 115 140 158" stroke="#2a2a2e" strokeWidth="3" fill="none"/>
      <path d="M130 88 Q155 105 170 158" stroke="#2a2a2e" strokeWidth="3" fill="none"/>
      <circle cx="86" cy="148" r="2" fill="#2a2a2e"/>
      <circle cx="120" cy="148" r="2" fill="#2a2a2e"/>
      <circle cx="154" cy="148" r="2" fill="#2a2a2e"/>
    </svg>
  ),

  // Power bank
  powerbank: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2a2e"/><stop offset="1" stopColor="#0e0e10"/>
        </linearGradient>
      </defs>
      <rect x="34" y="80" width="172" height="80" rx="12" fill="url(#pb-body)"/>
      <rect x="44" y="100" width="80" height="42" rx="4" fill="#0a0a0a"/>
      <rect x="50" y="110" width="68" height="6" rx="3" fill="#2dd07d"/>
      <rect x="50" y="120" width="44" height="4" rx="2" fill="#3a3a40"/>
      <rect x="50" y="130" width="58" height="4" rx="2" fill="#3a3a40"/>
      <rect x="138" y="110" width="22" height="22" rx="3" fill="#3a3a40"/>
      <rect x="143" y="115" width="12" height="12" rx="1" fill="#1a1a1c"/>
      <rect x="170" y="114" width="22" height="14" rx="2" fill="#3a3a40"/>
      <circle cx="180" cy="142" r="4" fill="#FFB800"/>
    </svg>
  ),

  // Drone
  drone: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <g fill="#2a2a2e">
        <circle cx="50" cy="70" r="22" fill="#1c1c1f"/>
        <circle cx="50" cy="70" r="20" fill="none" stroke="#3a3a40"/>
        <circle cx="190" cy="70" r="22" fill="#1c1c1f"/>
        <circle cx="190" cy="70" r="20" fill="none" stroke="#3a3a40"/>
        <circle cx="50" cy="170" r="22" fill="#1c1c1f"/>
        <circle cx="50" cy="170" r="20" fill="none" stroke="#3a3a40"/>
        <circle cx="190" cy="170" r="22" fill="#1c1c1f"/>
        <circle cx="190" cy="170" r="20" fill="none" stroke="#3a3a40"/>
        <line x1="60" y1="80" x2="100" y2="110" stroke="#2a2a2e" strokeWidth="8"/>
        <line x1="180" y1="80" x2="140" y2="110" stroke="#2a2a2e" strokeWidth="8"/>
        <line x1="60" y1="160" x2="100" y2="130" stroke="#2a2a2e" strokeWidth="8"/>
        <line x1="180" y1="160" x2="140" y2="130" stroke="#2a2a2e" strokeWidth="8"/>
      </g>
      <rect x="92" y="100" width="56" height="40" rx="8" fill="#1c1c1f"/>
      <rect x="100" y="110" width="40" height="22" rx="3" fill="#FFB800"/>
      <circle cx="120" cy="121" r="6" fill="#0a0a0a"/>
      <circle cx="120" cy="121" r="3" fill="#2a4060"/>
    </svg>
  ),

  // Kettle
  kettle: (
    <svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="kt-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fafafa"/><stop offset="1" stopColor="#c4c4c8"/>
        </linearGradient>
      </defs>
      <path d="M70 80 L160 80 Q170 80 170 90 L170 180 Q170 200 150 200 L80 200 Q60 200 60 180 L60 90 Q60 80 70 80 Z" fill="url(#kt-body)" stroke="#9a9aa0"/>
      <rect x="80" y="64" width="70" height="16" rx="6" fill="#1c1c1f"/>
      <path d="M170 110 Q210 110 210 150 L210 170 Q210 180 200 180 L188 180" stroke="#1c1c1f" strokeWidth="6" fill="none"/>
      <rect x="84" y="100" width="60" height="40" rx="4" fill="#1c1c1f" opacity=".15"/>
      <rect x="84" y="108" width="60" height="6" rx="3" fill="#FFB800"/>
      <ellipse cx="115" cy="210" rx="60" ry="6" fill="#1c1c1f"/>
    </svg>
  ),
};

export default ProductArt;
