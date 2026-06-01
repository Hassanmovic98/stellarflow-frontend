import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzerConfig = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// 1. Initialize the Bundle Analyzer plugin
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// 2. Initialize the PWA plugin with its production-ready caching rules
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /\/(relayers|logs|contracts)(\/.*)?$/,
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "page-shells",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "offlineCache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
        networkTimeoutSeconds: 10,
      },
    },
  ],
});

// 3. Your optimized Next.js base configurations
const nextConfig: NextConfig = {
  reactCompiler: false,
  swcMinify: true,
  compress: true,
  productionBrowserSourceMaps: false,
  optimizeFonts: true,
  optimizePackageImports: [
    "lucide-react",
    "react-icons",
  ],
};

export default withBundleAnalyzerConfig(nextConfig);
  turbopack: {},
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

// 4. Chain both plugins together sequentially to export the final configuration
export default withPWA(withBundleAnalyzer(nextConfig));
