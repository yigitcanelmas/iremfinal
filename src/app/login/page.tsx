"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated && !authLoading) {
      router.push('/iw-management');
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-orange-900">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, don't render login form
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(credentials);
      if (success) {
        // Force navigation to dashboard
        window.location.href = '/iw-management';
      } else {
        setError('Geçersiz email veya şifre');
      }
    } catch (error) {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Sol Taraf - Emlak Resmi */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Video Arka Plan */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute w-full h-full object-cover pointer-events-none"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="https://res.cloudinary.com/iremworld/video/upload/v1751217806/iremworldbgvideo_tbzmzr.webm" type="video/webm" />
          </video>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/40 via-orange-800/30 to-orange-600/25"></div>
        </div>
        
        {/* Wallpaper Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M20 20h8v8h-8zM36 20h8v8h-8zM52 20h8v8h-8zM20 36h8v8h-8zM36 36h8v8h-8zM52 36h8v8h-8zM20 52h8v8h-8zM36 52h8v8h-8zM52 52h8v8h-8z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '40px 40px'
          }}></div>
          
          {/* Emlak İkonları Pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M60 20L40 35v25h40V35L60 20zm-15 30v-10h10v10H45zm20 0v-10h10v10H65z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
            backgroundPosition: '40px 40px'
          }}></div>
          
          {/* Anahtar İkonları */}
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.06'%3E%3Cpath d='M30 40c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10zm15 5l15 15-3 3-3-3-3 3-3-3 3-3-6-6v-6z'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px',
            backgroundPosition: '20px 20px'
          }}></div>
        </div>
        
        {/* İçerik */}
        <div className="relative z-10 flex flex-col justify-center items-start pl-20 pr-12 py-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Emlak Dünyasına
              <span className="block text-orange-300">Hoş Geldiniz</span>
            </h1>
            <p className="text-xl mb-8 text-orange-100 leading-relaxed">
              İremWorld ile profesyonel emlak yönetimi artık çok daha kolay. 
              Portföyünüzü yönetin, müşterilerinizi takip edin.
            </p>
            
            {/* Özellikler */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-orange-100">Kolay Portföy Yönetimi</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-orange-100">Müşteri Takip Sistemi</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-orange-100">Detaylı Raporlama</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animasyonlu Şekiller */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-32 w-20 h-20 bg-orange-300/30 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-orange-500/25 rounded-full animate-ping"></div>
        
      </div>


      {/* Sağ Taraf - Giriş Modalı */}
      <div className="w-full lg:w-[46%] flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 via-white to-orange-50 relative rounded-l-[4rem] shadow-[0_0_80px_0_rgba(0,0,0,0.25)] lg:-ml-20">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/">
            <div 
              className="login-logo"
              role="img"
              aria-label="İrem World Logo"
            />
          </Link>
        </div>

        <div className="w-full max-w-md">
          {/* Başlık */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yapın</h2>
            <p className="text-gray-600">Hesabınıza erişim sağlayın</p>
          </div>

          {/* Giriş Formu */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-orange-100">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Adresi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={credentials.email}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/30 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 transition-all duration-200"
                    placeholder="ornek@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-white/30 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent bg-white/70 backdrop-blur-sm text-gray-900 transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={credentials.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                    Beni Hatırla
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                    Şifremi Unuttum
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg className="h-5 w-5 text-orange-300 group-hover:text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    )}
                  </span>
                  {isLoading ? 'Giriş yapılıyor...' : 'Güvenli Giriş'}
                </button>
              </div>
            </form>

            {/* Alt Bilgi */}
            <div className="mt-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Güvenli Bağlantı</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-center space-x-6 text-xs text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  SSL Korumalı
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Şifreli
                </div>
              </div>
            </div>
          </div>

          {/* Ana Sayfaya Dön */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
