import type { NextConfig } from 'next';

// Static export for GitHub Pages: the site lives at https://<user>.github.io/taskflow/
const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/taskflow',
  trailingSlash: true,
  images: { unoptimized: true },
  eslint: { ignoreDuringBuilds: true }, // we run `npm run lint` separately
};

export default nextConfig;
