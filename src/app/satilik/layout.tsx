import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satılık Emlak İlanları - Ev, Daire, Villa, Arsa | İrem World",
  description: "IREMWORLD REAL ESTATE MARKETING - Satılık ev, daire, villa, ofis, iş yeri ve arsa ilanları. Türkiye'nin en güvenilir satılık emlak platformu. INTERNATIONAL REAL ESTATE MARKETING ile yatırım fırsatları.",
  keywords: "satılık, satılık ev, satılık daire, satılık villa, satılık ofis, satılık iş yeri, satılık arsa, emlak satış, IREMWORLD, IREM, satılık gayrimenkul, gayrimenkul yatırımı, İstanbul satılık, Ankara satılık",
  openGraph: {
    title: "Satılık Emlak İlanları - Ev, Daire, Villa, Arsa | İrem World",
    description: "IREMWORLD REAL ESTATE MARKETING - Satılık ev, daire, villa, ofis, iş yeri ve arsa ilanları. Türkiye'nin en güvenilir satılık emlak platformu.",
    url: "https://iremworld.com/satilik",
    type: "website",
  },
  alternates: {
    canonical: "https://iremworld.com/satilik",
    languages: {
      "en-US": "https://iremworld.com/for-sale",
    },
  },
};

export default function SatilikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
