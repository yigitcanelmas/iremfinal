"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Property } from '@/types/property';
import { formatPrice, formatLocation } from '@/lib/client-utils';

interface PropertyCardProps {
  property: Property;
  view: 'grid' | 'list';
  onFavoriteToggle: (id: string) => void;
  isFavorite: boolean;
}

export const PropertyCard = ({ 
  property, 
  view, 
  onFavoriteToggle, 
  isFavorite 
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  return (
    <div 
      className={`
        group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800
        ${view === 'list' ? 'flex md:flex-row flex-col' : 'flex flex-col'}
        transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className={`
        relative overflow-hidden
        ${view === 'list' ? 'md:w-2/5 w-full' : 'w-full'}
        ${view === 'list' ? 'md:h-full h-64' : 'h-64'}
      `}>
        <img
          src={`https://source.unsplash.com/800x600/?apartment,house&sig=${property.id}-${currentImageIndex}`}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Image Navigation */}
        {isHovered && property.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Property Badge */}
        <div className="absolute top-4 right-4 bg-primary/90 text-white px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
          {property.type === 'sale' ? 'SATILIK' : 'KİRALIK'}
        </div>

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteToggle(property.id)}
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 ${
            isFavorite 
              ? 'bg-primary text-white' 
              : 'bg-black/20 text-white hover:bg-black/40'
          } backdrop-blur-sm`}
        >
          <svg 
            className="w-5 h-5" 
            fill={isFavorite ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Content Section */}
      <div className={`
        flex flex-col p-6
        ${view === 'list' ? 'md:w-3/5 w-full' : 'w-full'}
      `}>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {formatLocation(property.location)}
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
          {property.title}
        </h3>

        <div className="text-2xl font-bold text-primary mb-4">
          {formatPrice(property.price)} ₺
        </div>

        <div className="flex flex-wrap gap-4 mb-4">
          {property.category.main === "Arsa" ? (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.specs.netSize} m²
              </div>
              {property.landDetails?.pricePerSquareMeter && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {property.landDetails.pricePerSquareMeter.toLocaleString('tr-TR')} ₺/m²
                </div>
              )}
              {property.landDetails?.zoningStatus && (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {property.landDetails.zoningStatus}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {property.specs.rooms}
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {property.specs.bathrooms} Banyo
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                {property.specs.netSize} m²
              </div>
            </>
          )}
        </div>

        {view === 'list' && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        <div className="mt-auto">
          <Link
            href={`/property/${property.id}`}
            className="btn btn-primary w-full text-center"
          >
            Detayları Gör
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
