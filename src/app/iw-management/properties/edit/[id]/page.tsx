"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";
import { 
  Property, 
  PropertyMainCategory,
  RoomType,
  HeatingType,
  UsageStatus,
  DeedStatus,
  FromWho,
  FurnishingStatus
} from "@/types/property";
import AdminHero from "@/components/ui/AdminHero";
import FormSection from "@/components/ui/FormSection";
import ImageUpload from "@/components/ui/ImageUpload";
import LocationSelector from "@/components/ui/LocationSelector";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [id, setId] = useState<string>('');
  const [agents, setAgents] = useState<User[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    // Fetch agents
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

    if (isAuthenticated) {
      fetchAgents();
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (!response.ok) {
        throw new Error('Emlak bulunamadı');
      }
      const data = await response.json();
      setProperty(data);
    } catch (error) {
      console.error('Emlak yüklenirken hata:', error);
      alert('Emlak yüklenirken bir hata oluştu!');
      router.push('/iw-management/properties');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!property) return;

    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProperty(prev => ({
        ...prev!,
        [parent]: {
          ...(prev![parent as keyof typeof prev] as any),
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setProperty(prev => ({
        ...prev!,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleCheckboxChange = (section: string, name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!property) return;

    const { checked } = e.target;
    setProperty(prev => ({
      ...prev!,
      [section]: {
        ...(prev![section as keyof typeof prev] as any),
        [name]: checked
      }
    }));
  };

  const handleImagesChange = (newImages: string[]) => {
    if (!property) return;
    
    setProperty(prev => ({
      ...prev!,
      images: newImages
    }));
  };

  const validateForm = () => {
    if (!property) return [];

    const errors: string[] = [];

    // Temel bilgiler kontrolü
    if (!property.title.trim()) {
      errors.push("Başlık gereklidir");
    }
    if (!property.description.trim()) {
      errors.push("Açıklama gereklidir");
    }
    if (!property.price || property.price <= 0) {
      errors.push("Geçerli bir fiyat giriniz");
    }

    // Konum kontrolü
    if (!property.location.city.trim()) {
      errors.push("Şehir seçimi gereklidir");
    }

    // Emlak özellikleri kontrolü
    if (!property.specs.netSize || property.specs.netSize <= 0) {
      errors.push("Net alan gereklidir ve 0'dan büyük olmalıdır");
    }
    if (!property.specs.bathrooms || property.specs.bathrooms <= 0) {
      errors.push("Banyo sayısı gereklidir ve 0'dan büyük olmalıdır");
    }
    if (property.specs.age === undefined || property.specs.age < 0) {
      errors.push("Bina yaşı gereklidir ve 0 veya pozitif olmalıdır");
    }

    // Emlak danışmanı kontrolü - agent.id is optional in the type, so we check for name instead
    if (!property.agent.name.trim()) {
      errors.push("Emlak danışmanı seçimi gereklidir");
    }
    if (!property.agent.name.trim()) {
      errors.push("Danışman adı gereklidir");
    }
    if (!property.agent.phone.trim()) {
      errors.push("Danışman telefonu gereklidir");
    }
    if (!property.agent.email.trim()) {
      errors.push("Danışman e-postası gereklidir");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setLoading(true);
    try {
      // Form validasyonu
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        alert("Lütfen aşağıdaki hataları düzeltin:\n\n" + validationErrors.join("\n"));
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...property,
          updatedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Emlak güncellenirken bir hata oluştu');
      }

      alert("Emlak başarıyla güncellendi!");
      router.push("/iw-management/properties");
    } catch (error) {
      console.error("Emlak güncellenirken hata:", error);
      alert("Emlak güncellenirken bir hata oluştu!");
    } finally {
      setLoading(false);
    }
  };

  const renderCheckboxGroup = (
    section: string,
    items: Array<{ key: string; label: string }>,
    values: Record<string, any>
  ) => {
    return items.map(({ key, label }) => (
      <div key={key} className="flex items-center">
        <input
          type="checkbox"
          checked={values[key]}
          onChange={handleCheckboxChange(section, key)}
          className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900 dark:text-white">
          {label}
        </label>
      </div>
    ));
  };

  if (isLoading || !property) {
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
      <AdminHero
        title="Emlak Düzenle"
        subtitle={`${property.title} ilanını düzenliyorsunuz`}
        actions={[
          {
            label: "İlanlara Dön",
            href: "/iw-management/properties",
            icon: (
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            ),
            variant: "secondary"
          }
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Temel Bilgiler */}
          <FormSection title="Temel Bilgiler">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    İlan Tipi
                  </label>
                  <select
                    name="type"
                    value={property.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="sale">Satılık</option>
                    <option value="rent">Kiralık</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ana Kategori
                  </label>
                  <select
                    name="category.main"
                    value={property.category.main}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Konut">Konut</option>
                    <option value="İş Yeri">İş Yeri</option>
                    <option value="Arsa">Arsa</option>
                    <option value="Bina">Bina</option>
                    <option value="Turistik Tesis">Turistik Tesis</option>
                    <option value="Devremülk">Devremülk</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alt Kategori
                  </label>
                  <select
                    name="category.sub"
                    value={property.category.sub}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {property.category.main === "Konut" && (
                      <>
                        <option value="Daire">Daire</option>
                        <option value="Rezidans">Rezidans</option>
                        <option value="Villa">Villa</option>
                        <option value="Müstakil Ev">Müstakil Ev</option>
                        <option value="Dubleks">Dubleks</option>
                        <option value="Tripleks">Tripleks</option>
                      </>
                    )}
                    {property.category.main === "İş Yeri" && (
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
                    {property.category.main === "Arsa" && (
                      <>
                        <option value="Arsa">Arsa</option>
                        <option value="İmarlı Arsa">İmarlı Arsa</option>
                        <option value="Tarla">Tarla</option>
                        <option value="Bağ-Bahçe">Bağ-Bahçe</option>
                      </>
                    )}
                    {property.category.main === "Bina" && (
                      <>
                        <option value="Apartman">Apartman</option>
                        <option value="İş Hanı">İş Hanı</option>
                        <option value="Plaza">Plaza</option>
                      </>
                    )}
                    {property.category.main === "Turistik Tesis" && (
                      <>
                        <option value="Otel">Otel</option>
                        <option value="Apart Otel">Apart Otel</option>
                        <option value="Tatil Köyü">Tatil Köyü</option>
                      </>
                    )}
                    {property.category.main === "Devremülk" && (
                      <>
                        <option value="Otel">Otel</option>
                        <option value="Apart">Apart</option>
                        <option value="Villa">Villa</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Fiyat (₺)
                </label>
                <input
                  type="number"
                  name="price"
                  value={property.price}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Başlık
                </label>
                <input
                  type="text"
                  name="title"
                  value={property.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <RichTextEditor
                  value={property.description}
                  onChange={(value) => setProperty(prev => ({ ...prev!, description: value }))}
                  placeholder="Emlak açıklamasını buraya yazın..."
                />
              </div>
            </div>
          </FormSection>

          {/* Konum Bilgileri */}
          <FormSection title="Konum Bilgileri">
            <LocationSelector
              onChange={(location) => {
                setProperty(prev => ({
                  ...prev!,
                  location: {
                    ...prev!.location,
                    ...location,
                    state: location.state || null
                  }
                }));
              }}
              initialValues={{
                country: property.location.country,
                state: property.location.state || null,
                city: property.location.city,
                district: property.location.district
              }}
            />
          </FormSection>

          {/* Resimler */}
          <FormSection title="Resimler">
            <ImageUpload
              images={property.images}
              onImagesChange={handleImagesChange}
              maxImages={10}
            />
          </FormSection>

          {/* Emlak Özellikleri */}
          <FormSection title="Emlak Özellikleri">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Net Alan (m²)
                </label>
                <input
                  type="number"
                  name="specs.netSize"
                  value={property.specs.netSize}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Brüt Alan (m²)
                </label>
                <input
                  type="number"
                  name="specs.grossSize"
                  value={property.specs.grossSize || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Oda Sayısı
                </label>
                <select
                  name="specs.rooms"
                  value={property.specs.rooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Banyo Sayısı
                </label>
                <input
                  type="number"
                  name="specs.bathrooms"
                  value={property.specs.bathrooms}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Isıtma Tipi
                </label>
                <select
                  name="specs.heating"
                  value={property.specs.heating}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="Kombi Doğalgaz">Kombi Doğalgaz</option>
                  <option value="Merkezi Doğalgaz">Merkezi Doğalgaz</option>
                  <option value="Yerden Isıtma">Yerden Isıtma</option>
                  <option value="Merkezi (Pay Ölçer)">Merkezi (Pay Ölçer)</option>
                  <option value="Klima">Klima</option>
                  <option value="Şömine">Şömine</option>
                  <option value="Soba">Soba</option>
                  <option value="Isıtma Yok">Isıtma Yok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Eşyalı Durumu
                </label>
                <select
                  name="specs.furnishing"
                  value={property.specs.furnishing}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Furnished">Eşyalı</option>
                  <option value="Unfurnished">Eşyasız</option>
                  <option value="Partially Furnished">Yarı Eşyalı</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bina Yaşı
                </label>
                <input
                  type="number"
                  name="specs.age"
                  value={property.specs.age}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Bulunduğu Kat
                </label>
                <input
                  type="number"
                  name="specs.floor"
                  value={property.specs.floor || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Toplam Kat
                </label>
                <input
                  type="number"
                  name="specs.totalFloors"
                  value={property.specs.totalFloors || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Balkon Sayısı
                </label>
                <input
                  type="number"
                  name="specs.balconyCount"
                  value={property.specs.balconyCount || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </FormSection>

          {/* İç Özellikler */}
          <FormSection title="İç Özellikler">
            <div className="mb-6">
              <label htmlFor="kitchenType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mutfak Tipi
              </label>
              <select
                id="kitchenType"
                name="interiorFeatures.kitchenType"
                value={property.interiorFeatures.kitchenType}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Açık">Açık</option>
                <option value="Kapalı">Kapalı</option>
                <option value="Amerikan">Amerikan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Özellikler
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {renderCheckboxGroup('interiorFeatures', [
                  { key: 'hasBuiltInKitchen', label: 'Ankastre Mutfak' },
                  { key: 'hasBuiltInWardrobe', label: 'Gömme Dolap' },
                  { key: 'hasLaminate', label: 'Laminat' },
                  { key: 'hasParquet', label: 'Parke' },
                  { key: 'hasCeramic', label: 'Seramik' },
                  { key: 'hasMarble', label: 'Mermer' },
                  { key: 'hasWallpaper', label: 'Duvar Kağıdı' },
                  { key: 'hasPaintedWalls', label: 'Boyalı' },
                  { key: 'hasSpotLighting', label: 'Spot Aydınlatma' },
                  { key: 'hasHiltonBathroom', label: 'Hilton Banyo' },
                  { key: 'hasJacuzzi', label: 'Jakuzi' },
                  { key: 'hasShowerCabin', label: 'Duşakabin' },
                  { key: 'hasAmericanDoor', label: 'Amerikan Kapı' },
                  { key: 'hasSteelDoor', label: 'Çelik Kapı' },
                  { key: 'hasIntercom', label: 'Görüntülü Diafon' }
                ], Object.fromEntries(Object.entries(property.interiorFeatures).filter(([k, v]) => typeof v === 'boolean')))}
              </div>
            </div>
          </FormSection>

          {/* Dış Özellikler */}
          <FormSection title="Dış Özellikler">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cephe
              </label>
              <select
                name="exteriorFeatures.facade"
                value={property.exteriorFeatures.facade}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Kuzey">Kuzey</option>
                <option value="Güney">Güney</option>
                <option value="Doğu">Doğu</option>
                <option value="Batı">Batı</option>
                <option value="Güneydoğu">Güneydoğu</option>
                <option value="Güneybatı">Güneybatı</option>
                <option value="Kuzeydoğu">Kuzeydoğu</option>
                <option value="Kuzeybatı">Kuzeybatı</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Özellikler
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {renderCheckboxGroup('exteriorFeatures', [
                  { key: 'hasBalcony', label: 'Balkon' },
                  { key: 'hasTerrace', label: 'Teras' },
                  { key: 'hasGarden', label: 'Bahçe' },
                  { key: 'hasGardenUse', label: 'Bahçe Kullanımı' },
                  { key: 'hasSeaView', label: 'Deniz Manzarası' },
                  { key: 'hasCityView', label: 'Şehir Manzarası' },
                  { key: 'hasNatureView', label: 'Doğa Manzarası' },
                  { key: 'hasPoolView', label: 'Havuz Manzarası' }
                ], Object.fromEntries(Object.entries(property.exteriorFeatures).filter(([k, v]) => typeof v === 'boolean')))}
              </div>
            </div>
          </FormSection>

          {/* Bina Özellikleri */}
          <FormSection title="Bina Özellikleri">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderCheckboxGroup('buildingFeatures', [
                { key: 'hasElevator', label: 'Asansör' },
                { key: 'hasCarPark', label: 'Otopark' },
                { key: 'hasClosedCarPark', label: 'Kapalı Otopark' },
                { key: 'hasOpenCarPark', label: 'Açık Otopark' },
                { key: 'hasSecurity', label: 'Güvenlik' },
                { key: 'has24HourSecurity', label: '24 Saat Güvenlik' },
                { key: 'hasCameraSystem', label: 'Kamera Sistemi' },
                { key: 'hasConcierge', label: 'Kapıcı' },
                { key: 'hasPool', label: 'Havuz' },
                { key: 'hasGym', label: 'Spor Salonu' },
                { key: 'hasSauna', label: 'Sauna' },
                { key: 'hasTurkishBath', label: 'Türk Hamamı' },
                { key: 'hasPlayground', label: 'Çocuk Oyun Alanı' },
                { key: 'hasBasketballCourt', label: 'Basketbol Sahası' },
                { key: 'hasTennisCourt', label: 'Tenis Kortu' },
                { key: 'hasGenerator', label: 'Jeneratör' },
                { key: 'hasFireEscape', label: 'Yangın Merdiveni' },
                { key: 'hasFireDetector', label: 'Yangın Algılama' },
                { key: 'hasWaterBooster', label: 'Su Deposu' },
                { key: 'hasSatelliteSystem', label: 'Uydu Sistemi' },
                { key: 'hasWifi', label: 'Kablosuz İnternet' }
              ], property.buildingFeatures)}
            </div>
          </FormSection>

          {/* Emlak Detayları */}
          <FormSection title="Emlak Detayları">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kullanım Durumu
                </label>
                <select
                  name="propertyDetails.usageStatus"
                  value={property.propertyDetails.usageStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Boş">Boş</option>
                  <option value="Kiracılı">Kiracılı</option>
                  <option value="Mülk Sahibi">Mülk Sahibi</option>
                  <option value="Yeni Yapılmış">Yeni Yapılmış</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tapu Durumu
                </label>
                <select
                  name="propertyDetails.deedStatus"
                  value={property.propertyDetails.deedStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Kat Mülkiyeti">Kat Mülkiyeti</option>
                  <option value="Kat İrtifakı">Kat İrtifakı</option>
                  <option value="Arsa Tapulu">Arsa Tapulu</option>
                  <option value="Hisseli Tapu">Hisseli Tapu</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kimden
                </label>
                <select
                  name="propertyDetails.fromWho"
                  value={property.propertyDetails.fromWho}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="Sahibinden">Sahibinden</option>
                  <option value="Emlak Ofisinden">Emlak Ofisinden</option>
                  <option value="Bankadan">Bankadan</option>
                  <option value="Müteahhitten">Müteahhitten</option>
                  <option value="Belediyeden">Belediyeden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Aylık Aidat (₺)
                </label>
                <input
                  type="number"
                  name="propertyDetails.monthlyFee"
                  value={property.propertyDetails.monthlyFee || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Borç Miktarı (₺)
                </label>
                <input
                  type="number"
                  name="propertyDetails.debtAmount"
                  value={property.propertyDetails.debtAmount || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Kira Garanti Miktarı (₺)
                </label>
                <input
                  type="number"
                  name="propertyDetails.rentGuaranteeAmount"
                  value={property.propertyDetails.rentGuaranteeAmount || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Diğer Özellikler
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {renderCheckboxGroup('propertyDetails', [
                  { key: 'isSettlement', label: 'İskanlı' },
                  { key: 'creditEligible', label: 'Krediye Uygun' },
                  { key: 'exchangeAvailable', label: 'Takas' },
                  { key: 'inSite', label: 'Site İçerisinde' },
                  { key: 'hasDebt', label: 'Borç Var' },
                  { key: 'isRentGuaranteed', label: 'Kira Garantili' },
                  { key: 'isNewBuilding', label: 'Yeni Bina' },
                  { key: 'isSuitableForOffice', label: 'Ofis Kullanımına Uygun' },
                  { key: 'hasBusinessLicense', label: 'İş Yeri Ruhsatlı' }
                ], Object.fromEntries(Object.entries(property.propertyDetails).filter(([k, v]) => typeof v === 'boolean')))}
              </div>
            </div>
          </FormSection>

          {/* Emlak Danışmanı */}
          <FormSection title="Emlak Danışmanı">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Danışman Seçin *
                </label>
                <select
                  name="agent.name"
                  value={property.agent.name}
                  onChange={(e) => {
                    const selectedAgent = agents.find(agent => agent.name === e.target.value);
                    if (selectedAgent) {
                      setProperty(prev => ({
                        ...prev!,
                        agent: {
                          ...prev!.agent,
                          name: selectedAgent.name,
                          phone: selectedAgent.phone || "",
                          email: selectedAgent.email,
                          photo: selectedAgent.avatar || "",
                          company: "İrem World Emlak"
                        }
                      }));
                    } else {
                      setProperty(prev => ({
                        ...prev!,
                        agent: {
                          ...prev!.agent,
                          name: "",
                          phone: "",
                          email: "",
                          photo: ""
                        }
                      }));
                    }
                  }}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Danışman Seçin</option>
                  {agents.length > 0 ? (
                    agents.map(agent => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name} ({agent.role})
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>Kullanıcı bulunamadı</option>
                  )}
                </select>
              </div>

              {property.agent.name && (
                <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={property.agent.photo || "https://via.placeholder.com/40"}
                      alt={property.agent.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {property.agent.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {property.agent.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {property.agent.phone}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </FormSection>

          {/* Harici Linkler */}
          <FormSection title="Harici Linkler">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sahibinden.com İlan Linki
                </label>
                <input
                  type="url"
                  name="sahibindenLink"
                  value={property.sahibindenLink || ''}
                  onChange={handleInputChange}
                  placeholder="https://www.sahibinden.com/ilan/..."
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Bu emlağın Sahibinden.com'daki ilan linkini buraya ekleyebilirsiniz.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sanal Tur Linki
                </label>
                <input
                  type="url"
                  name="virtualTour"
                  value={property.virtualTour || ''}
                  onChange={handleInputChange}
                  placeholder="https://..."
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  360° sanal tur linkini buraya ekleyebilirsiniz.
                </p>
              </div>
            </div>
          </FormSection>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/iw-management/properties"
              className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {loading ? "Güncelleniyor..." : "Değişiklikleri Kaydet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
