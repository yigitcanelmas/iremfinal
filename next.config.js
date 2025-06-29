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
  // Tüm sayfaları dinamik yap - static generation'ı tamamen devre dışı bırak
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // Tüm sayfalar için dynamic rendering zorla
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Static generation'ı tamamen devre dışı bırak
  generateStaticParams: false,
  // ISR'ı devre dışı bırak
  revalidate: false
}

module.exports = nextConfig
