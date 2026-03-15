/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.4"]
    }
  },
  serverExternalPackages: ['@prisma/client']
}

module.exports = nextConfig
