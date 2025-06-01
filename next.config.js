/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['image.tmdb.org'],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  experimental: {
    esmExternals: 'loose'
  }
}

module.exports = nextConfig