import type { Metadata } from "next";
import HeroSection from "@/components/sections/hero-section";
import LayoutContent from "@/components/layout/LayoutContent";
import PerformanceComparison from "@/components/sections/performance-comparison";
import LayeredTextHero from "@/components/sections/layered-text-hero";
import FeaturedCategories from "@/components/sections/featured-categories";
import FeaturedProperties from "@/components/sections/featured-properties";
import PartnersSlider from "@/components/sections/partners-slider";
import BannerGallery from "@/components/sections/banner-gallery";
import AdvancedSearchBar from "@/components/ui/AdvancedSearchBar";

export const metadata: Metadata = {
  title: "İrem World | Türkiye'nin En Prestijli Emlak Pazarlama Platformu",
  description: "IREMWORLD REAL ESTATE MARKETING - Kiralık ve satılık arsa, ev, ofis, daire, villa, iş yeri arayanlar için Türkiye'nin en güvenilir emlak platformu. INTERNATIONAL REAL ESTATE MARKETING ile hayalinizdeki mülkü bulun.",
  keywords: "emlak, gayrimenkul, kiralık daire, satılık ev, arsa, villa, ofis, iş yeri, IREMWORLD, emlak pazarlama, gayrimenkul yatırımı, İstanbul emlak, Ankara emlak, İzmir emlak",
  openGraph: {
    title: "İrem World | Türkiye'nin En Prestijli Emlak Pazarlama Platformu",
    description: "IREMWORLD REAL ESTATE MARKETING - Kiralık ve satılık arsa, ev, ofis, daire, villa, iş yeri arayanlar için Türkiye'nin en güvenilir emlak platformu.",
    url: "https://iremworld.com",
    type: "website",
  },
};

export default function Home() {
  return (
    <LayoutContent>
      {/* Hero Section */}
      <HeroSection />

      {/* Advanced Search Section */}
      <section className="relative -mt-32 z-10 container mx-auto px-4">
        <AdvancedSearchBar />
      </section>

      {/* Spacer for content below search */}
      <div className="h-16"></div>

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Layered Text Hero */}
      <section className="w-full overflow-hidden">
        <LayeredTextHero />
      </section>

      {/* Featured Properties */}
      <FeaturedProperties />

      {/* Performance Comparison */}
      <PerformanceComparison />

      {/* Partners Slider */}
      <PartnersSlider />

      {/* Banner Gallery */}
      <BannerGallery />

      {/* Newsletter Section */}
      <section className="section bg-primary-500">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fırsatları Kaçırmayın!
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              En yeni emlak fırsatları ve güncel haberler için bültenimize kayıt olun.
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="E-posta adresiniz"
                  className="flex-1 px-6 py-4 rounded-full text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="submit"
                  className="btn bg-white text-primary-500 hover:bg-white/90 px-8 py-4 rounded-full font-medium transition-all duration-300 hover-lift"
                >
                  Kayıt Ol
                </button>
              </div>
            </form>
            <p className="mt-4 text-sm text-white/80">
              Gizlilik politikamızı okuyun. İstediğiniz zaman abonelikten çıkabilirsiniz.
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Trust Badges Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {/* Quality Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Güvenilir</h3>
              <p className="text-gray-600 text-sm">
                25 yıllık sektör deneyimi
              </p>
            </div>

            {/* Support Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">7/24 Destek</h3>
              <p className="text-gray-600 text-sm">
                Her zaman yanınızdayız
              </p>
            </div>

            {/* Security Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Güvenli İşlem</h3>
              <p className="text-gray-600 text-sm">
                %100 yasal güvence
              </p>
            </div>

            {/* Experience Badge */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-primary-500">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Uzman Ekip</h3>
              <p className="text-gray-600 text-sm">
                Profesyonel danışmanlık
              </p>
            </div>
          </div>
        </div>
      </section>
    </LayoutContent>
  );
}
