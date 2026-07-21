import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'wc.toprix.tn' },
      { protocol: 'https', hostname: 'shop.toprix.tn' },
      { protocol: 'https', hostname: '*.wp.com' },
      { protocol: 'https', hostname: '*.woocommerce.com' },
    ],
  },
};

export default nextConfig;
