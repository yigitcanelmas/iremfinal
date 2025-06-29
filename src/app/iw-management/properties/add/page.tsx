"use client";

import { useState, useEffect, Suspense } from "react";
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
  FurnishingStatus,
  ZoningStatus,
  CreditEligibility
} from "@/types/property";
import AdminHero from "@/components/ui/AdminHero";
import FormSection from "@/components/ui/FormSection";
import ImageUpload from "@/components/ui/ImageUpload";
import LocationSelector from "@/components/ui/LocationSelector";

export default function AddPropertyPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    type: "sale" as const,
    category: {
      main: "Konut" as PropertyMainCategory,
      sub: "Daire"
    },
    title: "",
    description: "",
    price: "",
    location: {
      country: "TR",
      state: null as string | null,
      city: "",
      district: undefined as string | undefined,
      neighborhood: "",
      address: ""
    },
    specs: {
      netSize: "",
      grossSize: "",
      rooms: "3+1" as RoomType,
      bathrooms: "",
      age: "",
      floor: "",
      totalFloors: "",
      heating: "Kombi Doğalgaz" as HeatingType,
      furnishing: "Unfurnished" as FurnishingStatus,
      balconyCount: ""
    },
    interiorFeatures: {
      kitchenType: "Açık" as const,
      hasBuiltInKitchen: false,
      hasBuiltInWardrobe: false,
      hasLaminate: false,
      hasParquet: false,
      hasCeramic: false,
      hasMarble: false,
      hasWallpaper: false,
      hasPaintedWalls: false,
      hasSpotLighting: false,
      hasHiltonBathroom: false,
      hasJacuzzi: false,
      hasShowerCabin: false,
      hasAmericanDoor: false,
      hasSteelDoor: false,
      hasIntercom: false
    },
    exteriorFeatures: {
      hasBalcony: false,
      hasTerrace: false,
      hasGarden: false,
      hasGardenUse: false,
      hasSeaView: false,
      hasCityView: false,
      hasNatureView: false,
      hasPoolView: false,
      facade: "Güney" as const
    },
    buildingFeatures: {
      hasElevator: false,
      hasCarPark: false,
      hasClosedCarPark: false,
      hasOpenCarPark: false,
      hasSecurity: false,
      has24HourSecurity: false,
      hasCameraSystem: false,
      hasConcierge: false,
      hasPool: false,
      hasGym: false,
      hasSauna: false,
      hasTurkishBath: false,
      hasPlayground: false,
      hasBasketballCourt: false,
      hasTennisCourt: false,
      hasGenerator: false,
      hasFireEscape: false,
      hasFireDetector: false,
      hasWaterBooster: false,
      hasSatelliteSystem: false,
      hasWifi: false
    },
    propertyDetails: {
      usageStatus: "Boş" as UsageStatus,
      deedStatus: "Kat Mülkiyeti" as DeedStatus,
      fromWho: "Emlak Ofisinden" as FromWho,
      isSettlement: false,
      creditEligible: false,
      exchangeAvailable: false,
      inSite: false,
      monthlyFee: "",
      hasDebt: false,
      debtAmount: "",
      isRentGuaranteed: false,
      rentGuaranteeAmount: "",
      isNewBuilding: false,
      isSuitableForOffice: false,
      hasBusinessLicense: false
    },
    landDetails: {
      zoningStatus: "Tarla" as ZoningStatus,
      pricePerSquareMeter: "",
      blockNumber: "",
      parcelNumber: "",
      sheetNumber: "",
      floorAreaRatio: "",
      buildingHeight: "",
      creditEligibility: "Bilinmiyor" as CreditEligibility
    },
    images: [] as string[],
    virtualTour: "",
    status: "active" as const,
    agent: {
      id: "",
      name: "",
      phone: "",
      email: "",
      photo: "",
      company: "İrem World Emlak",
      isOwner: false
    },
    sahibindenLink: ""
  });

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
          // Filter only active users (all roles)
          const filteredAgents = data.filter((user: User) => 
            user.isActive
          );
          console.log('Filtered agents:', filteredAgents);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child]: type === 'number' ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value
      }));
    }
  };

  const handleCheckboxChange = (section: string, name: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as any),
        [name]: checked
      }
    }));
  };

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const generateId = () => {
    const prefix = formData.type === "sale" ? "S" : "R";
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}${timestamp}`;
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Temel bilgiler kontrolü
    if (!formData.title.trim()) {
      errors.push("Başlık gereklidir");
    }
    if (!formData.description.trim()) {
      errors.push("Açıklama gereklidir");
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errors.push("Geçerli bir fiyat giriniz");
    }

    // Konum kontrolü
    if (!formData.location.city.trim()) {
      errors.push("Şehir seçimi gereklidir");
    }

    // Emlak özellikleri kontrolü
    if (!formData.specs.netSize || Number(formData.specs.netSize) <= 0) {
      errors.push("Alan gereklidir ve 0'dan büyük olmalıdır");
    }

    // Arsa kategorisi için özel validasyon
    if (formData.category.main === "Arsa") {
      // Arsa için m² fiyatı kontrolü
      if (!formData.landDetails.pricePerSquareMeter || Number(formData.landDetails.pricePerSquareMeter) <= 0) {
        errors.push("m² fiyatı gereklidir ve 0'dan büyük olmalıdır");
      }
    } else {
      // Diğer kategoriler için standart validasyon
      if (!formData.specs.bathrooms || Number(formData.specs.bathrooms) <= 0) {
        errors.push("Banyo sayısı gereklidir ve 0'dan büyük olmalıdır");
      }
      if (formData.specs.age === "" || Number(formData.specs.age) < 0) {
        errors.push("Bina yaşı gereklidir ve 0 veya pozitif olmalıdır");
      }
    }

    // Emlak danışmanı kontrolü
    if (!formData.agent.id) {
      errors.push("Emlak danışmanı seçimi gereklidir");
    }
    if (!formData.agent.name.trim()) {
      errors.push("Danışman adı gereklidir");
    }
    if (!formData.agent.phone.trim()) {
      errors.push("Danışman telefonu gereklidir");
    }
    if (!formData.agent.email.trim()) {
      errors.push("Danışman e-postası gereklidir");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Form validasyonu
      const validationErrors = validateForm();
      if (validationErrors.length > 0) {
        alert("Lütfen aşağıdaki hataları düzeltin:\n\n" + validationErrors.join("\n"));
        setLoading(false);
        return;
      }

      // Sayısal değerleri kontrol et ve dönüştür
      const netSize = Number(formData.specs.netSize);
      const grossSize = formData.specs.grossSize ? Number(formData.specs.grossSize) : undefined;
      const bathrooms = Number(formData.specs.bathrooms);
      const age = Number(formData.specs.age);
      const floor = formData.specs.floor ? Number(formData.specs.floor) : undefined;
      const totalFloors = formData.specs.totalFloors ? Number(formData.specs.totalFloors) : undefined;
      const balconyCount = formData.specs.balconyCount ? Number(formData.specs.balconyCount) : undefined;
      const price = Number(formData.price);

      // NaN kontrolü
      if (isNaN(netSize) || isNaN(bathrooms) || isNaN(age) || isNaN(price)) {
        alert("Lütfen sayısal alanları doğru formatta giriniz");
        setLoading(false);
        return;
      }

      const newProperty: Property = {
        id: generateId(),
        type: formData.type,
        category: formData.category,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: price,
        location: {
          ...formData.location,
          city: formData.location.city.trim(),
          district: formData.location.district?.trim(),
          neighborhood: formData.location.neighborhood?.trim(),
          address: formData.location.address?.trim()
        },
        specs: {
          ...formData.specs,
          netSize: netSize,
          grossSize: grossSize,
          bathrooms: bathrooms,
          age: age,
          floor: floor,
          totalFloors: totalFloors,
          balconyCount: balconyCount
        },
        interiorFeatures: formData.interiorFeatures,
        exteriorFeatures: formData.exteriorFeatures,
        buildingFeatures: formData.buildingFeatures,
        propertyDetails: {
          ...formData.propertyDetails,
          monthlyFee: formData.propertyDetails.monthlyFee ? Number(formData.propertyDetails.monthlyFee) : undefined,
          debtAmount: formData.propertyDetails.debtAmount ? Number(formData.propertyDetails.debtAmount) : undefined,
          rentGuaranteeAmount: formData.propertyDetails.rentGuaranteeAmount ? Number(formData.propertyDetails.rentGuaranteeAmount) : undefined
        },
        landDetails: formData.category.main === "Arsa" ? {
          ...formData.landDetails,
          pricePerSquareMeter: formData.landDetails.pricePerSquareMeter ? Number(formData.landDetails.pricePerSquareMeter) : undefined
        } : undefined,
        images: formData.images,
        virtualTour: formData.virtualTour || undefined,
        status: formData.status,
        createdAt: new Date().toISOString(),
        agent: {
          ...formData.agent,
          name: formData.agent.name.trim(),
          phone: formData.agent.phone.trim(),
          email: formData.agent.email.trim(),
          company: formData.agent.company || "İrem World Emlak"
        },
        sahibindenLink: formData.sahibindenLink || undefined
      };

      console.log("Gönderilecek veri:", newProperty);
      console.log("Resim URL'leri:", newProperty.images);

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProperty),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Hatası:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: Emlak eklenirken bir hata oluştu`);
      }

      const result = await response.json();
      console.log("Başarılı sonuç:", result);
      
      alert("Emlak başarıyla eklendi!");
      router.push("/iw-management/properties");
      
    } catch (error) {
      console.error("Emlak eklenirken hata:", error);
      
      let errorMessage = "Emlak eklenirken bir hata oluştu!";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-400 mx-auto"></div>
          <p className="mt-4 text-zinc-400">Yükleniyor...</p>
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
        title="Yeni Emlak Ekle"
        subtitle="Portföyünüze yeni bir emlak ilanı ekleyin"
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
                    value={formData.type}
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
                    value={formData.category.main}
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
                    value={formData.category.sub}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    {formData.category.main === "Konut" && (
                      <>
                        <option value="Daire">Daire</option>
                        <option value="Rezidans">Rezidans</option>
                        <option value="Villa">Villa</option>
                        <option value="Müstakil Ev">Müstakil Ev</option>
                        <option value="Dubleks">Dubleks</option>
                        <option value="Tripleks">Tripleks</option>
                      </>
                    )}
                    {formData.category.main === "İş Yeri" && (
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
                        <option value="Çiftlik">Çiftlik</option>
                      </>
                    )}
                    {formData.category.main === "Arsa" && (
                      <>
                        <option value="Arsa">Arsa</option>
                        <option value="İmarlı Arsa">İmarlı Arsa</option>
                        <option value="Tarla">Tarla</option>
                        <option value="Bağ-Bahçe">Bağ-Bahçe</option>
                      </>
                    )}
                    {formData.category.main === "Bina" && (
                      <>
                        <option value="Apartman">Apartman</option>
                        <option value="İş Hanı">İş Hanı</option>
                        <option value="Plaza">Plaza</option>
                      </>
                    )}
                    {formData.category.main === "Turistik Tesis" && (
                      <>
                        <option value="Otel">Otel</option>
                        <option value="Apart Otel">Apart Otel</option>
                        <option value="Tatil Köyü">Tatil Köyü</option>
                      </>
                    )}
                    {formData.category.main === "Devremülk" && (
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
                  value={formData.price}
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
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Emlak açıklamasını buraya yazın..."
                  rows={6}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-vertical"
                  required
                />
              </div>
            </div>
          </FormSection>

          {/* Konum Bilgileri */}
          <FormSection title="Konum Bilgileri">
            <LocationSelector
              onChange={(location) => {
                setFormData(prev => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    ...location
                  }
                }));
              }}
              initialValues={formData.location}
            />
          </FormSection>

          {/* Resimler */}
          <FormSection title="Resimler">
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={10}
            />
          </FormSection>

          {/* Emlak Özellikleri */}
          <FormSection title="Emlak Özellikleri">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {formData.category.main === "Arsa" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Alan (m²)
                    </label>
                    <input
                      type="number"
                      name="specs.netSize"
                      value={formData.specs.netSize}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      m² Fiyatı
                    </label>
                    <input
                      type="number"
                      name="landDetails.pricePerSquareMeter"
                      value={formData.landDetails.pricePerSquareMeter}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      İmar Durumu
                    </label>
                    <select
                      name="landDetails.zoningStatus"
                      value={formData.landDetails.zoningStatus}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Ada">Ada</option>
                      <option value="A-Lejantlı">A-Lejantlı</option>
                      <option value="Arazi">Arazi</option>
                      <option value="Bağ & Bahçe">Bağ & Bahçe</option>
                      <option value="Depo & Antrepo">Depo & Antrepo</option>
                      <option value="Eğitim">Eğitim</option>
                      <option value="Enerji Depolama">Enerji Depolama</option>
                      <option value="Konut">Konut</option>
                      <option value="Kültürel Tesis">Kültürel Tesis</option>
                      <option value="Muhtelif">Muhtelif</option>
                      <option value="Özel Kullanım">Özel Kullanım</option>
                      <option value="Sağlık">Sağlık</option>
                      <option value="Sanayi">Sanayi</option>
                      <option value="Sera">Sera</option>
                      <option value="Sit Alanı">Sit Alanı</option>
                      <option value="Spor Alanı">Spor Alanı</option>
                      <option value="Tarla">Tarla</option>
                      <option value="Tarla + Bağ">Tarla + Bağ</option>
                      <option value="Ticari">Ticari</option>
                      <option value="Ticari + Konut">Ticari + Konut</option>
                      <option value="Toplu Konut">Toplu Konut</option>
                      <option value="Turizm">Turizm</option>
                      <option value="Turizm + Konut">Turizm + Konut</option>
                      <option value="Turizm + Ticari">Turizm + Ticari</option>
                      <option value="Villa">Villa</option>
                      <option value="Zeytinlik">Zeytinlik</option>
                      <option value="İmarlı">İmarlı</option>
                      <option value="Ticari İmarlı">Ticari İmarlı</option>
                      <option value="Konut İmarlı">Konut İmarlı</option>
                      <option value="Sanayi İmarlı">Sanayi İmarlı</option>
                      <option value="Turizm İmarlı">Turizm İmarlı</option>
                      <option value="Belirtilmemiş">Belirtilmemiş</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ada No
                    </label>
                    <input
                      type="text"
                      name="landDetails.blockNumber"
                      value={formData.landDetails.blockNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Parsel No
                    </label>
                    <input
                      type="text"
                      name="landDetails.parcelNumber"
                      value={formData.landDetails.parcelNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pafta No
                    </label>
                    <input
                      type="text"
                      name="landDetails.sheetNumber"
                      value={formData.landDetails.sheetNumber}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kaks (Emsal)
                    </label>
                    <input
                      type="text"
                      name="landDetails.floorAreaRatio"
                      value={formData.landDetails.floorAreaRatio}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Gabari
                    </label>
                    <input
                      type="text"
                      name="landDetails.buildingHeight"
                      value={formData.landDetails.buildingHeight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Krediye Uygunluk
                    </label>
                    <select
                      name="landDetails.creditEligibility"
                      value={formData.landDetails.creditEligibility}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="Uygun">Uygun</option>
                      <option value="Uygun Değil">Uygun Değil</option>
                      <option value="Bilinmiyor">Bilinmiyor</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Net Alan (m²)
                    </label>
                    <input
                      type="number"
                      name="specs.netSize"
                      value={formData.specs.netSize}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Oda Sayısı
                    </label>
                    <select
                      name="specs.rooms"
                      value={formData.specs.rooms}
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
                      value={formData.specs.bathrooms}
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
                      value={formData.specs.heating}
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
                      value={formData.specs.furnishing}
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
                      value={formData.specs.age}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </>
              )}
            </div>
          </FormSection>

          {/* Arsa Detayları - sadece Arsa kategorisi seçili ise gösterilir */}
          {formData.category.main === "Arsa" && (
            <FormSection title="Arsa Detayları">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tapu Durumu
                  </label>
                  <select
                    name="propertyDetails.deedStatus"
                    value={formData.propertyDetails.deedStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Kat Mülkiyeti">Kat Mülkiyeti</option>
                    <option value="Kat İrtifakı">Kat İrtifakı</option>
                    <option value="Arsa Tapulu">Arsa Tapulu</option>
                    <option value="Hisseli Tapu">Hisseli Tapu</option>
                    <option value="Müstakil Tapulu">Müstakil Tapulu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kimden
                  </label>
                  <select
                    name="propertyDetails.fromWho"
                    value={formData.propertyDetails.fromWho}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
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
                    Takas
                  </label>
                  <select
                    name="propertyDetails.exchangeAvailable"
                    value={formData.propertyDetails.exchangeAvailable ? "Evet" : "Hayır"}
                    onChange={(e) => {
                      const value = e.target.value === "Evet";
                      setFormData(prev => ({
                        ...prev,
                        propertyDetails: {
                          ...prev.propertyDetails,
                          exchangeAvailable: value
                        }
                      }));
                    }}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Hayır">Hayır</option>
                    <option value="Evet">Evet</option>
                  </select>
                </div>
              </div>
            </FormSection>
          )}

          {/* İç Özellikler, Dış Özellikler ve Bina Özellikleri sadece Arsa kategorisi seçili değilse gösterilir */}
          {formData.category.main !== "Arsa" && (
            <>
              {/* İç Özellikler */}
              <FormSection title="İç Özellikler">
                <div className="bg-white dark:bg-gray-700 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <label htmlFor="kitchenType" className="block mb-1">Mutfak Tipi</label>
                  <select
                    id="kitchenType"
                    name="interiorFeatures.kitchenType"
                    value={formData.interiorFeatures.kitchenType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Açık">Açık</option>
                    <option value="Kapalı">Kapalı</option>
                    <option value="Amerikan">Amerikan</option>
                  </select>
                </div>

                <div className="mt-6">
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
                    ], Object.fromEntries(Object.entries(formData.interiorFeatures).filter(([k, v]) => typeof v === 'boolean')))}
                  </div>
                </div>
              </FormSection>

              {/* Dış Özellikler */}
              <FormSection title="Dış Özellikler">
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
                  ], Object.fromEntries(Object.entries(formData.exteriorFeatures).filter(([k, v]) => typeof v === 'boolean')))}
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
                  ], formData.buildingFeatures)}
                </div>
              </FormSection>
            </>
          )}

          {/* Emlak Danışmanı */}
          <FormSection title="Emlak Danışmanı">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Danışman Seçin *
                </label>
                <select
                  name="agent.id"
                  value={formData.agent.id}
                  onChange={(e) => {
                    const selectedAgent = agents.find(agent => agent.id === e.target.value);
                    if (selectedAgent) {
                      setFormData(prev => ({
                        ...prev,
                        agent: {
                          ...prev.agent,
                          id: selectedAgent.id,
                          name: selectedAgent.name,
                          phone: selectedAgent.phone || "",
                          email: selectedAgent.email,
                          photo: selectedAgent.avatar || ""
                        }
                      }));
                    } else {
                      // Boş seçim durumunda agent bilgilerini temizle
                      setFormData(prev => ({
                        ...prev,
                        agent: {
                          ...prev.agent,
                          id: "",
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

              {formData.agent.id && (
                <div className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex-shrink-0">
                    <img
                      src={formData.agent.photo || "https://via.placeholder.com/40"}
                      alt={formData.agent.name}
                      className="h-10 w-10 rounded-full"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formData.agent.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.agent.email}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.agent.phone}
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
                  value={formData.sahibindenLink}
                  onChange={handleInputChange}
                  placeholder="https://www.sahibinden.com/ilan/..."
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Bu emlağın Sahibinden.com'daki ilan linkini buraya ekleyebilirsiniz.
                </p>
              </div>
            </div>
          </FormSection>

          {/* Arsa Detayları - Sadece Arsa kategorisi için göster */}
          {formData.category.main === "Arsa" && (
            <FormSection title="Arsa Detayları">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    İmar Durumu
                  </label>
                  <select
                    name="landDetails.zoningStatus"
                    value={formData.landDetails.zoningStatus}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="Ada">Ada</option>
                    <option value="A-Lejantlı">A-Lejantlı</option>
                    <option value="Arazi">Arazi</option>
                    <option value="Bağ & Bahçe">Bağ & Bahçe</option>
                    <option value="Depo & Antrepo">Depo & Antrepo</option>
                    <option value="Eğitim">Eğitim</option>
                    <option value="Enerji Depolama">Enerji Depolama</option>
                    <option value="Konut">Konut</option>
                    <option value="Kültürel Tesis">Kültürel Tesis</option>
                    <option value="Muhtelif">Muhtelif</option>
                    <option value="Özel Kullanım">Özel Kullanım</option>
                    <option value="Sağlık">Sağlık</option>
                    <option value="Sanayi">Sanayi</option>
                    <option value="Sera">Sera</option>
                    <option value="Sit Alanı">Sit Alanı</option>
                    <option value="Spor Alanı">Spor Alanı</option>
                    <option value="Tarla">Tarla</option>
                    <option value="Tarla + Bağ">Tarla + Bağ</option>
                    <option value="Ticari">Ticari</option>
                    <option value="Ticari + Konut">Ticari + Konut</option>
                    <option value="Toplu Konut">Toplu Konut</option>
                    <option value="Turizm">Turizm</option>
                    <option value="Turizm + Konut">Turizm + Konut</option>
                    <option value="Turizm + Ticari">Turizm + Ticari</option>
                    <option value="Villa">Villa</option>
                    <option value="Zeytinlik">Zeytinlik</option>
                    <option value="İmarlı">İmarlı</option>
                    <option value="Ticari İmarlı">Ticari İmarlı</option>
                    <option value="Konut İmarlı">Konut İmarlı</option>
                    <option value="Sanayi İmarlı">Sanayi İmarlı</option>
                    <option value="Turizm İmarlı">Turizm İmarlı</option>
                    <option value="Belirtilmemiş">Belirtilmemiş</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    m² Fiyatı (₺)
                  </label>
                  <input
                    type="number"
                    name="landDetails.pricePerSquareMeter"
                    value={formData.landDetails.pricePerSquareMeter}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Ada No
                  </label>
                  <input
                    type="text"
                    name="landDetails.blockNumber"
                    value={formData.landDetails.blockNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Parsel No
                  </label>
                  <input
                    type="text"
                    name="landDetails.parcelNumber"
                    value={formData.landDetails.parcelNumber}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pafta No
                  </label>
                  <input
                    type="text"
                    name="landDetails.sheetNumber"
                    value={formData.landDetails.sheetNumber}
                    onChange={handleInputChange}
                    placeholder="Belirtilmemiş"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kaks (Emsal)
                  </label>
                  <input
                    type="text"
                    name="landDetails.floorAreaRatio"
                    value={formData.landDetails.floorAreaRatio}
                    onChange={handleInputChange}
                    placeholder="Belirtilmemiş"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gabari
                  </label>
                  <input
                    type="text"
                    name="landDetails.buildingHeight"
                    value={formData.landDetails.buildingHeight}
                    onChange={handleInputChange}
                    placeholder="Belirtilmemiş"
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Krediye Uygunluk
                  </label>
                  <select
                    name="landDetails.creditEligibility"
                    value={formData.landDetails.creditEligibility}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="Bilinmiyor">Bilinmiyor</option>
                    <option value="Uygun">Uygun</option>
                    <option value="Uygun Değil">Uygun Değil</option>
                  </select>
                </div>
              </div>
            </FormSection>
          )}

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
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? "Ekleniyor..." : "Emlak Ekle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
