"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import AdminHeader from "@/components/ui/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push('/login');
        return;
      }

      // Check if user has admin permissions
      if (!['admin', 'super_admin'].includes(user.role)) {
        router.push('/');
        return;
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated || !user || !['admin', 'super_admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <AdminHeader />
      
      {/* Main Content */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
