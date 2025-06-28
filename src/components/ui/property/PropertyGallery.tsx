"use client";

import { useState } from "react";
import Image from "next/image";
import { Property } from "@/types/property";
import ImageViewer from "../ImageViewer";

interface PropertyGalleryProps {
  property: Property;
}

export default function PropertyGallery({ property }: PropertyGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageViewer, setShowImageViewer] = useState(false);

  return (
    <div className="bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Main Image */}
          <div 
            className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-zoom-in"
            onClick={() => setShowImageViewer(true)}
          >
            <Image
              src={property.images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Thumbnail Grid */}
          <div className="grid grid-cols-3 gap-4">
            {property.images.slice(0, 6).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative aspect-square rounded-lg overflow-hidden ${
                  index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`${property.title} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Image Counter */}
        <div className="mt-4 text-center text-gray-500">
          {currentImageIndex + 1} / {property.images.length} Resim
        </div>

        {/* Image Viewer Modal */}
        {showImageViewer && (
          <ImageViewer
            images={property.images}
            initialIndex={currentImageIndex}
            onClose={() => setShowImageViewer(false)}
          />
        )}
      </div>
    </div>
  );
}
