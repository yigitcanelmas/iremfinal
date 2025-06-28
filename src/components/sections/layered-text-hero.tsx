"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function LayeredTextHero() {
  return (
    <div className="w-full">
      <div className="relative w-full h-[800px]">
        {/* Background Layer (Sky) */}
        <div className="absolute inset-0 w-full h-full">
          <div className="relative w-full h-[1000px] -top-[100px]">
            <Image
              src="/uploads/des/arkaplan.png"
              alt="Background Sky"
              width={1536}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Text Layer - Between background and foreground */}
        <div className="absolute inset-0 w-full h-full">
          <div className="relative h-full" style={{ top: '12%' }}>
            <motion.div
              animate={{ 
                x: ["100%", "-100%"]
              }}
              transition={{ 
                duration: 18,
                repeat: Infinity,
                ease: "linear",
                repeatType: "loop"
              }}
              style={{
                willChange: "transform",
                fontSize: 'clamp(4rem, 8vw, 8rem)',
                fontFamily: '"Helvetica Neue", "Arial Black", "Impact", sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.05em',
                textShadow: '0 8px 32px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
                WebkitTextStroke: '2px rgba(255,255,255,0.1)',
                textTransform: 'uppercase',
                color: 'white'
              }}
              className="whitespace-nowrap font-black tracking-tighter uppercase transform-gpu"
            >
              MODERN YAŞAMIN YENİ ADRESİ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; KONFORLU YAŞAM ALANI &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; LÜKS VE KALİTE &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; GELECEĞİN EVLERİ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </motion.div>
          </div>
        </div>

        {/* Foreground Layer (House) */}
        <div className="absolute inset-0 w-full h-full">
          <div className="relative w-full h-[1000px] -top-[100px]">
            <Image
              src="/uploads/des/onplan.png"
              alt="Foreground House"
              width={1536}
              height={1000}
              className="w-full h-full object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
