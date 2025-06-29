/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com']
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
    serverExternalPackages: ['mongoose', 'cloudinary']
  },
  // Environment variables'ları build sırasında kullanılabilir yap
  env: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    MONGODB_URI: process.env.MONGODB_URI
  }
}

module.exports = nextConfig
