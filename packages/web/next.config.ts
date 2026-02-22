import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['loot-core'],
  turbopack: {
    root: path.resolve(import.meta.dirname, '../../'),
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb',
    },
  },
  output: 'standalone',
  // Required for SharedArrayBuffer (absurd-sql / loot-core Web Worker)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

export default nextConfig;
