"use client";

import { Property } from "@/types/property";
import Link from "next/link";
import { formatLocation } from "@/lib/client-utils";

interface PropertyHeroProps {
  property: Property;
  type: 'sale' | 'rent';
}

export default function PropertyHero({ property, type }: PropertyHeroProps) {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-400">
            <li>
              <Link href="/" className="hover:text-white">Ana Sayfa</Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${type === 'sale' ? 'satilik' : 'kiralik'}`} className="hover:text-white">
                {type === 'sale' ? 'Satılık' : 'Kiralık'}
              </Link>
            </li>
            <li>/</li>
            <li className="text-white">{property.title}</li>
          </ol>
        </nav>

        {/* Title and Location */}
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{property.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-lg text-gray-300">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {formatLocation(property.location)}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {property.category.main} - {property.category.sub}
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {property.price.toLocaleString('tr-TR')} ₺
              {type === 'rent' && <span className="text-sm ml-1">/ay</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
