import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kiralık Emlak İlanları | İrem World",
  description: "IREMWORLD REAL ESTATE MARKETING - Kiralık daire, villa, ofis, iş yeri ve arsa ilanları. En güvenilir kiralık emlak seçenekleri ve profesyonel danışmanlık hizmeti.",
  keywords: "kiralık, kiralık daire, kiralık villa, kiralık ofis, kiralık iş yeri, kiralık arsa, emlak kiralama, IREMWORLD, IREM, kiralık gayrimenkul",
  openGraph: {
    title: "Kiralık Emlak İlanları | İrem World",
    description: "IREMWORLD REAL ESTATE MARKETING - Kiralık daire, villa, ofis, iş yeri ve arsa ilanları. En güvenilir kiralık emlak seçenekleri.",
    url: "https://iremworld.com/for-rent",
    type: "website",
  },
};

export default function ForRentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
