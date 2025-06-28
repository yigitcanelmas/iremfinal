"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Property } from "@/types/property";
import { formatLocation } from "@/lib/client-utils";

interface PropertyDetailPageProps {
  slug: string;
  type: 'sale' | 'rent';
}

export default function PropertyDetailPage({ slug, type }: PropertyDetailPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const id = slug.split('-').pop();
        const response = await fetch(`/api/properties/${id}`);
        
        if (!response.ok) {
          throw new Error(response.status === 404 ? 'İlan bulunamadı' : 'İlan yüklenemedi');
        }
        
        const property = await response.json();
        if (property.type !== type) {
          throw new Error(`Bu ilan ${type === 'sale' ? 'satılık' : 'kiralık'} değil`);
        }
        
        setProperty(property);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug, type]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">İlan yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">{error}</h1>
          <Link 
            href={type === 'sale' ? '/for-sale' : '/for-rent'}
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            ← İlanlara Dön
          </Link>
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
            <span className="mx-2">/</span>
            <Link href={type === 'sale' ? '/for-sale' : '/for-rent'} className="hover:text-primary">
              {type === 'sale' ? 'Satılık' : 'Kiralık'}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kolon - Galeri ve Detaylar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galeri */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="relative aspect-[4/3] mb-4">
                <Image
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
                {property.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button
                      onClick={() => setCurrentImageIndex(i => i === 0 ? property.images.length - 1 : i - 1)}
                      className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setCurrentImageIndex(i => (i + 1) % property.images.length)}
                      className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 aspect-[4/3] flex-shrink-0 rounded-lg overflow-hidden ${
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

            {/* İlan Detayları */}
            <div className="bg-white rounded-lg shadow-sm divide-y">
              {/* Başlık ve Fiyat */}
              <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">{property.title}</h1>
                <div className="flex items-center justify-between">
                  <div className="text-gray-500">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {formatLocation(property.location)}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-primary">
                    {property.price.toLocaleString('tr-TR')} ₺
                    {type === 'rent' && <span className="text-sm text-gray-500 ml-1">/ay</span>}
                  </div>
                </div>
              </div>

              {/* İlan Özellikleri */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">İlan Özellikleri</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">İlan No</div>
                    <div className="font-medium">{property.id}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Net m²</div>
                    <div className="font-medium">{property.specs.netSize} m²</div>
                  </div>
                  {property.specs.grossSize && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Brüt m²</div>
                      <div className="font-medium">{property.specs.grossSize} m²</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Oda Sayısı</div>
                    <div className="font-medium">{property.specs.rooms}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Bina Yaşı</div>
                    <div className="font-medium">{property.specs.age}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Banyo Sayısı</div>
                    <div className="font-medium">{property.specs.bathrooms}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Eşya Durumu</div>
                    <div className="font-medium">{property.specs.furnishing}</div>
                  </div>
                  {property.specs.floor !== undefined && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Bulunduğu Kat</div>
                      <div className="font-medium">{property.specs.floor}. Kat</div>
                    </div>
                  )}
                  {property.specs.totalFloors !== undefined && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Toplam Kat</div>
                      <div className="font-medium">{property.specs.totalFloors}</div>
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Isıtma</div>
                    <div className="font-medium">{property.specs.heating}</div>
                  </div>
                  {property.specs.balconyCount !== undefined && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Balkon Sayısı</div>
                      <div className="font-medium">{property.specs.balconyCount}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* İç Özellikler */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">İç Özellikler</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Mutfak Tipi</div>
                    <div className="font-medium">{property.interiorFeatures?.kitchenType || '-'}</div>
                  </div>
                  {property.interiorFeatures && Object.entries(property.interiorFeatures)
                    .filter(([key, value]) => typeof value === 'boolean' && value)
                    .map(([key]) => (
                      <div key={key} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {key === 'hasBuiltInKitchen' && 'Ankastre Mutfak'}
                        {key === 'hasBuiltInWardrobe' && 'Gömme Dolap'}
                        {key === 'hasLaminate' && 'Laminat'}
                        {key === 'hasParquet' && 'Parke'}
                        {key === 'hasCeramic' && 'Seramik'}
                        {key === 'hasMarble' && 'Mermer'}
                        {key === 'hasWallpaper' && 'Duvar Kağıdı'}
                        {key === 'hasPaintedWalls' && 'Boyalı'}
                        {key === 'hasSpotLighting' && 'Spot Aydınlatma'}
                        {key === 'hasHiltonBathroom' && 'Hilton Banyo'}
                        {key === 'hasJacuzzi' && 'Jakuzi'}
                        {key === 'hasShowerCabin' && 'Duşakabin'}
                        {key === 'hasAmericanDoor' && 'Amerikan Kapı'}
                        {key === 'hasSteelDoor' && 'Çelik Kapı'}
                        {key === 'hasIntercom' && 'Görüntülü Diafon'}
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Dış Özellikler */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Dış Özellikler</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {property.exteriorFeatures?.facade && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Cephe</div>
                      <div className="font-medium">{property.exteriorFeatures.facade}</div>
                    </div>
                  )}
                  {property.exteriorFeatures && Object.entries(property.exteriorFeatures)
                    .filter(([key, value]) => typeof value === 'boolean' && value)
                    .map(([key]) => (
                      <div key={key} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {key === 'hasBalcony' && 'Balkon'}
                        {key === 'hasTerrace' && 'Teras'}
                        {key === 'hasGarden' && 'Bahçe'}
                        {key === 'hasGardenUse' && 'Bahçe Kullanımı'}
                        {key === 'hasSeaView' && 'Deniz Manzarası'}
                        {key === 'hasCityView' && 'Şehir Manzarası'}
                        {key === 'hasNatureView' && 'Doğa Manzarası'}
                        {key === 'hasPoolView' && 'Havuz Manzarası'}
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Açıklama */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Açıklama</h2>
                <div 
                  className="text-gray-600 prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </div>

              {/* Bina Özellikleri */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Bina Özellikleri</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(property.buildingFeatures)
                    .filter(([key, value]) => typeof value === 'boolean' && value)
                    .map(([key]) => (
                      <div key={key} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {key === 'hasCarPark' && 'Otopark'}
                        {key === 'hasClosedCarPark' && 'Kapalı Otopark'}
                        {key === 'hasOpenCarPark' && 'Açık Otopark'}
                        {key === 'hasElevator' && 'Asansör'}
                        {key === 'hasSecurity' && 'Güvenlik'}
                        {key === 'has24HourSecurity' && '24 Saat Güvenlik'}
                        {key === 'hasCameraSystem' && 'Kamera Sistemi'}
                        {key === 'hasConcierge' && 'Kapıcı'}
                        {key === 'hasPool' && 'Havuz'}
                        {key === 'hasGym' && 'Spor Salonu'}
                        {key === 'hasSauna' && 'Sauna'}
                        {key === 'hasTurkishBath' && 'Türk Hamamı'}
                        {key === 'hasPlayground' && 'Çocuk Oyun Alanı'}
                        {key === 'hasBasketballCourt' && 'Basketbol Sahası'}
                        {key === 'hasTennisCourt' && 'Tenis Kortu'}
                        {key === 'hasGenerator' && 'Jeneratör'}
                        {key === 'hasFireEscape' && 'Yangın Merdiveni'}
                        {key === 'hasFireDetector' && 'Yangın Algılama'}
                        {key === 'hasWaterBooster' && 'Su Deposu'}
                        {key === 'hasSatelliteSystem' && 'Uydu Sistemi'}
                        {key === 'hasWifi' && 'Kablosuz İnternet'}
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Emlak Detayları */}
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Emlak Detayları</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Kullanım Durumu</div>
                    <div className="font-medium">{property.propertyDetails.usageStatus}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Tapu Durumu</div>
                    <div className="font-medium">{property.propertyDetails.deedStatus}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-gray-500">Kimden</div>
                    <div className="font-medium">{property.propertyDetails.fromWho}</div>
                  </div>
                  {property.propertyDetails.monthlyFee !== undefined && (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-500">Aidat</div>
                      <div className="font-medium">{property.propertyDetails.monthlyFee} ₺</div>
                    </div>
                  )}
                  {Object.entries(property.propertyDetails)
                    .filter(([key, value]) => typeof value === 'boolean' && value)
                    .map(([key]) => (
                      <div key={key} className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {key === 'isSettlement' && 'İskanlı'}
                        {key === 'creditEligible' && 'Krediye Uygun'}
                        {key === 'exchangeAvailable' && 'Takasa Uygun'}
                        {key === 'inSite' && 'Site İçerisinde'}
                        {key === 'hasDebt' && 'Borç Var'}
                        {key === 'isRentGuaranteed' && 'Kira Garantili'}
                        {key === 'isNewBuilding' && 'Yeni Bina'}
                        {key === 'isSuitableForOffice' && 'Ofis Kullanımına Uygun'}
                        {key === 'hasBusinessLicense' && 'İş Yeri Ruhsatlı'}
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Kolon - İletişim */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{property.agent.name}</h3>
                <p className="text-gray-500">{property.agent.company}</p>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center justify-center w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Telefon
                </a>

                <a
                  href={`https://wa.me/${property.agent.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Merhaba, ${window.location.origin}/${type === 'sale' ? 'satilik' : 'kiralik'}/${slug} ilanınız hakkında bilgi almak istiyorum.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#22BF5B] transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  WhatsApp
                </a>

                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center justify-center w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  E-posta
                </a>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="text-sm text-gray-500 space-y-2">
                  <p>• Bu ilan {new Date(property.createdAt).toLocaleDateString('tr-TR')} tarihinde yayınlandı</p>
                  <p>• İlan no: {property.id}</p>
                  {property.sahibindenLink && (
                    <p>
                      • Bu ilanı 
                      <a 
                        href={property.sahibindenLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline ml-1"
                      >
                        sahibinden.com
                      </a>'da görüntüle
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}