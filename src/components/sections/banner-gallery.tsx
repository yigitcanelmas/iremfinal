"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const banners = [
  {
    id: 1,
    title: "Lüks Yaşam",
    subtitle: "Premium Villalar",
    description: "Özel havuzlu, deniz manzaralı villalarımızı keşfedin.",
    image: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    position: "center"
  },
  {
    id: 2,
    title: "Modern Yaşam",
    subtitle: "Akıllı Daireler",
    description: "Teknoloji ile donatılmış modern yaşam alanları.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    position: "right"
  },
  {
    id: 3,
    title: "İş Dünyası",
    subtitle: "Prestijli Ofisler",
    description: "İş hayatınızı bir üst seviyeye taşıyın.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2069&q=80",
    position: "left"
  }
];

export default function BannerGallery() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      nextBanner();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentBanner]);

  const nextBanner = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentBanner((prev) => (prev + 1) % banners.length);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  const prevBanner = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };

  return (
    <section className="relative h-[600px] overflow-hidden bg-gray-900">
      {/* Background Slides */}
      {banners.map((banner, index) => (
        <motion.div
          key={banner.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentBanner ? 1 : 0,
            scale: index === currentBanner ? 1 : 1.1
          }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <Image
            src={banner.image}
            alt={banner.title}
            fill
            sizes="100vw"
            className={`object-cover object-${banner.position}`}
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="container h-full flex items-center">
          <motion.div
            key={banners[currentBanner].id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl text-white"
          >
            <span className="inline-block text-primary-400 text-lg font-medium mb-4">
              {banners[currentBanner].subtitle}
            </span>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              {banners[currentBanner].title}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {banners[currentBanner].description}
            </p>
            <button className="btn btn-primary hover-lift hover-glow">
              Daha Fazla Bilgi
            </button>
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-8 right-8 z-20 flex space-x-4">
        <button
          onClick={prevBanner}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
          disabled={isAnimating}
        >
          <svg className="w-6 h-6 text-white transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextBanner}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 group"
          disabled={isAnimating}
        >
          <svg className="w-6 h-6 text-white transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-8 left-8 z-20 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-16 h-1 rounded-full transition-all duration-500 ${
              index === currentBanner
                ? "bg-primary-500 w-24"
                : "bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/50 to-transparent"></div>
    </section>
  );
}
