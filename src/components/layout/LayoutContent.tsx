"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isAdminPage = pathname?.startsWith("/iw-management");

  // Login sayfasında header ve footer'ı tamamen gizle
  if (isLoginPage || isAdminPage) {
    return <div className="w-full h-full">{children}</div>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
