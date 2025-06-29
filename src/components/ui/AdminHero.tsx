"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

interface AdminHeroProps {
  title?: string;
  subtitle?: string;
  actions?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    variant?: string;
    onClick?: () => void;
  }>;
  stats?: Array<{
    label: string;
    value: number | string;
  }>;
}

export default function AdminHero({ 
  title = "Yönetim Paneli",
  subtitle = "İrem World Admin Dashboard",
  actions = [],
  stats = [
    { label: "Toplam İlan", value: 156 },
    { label: "Aktif Kullanıcı", value: 42 },
    { label: "Bu Ay", value: 28 }
  ]
}: AdminHeroProps) {
  const { user } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden mt-20 lg:mt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/kurumsal-logo/iremworld-logo.png')] bg-cover bg-center opacity-5"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          {/* Left Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {title}
                </h1>
                <p className="text-slate-300 text-lg">
                  {subtitle}
                </p>
              </div>
            </div>
            
            {/* User Welcome */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 max-w-lg">
              <div className="flex items-center space-x-3">
                {user?.avatar && (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-white/30"
                  />
                )}
                <div>
                  <p className="text-white font-medium">
                    Hoş geldin, {user?.name}
                  </p>
                  <p className="text-slate-300 text-sm capitalize">
                    {user?.role} • {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="hidden lg:flex space-x-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${
                  index === 0 ? 'from-emerald-500 to-teal-600' :
                  index === 1 ? 'from-orange-500 to-red-600' :
                  'from-violet-500 to-purple-600'
                } rounded-2xl flex items-center justify-center mb-3 shadow-lg`}>
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-lg">{stat.value}</p>
                <p className="text-slate-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {actions.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {actions.map((action, index) => (
              action.onClick ? (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  {action.icon}
                  {action.label}
                </button>
              ) : (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  {action.icon}
                  {action.label}
                </Link>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
