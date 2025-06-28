"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Property, PropertyFilters as Filters, PropertyView } from "@/types/property";
import PropertyDetailCard from "@/components/ui/PropertyDetailCard";
import PropertyFilters from "@/components/ui/PropertyFilters";
import SearchBar from "@/components/ui/SearchBar";
import HeroBanner from "@/components/ui/HeroBanner";

function AllPropertiesContent() {
  const searchParams = useSearchParams();
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<PropertyView>("grid");
  const [filters, setFilters] = useState<Filters>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          setAllProperties(data.properties || []);
        }
      } catch (error) {
        console.error('Emlaklar yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  // Extract unique cities and districts for filters
  const cities = Array.isArray(allProperties) ? Array.from(new Set(allProperties.map((p) => p.location.city))) : [];
  const districts = filters.city && Array.isArray(allProperties)
    ? Array.from(
        new Set(
          allProperties
            .filter((p) => p.location.city === filters.city)
            .map((p) => p.location.district)
            .filter((district): district is string => district !== undefined)
        )
      )
    : [];

  // URL parametrelerinden filtreleri yükle
  useEffect(() => {
    const urlFilters: Filters = {};
    
    if (searchParams.get('type')) urlFilters.propertyType = searchParams.get('type')!;
    if (searchParams.get('category')) urlFilters.category = searchParams.get('category') as any;
    if (searchParams.get('city')) urlFilters.city = searchParams.get('city')!;
    if (searchParams.get('district')) urlFilters.district = searchParams.get('district')!;
    if (searchParams.get('minPrice')) urlFilters.minPrice = Number(searchParams.get('minPrice'));
    if (searchParams.get('maxPrice')) urlFilters.maxPrice = Number(searchParams.get('maxPrice'));
    if (searchParams.get('rooms')) urlFilters.rooms = searchParams.get('rooms')!;
    if (searchParams.get('minSize')) urlFilters.minSize = Number(searchParams.get('minSize'));
    if (searchParams.get('maxSize')) urlFilters.maxSize = Number(searchParams.get('maxSize'));
    if (searchParams.get('furnishing')) urlFilters.furnishing = searchParams.get('furnishing')!;
    if (searchParams.get('heating')) urlFilters.heating = searchParams.get('heating')!;
    if (searchParams.get('usageStatus')) urlFilters.usageStatus = searchParams.get('usageStatus')!;
    if (searchParams.get('deedStatus')) urlFilters.deedStatus = searchParams.get('deedStatus')!;
    if (searchParams.get('fromWho')) urlFilters.fromWho = searchParams.get('fromWho')!;
    if (searchParams.get('maxMonthlyFee')) urlFilters.maxMonthlyFee = Number(searchParams.get('maxMonthlyFee'));
    if (searchParams.get('hasCarPark') === 'true') urlFilters.hasCarPark = true;
    if (searchParams.get('hasElevator') === 'true') urlFilters.hasElevator = true;
    if (searchParams.get('isFurnished') === 'true') urlFilters.isFurnished = true;
    if (searchParams.get('balconyCount')) urlFilters.balconyCount = Number(searchParams.get('balconyCount'));
    if (searchParams.get('inSite') === 'true') urlFilters.inSite = true;
    if (searchParams.get('creditEligible') === 'true') urlFilters.creditEligible = true;
    if (searchParams.get('exchangeAvailable') === 'true') urlFilters.exchangeAvailable = true;
    if (searchParams.get('search')) setSearchQuery(searchParams.get('search')!);

    setFilters(urlFilters);
  }, [searchParams]);

  // Filter and sort properties
  useEffect(() => {
    let filtered = [...allProperties];

    // Apply search filter
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(lowerSearch) ||
          p.description.toLowerCase().includes(lowerSearch) ||
          p.location.city.toLowerCase().includes(lowerSearch) ||
          (p.location.district?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    // Apply other filters
    if (filters.propertyType) {
      filtered = filtered.filter((p) => p.type === filters.propertyType);
    }
    if (filters.city) {
      filtered = filtered.filter((p) => p.location.city === filters.city);
    }
    if (filters.district) {
      filtered = filtered.filter((p) => p.location.district === filters.district);
    }
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= filters.maxPrice!);
    }
    if (filters.minSize !== undefined) {
      filtered = filtered.filter((p) => p.specs.netSize >= filters.minSize!);
    }
    if (filters.maxSize !== undefined) {
      filtered = filtered.filter((p) => p.specs.netSize <= filters.maxSize!);
    }
    if (filters.rooms) {
      filtered = filtered.filter((p) => p.specs.rooms === filters.rooms);
    }
    if (filters.furnishing) {
      filtered = filtered.filter((p) => p.specs.furnishing === filters.furnishing);
    }
    if (filters.hasCarPark) {
      filtered = filtered.filter((p) => p.buildingFeatures.hasCarPark === true);
    }
    if (filters.hasElevator) {
      filtered = filtered.filter((p) => p.buildingFeatures.hasElevator === true);
    }
    if (filters.isFurnished) {
      filtered = filtered.filter((p) => p.specs.furnishing === "Furnished");
    }
    if (filters.heating) {
      filtered = filtered.filter((p) => p.specs.heating === filters.heating);
    }

    // Property Details Filters
    if (filters.usageStatus) {
      filtered = filtered.filter((p) => p.propertyDetails?.usageStatus === filters.usageStatus);
    }
    if (filters.deedStatus) {
      filtered = filtered.filter((p) => p.propertyDetails?.deedStatus === filters.deedStatus);
    }
    if (filters.fromWho) {
      filtered = filtered.filter((p) => p.propertyDetails?.fromWho === filters.fromWho);
    }
    if (filters.maxMonthlyFee !== undefined) {
      filtered = filtered.filter((p) => !p.propertyDetails?.monthlyFee || p.propertyDetails.monthlyFee <= filters.maxMonthlyFee!);
    }
    if (filters.inSite) {
      filtered = filtered.filter((p) => p.propertyDetails?.inSite === true);
    }
    if (filters.creditEligible) {
      filtered = filtered.filter((p) => p.propertyDetails?.creditEligible === true);
    }
    if (filters.exchangeAvailable) {
      filtered = filtered.filter((p) => p.propertyDetails?.exchangeAvailable === true);
    }
    if (filters.balconyCount !== undefined) {
      filtered = filtered.filter((p) => p.specs.balconyCount === filters.balconyCount);
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "size_desc":
        filtered.sort((a, b) => b.specs.netSize - a.specs.netSize);
        break;
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    setFilteredProperties(filtered);
  }, [allProperties, filters, searchQuery, sortBy]);

  const saleCount = filteredProperties.filter(p => p.type === 'sale').length;
  const rentCount = filteredProperties.filter(p => p.type === 'rent').length;

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Emlaklar yükleniyor...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <HeroBanner
        title="Tüm Emlak İlanları"
        subtitle="Satılık ve kiralık tüm emlak seçeneklerimizi keşfedin"
        images={[
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop",
          "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1920&h=1080&fit=crop"
        ]}
        stats={[
          { label: "Toplam İlan", value: filteredProperties.length },
          { label: "Satılık", value: saleCount },
          { label: "Kiralık", value: rentCount }
        ]}
      />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-12">
            <SearchBar
              onSearch={setSearchQuery}
              initialValue={searchQuery}
              placeholder="İlan no, konut tipi veya lokasyon ara..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-6">
                <PropertyFilters
                  initialFilters={filters}
                  onFilterChange={setFilters}
                  cities={cities}
                  districts={districts}
                />
              </div>
            </div>

            {/* Properties Grid */}
            <div className="lg:col-span-9">
              {/* Controls */}
              <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                    {filteredProperties.length} ilan bulundu
                  </span>
                  {filters.propertyType && (
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                      {filters.propertyType === 'sale' ? 'Satılık' : 'Kiralık'}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-4">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="newest">En Yeni</option>
                    <option value="price_asc">Fiyat (Düşük-Yüksek)</option>
                    <option value="price_desc">Fiyat (Yüksek-Düşük)</option>
                    <option value="size_desc">Büyükten Küçüğe</option>
                  </select>

                  {/* View Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setView("grid")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        view === "grid"
                          ? "bg-gray-800 text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setView("list")}
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        view === "list"
                          ? "bg-gray-800 text-white shadow-lg"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Properties Display */}
              {filteredProperties.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Aradığınız kriterlerde emlak bulunamadı
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Filtrelerinizi değiştirerek tekrar deneyin
                  </p>
                </div>
              ) : (
                <div className={`grid gap-8 ${
                  view === "grid" 
                    ? "grid-cols-1 xl:grid-cols-2" 
                    : "grid-cols-1"
                }`}>
                  {filteredProperties.map((property) => (
                    <PropertyDetailCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// Main component wrapped with Suspense
export default function AllPropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Sayfa yükleniyor...</p>
        </div>
      </div>
    }>
      <AllPropertiesContent />
    </Suspense>
  );
}
