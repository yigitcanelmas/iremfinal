"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const SLIDES = [
  {
    id: 1,
    type: "villa",
    title: "Lüks Villa Yaşamı",
    subtitle: "Özel Bahçeli Villalar",
    description: "Deniz manzaralı, özel havuzlu villalarımızda hayalinizdeki yaşamı keşfedin. Modern mimarisi ve geniş yaşam alanları ile.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "150+", label: "Villa Seçeneği" },
    features: ["Özel Havuz", "Deniz Manzarası", "Geniş Bahçe", "Kapalı Garaj"],
    priceRange: "5M - 25M ₺",
    cta: "Villa Koleksiyonu",
    href: "/for-sale?type=villa",
    gradient: "from-blue-900/40 via-blue-800/30 to-transparent",
    accentColor: "text-blue-300"
  },
  {
    id: 2,
    type: "apartment",
    title: "Modern Daire Yaşamı",
    subtitle: "Şehir Merkezinde Konfor",
    description: "Şehrin kalbinde, modern mimarisi ve akıllı ev teknolojileri ile donatılmış dairelerimizde yaşayın.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "300+", label: "Daire Seçeneği" },
    features: ["Akıllı Ev", "Güvenlik", "Asansör", "Otopark"],
    priceRange: "1.5M - 8M ₺",
    cta: "Daire Koleksiyonu",
    href: "/for-sale?type=daire",
    gradient: "from-emerald-900/40 via-emerald-800/30 to-transparent",
    accentColor: "text-emerald-300"
  },
  {
    id: 3,
    type: "office",
    title: "Prestijli Ofis Alanları",
    subtitle: "İş Dünyasının Merkezi",
    description: "İş hayatınızı bir üst seviyeye taşıyacak, modern teknoloji ile donatılmış prestijli ofis alanları.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    stats: { value: "80+", label: "Ofis Seçeneği" },
    features: ["Metro Yakını", "Toplantı Salonu", "Vale Hizmeti", "Güvenlik"],
    priceRange: "3M - 15M ₺",
    cta: "Ofis Koleksiyonu",
    href: "/for-sale?type=ofis",
    gradient: "from-orange-900/40 via-red-800/30 to-transparent",
    accentColor: "text-orange-300"
  },
  {
    id: 4,
    type: "land",
    title: "Yatırım Arsaları",
    subtitle: "Geleceğe Yatırım",
    description: "Stratejik konumlarda, değer kazanma potansiyeli yüksek arsa ve arazilerimizle geleceğe yatırım yapın.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    stats: { value: "120+", label: "Arsa Seçeneği" },
    features: ["İmar İzni", "Ulaşım", "Altyapı", "Yatırım Değeri"],
    priceRange: "500K - 10M ₺",
    cta: "Arsa Koleksiyonu",
    href: "/for-sale?type=arsa",
    gradient: "from-purple-900/40 via-pink-800/30 to-transparent",
    accentColor: "text-purple-300"
  }
] as const;

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    // Preload all images
    const preloadImages = async () => {
      const imagePromises = SLIDES.map((slide) => {
        return new Promise<void>((resolve, reject) => {
          const img = new window.Image();
          img.src = slide.image;
          img.onload = () => resolve();
          img.onerror = () => reject();
        });
      });

      try {
        await Promise.all(imagePromises);
        setIsVisible(true);
      } catch (error) {
        console.error('Error preloading images:', error);
        setIsVisible(true); // Show content even if some images fail to load
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlideData = SLIDES[currentSlide];

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gray-900">
      {/* Loading State */}
      {!isVisible && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white/80">Yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Parallax Background */}
      <motion.div
        style={{ 
          y: useTransform(scrollYProgress, [0, 1], ["0%", "25%"]),
          scale: useTransform(scrollYProgress, [0, 1], [1, 1.1]),
          opacity 
        }}
        className="absolute inset-0 z-0"
      >
        {SLIDES.map((slide, index) => (
          <motion.div
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentSlide ? 1 : 0,
              scale: index === currentSlide ? 1 : 1.15
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority={index === 0}
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full backdrop-blur-md"
        />
        <motion.div 
          animate={{ 
            y: [0, 15, 0],
            x: [0, 10, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-40 left-20 w-24 h-24 bg-primary-500/20 rounded-full backdrop-blur-md"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-1/2 right-1/3 w-16 h-16 bg-white/20 rounded-full backdrop-blur-md"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              key={currentSlideData.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Property Type Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-6 py-3 bg-black/20 backdrop-blur-xl rounded-full border border-white/30"
              >
                <span className="text-white font-bold text-lg mr-2 drop-shadow-lg">
                  {currentSlideData.stats.value}
                </span>
                <span className="text-white/90 text-sm">
                  {currentSlideData.stats.label}
                </span>
              </motion.div>

              {/* Subtitle */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              className="text-white text-xl md:text-2xl font-medium drop-shadow-lg"
              >
                {currentSlideData.subtitle}
              </motion.h2>

              {/* Main Title */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                {currentSlideData.title}
              </motion.h1>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white/90 text-lg md:text-xl leading-relaxed max-w-xl"
              >
                {currentSlideData.description}
              </motion.p>

              {/* Features */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {currentSlideData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-black/20 backdrop-blur-xl rounded-full text-white/90 text-sm border border-white/30"
                  >
                    {feature}
                  </span>
                ))}
              </motion.div>

              {/* Price Range */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-white"
              >
                <span className="text-white/70 text-sm">Fiyat Aralığı:</span>
                <span className="text-2xl font-bold ml-2">{currentSlideData.priceRange}</span>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={currentSlideData.href}
                  className="btn btn-primary text-lg px-8 py-4 hover-lift hover-glow group"
                >
                  {currentSlideData.cta}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-4 hover-lift"
                >
                  Danışmanlık Al
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Property Showcase */}
            <motion.div
              key={`showcase-${currentSlideData.id}`}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Property Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-white text-xl font-semibold">Öne Çıkan</h3>
                      <span className="text-white text-sm font-medium drop-shadow-lg">
                        {currentSlideData.type.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="aspect-video rounded-2xl overflow-hidden">
                      <Image
                        src={currentSlideData.image}
                        alt={currentSlideData.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-white text-lg font-semibold">
                        Premium {currentSlideData.type === 'villa' ? 'Villa' : 
                                currentSlideData.type === 'apartment' ? 'Daire' :
                                currentSlideData.type === 'office' ? 'Ofis' : 'Arsa'}
                      </h4>
                      <div className="flex items-center justify-between text-white/80">
                        <span>Başlangıç Fiyatı</span>
                        <span className="font-bold">{currentSlideData.priceRange.split(' - ')[0]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Stats */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 bg-primary-500 text-white px-6 py-3 rounded-full font-bold shadow-lg"
                >
                  {currentSlideData.stats.value}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Left Navigation Control */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 group p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 z-10"
      >
        <svg className="w-8 h-8 text-white group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Navigation Control */}
      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 group p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 z-10"
      >
        <svg className="w-8 h-8 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              index === currentSlide
                ? "w-12 h-3 bg-primary-500"
                : "w-3 h-3 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 right-8 z-10 text-white"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 opacity-80">Keşfet</span>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div 
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-3 bg-white/70 rounded-full mt-2"
            />
          </div>
        </div>
      </motion.div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
