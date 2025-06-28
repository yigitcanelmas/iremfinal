"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Customer, UpdateCustomerData } from "@/types/customer";
import { User } from "@/types/user";
import { 
  RiArrowLeftLine,
  RiSaveLine,
  RiUserLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiBuildingLine,
  RiPriceTag3Line,
  RiStarLine,
  RiTeamLine,
  RiEditLine
} from "react-icons/ri";
import LocationSelector from "@/components/ui/LocationSelector";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

export default function EditCustomerPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<UpdateCustomerData>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agents, setAgents] = useState<User[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && customerId) {
      fetchCustomer();
      fetchAgents();
    }
  }, [isAuthenticated, customerId]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customers/${customerId}`);
      
      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData);
        setFormData(customerData);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        router.push('/iw-management/customers');
      }
    } catch (error) {
      console.error('Network error fetching customer:', error);
      router.push('/iw-management/customers');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        const filteredAgents = data.filter((user: User) => user.isActive);
        setAgents(filteredAgents);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAddressChange = (location: { country: string; state: string | null; city: string; district?: string }) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        country: location.country,
        state: location.state || '',
        city: location.city,
        district: location.district || ''
      }
    }));
  };

  const handleAddressFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  const handlePropertyPreferenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      propertyPreferences: {
        ...prev.propertyPreferences,
        [field]: value
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      propertyPreferences: {
        ...prev.propertyPreferences,
        features: prev.propertyPreferences?.features?.includes(feature)
          ? prev.propertyPreferences.features.filter(f => f !== feature)
          : [...(prev.propertyPreferences?.features || []), feature]
      }
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }
    
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefon alanı zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const cleanFormData = {
        ...formData,
        propertyPreferences: {
          ...formData.propertyPreferences,
          budgetMin: formData.propertyPreferences?.budgetMin || undefined,
          budgetMax: formData.propertyPreferences?.budgetMax || undefined,
          sizeMin: formData.propertyPreferences?.sizeMin || undefined,
          sizeMax: formData.propertyPreferences?.sizeMax || undefined,
          roomRequirement: formData.propertyPreferences?.roomRequirement || undefined,
          preferredLocations: formData.propertyPreferences?.preferredLocations || [],
          categories: formData.propertyPreferences?.categories || []
        }
      };

      const encodeHeaderValue = (value: string) => {
        return encodeURIComponent(value).replace(/%/g, '_');
      };

      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': encodeHeaderValue(user?.id || 'system'),
          'x-user-name': encodeHeaderValue(user?.name || 'System User'),
          'x-user-email': encodeHeaderValue(user?.email || 'system@example.com')
        },
        body: JSON.stringify(cleanFormData)
      });

      if (response.ok) {
        router.push('/iw-management/customers');
      } else {
        const errorText = await response.text();
        try {
          const error = JSON.parse(errorText);
          setErrors({ submit: error.error || 'Müşteri güncellenirken hata oluştu' });
        } catch {
          setErrors({ submit: `Sunucu hatası: ${response.status} - ${errorText}` });
        }
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ submit: `Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700/50 -mt-[4.5rem] pt-[4.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link
                href="/iw-management/customers"
                className="mr-4 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <RiArrowLeftLine className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-100">
                  Müşteri Düzenle
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {customer.firstName} {customer.lastName} bilgilerini düzenleyin
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Basic Information */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <RiUserLine className="w-5 h-5 mr-2 text-slate-400" />
                  Temel Bilgiler
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Ad *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.firstName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Adınızı girin"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Soyad *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.lastName ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="Soyadınızı girin"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    E-posta *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-2 bg-slate-800 border rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : 'border-slate-600'
                    }`}
                    placeholder="ornek@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Telefon *
                  </label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="TR"
                    value={formData.phone || ''}
                    onChange={(value) => handleInputChange('phone', value || '')}
                    className="phone-input"
                    placeholder="Telefon numarasını girin"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alternatif Telefon
                  </label>
                  <PhoneInput
                    international
                    countryCallingCodeEditable={false}
                    defaultCountry="TR"
                    value={formData.alternativePhone || ''}
                    onChange={(value) => handleInputChange('alternativePhone', value || '')}
                    className="phone-input"
                    placeholder="Alternatif telefon numarası"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Müşteri Tipi
                  </label>
                  <select
                    value={formData.customerType || ''}
                    onChange={(e) => handleInputChange('customerType', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lead">Potansiyel</option>
                    <option value="prospect">Aday</option>
                    <option value="active_client">Aktif Müşteri</option>
                    <option value="past_client">Eski Müşteri</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status || ''}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                    <option value="blacklisted">Kara Liste</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={formData.priority || ''}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Düşük</option>
                    <option value="medium">Orta</option>
                    <option value="high">Yüksek</option>
                    <option value="urgent">Acil</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Address, Agent, Notes */}
          <div className="lg:col-span-8 space-y-8">
            {/* Address Information */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <RiMapPinLine className="w-5 h-5 mr-2 text-slate-400" />
                  Adres Bilgileri
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <LocationSelector
                      onChange={handleAddressChange}
                      initialValues={{
                        country: formData.address?.country || 'TR',
                        state: formData.address?.state || null,
                        city: formData.address?.city || '',
                        district: formData.address?.district
                      }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Posta Kodu
                    </label>
                    <input
                      type="text"
                      value={formData.address?.postalCode || ''}
                      onChange={(e) => handleAddressFieldChange('postalCode', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="34000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Adres
                    </label>
                    <textarea
                      value={formData.address?.street || ''}
                      onChange={(e) => handleAddressFieldChange('street', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tam adres bilgisi"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Assigned Agent */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <RiTeamLine className="w-5 h-5 mr-2 text-slate-400" />
                  Temsilci Atama
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Atanacak Temsilci
                  </label>
                  <select
                    value={formData.assignedAgent?.agentId || ''}
                    onChange={(e) => {
                      const selectedAgent = agents.find(agent => agent.id === e.target.value);
                      if (selectedAgent) {
                        handleInputChange('assignedAgent', {
                          agentId: selectedAgent.id,
                          agentName: selectedAgent.name,
                          assignedDate: formData.assignedAgent?.assignedDate || new Date().toISOString()
                        });
                      } else {
                        handleInputChange('assignedAgent', undefined);
                      }
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Temsilci Seçin (İsteğe Bağlı)</option>
                    {agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Property Preferences */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center">
                  <RiBuildingLine className="w-5 h-5 mr-2 text-slate-400" />
                  Emlak Tercihleri
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      İşlem Tipi
                    </label>
                    <select
                      value={formData.propertyPreferences?.type || ''}
                      onChange={(e) => handlePropertyPreferenceChange('type', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="sale">Satılık</option>
                      <option value="rent">Kiralık</option>
                      <option value="both">Her İkisi</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Oda Sayısı
                    </label>
                    <select
                      value={formData.propertyPreferences?.roomRequirement || ''}
                      onChange={(e) => handlePropertyPreferenceChange('roomRequirement', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Stüdyo">Stüdyo</option>
                      <option value="1+0">1+0</option>
                      <option value="1+1">1+1</option>
                      <option value="2+0">2+0</option>
                      <option value="2+1">2+1</option>
                      <option value="3+1">3+1</option>
                      <option value="3+2">3+2</option>
                      <option value="4+1">4+1</option>
                      <option value="4+2">4+2</option>
                      <option value="5+1">5+1</option>
                      <option value="5+2">5+2</option>
                      <option value="6+ Oda">6+ Oda</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Minimum Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.propertyPreferences?.budgetMin || ''}
                      onChange={(e) => handlePropertyPreferenceChange('budgetMin', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="500000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Maksimum Bütçe (₺)
                    </label>
                    <input
                      type="number"
                      value={formData.propertyPreferences?.budgetMax || ''}
                      onChange={(e) => handlePropertyPreferenceChange('budgetMax', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="1000000"
                    />
                  </div>
                </div>

                {/* Property Categories */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Emlak Kategorileri
                  </label>
                  <div className="space-y-4">
                    {/* Category Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Ana Kategori
                        </label>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              const newCategory = {
                                main: e.target.value as any,
                                sub: ""
                              };
                              setFormData(prev => ({
                                ...prev,
                                propertyPreferences: {
                                  ...prev.propertyPreferences,
                                  categories: [...(prev.propertyPreferences?.categories || []), newCategory]
                                }
                              }));
                            }
                          }}
                          className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Kategori Ekle</option>
                          <option value="Konut">Konut</option>
                          <option value="İş Yeri">İş Yeri</option>
                          <option value="Arsa">Arsa</option>
                          <option value="Bina">Bina</option>
                          <option value="Turistik Tesis">Turistik Tesis</option>
                          <option value="Devremülk">Devremülk</option>
                        </select>
                      </div>
                    </div>

                    {/* Selected Categories */}
                    {formData.propertyPreferences?.categories && formData.propertyPreferences.categories.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Seçili Kategoriler
                        </label>
                        <div className="space-y-2">
                          {formData.propertyPreferences.categories.map((category, index) => (
                            <div key={index} className="flex items-center space-x-2 bg-slate-700/50 p-3 rounded-lg">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-sm text-slate-400">Ana Kategori:</span>
                                  <div className="text-slate-200">{category.main}</div>
                                </div>
                                <div>
                                  <label className="block text-sm text-slate-400 mb-1">Alt Kategori:</label>
                                  <select
                                    value={category.sub}
                                    onChange={(e) => {
                                      const updatedCategories = [...(formData.propertyPreferences?.categories || [])];
                                      updatedCategories[index] = { ...category, sub: e.target.value };
                                      setFormData(prev => ({
                                        ...prev,
                                        propertyPreferences: {
                                          ...prev.propertyPreferences,
                                          categories: updatedCategories
                                        }
                                      }));
                                    }}
                                    className="w-full px-3 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  >
                                    <option value="">Alt Kategori Seçin</option>
                                    {category.main === "Konut" && (
                                      <>
                                        <option value="Daire">Daire</option>
                                        <option value="Rezidans">Rezidans</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Müstakil Ev">Müstakil Ev</option>
                                        <option value="Dubleks">Dubleks</option>
                                        <option value="Tripleks">Tripleks</option>
                                      </>
                                    )}
                                    {category.main === "İş Yeri" && (
                                      <>
                                        <option value="Ofis">Ofis</option>
                                        <option value="Büro">Büro</option>
                                        <option value="Plaza">Plaza</option>
                                        <option value="İş Merkezi">İş Merkezi</option>
                                        <option value="Dükkan">Dükkan</option>
                                        <option value="Mağaza">Mağaza</option>
                                        <option value="Depo">Depo</option>
                                        <option value="Fabrika">Fabrika</option>
                                        <option value="Atölye">Atölye</option>
                                      </>
                                    )}
                                    {category.main === "Arsa" && (
                                      <>
                                        <option value="Arsa">Arsa</option>
                                        <option value="İmarlı Arsa">İmarlı Arsa</option>
                                        <option value="Tarla">Tarla</option>
                                        <option value="Bağ-Bahçe">Bağ-Bahçe</option>
                                      </>
                                    )}
                                    {category.main === "Bina" && (
                                      <>
                                        <option value="Apartman">Apartman</option>
                                        <option value="İş Hanı">İş Hanı</option>
                                        <option value="Plaza">Plaza</option>
                                      </>
                                    )}
                                    {category.main === "Turistik Tesis" && (
                                      <>
                                        <option value="Otel">Otel</option>
                                        <option value="Apart Otel">Apart Otel</option>
                                        <option value="Tatil Köyü">Tatil Köyü</option>
                                      </>
                                    )}
                                    {category.main === "Devremülk" && (
                                      <>
                                        <option value="Otel">Otel</option>
                                        <option value="Apart">Apart</option>
                                        <option value="Villa">Villa</option>
                                      </>
                                    )}
                                  </select>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCategories = formData.propertyPreferences?.categories?.filter((_, i) => i !== index) || [];
                                  setFormData(prev => ({
                                    ...prev,
                                    propertyPreferences: {
                                      ...prev.propertyPreferences,
                                      categories: updatedCategories
                                    }
                                  }));
                                }}
                                className="text-red-400 hover:text-red-300 p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Property Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">
                    Aranan Özellikler
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      { key: 'hasElevator', label: 'Asansör' },
                      { key: 'hasCarPark', label: 'Otopark' },
                      { key: 'hasPool', label: 'Havuz' },
                      { key: 'hasGym', label: 'Spor Salonu' },
                      { key: 'hasSecurity', label: 'Güvenlik' },
                      { key: 'hasBalcony', label: 'Balkon' },
                      { key: 'hasTerrace', label: 'Teras' },
                      { key: 'hasGarden', label: 'Bahçe' },
                      { key: 'hasSeaView', label: 'Deniz Manzarası' },
                      { key: 'hasCityView', label: 'Şehir Manzarası' }
                    ].map(feature => (
                      <label key={feature.key} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.propertyPreferences?.features?.includes(feature.key) || false}
                          onChange={() => handleFeatureToggle(feature.key)}
                          className="w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-300">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100">
                  Notlar
                </h3>
              </div>
              <div className="p-6">
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Müşteri hakkında notlar..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/iw-management/customers"
                className="px-6 py-2 text-slate-400 hover:text-slate-300 font-medium"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <RiEditLine className="w-5 h-5 mr-2" />
                    Müşteri Güncelle
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
