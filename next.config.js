/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Dynamic routes için server-side rendering'i etkinleştir
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // API routes ve dynamic pages için static generation'ı devre dışı bırak
  generateBuildId: async () => {
    return 'build-' + Date.now()
  }
}

module.exports = nextConfig
