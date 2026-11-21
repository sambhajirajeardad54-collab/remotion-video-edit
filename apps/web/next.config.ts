import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Shared workspace packages ship TypeScript source; let Next compile them.
  transpilePackages: ['@edu/core', '@edu/design'],
  poweredByHeader: false,
  reactStrictMode: true,
};

export default nextConfig;
