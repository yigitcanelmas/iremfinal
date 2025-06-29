import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Satılık Emlak İlanları | İrem World",
  description: "IREMWORLD REAL ESTATE MARKETING - Satılık daire, villa, ofis, iş yeri ve arsa ilanları. En güvenilir satılık emlak seçenekleri ve yatırım fırsatları.",
  keywords: "satılık, satılık daire, satılık villa, satılık ofis, satılık iş yeri, satılık arsa, emlak satış, IREMWORLD, IREM, satılık gayrimenkul, gayrimenkul yatırımı",
  openGraph: {
    title: "Satılık Emlak İlanları | İrem World",
    description: "IREMWORLD REAL ESTATE MARKETING - Satılık daire, villa, ofis, iş yeri ve arsa ilanları. En güvenilir satılık emlak seçenekleri ve yatırım fırsatları.",
    url: "https://iremworld.com/for-sale",
    type: "website",
  },
  alternates: {
    canonical: "https://iremworld.com/for-sale",
    languages: {
      "tr-TR": "https://iremworld.com/satilik",
    },
  },
};

export default function ForSaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
