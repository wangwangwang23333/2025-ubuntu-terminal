/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/2025-ubuntu-terminal' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/resume/' : '',
}

export default nextConfig