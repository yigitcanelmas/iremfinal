"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import FloatingInput from "@/components/ui/FloatingInput";
import { RiUser3Line, RiShieldKeyholeLine, RiPaletteLine, RiSettings4Line } from "react-icons/ri";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || ""
  });
  const [siteSettings, setSiteSettings] = useState({
    siteName: "IremWorld",
    siteDescription: "Emlak ve Gayrimenkul Yönetim Sistemi",
    headerLogo: "/logo.png",
    footerLogo: "/logo.png",
    primaryColor: "#FF6B35",
    secondaryColor: "#2E294E",
    footerText: "© 2025 IremWorld. Tüm hakları saklıdır.",
    socialLinks: {
      facebook: "https://facebook.com/iremworld",
      twitter: "https://twitter.com/iremworld",
      instagram: "https://instagram.com/iremworld",
      linkedin: "https://linkedin.com/company/iremworld"
    }
  });

  // Site ayarlarını yükle ve profil verilerini güncelle
  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSiteSettings();
    }
    // Kullanıcı bilgileri değiştiğinde profil verilerini güncelle
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || ""
    });
  }, [user]);

  const fetchSiteSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const settings = await response.json();
        setSiteSettings(settings);
      }
    } catch (error) {
      console.error('Site ayarları yüklenirken hata:', error);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Yeni şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Yeni şifre en az 6 karakter olmalıdır");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Şifre başarıyla değiştirildi");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(data.error || "Şifre değiştirilemedi");
      }
    } catch (error) {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSiteSettingsChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteSettings),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Site ayarları başarıyla güncellendi");
      } else {
        setError(data.error || "Site ayarları güncellenemedi");
      }
    } catch (error) {
      setError("Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Profil", icon: RiUser3Line },
    { id: "security", name: "Güvenlik", icon: RiShieldKeyholeLine },
    { id: "appearance", name: "Görünüm", icon: RiPaletteLine },
    ...(user?.role === "admin" ? [{ id: "site", name: "Site", icon: RiSettings4Line }] : [])
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Ayarlar
          </h1>
          <p className="mt-2 text-zinc-400">
            Sistem ayarlarını ve kullanıcı tercihlerini yönetin
          </p>
        </div>
        {/* Modern Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-zinc-800/60 p-1 rounded-2xl backdrop-blur-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-zinc-700 text-blue-400 shadow-lg transform scale-105"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700/50"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-zinc-800/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-zinc-700/50 overflow-hidden">
          <div className="p-8">
            {/* Success/Error Messages */}
            {message && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-800 text-green-300 rounded-2xl flex items-center space-x-3">
                <span className="text-xl">✅</span>
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-800 text-red-300 rounded-2xl flex items-center space-x-3">
                <span className="text-xl">❌</span>
                <span>{error}</span>
              </div>
            )}

            {/* Profil Ayarları */}
            {activeTab === "profile" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Profil Ayarları
                  </h3>
                  <p className="text-zinc-400">
                    Kişisel bilgilerinizi güncelleyin
                  </p>
                </div>

                <div className="flex flex-col items-center space-y-6">
                  {/* Profile Picture */}
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                      <img
                        className="w-full h-full object-cover"
                        src={user?.avatar || "https://via.placeholder.com/128"}
                        alt={user?.name}
                      />
                    </div>
                    <button className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Form Fields */}
                  <div className="w-full max-w-md space-y-6">
                    <FloatingInput
                      label="Ad Soyad"
                      name="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      required
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">E-posta</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        className="w-full p-4 bg-zinc-700/50 border border-zinc-600 rounded-2xl text-white opacity-60 cursor-not-allowed"
                        disabled
                        readOnly
                      />
                      <p className="text-xs text-zinc-500 mt-1">E-posta adresi değiştirilemez</p>
                    </div>

                    <FloatingInput
                      label="Telefon Numarası"
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      placeholder="05XX XXX XX XX"
                    />

                    <button
                      type="button"
                      onClick={async () => {
                        setLoading(true);
                        setError("");
                        setMessage("");

                        try {
                          const response = await fetch('/api/users/profile', {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                              userId: user?.id,
                              ...profileData
                            }),
                          });

                          const data = await response.json();

                          if (response.ok) {
                            setMessage("Profil başarıyla güncellendi");
                          } else {
                            setError(data.error || "Profil güncellenemedi");
                          }
                        } catch (error) {
                          setError("Bir hata oluştu");
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Güncelleniyor...</span>
                        </div>
                      ) : (
                        "Değişiklikleri Kaydet"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Güvenlik */}
            {activeTab === "security" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Güvenlik Ayarları
                  </h3>
                  <p className="text-zinc-400">
                    Hesabınızın güvenliğini sağlayın
                  </p>
                </div>

                <form onSubmit={handlePasswordChange} className="max-w-md mx-auto space-y-6">
                  <FloatingInput
                    label="Mevcut Şifre"
                    type="password"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />

                  <FloatingInput
                    label="Yeni Şifre"
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />

                  <FloatingInput
                    label="Yeni Şifre (Tekrar)"
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Güncelleniyor...</span>
                      </div>
                    ) : (
                      "Şifreyi Değiştir"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Görünüm */}
            {activeTab === "appearance" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Görünüm Ayarları
                  </h3>
                  <p className="text-zinc-400">
                    Arayüz tercihlerinizi özelleştirin
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-8">
                  {/* Theme Selection */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tema Seçimi</h4>
                    <div className="space-y-3">
                      {[
                        { value: "light", label: "Açık Tema", icon: "☀️" },
                        { value: "dark", label: "Koyu Tema", icon: "🌙" },
                        { value: "system", label: "Sistem Teması", icon: "💻" }
                      ].map((theme) => (
                        <label key={theme.value} className="flex items-center p-4 bg-zinc-700/50 rounded-2xl cursor-pointer hover:bg-zinc-700 transition-all duration-300">
                          <input
                            type="radio"
                            name="theme"
                            value={theme.value}
                            defaultChecked={theme.value === "system"}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{theme.icon}</span>
                            <span className="font-medium text-white">{theme.label}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Font Boyutu</h4>
                    <select className="w-full p-4 bg-zinc-700 border border-zinc-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white">
                      <option value="sm">Küçük</option>
                      <option value="md" selected>Orta</option>
                      <option value="lg">Büyük</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Değişiklikleri Kaydet
                  </button>
                </div>
              </div>
            )}

            {/* Site Ayarları */}
            {activeTab === "site" && user?.role === "admin" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Site Ayarları
                  </h3>
                  <p className="text-zinc-400">
                    Web sitesi genel ayarlarını yönetin
                  </p>
                </div>

                <form onSubmit={handleSiteSettingsChange} className="max-w-2xl mx-auto space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Site Adı"
                      name="siteName"
                      value={siteSettings.siteName}
                      onChange={(e) => setSiteSettings({...siteSettings, siteName: e.target.value})}
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Ana Renk</label>
                      <input
                        type="color"
                        value={siteSettings.primaryColor}
                        onChange={(e) => setSiteSettings({...siteSettings, primaryColor: e.target.value})}
                        className="w-full h-12 rounded-2xl border border-zinc-600"
                      />
                    </div>
                  </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Site Açıklaması</label>
                      <textarea
                        value={siteSettings.siteDescription}
                        onChange={(e) => setSiteSettings({...siteSettings, siteDescription: e.target.value})}
                        rows={3}
                        className="w-full p-4 bg-zinc-700 border border-zinc-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-white"
                      />
                    </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FloatingInput
                      label="Facebook URL"
                      name="facebook"
                      value={siteSettings.socialLinks.facebook}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        socialLinks: {...siteSettings.socialLinks, facebook: e.target.value}
                      })}
                    />

                    <FloatingInput
                      label="Instagram URL"
                      name="instagram"
                      value={siteSettings.socialLinks.instagram}
                      onChange={(e) => setSiteSettings({
                        ...siteSettings,
                        socialLinks: {...siteSettings.socialLinks, instagram: e.target.value}
                      })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Kaydediliyor...</span>
                      </div>
                    ) : (
                      "Değişiklikleri Kaydet"
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
