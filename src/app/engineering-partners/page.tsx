"use client";

import PageHero from "@/components/sections/page-hero";
import PartnerCard from "@/components/sections/partner-card";
import ScrollToTop from "@/components/ui/scroll-to-top";
import { motion } from "framer-motion";

const partners = [
  {
    name: "Yapı Mühendislik",
    logo: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    description: "30 yıllık deneyimle inşaat ve yapı denetimi alanında uzmanlaşmış, yüksek kalite standartlarıyla hizmet veren mühendislik firması.",
    services: ["Yapı Denetimi", "Statik Proje", "Deprem Analizi", "Güçlendirme"],
    website: "https://yapimuhendislik.com"
  },
  {
    name: "Teknik Proje",
    logo: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    description: "Mekanik, elektrik ve tesisat projelerinde uzmanlaşmış, yenilenebilir enerji sistemleri konusunda öncü mühendislik firması.",
    services: ["Mekanik Proje", "Elektrik Projesi", "Tesisat", "Enerji Sistemleri"],
    website: "https://teknikproje.com"
  },
  {
    name: "Çevre Mühendislik",
    logo: "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    description: "Sürdürülebilir yapılar ve çevre dostu projeler geliştiren, yeşil bina sertifikasyonu konusunda uzman mühendislik firması.",
    services: ["Yeşil Bina", "Çevre Danışmanlığı", "Atık Yönetimi", "Enerji Verimliliği"],
    website: "https://cevremuhendislik.com"
  }
];

const advantages = [
  {
    title: "Teknik Uzmanlık",
    description: "Deneyimli mühendislik ekibi ile profesyonel teknik destek.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Kalite Standartları",
    description: "Uluslararası standartlarda mühendislik çözümleri.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  },
  {
    title: "Yenilikçi Çözümler",
    description: "Modern teknoloji ve yenilikçi mühendislik yaklaşımları.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    title: "Sürdürülebilirlik",
    description: "Çevre dostu ve sürdürülebilir mühendislik projeleri.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function EngineeringPartnersPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        title="Mühendislik Partnerlerimiz"
        subtitle="İŞ ORTAKLARIMIZ"
        description="Kaliteli ve güvenilir mühendislik çözümleri sunan iş ortaklarımız"
        imagePath="https://images.unsplash.com/photo-1581094288338-2314dddb7ece?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
        gradient="from-primary-900/60 via-primary-800/40 to-transparent"
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
              Mühendislik İş Ortaklığının Avantajları
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-primary-100 max-w-3xl mx-auto"
            >
              IREMWORLD mühendislik iş ortaklığı ile kazanacağınız rekabet avantajları
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
              Mühendislik Partneri Olun
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
