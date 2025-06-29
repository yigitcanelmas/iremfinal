import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiralık Emlak İlanları - Daire, Villa, Ofis | İrem World",
  description: "IREMWORLD REAL ESTATE MARKETING - Kiralık daire, villa, ofis, iş yeri ve arsa ilanları. Türkiye'nin en güvenilir kiralık emlak platformu. INTERNATIONAL REAL ESTATE MARKETING.",
  keywords: "kiralık, kiralık daire, kiralık villa, kiralık ofis, kiralık iş yeri, kiralık arsa, emlak kiralama, IREMWORLD, IREM, kiralık gayrimenkul, İstanbul kiralık, Ankara kiralık",
  openGraph: {
    title: "Kiralık Emlak İlanları - Daire, Villa, Ofis | İrem World",
    description: "IREMWORLD REAL ESTATE MARKETING - Kiralık daire, villa, ofis, iş yeri ve arsa ilanları. Türkiye'nin en güvenilir kiralık emlak platformu.",
    url: "https://iremworld.com/kiralik",
    type: "website",
  },
  alternates: {
    canonical: "https://iremworld.com/kiralik",
    languages: {
      "en-US": "https://iremworld.com/for-rent",
    },
  },
};

export default function KiralikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
