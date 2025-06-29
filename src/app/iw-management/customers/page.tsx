"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Customer, CustomerFilters, CustomerStats } from "@/types/customer";
import { 
  RiUserLine, 
  RiTeamLine, 
  RiEyeLine, 
  RiAddLine, 
  RiBarChartLine,
  RiSearchLine,
  RiFilterLine,
  RiCalendarLine,
  RiPhoneLine,
  RiMailLine,
  RiMapPinLine,
  RiPriceTag3Line,
  RiUserStarLine,
  RiArrowRightLine,
  RiDeleteBinLine,
  RiEditLine
} from "react-icons/ri";

export default function CustomersPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CustomerFilters>({});
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchCustomers();
      fetchStats();
    }
  }, [isAuthenticated, filters, pagination.page]);
  
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      queryParams.set('page', pagination.page.toString());
      queryParams.set('limit', pagination.limit.toString());
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          queryParams.set(key, value);
        }
      });
      
      const response = await fetch(`/api/customers?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/customers?type=stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching customer stats:', error);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/customers/${customerId}`, {
          method: 'DELETE',
          headers: {
            'x-user-id': user?.id || 'system',
            'x-user-name': user?.name || 'System User',
            'x-user-email': user?.email || 'system@example.com'
          }
        });

        if (response.ok) {
          setCustomers(customers.filter(c => c.id !== customerId));
          alert('Müşteri başarıyla silindi!');
          fetchStats(); // İstatistikleri güncelle
        } else {
          alert('Müşteri silinirken bir hata oluştu!');
        }
      } catch (error) {
        console.error('Error deleting customer:', error);
        alert('Müşteri silinirken bir hata oluştu!');
      }
    }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-b from-slate-900 to-slate-800 border-b border-slate-700/50 -mt-[4.5rem] pt-[4.5rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-100">
                Müşteri Yönetimi
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Müşteri ve potansiyel müşteri yönetimi
              </p>
            </div>
            <Link
              href="/iw-management/customers/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <RiAddLine className="w-5 h-5 mr-1.5" />
              Yeni Müşteri
            </Link>
          </div>
        </div>
        
        {/* Stats Cards */}
        {stats && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <RiTeamLine className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-slate-100">
                      {stats.totalCustomers}
                    </div>
                    <div className="text-sm text-slate-400">
                      Toplam Müşteri
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                      <RiUserLine className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-slate-100">
                      {stats.newLeads}
                    </div>
                    <div className="text-sm text-slate-400">
                      Yeni Potansiyel
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                      <RiUserStarLine className="w-5 h-5 text-amber-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-slate-100">
                      {stats.activeClients}
                    </div>
                    <div className="text-sm text-slate-400">
                      Aktif Müşteri
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                      <RiBarChartLine className="w-5 h-5 text-violet-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-2xl font-bold text-slate-100">
                      {((stats.activeClients / stats.totalCustomers) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-slate-400">
                      Dönüşüm Oranı
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 mb-6 border border-slate-700/50">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Müşteri ara..."
                className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            
            <select
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                customerType: e.target.value as Customer['customerType'] | undefined 
              }))}
            >
              <option value="">Tüm Tipler</option>
              <option value="lead">Potansiyel</option>
              <option value="prospect">Aday</option>
              <option value="active_client">Aktif Müşteri</option>
              <option value="past_client">Eski Müşteri</option>
            </select>
            
            <select
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                status: e.target.value as Customer['status'] | undefined 
              }))}
            >
              <option value="">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="inactive">Pasif</option>
              <option value="blacklisted">Kara Liste</option>
            </select>
            
            <select
              className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                priority: e.target.value as Customer['priority'] | undefined 
              }))}
            >
              <option value="">Tüm Öncelikler</option>
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
              <option value="urgent">Acil</option>
            </select>
          </div>
        </div>
        
        {/* Customer List */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="bg-slate-800/50">
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Müşteri
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    İletişim
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Tip / Durum
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Son İletişim
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Temsilci
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-slate-400 uppercase tracking-wider w-48">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-300">
                            {customer.firstName.charAt(0)}
                            {customer.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-slate-200">
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {customer.address?.city}, {customer.address?.district}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-200">
                        {customer.email}
                      </div>
                      <div className="text-xs text-slate-400">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.customerType === 'lead' ? 'bg-blue-500/20 text-blue-300' :
                        customer.customerType === 'prospect' ? 'bg-yellow-500/20 text-yellow-300' :
                        customer.customerType === 'active_client' ? 'bg-green-500/20 text-green-300' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {customer.customerType === 'lead' ? 'Potansiyel' :
                         customer.customerType === 'prospect' ? 'Aday' :
                         customer.customerType === 'active_client' ? 'Aktif' : 'Eski'}
                      </span>
                      <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        customer.status === 'active' ? 'bg-emerald-500/20 text-emerald-300' :
                        customer.status === 'inactive' ? 'bg-slate-500/20 text-slate-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {customer.status === 'active' ? 'Aktif' :
                         customer.status === 'inactive' ? 'Pasif' : 'Kara Liste'}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <div className="text-sm text-slate-200">
                        {customer.communicationSummary.lastContactDate ? 
                          new Date(customer.communicationSummary.lastContactDate).toLocaleDateString('tr-TR') :
                          'Henüz iletişim yok'
                        }
                      </div>
                      <div className="text-xs text-slate-400">
                        {customer.communicationSummary.totalInteractions} etkileşim
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {customer.assignedAgent ? (
                        <div>
                          <div className="text-sm text-slate-200">
                            {customer.assignedAgent.agentName}
                          </div>
                          <div className="text-xs text-slate-400">
                            {new Date(customer.assignedAgent.assignedDate).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">
                          Atanmamış
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/iw-management/customers/edit/${customer.id}`}
                          className="text-blue-400 hover:text-blue-300 inline-flex items-center px-2 py-1 rounded"
                        >
                          <RiEditLine className="w-4 h-4 mr-1" />
                          Düzenle
                        </Link>
                        <Link
                          href={`/iw-management/customers/${customer.id}`}
                          className="text-green-400 hover:text-green-300 inline-flex items-center px-2 py-1 rounded"
                        >
                          Detay
                          <RiArrowRightLine className="ml-1 w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-400 hover:text-red-300 inline-flex items-center px-2 py-1 rounded"
                        >
                          <RiDeleteBinLine className="w-4 h-4 mr-1" />
                          Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-3 py-3 bg-slate-800/50 border-t border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-400">
                  Toplam {pagination.total} müşteri
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Önceki
                  </button>
                  <span className="text-sm text-slate-400">
                    Sayfa {pagination.page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1 text-sm bg-slate-700 text-slate-200 rounded hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sonraki
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
