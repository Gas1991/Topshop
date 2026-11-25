import { ImageResponse } from 'next/og';

// Image affichee quand une page sans photo propre est partagee.
export const alt = 'Topshop.tn — boutique en ligne en Tunisie';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFB800', color: '#111' }}>
        <div style={{ fontSize: 130, fontWeight: 700 }}>topshop.tn</div>
        <div style={{ fontSize: 44, marginTop: 16 }}>Livraison en Tunisie — Paiement à la livraison</div>
      </div>
    ),
    size,
  );
}
