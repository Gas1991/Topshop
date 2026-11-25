import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Les photos sont servies directement depuis leur source (CDN Shipper) :
    // le quota d'optimisation Vercel epuise renvoyait des erreurs 402.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'wc.toprix.tn' },
      { protocol: 'https', hostname: 'shop.toprix.tn' },
      { protocol: 'https', hostname: 'spacenet.tn' },
      { protocol: 'https', hostname: 'cdn.shipper.network' },
      { protocol: 'https', hostname: '*.wp.com' },
      { protocol: 'https', hostname: '*.woocommerce.com' },
    ],
  },
};

export default nextConfig;
