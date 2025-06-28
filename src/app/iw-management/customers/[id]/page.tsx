"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Customer, CustomerInteraction } from "@/types/customer";
import { 
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiCalendarLine,
  RiTeamLine,
  RiPriceTag3Line,
  RiBuilding2Line,
  RiChat1Line,
  RiFileTextLine,
  RiAddLine,
  RiArrowLeftLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiCloseLine,
  RiAlertLine,
  RiTimeLine,
  RiStarLine
} from "react-icons/ri";

interface Props {
  params: {
    id: string;
  };
}

export default function CustomerDetailsPage({ params }: Props) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [interactions, setInteractions] = useState<CustomerInteraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [interactionStats, setInteractionStats] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomer();
      fetchInteractions();
    }
  }, [isAuthenticated, params.id]);
  
  const fetchCustomer = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
    }
  };
  
  const fetchInteractions = async () => {
    try {
      const [interactionsResponse, statsResponse] = await Promise.all([
        fetch(`/api/customers/${params.id}/interactions`),
        fetch(`/api/customers/${params.id}/interactions?type=stats`)
      ]);
      
      if (interactionsResponse.ok) {
        const data = await interactionsResponse.json();
        setInteractions(data.interactions);
      }
      
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setInteractionStats(data);
      }
    } catch (error) {
      console.error('Error fetching interactions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/customers/${params.id}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': user?.id || '',
          'x-user-name': user?.name || '',
          'x-user-email': user?.email || ''
        }
      });
      
      if (response.ok) {
        router.push('/iw-management/customers');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
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
      {/* Hero Section */}
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
                  {customer.firstName} {customer.lastName}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Müşteri Detayları
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/iw-management/customers/edit/${customer.id}`}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RiEditLine className="w-5 h-5 mr-1.5" />
                Düzenle
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <RiDeleteBinLine className="w-5 h-5 mr-1.5" />
                Sil
              </button>
            </div>
          </div>
        </div>
        
        {/* Customer Status */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    customer.customerType === 'lead' ? 'bg-blue-500/10' :
                    customer.customerType === 'prospect' ? 'bg-yellow-500/10' :
                    customer.customerType === 'active_client' ? 'bg-green-500/10' :
                    'bg-slate-500/10'
                  }`}>
                    <RiUserLine className={`w-5 h-5 ${
                      customer.customerType === 'lead' ? 'text-blue-400' :
                      customer.customerType === 'prospect' ? 'text-yellow-400' :
                      customer.customerType === 'active_client' ? 'text-green-400' :
                      'text-slate-400'
                    }`} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-slate-400">Müşteri Tipi</div>
                  <div className="text-lg font-semibold text-slate-100">
                    {customer.customerType === 'lead' ? 'Potansiyel' :
                     customer.customerType === 'prospect' ? 'Aday' :
                     customer.customerType === 'active_client' ? 'Aktif' : 'Eski'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    customer.status === 'active' ? 'bg-emerald-500/10' :
                    customer.status === 'inactive' ? 'bg-slate-500/10' :
                    'bg-red-500/10'
                  }`}>
                    <RiCheckLine className={`w-5 h-5 ${
                      customer.status === 'active' ? 'text-emerald-400' :
                      customer.status === 'inactive' ? 'text-slate-400' :
                      'text-red-400'
                    }`} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-slate-400">Durum</div>
                  <div className="text-lg font-semibold text-slate-100">
                    {customer.status === 'active' ? 'Aktif' :
                     customer.status === 'inactive' ? 'Pasif' : 'Kara Liste'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    customer.priority === 'urgent' ? 'bg-red-500/10' :
                    customer.priority === 'high' ? 'bg-orange-500/10' :
                    customer.priority === 'medium' ? 'bg-yellow-500/10' :
                    'bg-blue-500/10'
                  }`}>
                    <RiStarLine className={`w-5 h-5 ${
                      customer.priority === 'urgent' ? 'text-red-400' :
                      customer.priority === 'high' ? 'text-orange-400' :
                      customer.priority === 'medium' ? 'text-yellow-400' :
                      'text-blue-400'
                    }`} />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-slate-400">Öncelik</div>
                  <div className="text-lg font-semibold text-slate-100">
                    {customer.priority === 'urgent' ? 'Acil' :
                     customer.priority === 'high' ? 'Yüksek' :
                     customer.priority === 'medium' ? 'Orta' : 'Düşük'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                    <RiTeamLine className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-sm text-slate-400">Temsilci</div>
                  <div className="text-lg font-semibold text-slate-100">
                    {customer.assignedAgent?.agentName || 'Atanmamış'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100">
                  Temel Bilgiler
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-400">Ad Soyad</div>
                    <div className="text-slate-200 mt-1">
                      {customer.firstName} {customer.lastName}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">E-posta</div>
                    <div className="text-slate-200 mt-1">
                      {customer.email}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Telefon</div>
                    <div className="text-slate-200 mt-1">
                      {customer.phone}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Alternatif Telefon</div>
                    <div className="text-slate-200 mt-1">
                      {customer.alternativePhone || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Kaynak</div>
                    <div className="text-slate-200 mt-1">
                      {customer.leadSource === 'website' ? 'Web Sitesi' :
                       customer.leadSource === 'referral' ? 'Referans' :
                       customer.leadSource === 'social_media' ? 'Sosyal Medya' :
                       customer.leadSource === 'advertisement' ? 'Reklam' :
                       customer.leadSource === 'walk_in' ? 'Direkt Başvuru' :
                       customer.leadSource === 'phone_call' ? 'Telefon' : 'Diğer'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Kayıt Tarihi</div>
                    <div className="text-slate-200 mt-1">
                      {new Date(customer.createdAt).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Address */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100">
                  Adres Bilgileri
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-400">Şehir</div>
                    <div className="text-slate-200 mt-1">
                      {customer.address?.city || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">İlçe</div>
                    <div className="text-slate-200 mt-1">
                      {customer.address?.district || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-400">Adres</div>
                    <div className="text-slate-200 mt-1">
                      {customer.address?.street || '-'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Property Preferences */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-slate-100">
                  Emlak Tercihleri
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-slate-400">İşlem Tipi</div>
                    <div className="text-slate-200 mt-1">
                      {customer.propertyPreferences?.type === 'sale' ? 'Satılık' :
                       customer.propertyPreferences?.type === 'rent' ? 'Kiralık' : 'Her İkisi'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Bütçe Aralığı</div>
                    <div className="text-slate-200 mt-1">
                      {customer.propertyPreferences?.budgetMin ? 
                        `${customer.propertyPreferences.budgetMin.toLocaleString('tr-TR')} ₺ - 
                         ${customer.propertyPreferences.budgetMax?.toLocaleString('tr-TR')} ₺` : 
                        '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Oda Sayısı</div>
                    <div className="text-slate-200 mt-1">
                      {customer.propertyPreferences?.roomRequirement || '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400">Büyüklük</div>
                    <div className="text-slate-200 mt-1">
                      {customer.propertyPreferences?.sizeMin ? 
                        `${customer.propertyPreferences.sizeMin} - 
                         ${customer.propertyPreferences.sizeMax} m²` : 
                        '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-400">Emlak Kategorileri</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customer.propertyPreferences?.categories && customer.propertyPreferences.categories.length > 0 ? (
                        customer.propertyPreferences.categories.map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full"
                          >
                            {category.main}{category.sub ? ` - ${category.sub}` : ''}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-200">-</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-400">Tercih Edilen Bölgeler</div>
                    <div className="text-slate-200 mt-1">
                      {customer.propertyPreferences?.preferredLocations?.map(loc => 
                        `${loc.district}, ${loc.city}`
                      ).join(' | ') || '-'}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-slate-400">Özellikler</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customer.propertyPreferences?.features?.map(feature => (
                        <span
                          key={feature}
                          className="px-2 py-1 text-xs font-medium bg-slate-700/50 text-slate-300 rounded-full"
                        >
                          {feature === 'hasElevator' ? 'Asansör' :
                           feature === 'hasCarPark' ? 'Otopark' :
                           feature === 'hasPool' ? 'Havuz' :
                           feature === 'hasGym' ? 'Spor Salonu' :
                           feature === 'hasSecurity' ? 'Güvenlik' :
                           feature === 'hasBalcony' ? 'Balkon' :
                           feature === 'hasTerrace' ? 'Teras' :
                           feature === 'hasGarden' ? 'Bahçe' :
                           feature === 'hasSeaView' ? 'Deniz Manzarası' :
                           feature === 'hasCityView' ? 'Şehir Manzarası' : feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interested Properties */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">
                  İlgilenilen Emlaklar
                </h3>
                <Link
                  href={`/iw-management/customers/${customer.id}/properties`}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="divide-y divide-slate-700/50">
                {customer.interestedProperties?.slice(0, 3).map(property => (
                  <div key={property.propertyId} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/iw-management/properties/${property.propertyId}`}
                          className="text-slate-200 hover:text-slate-100"
                        >
                          {property.propertyTitle}
                        </Link>
                        <div className="text-sm text-slate-400 mt-1">
                          {new Date(property.addedDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.interestLevel === 'high' ? 'bg-green-500/20 text-green-300' :
                          property.interestLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-blue-500/20 text-blue-300'
                        }`}>
                          {property.interestLevel === 'high' ? 'Yüksek' :
                           property.interestLevel === 'medium' ? 'Orta' : 'Düşük'}
                        </span>
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          property.status === 'interested' ? 'bg-blue-500/20 text-blue-300' :
                          property.status === 'viewed' ? 'bg-yellow-500/20 text-yellow-300' :
                          property.status === 'offered' ? 'bg-orange-500/20 text-orange-300' :
                          property.status === 'purchased' ? 'bg-green-500/20 text-green-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {property.status === 'interested' ? 'İlgileniyor' :
                           property.status === 'viewed' ? 'Görüntüledi' :
                           property.status === 'offered' ? 'Teklif Verdi' :
                           property.status === 'purchased' ? 'Satın Aldı' : 'Vazgeçti'}
                        </span>
                      </div>
                    </div>
                    {property.notes && (
                      <div className="mt-2 text-sm text-slate-400">
                        {property.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Interactions */}
          <div className="space-y-8">
            {/* Interaction Stats */}
            {interactionStats && (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
                <div className="px-6 py-4 border-b border-slate-700/50">
                  <h3 className="text-lg font-semibold text-slate-100">
                    Etkileşim Özeti
                  </h3>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-100">
                        {interactionStats.totalInteractions}
                      </div>
                      <div className="text-sm text-slate-400">
                        Toplam Etkileşim
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-slate-100">
                        {Math.round(interactionStats.averageDuration)} dk
                      </div>
                      <div className="text-sm text-slate-400">
                        Ortalama Süre
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">
                      Etkileşim Tipleri
                    </div>
                    <div className="space-y-2">
                      {Object.entries(interactionStats.byType).map(([type, count]: [string, any]) => (
                        <div key={type} className="flex items-center">
                          <div className="flex-1 text-sm text-slate-400">
                            {type === 'phone_call_incoming' ? 'Gelen Arama' :
                             type === 'phone_call_outgoing' ? 'Giden Arama' :
                             type === 'email_sent' ? 'Gönderilen E-posta' :
                             type === 'email_received' ? 'Alınan E-posta' :
                             type === 'meeting_office' ? 'Ofis Görüşmesi' :
                             type === 'meeting_property' ? 'Emlak Görüşmesi' :
                             type === 'whatsapp_message' ? 'WhatsApp' :
                             type === 'sms_sent' ? 'SMS' :
                             type === 'site_visit' ? 'Emlak Ziyareti' :
                             type === 'contract_signing' ? 'Sözleşme İmzalama' :
                             type === 'follow_up_call' ? 'Takip Araması' :
                             type === 'complaint' ? 'Şikayet' :
                             type === 'feedback' ? 'Geri Bildirim' : type}
                          </div>
                          <div className="text-sm font-medium text-slate-300">
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-slate-300 mb-2">
                      Sonuçlar
                    </div>
                    <div className="space-y-2">
                      {Object.entries(interactionStats.byOutcome).map(([outcome, count]: [string, any]) => (
                        <div key={outcome} className="flex items-center">
                          <div className="flex-1 text-sm text-slate-400">
                            {outcome === 'successful' ? 'Başarılı' :
                             outcome === 'no_answer' ? 'Cevap Yok' :
                             outcome === 'busy' ? 'Meşgul' :
                             outcome === 'callback_requested' ? 'Geri Arama İsteği' :
                             outcome === 'meeting_scheduled' ? 'Görüşme Planlandı' :
                             outcome === 'property_visit_scheduled' ? 'Emlak Ziyareti Planlandı' :
                             outcome === 'offer_made' ? 'Teklif Verildi' :
                             outcome === 'offer_accepted' ? 'Teklif Kabul Edildi' :
                             outcome === 'offer_rejected' ? 'Teklif Reddedildi' :
                             outcome === 'contract_signed' ? 'Sözleşme İmzalandı' :
                             outcome === 'deal_closed' ? 'Anlaşma Tamamlandı' :
                             outcome === 'lost_opportunity' ? 'Kayıp Fırsat' :
                             outcome === 'follow_up_needed' ? 'Takip Gerekli' : outcome}
                          </div>
                          <div className="text-sm font-medium text-slate-300">
                            {count}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recent Interactions */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg border border-slate-700/50">
              <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-100">
                  Son Etkileşimler
                </h3>
                <Link
                  href={`/iw-management/customers/${customer.id}/interactions`}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Tümünü Gör
                </Link>
              </div>
              <div className="divide-y divide-slate-700/50">
                {interactions.slice(0, 5).map(interaction => (
                  <div key={interaction.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-slate-200">
                          {interaction.subject}
                        </div>
                        <div className="text-sm text-slate-400 mt-1">
                          {new Date(interaction.interactionDate).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        interaction.outcome === 'successful' ? 'bg-green-500/20 text-green-300' :
                        interaction.outcome === 'follow_up_needed' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {interaction.outcome === 'successful' ? 'Başarılı' :
                         interaction.outcome === 'follow_up_needed' ? 'Takip Gerekli' : 'Başarısız'}
                      </span>
                    </div>
                    {interaction.description && (
                      <div className="mt-2 text-sm text-slate-400">
                        {interaction.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 mx-auto mb-4">
              <RiAlertLine className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-100 text-center mb-2">
              Müşteriyi Sil
            </h3>
            <p className="text-slate-400 text-center mb-6">
              Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-300"
              >
                İptal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
