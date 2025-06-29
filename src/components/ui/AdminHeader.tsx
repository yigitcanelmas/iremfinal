"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { 
  RiBuildingLine, 
  RiTeamLine, 
  RiSettings4Line, 
  RiAddLine, 
  RiMenuLine, 
  RiCloseLine,
  RiLogoutBoxLine,
  RiHomeLine,
  RiDashboardLine
} from "react-icons/ri";

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/iw-management',
      icon: RiDashboardLine,
    },
    {
      name: 'İlanlar',
      href: '/iw-management/properties',
      icon: RiBuildingLine,
    },
    {
      name: 'Yeni İlan',
      href: '/iw-management/properties/add',
      icon: RiAddLine,
    },
    ...(user?.role === 'admin' ? [{
      name: 'Kullanıcılar',
      href: '/iw-management/users',
      icon: RiTeamLine,
    }] : []),
    {
      name: 'Ayarlar',
      href: '/iw-management/settings',
      icon: RiSettings4Line,
    },
  ];

  return (
    <header className="bg-black/95 backdrop-blur-xl border-b border-zinc-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/iw-management" className="flex items-center hover:scale-105 transition-transform group">
              <div 
                className="w-24 h-24 lg:w-28 lg:h-28 -mt-4 -mb-4 bg-[url('/images/kurumsal-logo/iremworld-logo.png')] bg-contain bg-no-repeat bg-center relative z-10"
                role="img"
                aria-label="İrem World Logo"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Ana Siteye Dön */}
            <button
              onClick={() => handleNavigation('/')}
              className="hidden sm:flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              <RiHomeLine className="w-4 h-4 mr-2" />
              Ana Site
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-zinc-700"
                />
              )}
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-white">
                  {user?.name}
                </div>
                <div className="text-xs text-zinc-400">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-3 py-2 text-sm font-medium text-zinc-400 hover:text-red-500 transition-colors"
            >
              <RiLogoutBoxLine className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Çıkış</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? (
                <RiCloseLine className="w-5 h-5" />
              ) : (
                <RiMenuLine className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavigation(item.href);
                    }}
                    className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-colors"
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
