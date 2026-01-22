import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
      }
    ],
  },
  experimental: {
    optimizeCss: true,
  },
  turbopack: {},
  // Optimize CSS loading to reduce preload warnings
  webpack: (config, { dev }) => {
    if (!dev) {
      // Optimize CSS chunks in production
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.css$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
};

export default nextConfig;