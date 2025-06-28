"use client";

import Link from "next/link";

export default function AdminNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary text-white flex items-center justify-between px-6 py-3 shadow-md z-[100]">
      <div className="text-lg font-bold">Admin Paneli</div>
      <div>
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-primary px-4 py-2 rounded-md font-medium hover:bg-gray-100"
        >
          Siteyi Görüntüle
        </Link>
      </div>
    </nav>
  );
}
