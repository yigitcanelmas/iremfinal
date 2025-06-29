"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { UserActivity } from "@/types/activity";
import { RiBarChartLine, RiTeamLine, RiEyeLine } from "react-icons/ri";

export default function ActivitiesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [activityStats, setActivityStats] = useState<{
    totalActivities: number;
    todayActivities: number;
    weekActivities: number;
    monthActivities: number;
    topActions: { action: string; count: number }[];
    topUsers: { userId: string; userName: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchActivities();
    }
  }, [isAuthenticated]);

  const fetchActivities = async () => {
    try {
      // Fetch all activities (no limit)
      const activitiesResponse = await fetch('/api/activities');
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-zinc-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-zinc-800 to-zinc-900/50 p-8 -mt-[4.5rem] pt-[5rem] border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-white mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Sistem Aktiviteleri
            </h1>
            <p className="text-xl opacity-90">
              Tüm kullanıcı ve sistem aktivitelerini görüntüleyin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-800/40 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50">
              <div className="text-white">
                <div className="text-3xl font-bold mb-1">{activityStats?.totalActivities || 0}</div>
                <div className="text-sm opacity-80">Toplam Aktivite</div>
              </div>
            </div>
            
            <div className="bg-zinc-800/40 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50">
              <div className="text-white">
                <div className="text-3xl font-bold mb-1">{activityStats?.todayActivities || 0}</div>
                <div className="text-sm opacity-80">Bugün</div>
              </div>
            </div>
            
            <div className="bg-zinc-800/40 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50">
              <div className="text-white">
                <div className="text-3xl font-bold mb-1">{activityStats?.weekActivities || 0}</div>
                <div className="text-sm opacity-80">Bu Hafta</div>
              </div>
            </div>
            
            <div className="bg-zinc-800/40 backdrop-blur-lg rounded-2xl p-6 border border-zinc-700/50">
              <div className="text-white">
                <div className="text-3xl font-bold mb-1">{activityStats?.monthActivities || 0}</div>
                <div className="text-sm opacity-80">Bu Ay</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* All Activities */}
          <div className="lg:col-span-2 bg-zinc-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-zinc-700/50">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <RiBarChartLine className="w-6 h-6 mr-2 text-zinc-400" />
                Tüm Aktiviteler
              </h3>
              
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-4 bg-zinc-700/30 rounded-xl">
                    <div className={`flex-shrink-0 w-3 h-3 mt-1 rounded-full ${
                      activity.status === 'success' ? 'bg-green-400' :
                      activity.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white">
                        {activity.userName}
                      </div>
                      <div className="text-sm text-zinc-400">
                        {activity.description}
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString('tr-TR')}
                      </div>
                      {activity.ipAddress && (
                        <div className="text-xs text-zinc-500">
                          IP: {activity.ipAddress}
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        activity.action === 'user_login' ? 'bg-blue-600/80 text-white border border-blue-500/50 backdrop-blur-xl' :
                        activity.action === 'property_create' ? 'bg-green-600/80 text-white border border-green-500/50 backdrop-blur-xl' :
                        activity.action === 'property_update' ? 'bg-yellow-600/80 text-white border border-yellow-500/50 backdrop-blur-xl' :
                        activity.action === 'property_delete' ? 'bg-red-600/80 text-white border border-red-500/50 backdrop-blur-xl' :
                        activity.action === 'user_create' ? 'bg-purple-600/80 text-white border border-purple-500/50 backdrop-blur-xl' :
                        activity.action === 'user_delete' ? 'bg-red-600/80 text-white border border-red-500/50 backdrop-blur-xl' :
                        'bg-zinc-600/80 text-white border border-zinc-500/50 backdrop-blur-xl'
                      }`}>
                        {activity.action}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Top Actions */}
            <div className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-zinc-700/50">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <RiBarChartLine className="w-5 h-5 mr-2 text-zinc-400" />
                En Çok Yapılan İşlemler
              </h4>
              <div className="space-y-3">
                {activityStats?.topActions.map((action, index) => (
                  <div key={action.action} className="flex items-center justify-between p-3 bg-zinc-700/30 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-zinc-400' :
                        index === 1 ? 'bg-zinc-500' :
                        index === 2 ? 'bg-zinc-600' : 'bg-zinc-700'
                      }`}></div>
                      <span className="text-sm text-white">
                        {action.action}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-zinc-400">
                      {action.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="bg-zinc-800/40 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-zinc-700/50">
              <h4 className="text-lg font-medium text-white mb-4 flex items-center">
                <RiTeamLine className="w-5 h-5 mr-2 text-zinc-400" />
                En Aktif Kullanıcılar
              </h4>
              <div className="space-y-3">
                {activityStats?.topUsers.map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-3 bg-zinc-700/30 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-zinc-400' :
                        index === 1 ? 'bg-zinc-500' :
                        index === 2 ? 'bg-zinc-600' : 'bg-zinc-700'
                      }`}></div>
                      <span className="text-sm text-white">
                        {user.userName}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-zinc-400">
                      {user.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
