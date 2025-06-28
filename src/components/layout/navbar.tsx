"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const menuItems = {
  ilanlar: {
    name: "İlanlar",
    items: [
      { name: "Kiralık İlanlar", href: "/for-rent" },
      { name: "Satılık İlanlar", href: "/for-sale" },
    ]
  },
  hizmetler: {
    name: "Hizmetler",
    items: [
      { name: "Emlak Pazarlaması", href: "/real-estate-marketing" },
      { name: "Yatırım Fırsatları", href: "/investment-opportunities" },
    ]
  },
  isOrtaklari: {
    name: "İş Ortaklarımız",
    items: [
      { name: "Emlak Ofisleri ve Projeler", href: "/real-estate-partners" },
      { name: "Teknoloji Danışmanlarımız", href: "/technology-partners" },
      { name: "Mühendislik Danışmanlarımız", href: "/engineering-partners" },
      { name: "Hukuk İşleri Danışmanlarımız", href: "/law-partners" },
    ]
  },
  haberler: {
    name: "Haberler",
    items: [
      { name: "Bizden Haberler", href: "/news-from-us" },
      { name: "Ortaklarımızdan Haberler", href: "/news-from-partners" },
    ]
  }
};

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/iw-management');
  const isPropertyDetailPage = pathname.startsWith('/property/') || pathname.startsWith('/kiralik/') || pathname.startsWith('/satilik/');

  const handleNavigation = (href: string) => {
    window.location.href = href;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isAdminPage
          ? "bg-slate-900/95 backdrop-blur-md shadow-soft"
          : isPropertyDetailPage
          ? "bg-slate-900/95 backdrop-blur-md shadow-soft"
          : isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className={`flex items-center justify-between ${
          isPropertyDetailPage 
            ? "h-12 lg:h-14" 
            : "h-14 lg:h-16"
        }`}>
          {/* Logo */}
          <Link 
            href="/" 
            className="relative flex items-center hover-lift group"
          >
            <div 
              className="w-48 h-48 lg:w-52 lg:h-52 bg-[url('/images/kurumsal-logo/iremworld-logo.png')] bg-contain bg-no-repeat bg-center relative z-10"
              role="img"
              aria-label="İrem World Logo"
            />
          </Link>

          {/* Rest of the navbar code remains unchanged */}
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNavigation("/")}
              className={`
                relative px-4 py-2 text-sm font-medium transition-colors duration-300
                ${isActive("/")
                  ? "text-primary-500"
                  : `${isAdminPage ? "text-white" : isPropertyDetailPage ? "text-white" : !isScrolled ? "text-white" : "text-gray-700"} hover:text-primary-500`
                }
              `}
            >
              Ana Sayfa
            </button>

            {/* Dropdown Menus */}
            {Object.entries(menuItems).map(([key, menu]) => (
              <div
                key={key}
                className="relative group"
              >
                <div className="flex items-center px-4 py-6 -my-4">
                  <button
                    className={`
                      relative text-sm font-medium transition-colors duration-300 flex items-center
                      ${isAdminPage ? "text-white" : isPropertyDetailPage ? "text-white" : !isScrolled ? "text-white" : "text-gray-700"} 
                      group-hover:text-primary-500
                    `}
                  >
                    {menu.name}
                    <svg
                      className={`ml-1 w-4 h-4 transition-transform group-hover:rotate-180`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {/* Dropdown Content */}
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-lg py-2 border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                  {menu.items.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item.href)}
                      className={`
                        block w-full text-left px-4 py-2 text-sm transition-colors duration-300
                        ${isActive(item.href)
                          ? "text-primary-500 bg-primary-50"
                          : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
                        }
                      `}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={() => handleNavigation("/contact-us")}
              className={`
                relative px-4 py-2 text-sm font-medium transition-colors duration-300
                ${isActive("/contact-us")
                  ? "text-primary-500"
                  : `${isAdminPage ? "text-white" : isPropertyDetailPage ? "text-white" : !isScrolled ? "text-white" : "text-gray-700"} hover:text-primary-500`
                }
              `}
            >
              İletişim
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-900/10 transition-colors"
                >
                  {user?.avatar && (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className={`text-sm font-medium ${isAdminPage ? "text-white" : isPropertyDetailPage ? "text-white" : !isScrolled ? "text-white" : "text-gray-700"}`}>
                    {user?.name}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''} ${isAdminPage ? "text-white" : isPropertyDetailPage ? "text-white" : !isScrolled ? "text-white" : "text-gray-700"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavigation("/iw-management");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-500"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Yönetim Paneli
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => handleNavigation("/login")} className="btn btn-primary text-sm hover-lift">
                İlan Ekle
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative w-10 h-10 flex items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center w-6 h-6">
              <span
                className={`block w-6 h-0.5 transition-all duration-300 ${
                  isAdminPage ? "bg-white" : isPropertyDetailPage ? "bg-white" : !isScrolled ? "bg-white" : "bg-gray-900"
                } ${isMobileMenuOpen ? "rotate-45 translate-y-1" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isAdminPage ? "bg-white" : isPropertyDetailPage ? "bg-white" : !isScrolled ? "bg-white" : "bg-gray-900"
                } ${isMobileMenuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-6 h-0.5 mt-1 transition-all duration-300 ${
                  isAdminPage ? "bg-white" : isPropertyDetailPage ? "bg-white" : !isScrolled ? "bg-white" : "bg-gray-900"
                } ${isMobileMenuOpen ? "-rotate-45 -translate-y-1" : ""}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`
            lg:hidden fixed inset-x-0 ${
              isPropertyDetailPage ? "top-12" : "top-14"
            } bg-white/95 backdrop-blur-md
            transition-all duration-300 transform
            ${isMobileMenuOpen ? "translate-y-0" : "-translate-y-full"}
          `}
        >
          <div className="container py-6 space-y-6">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavigation("/");
                }}
                className={`
                  w-full text-left px-4 py-2 text-base font-medium transition-colors duration-300
                  ${isActive("/")
                    ? "text-primary-500 bg-primary-50"
                    : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
                  }
                  rounded-xl
                `}
              >
                Ana Sayfa
              </button>

              {/* Mobile Dropdown Sections */}
              {Object.entries(menuItems).map(([key, menu]) => (
                <div key={key} className="space-y-2">
                  <div className="px-4 py-2 text-sm font-semibold text-gray-400">
                    {menu.name}
                  </div>
                  <div className="pl-4 space-y-2">
                    {menu.items.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleNavigation(item.href);
                        }}
                        className={`
                          block w-full text-left px-4 py-2 text-base transition-colors duration-300
                          ${isActive(item.href)
                            ? "text-primary-500 bg-primary-50"
                            : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
                          }
                          rounded-xl
                        `}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleNavigation("/contact-us");
                }}
                className={`
                  w-full text-left px-4 py-2 text-base font-medium transition-colors duration-300
                  ${isActive("/contact-us")
                    ? "text-primary-500 bg-primary-50"
                    : "text-gray-700 hover:text-primary-500 hover:bg-gray-50"
                  }
                  rounded-xl
                `}
              >
                İletişim
              </button>
            </div>

            <div className="flex flex-col space-y-4 px-4">
              
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {user?.avatar && (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleNavigation("/iw-management");
                    }}
                    className="btn btn-ghost text-base w-full justify-start"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Yönetim Paneli
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="btn btn-ghost text-base w-full justify-start text-red-600"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleNavigation("/login");
                  }}
                  className="btn btn-primary text-base w-full"
                >
                  İlan Ekle
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
