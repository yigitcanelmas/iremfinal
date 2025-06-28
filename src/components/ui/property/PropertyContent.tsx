"use client";

import { Property } from "@/types/property";

interface PropertyContentProps {
  property: Property;
  type: 'sale' | 'rent';
  isVisible: boolean;
}

export default function PropertyContent({ property, type, isVisible }: PropertyContentProps) {
  // Helper function to safely render feature lists
  const renderFeatureList = (features: Array<{label: string, value: any, condition?: boolean}>) => {
    return features
      .filter(item => item.condition !== false && item.value && item.value !== 'Belirtilmemiş')
      .map((item, index) => (
        <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
          <span className="text-gray-600 text-sm font-medium">{item.label}</span>
          <span className="font-semibold text-gray-900 text-sm">{item.value}</span>
        </div>
      ));
  };

  const renderBooleanFeatures = (features: Array<{label: string, condition: boolean}>) => {
    return features
      .filter(item => item.condition)
      .map((item, index) => (
        <div key={index} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
          <span className="text-gray-600 text-sm font-medium">{item.label}</span>
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      ));
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            {/* Description */}
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <h2 className="text-4xl font-bold text-gray-900">Bu Emlak Hakkında</h2>
                <div className="h-px bg-gradient-to-r from-primary to-transparent flex-1"></div>
              </div>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 leading-relaxed">{property.description}</p>
              </div>
            </div>

            {/* Property Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Specifications */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center mb-6">
                  <div className="p-3 bg-primary/10 rounded-xl mr-4 transform transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Temel Özellikler</h3>
                </div>
                <div className="space-y-4">
                  {renderFeatureList([
                    { label: 'Oda Sayısı', value: property.specs?.rooms },
                    { label: 'Banyo Sayısı', value: property.specs?.bathrooms },
                    { label: 'Net Alan', value: property.specs?.netSize ? `${property.specs.netSize} m²` : null },
                    { label: 'Brüt Alan', value: property.specs?.grossSize ? `${property.specs.grossSize} m²` : null },
                    { label: 'Bina Yaşı', value: property.specs?.age ? `${property.specs.age} yıl` : null },
                    { label: 'Kat', value: property.specs?.floor },
                    { label: 'Toplam Kat', value: property.specs?.totalFloors },
                    { label: 'Isıtma', value: property.specs?.heating },
                    { label: 'Eşyalı Durumu', value: property.specs?.furnishing },
                    { label: 'Balkon Sayısı', value: property.specs?.balconyCount }
                  ])}
                </div>
              </div>

              {/* Interior Features */}
              {property.interiorFeatures && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">İç Özellikler</h3>
                  </div>
                  <div className="space-y-4">
                    {renderFeatureList([
                      { label: 'Mutfak Tipi', value: property.interiorFeatures.kitchenType }
                    ])}
                    {renderBooleanFeatures([
                      { label: 'Ankastre Mutfak', condition: property.interiorFeatures.hasBuiltInKitchen },
                      { label: 'Gömme Dolap', condition: property.interiorFeatures.hasBuiltInWardrobe },
                      { label: 'Laminat', condition: property.interiorFeatures.hasLaminate },
                      { label: 'Parke', condition: property.interiorFeatures.hasParquet },
                      { label: 'Seramik', condition: property.interiorFeatures.hasCeramic },
                      { label: 'Mermer', condition: property.interiorFeatures.hasMarble },
                      { label: 'Duvar Kağıdı', condition: property.interiorFeatures.hasWallpaper },
                      { label: 'Boyalı Duvarlar', condition: property.interiorFeatures.hasPaintedWalls },
                      { label: 'Spot Aydınlatma', condition: property.interiorFeatures.hasSpotLighting },
                      { label: 'Hilton Banyo', condition: property.interiorFeatures.hasHiltonBathroom },
                      { label: 'Jakuzi', condition: property.interiorFeatures.hasJacuzzi },
                      { label: 'Duşakabin', condition: property.interiorFeatures.hasShowerCabin },
                      { label: 'Amerikan Kapı', condition: property.interiorFeatures.hasAmericanDoor },
                      { label: 'Çelik Kapı', condition: property.interiorFeatures.hasSteelDoor },
                      { label: 'Görüntülü Diafon', condition: property.interiorFeatures.hasIntercom }
                    ])}
                  </div>
                </div>
              )}

              {/* Exterior Features */}
              {property.exteriorFeatures && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Dış Özellikler</h3>
                  </div>
                  <div className="space-y-4">
                    {renderFeatureList([
                      { label: 'Cephe', value: property.exteriorFeatures.facade }
                    ])}
                    {renderBooleanFeatures([
                      { label: 'Balkon', condition: property.exteriorFeatures.hasBalcony },
                      { label: 'Teras', condition: property.exteriorFeatures.hasTerrace },
                      { label: 'Bahçe', condition: property.exteriorFeatures.hasGarden },
                      { label: 'Bahçe Kullanımı', condition: property.exteriorFeatures.hasGardenUse },
                      { label: 'Deniz Manzarası', condition: property.exteriorFeatures.hasSeaView },
                      { label: 'Şehir Manzarası', condition: property.exteriorFeatures.hasCityView },
                      { label: 'Doğa Manzarası', condition: property.exteriorFeatures.hasNatureView },
                      { label: 'Havuz Manzarası', condition: property.exteriorFeatures.hasPoolView }
                    ])}
                  </div>
                </div>
              )}

              {/* Building Features */}
              {property.buildingFeatures && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Bina Özellikleri</h3>
                  </div>
                  <div className="space-y-4">
                    {renderBooleanFeatures([
                      { label: 'Asansör', condition: property.buildingFeatures.hasElevator },
                      { label: 'Otopark', condition: property.buildingFeatures.hasCarPark },
                      { label: 'Kapalı Otopark', condition: property.buildingFeatures.hasClosedCarPark },
                      { label: 'Açık Otopark', condition: property.buildingFeatures.hasOpenCarPark },
                      { label: 'Güvenlik', condition: property.buildingFeatures.hasSecurity },
                      { label: '24 Saat Güvenlik', condition: property.buildingFeatures.has24HourSecurity },
                      { label: 'Kamera Sistemi', condition: property.buildingFeatures.hasCameraSystem },
                      { label: 'Kapıcı', condition: property.buildingFeatures.hasConcierge },
                      { label: 'Havuz', condition: property.buildingFeatures.hasPool },
                      { label: 'Spor Salonu', condition: property.buildingFeatures.hasGym },
                      { label: 'Sauna', condition: property.buildingFeatures.hasSauna },
                      { label: 'Türk Hamamı', condition: property.buildingFeatures.hasTurkishBath },
                      { label: 'Çocuk Oyun Alanı', condition: property.buildingFeatures.hasPlayground },
                      { label: 'Basketbol Sahası', condition: property.buildingFeatures.hasBasketballCourt },
                      { label: 'Tenis Kortu', condition: property.buildingFeatures.hasTennisCourt },
                      { label: 'Jeneratör', condition: property.buildingFeatures.hasGenerator },
                      { label: 'Yangın Merdiveni', condition: property.buildingFeatures.hasFireEscape },
                      { label: 'Yangın Algılama', condition: property.buildingFeatures.hasFireDetector },
                      { label: 'Su Deposu', condition: property.buildingFeatures.hasWaterBooster },
                      { label: 'Uydu Sistemi', condition: property.buildingFeatures.hasSatelliteSystem },
                      { label: 'Kablosuz İnternet', condition: property.buildingFeatures.hasWifi }
                    ])}
                  </div>
                </div>
              )}

              {/* Property Details */}
              {property.propertyDetails && (
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:border-primary/20 transition-colors duration-300">
                  <div className="flex items-center mb-8">
                    <div className="p-3 bg-primary/10 rounded-xl mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Emlak Detayları</h3>
                  </div>
                  <div className="space-y-4">
                    {renderFeatureList([
                      { label: 'Kullanım Durumu', value: property.propertyDetails.usageStatus },
                      { label: 'Tapu Durumu', value: property.propertyDetails.deedStatus },
                      { label: 'Kimden', value: property.propertyDetails.fromWho },
                      { label: 'Aylık Aidat', value: property.propertyDetails.monthlyFee ? `${property.propertyDetails.monthlyFee} ₺` : null },
                      { label: 'Borç Miktarı', value: property.propertyDetails.debtAmount ? `${property.propertyDetails.debtAmount} ₺` : null },
                      { label: 'Kira Garanti Miktarı', value: property.propertyDetails.rentGuaranteeAmount ? `${property.propertyDetails.rentGuaranteeAmount} ₺` : null }
                    ])}
                    {renderBooleanFeatures([
                      { label: 'İskanlı', condition: property.propertyDetails.isSettlement },
                      { label: 'Krediye Uygun', condition: property.propertyDetails.creditEligible },
                      { label: 'Takas Yapılır', condition: property.propertyDetails.exchangeAvailable },
                      { label: 'Site İçerisinde', condition: property.propertyDetails.inSite },
                      { label: 'Borç Var', condition: property.propertyDetails.hasDebt },
                      { label: 'Kira Garantili', condition: property.propertyDetails.isRentGuaranteed },
                      { label: 'Yeni Bina', condition: property.propertyDetails.isNewBuilding },
                      { label: 'Ofis Kullanımına Uygun', condition: property.propertyDetails.isSuitableForOffice },
                      { label: 'İş Yeri Ruhsatlı', condition: property.propertyDetails.hasBusinessLicense }
                    ])}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Agent Card */}
              <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{property.agent.name}</h3>
                  <p className="text-gray-600">{property.agent.company}</p>
                </div>

                {/* Contact Buttons */}
                <div className="space-y-3">
                  <a
                    href={`tel:${property.agent.phone}`}
                    className="block w-full py-3 px-6 bg-primary text-white rounded-2xl text-center font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Danışmanı Ara
                  </a>
                  <a
                    href={`mailto:${property.agent.email}`}
                    className="block w-full py-3 px-6 bg-gray-100 text-gray-900 rounded-2xl text-center font-semibold hover:bg-gray-200 transition-colors"
                  >
                    E-posta Gönder
                  </a>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 border border-primary/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-2">
                    {property.price.toLocaleString('tr-TR')} ₺
                  </div>
                  {type === 'rent' && (
                    <div className="text-gray-600">aylık</div>
                  )}
                </div>
              </div>

              {/* External Links */}
              {property.sahibindenLink && (
                <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                  <a
                    href={property.sahibindenLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-6 bg-orange-500 text-white rounded-2xl text-center font-semibold hover:bg-orange-600 transition-colors"
                  >
                    Sahibinden.com'da Gör
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
