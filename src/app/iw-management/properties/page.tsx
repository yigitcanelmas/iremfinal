"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Property } from "@/types/property";
import { generatePropertyUrl } from "@/utils/slug";
import AdminHero from "@/components/ui/AdminHero";

export default function PropertiesManagementPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "sale" | "rent">("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "price-high" | "price-low">("newest");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProperties();
    }
  }, [isAuthenticated]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (!response.ok) {
        throw new Error('Emlaklar getirilemedi');
      }
      const data = await response.json();
      const propertiesArray = data.properties || [];
      setProperties(propertiesArray);
      setFilteredProperties(propertiesArray);
    } catch (error) {
      console.error('Emlaklar yüklenirken hata:', error);
      alert('Emlaklar yüklenirken bir hata oluştu!');
    }
  };

  useEffect(() => {
    if (!Array.isArray(properties)) {
      setFilteredProperties([]);
      return;
    }

    let filtered = properties;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(property => property.type === filterType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  }, [properties, searchTerm, filterType, sortBy]);

  const handleDelete = async (propertyId: string) => {
    if (!confirm("Bu emlak ilanını silmek istediğinizden emin misiniz?")) {
      return;
    }

    setLoading(true);
    try {
      // API'den emlak silme
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Emlak silinirken bir hata oluştu');
      }

      // Başarılı silme işleminden sonra local state'i güncelle
      const updatedProperties = properties.filter(p => p.id !== propertyId);
      setProperties(updatedProperties);
      
      alert("Emlak ilanı başarıyla silindi!");
    } catch (error) {
      console.error("Emlak silinirken hata:", error);
      alert("Emlak silinirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price) + ' ₺';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <AdminHero
        title="Emlak Yönetimi"
        subtitle={`Hoş geldiniz, ${user?.name} - Tüm emlak ilanlarınızı görüntüleyin ve yönetin`}
        actions={[
          {
            label: "Yeni Emlak Ekle",
            href: "/iw-management/properties/add",
            icon: (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            ),
            variant: "success"
          },
          {
            label: "Dashboard'a Dön",
            href: "/iw-management",
            icon: (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ),
            variant: "secondary"
          }
        ]}
        stats={[
          { label: "Toplam İlan", value: Array.isArray(properties) ? properties.length : 0 },
          { label: "Satılık", value: Array.isArray(properties) ? properties.filter(p => p.type === 'sale').length : 0 },
          { label: "Kiralık", value: Array.isArray(properties) ? properties.filter(p => p.type === 'rent').length : 0 },
          { label: "Bu Hafta Eklenen", value: Array.isArray(properties) ? properties.filter(p => {
            const createdDate = new Date(p.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return createdDate > weekAgo;
          }).length : 0 }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-lg rounded-2xl mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Arama
                </label>
                <input
                  type="text"
                  placeholder="İlan başlığı, konum veya ID ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  İlan Tipi
                </label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as "all" | "sale" | "rent")}
                  className="block w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="all">Tümü</option>
                  <option value="sale">Satılık</option>
                  <option value="rent">Kiralık</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Sıralama
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "price-high" | "price-low")}
                  className="block w-full bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                  <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                  <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProperties.length} ilan bulundu
          </p>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-200">
              {/* Property Image */}
              <div className="relative h-48">
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    property.type === 'sale' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                      : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                  }`}>
                    {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
                  </span>
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                  {formatPrice(property.price)}
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {property.location.district ? `${property.location.district}, ` : ''}{property.location.city}
                  </p>
                  <p className="text-xs text-blue-400 font-medium">
                    {property.category ? `${property.category.main} - ${property.category.sub}` : 'Kategori belirtilmemiş'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    ID: {property.id}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white">{property.specs.rooms}</div>
                    <div className="text-gray-500 dark:text-gray-400">Oda</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white">{property.specs.bathrooms}</div>
                    <div className="text-gray-500 dark:text-gray-400">Banyo</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900 dark:text-white">{property.specs.netSize}</div>
                    <div className="text-gray-500 dark:text-gray-400">m²</div>
                  </div>
                </div>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Ekleme Tarihi: {new Date(property.createdAt).toLocaleDateString('tr-TR')}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                    href={generatePropertyUrl(property)}
                    target="_blank"
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-xl text-sm font-medium rounded-xl text-gray-300 hover:bg-slate-700/40 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Görüntüle
                  </Link>
                  
                  <Link
                    href={`/iw-management/properties/edit/${property.id}`}
                    className="flex-1 inline-flex justify-center items-center px-3 py-2 bg-blue-600/80 backdrop-blur-xl border border-blue-500/50 shadow-lg hover:shadow-xl text-sm font-medium rounded-xl text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Düzenle
                  </Link>
                  
                  <button
                    onClick={() => handleDelete(property.id)}
                    disabled={loading}
                    className="inline-flex justify-center items-center px-3 py-2 bg-red-600/80 backdrop-blur-xl border border-red-500/50 shadow-lg hover:shadow-xl text-sm font-medium rounded-xl text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12 bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-lg rounded-2xl p-8">
            <div className="bg-slate-700/40 rounded-full p-4 w-16 h-16 mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">Emlak bulunamadı</h3>
            <p className="text-gray-400 mb-8">
              Arama kriterlerinize uygun emlak ilanı bulunamadı.
            </p>
            <div>
              <Link
                href="/iw-management/properties/add"
                className="inline-flex items-center px-6 py-3 bg-blue-600/80 backdrop-blur-xl border border-blue-500/50 shadow-lg hover:shadow-xl text-sm font-medium rounded-xl text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Emlak Ekle
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
