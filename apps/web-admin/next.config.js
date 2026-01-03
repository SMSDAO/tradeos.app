/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@tradeos/shared'],
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
