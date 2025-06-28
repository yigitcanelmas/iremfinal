"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { RiDashboardLine, RiBuildingLine, RiTeamLine, RiSettings4Line, RiQuestionLine, RiUserStarLine } from "react-icons/ri";
import { IoChevronForward } from "react-icons/io5";
import { BiArrowBack } from "react-icons/bi";

const navigation = {
  main: [
    { 
      name: "Ana Sayfa", 
      href: "/iw-management", 
      icon: RiDashboardLine 
    },
    { 
      name: "İlanlar", 
      href: "/iw-management/properties", 
      icon: RiBuildingLine,
      subItems: [
        { name: "Tüm İlanlar", href: "/iw-management/properties" },
        { name: "İlan Ekle", href: "/iw-management/properties/add" },
        { name: "Kategoriler", href: "/iw-management/properties/categories" }
      ]
    },
    { 
      name: "Kullanıcılar", 
      href: "/iw-management/users", 
      icon: RiTeamLine,
      subItems: [
        { name: "Tüm Kullanıcılar", href: "/iw-management/users" },
        { name: "Roller", href: "/iw-management/users/roles" },
        { name: "İzinler", href: "/iw-management/users/permissions" }
      ]
    },
    {
      name: "Emlak Danışmanları",
      href: "/iw-management/agents",
      icon: RiUserStarLine
    }
  ],
  settings: [
    { name: "Ayarlar", href: "/iw-management/settings", icon: RiSettings4Line },
    { name: "Yardım", href: "/iw-management/help", icon: RiQuestionLine }
  ]
};

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(href + "/");
  };

  const isExpanded = (item: any) => {
    return item.subItems?.some((subItem: any) => isActive(subItem.href));
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-zinc-800 bg-black/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-800">
        <Link href="/iw-management" className="flex items-center space-x-3">
          <div 
            className="w-20 h-20 -my-6 bg-[url('https://dev01.iremworld.com/wp-content/uploads/2025/03/irem-e1741856017529.png')] bg-contain bg-no-repeat bg-center"
            role="img"
            aria-label="İrem World Logo"
          />
          <span className="text-lg font-semibold text-white">
            Admin Panel
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigation.main.map((item) => (
            <div key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <item.icon className="text-xl mr-3 w-5 h-5" />
                <span>{item.name}</span>
                {item.subItems && (
                  <IoChevronForward
                    className={`ml-auto h-5 w-5 transform transition-transform duration-200 ${
                      isExpanded(item) ? "rotate-90" : ""
                    }`}
                  />
                )}
              </Link>
              {/* Sub Items */}
              {item.subItems && isExpanded(item) && (
                <div className="mt-1 ml-4 space-y-1">
                  {item.subItems.map((subItem: any) => (
                    <Link
                      key={subItem.name}
                      href={subItem.href}
                      className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        isActive(subItem.href)
                          ? "bg-zinc-800 text-white"
                          : "text-zinc-500 hover:bg-zinc-800/50 hover:text-white"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Settings Navigation */}
        <div className="border-t border-zinc-800">
          <nav className="px-2 py-4 space-y-1">
            {navigation.settings.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                <item.icon className="text-xl mr-3 w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="px-4 py-4 border-t border-zinc-800">
            <div className="flex items-center space-x-3">
              {user?.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-8 w-8 rounded-full border border-zinc-700"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  {user?.email}
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:bg-zinc-800/50 hover:text-white transition-all duration-200"
                title="Siteye Dön"
              >
                <BiArrowBack className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
