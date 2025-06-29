"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Property } from "@/types/property";
import { UserActivity } from "@/types/activity";
import { 
  RiBuildingLine, 
  RiTeamLine, 
  RiEyeLine, 
  RiMoneyDollarCircleLine, 
  RiAddLine, 
  RiBarChartLine, 
  RiSettings4Line,
  RiSearchLine,
  RiNotificationLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCalendarLine,
  RiLineChartLine,
  RiUserAddLine
} from "react-icons/ri";
import saleData from "@/data/enhanced-sale.json";
import rentData from "@/data/rent.json";

export default function ManagementDashboard() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [saleProperties, setSaleProperties] = useState<Property[]>([]);
  const [rentProperties, setRentProperties] = useState<Property[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activityStats, setActivityStats] = useState<{
    totalActivities: number;
    todayActivities: number;
    weekActivities: number;
    monthActivities: number;
    topActions: { action: string; count: number }[];
    topUsers: { userId: string; userName: string; count: number }[];
  } | null>(null);
  const [stats, setStats] = useState({
    totalSale: 0,
    totalRent: 0,
    totalValue: 0,
    recentlyAdded: 0
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      setSaleProperties(saleData as Property[]);
      setRentProperties(rentData as Property[]);
      
      // Calculate stats
      const totalSale = saleData.length;
      const totalRent = rentData.length;
      const totalValue = saleData.reduce((sum, prop) => sum + prop.price, 0);
      const recentlyAdded = [...saleData, ...rentData].filter(prop => {
        const createdDate = new Date(prop.createdAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return createdDate > weekAgo;
      }).length;

      setStats({ totalSale, totalRent, totalValue, recentlyAdded });
      
      // Fetch activities
      fetchActivities();
    }
  }, [isAuthenticated]);

  const fetchActivities = async () => {
    try {
      // Fetch recent activities
      const activitiesResponse = await fetch('/api/activities?limit=10');
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData);
      } else {
        console.warn('Aktivite verileri yüklenemedi:', activitiesResponse.status);
        setActivities([]);
      }

      // Fetch activity stats
      const statsResponse = await fetch('/api/activities?type=stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setActivityStats(statsData);
      } else {
        console.warn('Aktivite istatistikleri yüklenemedi:', statsResponse.status);
        setActivityStats({
          totalActivities: 0,
          todayActivities: 0,
          weekActivities: 0,
          monthActivities: 0,
          topActions: [],
          topUsers: []
        });
      }
    } catch (error) {
      console.error('Aktivite verileri yüklenirken hata:', error);
      setActivities([]);
      setActivityStats({
        totalActivities: 0,
        todayActivities: 0,
        weekActivities: 0,
        monthActivities: 0,
        topActions: [],
        topUsers: []
      });
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
                Dashboard
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Hoş geldiniz, {user?.name}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors">
                <RiSearchLine className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors relative">
                <RiNotificationLine className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <RiBuildingLine className="w-5 h-5 text-blue-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-100">{stats.totalSale}</div>
                  <div className="text-sm text-slate-400">Satılık İlanlar</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <RiBuildingLine className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-100">{stats.totalRent}</div>
                  <div className="text-sm text-slate-400">Kiralık İlanlar</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <RiMoneyDollarCircleLine className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-100">
                    {stats.totalValue >= 1000000 
                      ? `${(stats.totalValue / 1000000).toFixed(1)}M ₺`
                      : stats.totalValue >= 1000
                      ? `${(stats.totalValue / 1000).toFixed(0)}K ₺`
                      : `${stats.totalValue.toLocaleString('tr-TR')} ₺`
                    }
                  </div>
                  <div className="text-sm text-slate-400">Toplam Değer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 border border-slate-700/50">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
                    <RiCalendarLine className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-slate-100">{stats.recentlyAdded}</div>
                  <div className="text-sm text-slate-400">Bu Hafta Eklenen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border border-slate-700/50 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <RiAddLine className="w-6 h-6 mr-2 text-zinc-400" />
            Hızlı İşlemler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            <Link
              href="/iw-management/properties/add"
              className="group flex items-center justify-center p-4 bg-slate-800/40 hover:bg-slate-700/40 rounded-2xl transition-all duration-200 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-xl"
            >
              <RiAddLine className="w-5 h-5 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-blue-400">Yeni İlan Ekle</span>
            </Link>
            
            <Link
              href="/iw-management/properties"
              className="group flex items-center justify-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 rounded-xl transition-all duration-200 border border-amber-200/50 dark:border-amber-700/50"
            >
              <RiBuildingLine className="w-5 h-5 mr-3 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-emerald-400">Tüm İlanlar</span>
            </Link>

            <Link
              href="/iw-management/customers/add"
              className="group flex items-center justify-center p-4 bg-slate-800/40 hover:bg-slate-700/40 rounded-2xl transition-all duration-200 backdrop-blur-xl border border-slate-700/50 shadow-lg hover:shadow-xl"
            >
              <RiUserAddLine className="w-5 h-5 mr-3 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-violet-400">Yeni Müşteri</span>
            </Link>

            <Link
              href="/iw-management/customers"
              className="group flex items-center justify-center p-4 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 hover:from-violet-100 hover:to-purple-100 dark:hover:from-violet-900/30 dark:hover:to-purple-900/30 rounded-xl transition-all duration-200 border border-violet-200/50 dark:border-violet-700/50"
            >
              <RiTeamLine className="w-5 h-5 mr-3 text-violet-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-violet-400">Müşteriler</span>
            </Link>
            
            {user?.role === 'admin' && (
              <Link
                href="/iw-management/users"
                className="group flex items-center justify-center p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 rounded-xl transition-all duration-200 border border-orange-200/50 dark:border-orange-700/50"
              >
                <RiTeamLine className="w-5 h-5 mr-3 text-orange-400 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-orange-400">Kullanıcılar</span>
              </Link>
            )}
            
            <Link
              href="/iw-management/settings"
              className="group flex items-center justify-center p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 rounded-xl transition-all duration-200 border border-amber-200/50 dark:border-amber-700/50"
            >
              <RiSettings4Line className="w-5 h-5 mr-3 text-amber-400 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-amber-400">Ayarlar</span>
            </Link>
          </div>
        </div>

        {/* Grid Layout for Properties and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Properties */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <RiBuildingLine className="w-6 h-6 mr-2 text-zinc-400" />
                  Son Eklenen İlanlar
                </h3>
                <Link
                  href="/iw-management/properties"
                  className="text-sm text-zinc-300 hover:text-white font-medium flex items-center"
                >
                  Tümünü Görüntüle <RiEyeLine className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-3">
                {[...saleProperties, ...rentProperties]
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .slice(0, 5)
                  .map((property) => (
                    <div key={property.id} className="p-4 bg-slate-700/20 rounded-xl hover:bg-slate-700/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-100 truncate">
                            {property.title}
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            {property.location.district}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 ml-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            property.type === 'sale' 
                              ? 'bg-emerald-500/20 text-emerald-300' 
                              : 'bg-blue-500/20 text-blue-300'
                          }`}>
                            {property.type === 'sale' ? 'Satılık' : 'Kiralık'}
                          </span>
                          <div className="text-sm font-medium text-slate-100">
                            {property.price >= 1000000 
                              ? `${(property.price / 1000000).toFixed(1)}M ₺`
                              : property.price >= 1000
                              ? `${(property.price / 1000).toFixed(0)}K ₺`
                              : `${property.price.toLocaleString('tr-TR')} ₺`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-black/40 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <RiBarChartLine className="w-6 h-6 mr-2 text-zinc-400" />
                  Son Aktiviteler
                </h3>
                <div className="flex items-center space-x-3">
                  {activityStats && (
                    <div className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50">
                      Bugün: {activityStats.todayActivities}
                    </div>
                  )}
                  <Link
                    href="/iw-management/activities"
                    className="text-sm text-zinc-300 hover:text-white font-medium flex items-center"
                  >
                    Tümünü Görüntüle <RiEyeLine className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-700/20 rounded-xl">
                      <div className={`flex-shrink-0 w-3 h-3 mt-1 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-100">
                          {activity.userName}
                        </div>
                      <div className="text-sm text-zinc-400">
                          {activity.description}
                        </div>
                      <div className="text-xs text-slate-500 mt-1">
                          {new Date(activity.timestamp).toLocaleString('tr-TR')}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.action === 'user_login' ? 'bg-blue-500/20 text-blue-300' :
                        activity.action === 'property_create' ? 'bg-emerald-500/20 text-emerald-300' :
                        activity.action === 'property_update' ? 'bg-amber-500/20 text-amber-300' :
                        activity.action === 'property_delete' ? 'bg-red-500/20 text-red-300' :
                        activity.action === 'user_create' ? 'bg-violet-500/20 text-violet-300' :
                        activity.action === 'user_delete' ? 'bg-red-500/20 text-red-300' :
                        'bg-slate-700/50 text-slate-300'
                        }`}>
                          {activity.action}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <RiBarChartLine className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-slate-400">
                      Henüz aktivite bulunmuyor
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        {activityStats && user?.role === 'admin' && (
          <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-lg border border-slate-700/50">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <RiBarChartLine className="w-6 h-6 mr-2 text-zinc-400" />
                Aktivite Grafiği
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <RiBarChartLine className="w-8 h-8 text-zinc-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {activityStats.totalActivities}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Toplam Aktivite
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <RiBarChartLine className="w-8 h-8 text-zinc-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {activityStats.todayActivities}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Bugün
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <RiBarChartLine className="w-8 h-8 text-zinc-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {activityStats.weekActivities}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Bu Hafta
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-800/50 p-4 rounded-xl border border-zinc-700">
                  <div className="flex items-center space-x-3">
                    <RiBarChartLine className="w-8 h-8 text-zinc-400" />
                    <div>
                      <div className="text-2xl font-bold text-white">
                        {activityStats.monthActivities}
                      </div>
                      <div className="text-sm text-zinc-400">
                        Bu Ay
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Actions */}
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <RiBarChartLine className="w-5 h-5 mr-2 text-zinc-400" />
                    En Çok Yapılan İşlemler
                  </h4>
                  <div className="space-y-3">
                    {activityStats.topActions && activityStats.topActions.length > 0 ? (
                      activityStats.topActions.map((action, index) => (
                        <div key={action.action} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-green-400' :
                              index === 1 ? 'bg-blue-400' :
                              index === 2 ? 'bg-yellow-400' : 'bg-purple-400'
                            }`}></div>
                            <span className="text-sm text-zinc-300">
                              {action.action}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-zinc-400">
                            {action.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-400">Henüz veri bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Top Users */}
                <div className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700">
                  <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                    <RiTeamLine className="w-5 h-5 mr-2 text-zinc-400" />
                    En Aktif Kullanıcılar
                  </h4>
                  <div className="space-y-3">
                    {activityStats.topUsers && activityStats.topUsers.length > 0 ? (
                      activityStats.topUsers.map((user, index) => (
                        <div key={user.userId} className="flex items-center justify-between p-2 bg-slate-800/50 rounded-lg border border-slate-600/50">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-green-400' :
                              index === 1 ? 'bg-blue-400' :
                              index === 2 ? 'bg-yellow-400' : 'bg-purple-400'
                            }`}></div>
                            <span className="text-sm text-zinc-300">
                              {user.userName}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-zinc-400">
                            {user.count}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-slate-400">Henüz veri bulunmuyor</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}