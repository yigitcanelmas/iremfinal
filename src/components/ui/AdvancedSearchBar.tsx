"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PropertyFilters, PropertyCategory } from '@/types/property';
import { getCountries, getStates, getCities, getDistricts, type LocationOption } from '@/data/locations';

interface AdvancedSearchBarProps {
  initialFilters?: PropertyFilters;
}

export default function AdvancedSearchBar({ initialFilters }: AdvancedSearchBarProps) {
  const router = useRouter();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters || {});
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [districts, setDistricts] = useState<LocationOption[]>([]);
  const [searchText, setSearchText] = useState('');

  // Initialize countries on component mount
  useEffect(() => {
    setCountries(getCountries());
  }, []);

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    
    // Ana filtreler
    if (filters.propertyType) queryParams.append('type', filters.propertyType);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.country) queryParams.append('country', filters.country);
    if (filters.state) queryParams.append('state', filters.state);
    if (filters.city) queryParams.append('city', filters.city);
    if (filters.district) queryParams.append('district', filters.district);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (searchText.trim()) queryParams.append('search', searchText.trim());
    
    // Gelişmiş filtreler
    if (filters.rooms) queryParams.append('rooms', filters.rooms);
    if (filters.minSize) queryParams.append('minSize', filters.minSize.toString());
    if (filters.maxSize) queryParams.append('maxSize', filters.maxSize.toString());
    if (filters.furnishing) queryParams.append('furnishing', filters.furnishing);
    if (filters.kitchenType) queryParams.append('kitchenType', filters.kitchenType);
    if (filters.heatingType) queryParams.append('heatingType', filters.heatingType);
    if (filters.usageStatus) queryParams.append('usageStatus', filters.usageStatus);
    if (filters.deedStatus) queryParams.append('deedStatus', filters.deedStatus);
    if (filters.fromWho) queryParams.append('fromWho', filters.fromWho);
    if (filters.maxMonthlyFee) queryParams.append('maxMonthlyFee', filters.maxMonthlyFee.toString());

    // Özellikler
    if (filters.hasParking) queryParams.append('hasParking', 'true');
    if (filters.hasElevator) queryParams.append('hasElevator', 'true');
    if (filters.isFurnished) queryParams.append('isFurnished', 'true');
    if (filters.hasBalcony) queryParams.append('hasBalcony', 'true');
    if (filters.inSite) queryParams.append('inSite', 'true');
    if (filters.creditEligible) queryParams.append('creditEligible', 'true');
    if (filters.exchangeAvailable) queryParams.append('exchangeAvailable', 'true');

    // Yönlendirme - Eğer propertyType seçilmemişse /all'a git
    let targetPath = '/all';
    if (filters.propertyType === 'sale') {
      targetPath = '/for-sale';
    } else if (filters.propertyType === 'rent') {
      targetPath = '/for-rent';
    }

    const queryString = queryParams.toString();
    router.push(`${targetPath}${queryString ? `?${queryString}` : ''}`);
  };

  // Kategori seçenekleri
  const categoryOptions: { value: PropertyCategory; label: string; group: string }[] = [
    // Konut
    { value: "Konut", label: "Konut", group: "Konut" },
    { value: "Apartman Dairesi", label: "Apartman Dairesi", group: "Konut" },
    { value: "Villa", label: "Villa", group: "Konut" },
    { value: "Müstakil Ev", label: "Müstakil Ev", group: "Konut" },
    { value: "Dubleks", label: "Dubleks", group: "Konut" },
    { value: "Tripleks", label: "Tripleks", group: "Konut" },
    { value: "Rezidans", label: "Rezidans", group: "Konut" },
    // Ticari
    { value: "Ofis", label: "Ofis", group: "Ticari" },
    { value: "Büro", label: "Büro", group: "Ticari" },
    { value: "Plaza", label: "Plaza", group: "Ticari" },
    { value: "İş Merkezi", label: "İş Merkezi", group: "Ticari" },
    { value: "Dükkan", label: "Dükkan", group: "Ticari" },
    { value: "Mağaza", label: "Mağaza", group: "Ticari" },
    // Sanayi
    { value: "Depo", label: "Depo", group: "Sanayi" },
    { value: "Fabrika", label: "Fabrika", group: "Sanayi" },
    { value: "Atölye", label: "Atölye", group: "Sanayi" },
    // Arazi
    { value: "Arsa", label: "Arsa", group: "Arazi" },
    { value: "İmarlı Arsa", label: "İmarlı Arsa", group: "Arazi" },
    { value: "Tarla", label: "Tarla", group: "Arazi" },
    { value: "Bağ-Bahçe", label: "Bağ-Bahçe", group: "Arazi" },
    // Turizm & Sağlık
    { value: "Otel", label: "Otel", group: "Turizm & Sağlık" },
    { value: "Apart Otel", label: "Apart Otel", group: "Turizm & Sağlık" },
    { value: "Klinik", label: "Klinik", group: "Turizm & Sağlık" },
    { value: "Hastane", label: "Hastane", group: "Turizm & Sağlık" },
  ];

  const groupedCategories = categoryOptions.reduce((acc, option) => {
    if (!acc[option.group]) acc[option.group] = [];
    acc[option.group].push(option);
    return acc;
  }, {} as Record<string, typeof categoryOptions>);

  return (
    <div className="w-full max-w-6xl mx-auto relative z-50">
      <div className="relative bg-white/10 backdrop-blur-md rounded-full border border-white/20 overflow-hidden shadow-2xl">
        <div className="flex items-center overflow-x-auto">
          {/* İşlem Tipi */}
          <select
            className="flex-none w-32 py-5 pl-6 pr-2 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
            value={filters.propertyType || ''}
            onChange={(e) => setFilters({ ...filters, propertyType: e.target.value || undefined })}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" className="text-gray-900">Tümü</option>
            <option value="sale" className="text-gray-900">Satılık</option>
            <option value="rent" className="text-gray-900">Kiralık</option>
          </select>

          {/* Ülke Seçimi */}
          <select
            className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
            value={filters.country || ''}
            onChange={(e) => {
              const country = e.target.value || undefined;
              setFilters({ 
                ...filters, 
                country,
                state: undefined,
                city: undefined,
                district: undefined 
              });
              if (country) {
                setStates(getStates(country));
                setCities(getCities(country));
              } else {
                setStates([]);
                setCities([]);
              }
              setDistricts([]);
            }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em'
            }}
          >
            <option value="" className="text-gray-900">Ülke</option>
            {countries.map(country => (
              <option key={country.value} value={country.value} className="text-gray-900">
                {country.label}
              </option>
            ))}
          </select>

          {/* Eyalet/Bölge Seçimi */}
          {filters.country && states.length > 0 && (
            <select
              className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
              value={filters.state || ''}
              onChange={(e) => {
                const state = e.target.value || undefined;
                setFilters({ 
                  ...filters, 
                  state,
                  city: undefined,
                  district: undefined 
                });
                if (state && filters.country) {
                  setCities(getCities(filters.country, state));
                }
                setDistricts([]);
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" className="text-gray-900">Eyalet</option>
              {states.map(state => (
                <option key={state.value} value={state.value} className="text-gray-900">
                  {state.label}
                </option>
              ))}
            </select>
          )}

          {/* Şehir Seçimi */}
          {filters.country && cities.length > 0 && (
            <select
              className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
              value={filters.city || ''}
              onChange={(e) => {
                const city = e.target.value || undefined;
                setFilters({ 
                  ...filters, 
                  city,
                  district: undefined 
                });
                if (city && filters.country) {
                  setDistricts(getDistricts(filters.country, city));
                } else {
                  setDistricts([]);
                }
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" className="text-gray-900">Şehir</option>
              {cities.map(city => (
                <option key={city.value} value={city.value} className="text-gray-900">
                  {city.label}
                </option>
              ))}
            </select>
          )}

          {/* İlçe Seçimi */}
          {filters.city && districts.length > 0 && (
            <select
              className="flex-none w-36 py-5 px-4 bg-transparent text-white border-r border-white/20 focus:outline-none appearance-none cursor-pointer"
              value={filters.district || ''}
              onChange={(e) => {
                const district = e.target.value || undefined;
                setFilters({ ...filters, district });
              }}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="" className="text-gray-900">İlçe</option>
              {districts.map(district => (
                <option key={district.value} value={district.value} className="text-gray-900">
                  {district.label}
                </option>
              ))}
            </select>
          )}

          {/* Arama Kutusu - Flex-1 ile kalan boşluğu doldurur */}
          <div className="flex-1 flex items-center pl-4 min-w-0">
            <svg 
              className="w-5 h-5 text-white/80 flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder="Konum, özellik veya kelime ara..."
              className="flex-1 ml-3 py-5 bg-transparent text-white placeholder-white/70 border-none focus:outline-none text-lg min-w-0"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          {/* Gelişmiş Arama Butonu */}
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex-none px-6 text-white/80 hover:text-white border-l border-white/20"
          >
            <svg
              className={`w-6 h-6 transform transition-transform ${isAdvancedOpen ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          {/* Arama Butonu */}
          <button
            onClick={handleSearch}
            className="flex-none bg-primary-500 hover:bg-primary-600 text-white px-8 py-5 font-semibold transition-all duration-300 rounded-full mr-1"
          >
            Ara
          </button>
        </div>
      </div>

      {/* Gelişmiş Arama Paneli */}
      {isAdvancedOpen && (
        <div className="absolute left-0 right-0 bottom-full mb-3 bg-gray-900 rounded-2xl border border-white/20 p-6 shadow-xl z-[100] max-h-96 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Emlak Kategorisi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value as PropertyCategory || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Tüm Kategoriler</option>
                {Object.entries(groupedCategories).map(([group, options]) => (
                  <optgroup key={group} label={group} className="text-gray-900">
                    {options.map(option => (
                      <option key={option.value} value={option.value} className="text-gray-900">
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Fiyat Aralığı */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Fiyat Aralığı (₺)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min fiyat"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  placeholder="Max fiyat"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Oda Sayısı */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Oda Sayısı
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.rooms || ''}
                onChange={(e) => setFilters({ ...filters, rooms: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                {['1+0', '1+1', '2+1', '3+1', '4+1', '5+1'].map(room => (
                  <option key={room} value={room} className="text-gray-900">{room}</option>
                ))}
              </select>
            </div>

            {/* Metrekare */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Metrekare
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min m²"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.minSize || ''}
                  onChange={(e) => setFilters({ ...filters, minSize: e.target.value ? Number(e.target.value) : undefined })}
                />
                <input
                  type="number"
                  placeholder="Max m²"
                  className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors placeholder-white/50"
                  value={filters.maxSize || ''}
                  onChange={(e) => setFilters({ ...filters, maxSize: e.target.value ? Number(e.target.value) : undefined })}
                />
              </div>
            </div>

            {/* Mutfak Tipi */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Mutfak Tipi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.kitchenType || ''}
                onChange={(e) => setFilters({ ...filters, kitchenType: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                <option value="Açık" className="text-gray-900">Açık</option>
                <option value="Kapalı" className="text-gray-900">Kapalı</option>
              </select>
            </div>

            {/* Isıtma Tipi */}
            <div>
              <label className="block text-sm font-medium text-white/90 mb-2">
                Isıtma Tipi
              </label>
              <select
                className="w-full px-3 py-2 bg-white/10 text-white border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent hover:bg-white/20 transition-colors appearance-none cursor-pointer"
                value={filters.heatingType || ''}
                onChange={(e) => setFilters({ ...filters, heatingType: e.target.value || undefined })}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.2em 1.2em'
                }}
              >
                <option value="" className="text-gray-900">Seçiniz</option>
                <option value="Kombi" className="text-gray-900">Kombi</option>
                <option value="Doğalgaz" className="text-gray-900">Doğalgaz</option>
                <option value="Merkezi" className="text-gray-900">Merkezi</option>
                <option value="Payölçer" className="text-gray-900">Payölçer</option>
                <option value="Yerden Isıtma" className="text-gray-900">Yerden Isıtma</option>
              </select>
            </div>
          </div>

          {/* Özellikler */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-white/90 mb-3">
              Özellikler
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { key: 'hasParking', label: 'Otopark' },
                { key: 'hasElevator', label: 'Asansör' },
                { key: 'isFurnished', label: 'Eşyalı' },
                { key: 'hasBalcony', label: 'Balkon' },
                { key: 'inSite', label: 'Site İçerisinde' },
                { key: 'creditEligible', label: 'Krediye Uygun' },
                { key: 'exchangeAvailable', label: 'Takas Yapılır' }
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center group cursor-pointer hover:bg-white/10 px-3 py-2 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    className="rounded text-primary focus:ring-primary"
                    checked={Boolean(filters[key as keyof PropertyFilters]) || false}
                    onChange={(e) => setFilters({ ...filters, [key]: e.target.checked || undefined })}
                  />
                  <span className="ml-2 text-sm text-white/90 group-hover:text-white transition-colors">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
