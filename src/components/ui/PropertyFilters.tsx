"use client";

import { useState, useEffect } from 'react';
import { PropertyFilters as Filters } from '@/types/property';

interface PropertyFiltersProps {
  initialFilters: Filters;
  onFilterChange: (filters: Filters) => void;
  cities: string[];
  districts: string[];
}

export default function PropertyFilters({
  initialFilters,
  onFilterChange,
  cities,
  districts
}: PropertyFiltersProps) {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const updateFilter = (key: keyof Filters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">Filtreler</h4>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Temizle
        </button>
      </div>

      {/* Property Category */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Emlak Tipi
        </label>
        <select
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tüm Kategoriler</option>
          <optgroup label="Konut">
            <option value="Konut">Konut</option>
            <option value="Apartman Dairesi">Apartman Dairesi</option>
            <option value="Villa">Villa</option>
            <option value="Müstakil Ev">Müstakil Ev</option>
            <option value="Dubleks">Dubleks</option>
            <option value="Tripleks">Tripleks</option>
            <option value="Rezidans">Rezidans</option>
          </optgroup>
          <optgroup label="Ticari">
            <option value="Ofis">Ofis</option>
            <option value="Büro">Büro</option>
            <option value="Plaza">Plaza</option>
            <option value="İş Merkezi">İş Merkezi</option>
            <option value="Dükkan">Dükkan</option>
            <option value="Mağaza">Mağaza</option>
          </optgroup>
          <optgroup label="Sanayi">
            <option value="Depo">Depo</option>
            <option value="Fabrika">Fabrika</option>
            <option value="Atölye">Atölye</option>
          </optgroup>
          <optgroup label="Arazi">
            <option value="Arsa">Arsa</option>
            <option value="İmarlı Arsa">İmarlı Arsa</option>
            <option value="Tarla">Tarla</option>
            <option value="Bağ-Bahçe">Bağ-Bahçe</option>
          </optgroup>
          <optgroup label="Turizm & Sağlık">
            <option value="Otel">Otel</option>
            <option value="Apart Otel">Apart Otel</option>
            <option value="Klinik">Klinik</option>
            <option value="Hastane">Hastane</option>
          </optgroup>
        </select>
      </div>

      {/* City */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Şehir
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => updateFilter('city', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tüm Şehirler</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>

      {/* District */}
      {filters.city && districts.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            İlçe
          </label>
          <select
            value={filters.district || ''}
            onChange={(e) => updateFilter('district', e.target.value || undefined)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          >
            <option value="">Tüm İlçeler</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Fiyat Aralığı
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Oda Sayısı
        </label>
        <div className="grid grid-cols-4 gap-2">
          {['1+0', '1+1', '2+1', '3+1', '4+1', '5+1'].map((room) => (
            <button
              key={room}
              onClick={() => updateFilter('rooms', filters.rooms === room ? undefined : room)}
              className={`py-2 px-3 text-sm rounded-lg border transition-all ${
                filters.rooms === room
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-primary'
              }`}
            >
              {room}
            </button>
          ))}
        </div>
      </div>

      {/* Size Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Metrekare
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min m²"
            value={filters.minSize || ''}
            onChange={(e) => updateFilter('minSize', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <input
            type="number"
            placeholder="Max m²"
            value={filters.maxSize || ''}
            onChange={(e) => updateFilter('maxSize', e.target.value ? Number(e.target.value) : undefined)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Kitchen Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mutfak Tipi
        </label>
        <select
          value={filters.kitchenType || ''}
          onChange={(e) => updateFilter('kitchenType', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Açık">Açık</option>
          <option value="Kapalı">Kapalı</option>
        </select>
      </div>

      {/* Heating Type */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Isıtma Tipi
        </label>
        <select
          value={filters.heatingType || ''}
          onChange={(e) => updateFilter('heatingType', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Kombi">Kombi</option>
          <option value="Doğalgaz">Doğalgaz</option>
          <option value="Merkezi">Merkezi</option>
          <option value="Payölçer">Payölçer</option>
          <option value="Yerden Isıtma">Yerden Isıtma</option>
        </select>
      </div>

      {/* Usage Status */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kullanım Durumu
        </label>
        <select
          value={filters.usageStatus || ''}
          onChange={(e) => updateFilter('usageStatus', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Boş">Boş</option>
          <option value="Kiracılı">Kiracılı</option>
          <option value="Mülk Sahibi">Mülk Sahibi</option>
        </select>
      </div>

      {/* Deed Status */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Tapu Durumu
        </label>
        <select
          value={filters.deedStatus || ''}
          onChange={(e) => updateFilter('deedStatus', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Kat Mülkiyeti">Kat Mülkiyeti</option>
          <option value="Kat İrtifakı">Kat İrtifakı</option>
        </select>
      </div>

      {/* From Who */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Kimden
        </label>
        <select
          value={filters.fromWho || ''}
          onChange={(e) => updateFilter('fromWho', e.target.value || undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        >
          <option value="">Tümü</option>
          <option value="Emlak Ofisinden">Emlak Ofisinden</option>
          <option value="Sahibinden">Sahibinden</option>
        </select>
      </div>

      {/* Monthly Fee */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Maksimum Aylık Aidat (₺)
        </label>
        <input
          type="number"
          placeholder="Max aidat"
          value={filters.maxMonthlyFee || ''}
          onChange={(e) => updateFilter('maxMonthlyFee', e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>

      {/* Features */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Özellikler
        </label>
        <div className="space-y-2">
          {[
            { key: 'hasBalcony', label: 'Balkon' },
            { key: 'hasParking', label: 'Otopark' },
            { key: 'hasElevator', label: 'Asansör' },
            { key: 'isFurnished', label: 'Eşyalı' },
            { key: 'inSite', label: 'Site İçerisinde' },
            { key: 'creditEligible', label: 'Krediye Uygun' },
            { key: 'exchangeAvailable', label: 'Takas Yapılır' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(filters[key as keyof Filters]) || false}
                onChange={(e) => updateFilter(key as keyof Filters, e.target.checked || undefined)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
