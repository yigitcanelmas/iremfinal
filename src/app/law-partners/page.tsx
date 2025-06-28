"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Adalet Hukuk Bürosu",
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    description: "Gayrimenkul hukuku alanında 25 yıllık deneyim. Tapu işlemleri, sözleşme hazırlama, uyuşmazlık çözümü ve hukuki danışmanlık hizmetleri.",
    services: ["Gayrimenkul Hukuku", "Tapu İşlemleri", "Sözleşme Hukuku", "Uyuşmazlık Çözümü"],
    website: "https://adalethukuk.com"
  },
  {
    name: "Barış Avukatlık",
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    description: "İnşaat ve gayrimenkul sektöründe uzmanlaşmış hukuk bürosu. Müteahhitlik sözleşmeleri, ruhsat işlemleri ve yatırım danışmanlığı.",
    services: ["İnşaat Hukuku", "Müteahhitlik", "Ruhsat İşlemleri", "Yatırım Hukuku"],
    website: "https://barisavukatlik.com"
  },
  {
    name: "Hukuk & Danışmanlık",
    logo: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    description: "Kurumsal hukuk ve gayrimenkul yatırımları konusunda uzman avukat kadrosu ile kapsamlı hukuki destek ve danışmanlık hizmetleri.",
    services: ["Kurumsal Hukuk", "Yatırım Danışmanlığı", "Vergi Hukuku", "Uluslararası Hukuk"],
    website: "https://hukukdanismanlik.com"
  }
];

const advantages = [
  {
    title: "Uzman Kadro",
    description: "Gayrimenkul hukuku alanında deneyimli avukat kadrosu.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  {
    title: "Hızlı Çözüm",
    description: "Hukuki süreçlerde hızlı ve etkili çözüm odaklı yaklaşım.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Güvenilir Hizmet",
    description: "Şeffaf ve güvenilir hukuki danışmanlık hizmetleri.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Kapsamlı Destek",
    description: "A'dan Z'ye tüm hukuki süreçlerde profesyonel destek.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  }
];

export default function LawPartnersPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Hukuk Bürosu Partnerlerimiz"
        subtitle="İŞ ORTAKLARIMIZ"
        description="Gayrimenkul hukuku alanında uzman hukuk büroları ile güçlü iş birliği"
        imagePath="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        gradient="from-primary-900/80 via-primary-800/50 to-transparent"
      />

      {/* Partners Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <PartnerCard
                key={partner.name}
                name={partner.name}
                logo={partner.logo}
                description={partner.description}
                services={partner.services}
                website={partner.website}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with Particle Effect */}
      <section id="contact-section" className="relative py-24 bg-gradient-to-br from-primary-900/90 to-primary-800/90 overflow-hidden">
        {/* Particle Effect */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative container">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Hukuk Bürosu İş Ortaklığının Avantajları
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-primary-100 max-w-3xl mx-auto"
            >
              IREMWORLD hukuk bürosu iş ortaklığı ile kazanacağınız rekabet avantajları
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/20 to-primary-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mb-6 text-primary-200 group-hover:scale-110 transition-transform">
                    {advantage.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">
                    {advantage.title}
                  </h3>
                  <p className="text-primary-100">
                    {advantage.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-16"
          >
            <a
              href="/contact"
              className="inline-flex items-center px-8 py-4 text-lg font-semibold text-primary-900 bg-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              Hukuk Bürosu Partneri Olun
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
}
