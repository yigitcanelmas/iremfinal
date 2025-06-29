import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import LayoutContent from "@/components/layout/LayoutContent";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "İrem World | Modern Emlak Pazarlama",
  description: "IREMWORLD REAL ESTATE MARKETING - Türkiye'nin en prestijli emlak pazarlama platformu. Kiralık, satılık arsa, ev, ofis, daire, villa, iş yeri gibi gayrimenkul seçenekleriyle hayalinizdeki mülkü bulun.",
  keywords: "emlak, gayrimenkul, kiralık, satılık, arsa, ev, ofis, daire, villa, iş yeri, IREMWORLD, IREM, INTERNATIONAL REAL ESTATE MARKETING",
  openGraph: {
    title: "İrem World | Modern Emlak Pazarlama",
    description: "IREMWORLD REAL ESTATE MARKETING - Türkiye'nin en prestijli emlak pazarlama platformu. Kiralık, satılık arsa, ev, ofis, daire, villa, iş yeri gibi gayrimenkul seçenekleriyle hayalinizdeki mülkü bulun.",
    url: "https://iremworld.com",
    siteName: "IREMWORLD REAL ESTATE MARKETING",
    images: [
      {
        url: "https://iremworld.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "IREMWORLD REAL ESTATE MARKETING",
      },
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "İrem World | Modern Emlak Pazarlama",
    description: "IREMWORLD REAL ESTATE MARKETING - Türkiye'nin en prestijli emlak pazarlama platformu. Kiralık, satılık arsa, ev, ofis, daire, villa, iş yeri gibi gayrimenkul seçenekleriyle hayalinizdeki mülkü bulun.",
    images: ["https://iremworld.com/twitter-image.jpg"],
    site: "@iremworld",
  },
  icons: {
    icon: "/icon.png",
  },
  metadataBase: new URL("https://iremworld.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/icon.png" sizes="any" />
        <script src="https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.min.js" async></script>
        {/* Structured Data JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "name": "IREMWORLD REAL ESTATE MARKETING",
              "alternateName": "IREM WORLD",
              "url": "https://iremworld.com",
              "logo": "https://iremworld.com/icon.png",
              "description": "IREMWORLD REAL ESTATE MARKETING - INTERNATIONAL REAL ESTATE MARKETING. Türkiye'nin en prestijli emlak pazarlama platformu.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Turkey",
                "addressCountry": "TR"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+90-xxx-xxx-xxxx",
                "email": "info@iremworld.com"
              },
              "sameAs": [
                "https://www.facebook.com/iremworld",
                "https://www.instagram.com/iremworld",
                "https://www.linkedin.com/company/iremworld"
              ],
              "serviceArea": {
                "@type": "Country",
                "name": "Turkey"
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Emlak Hizmetleri",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Kiralık Emlak",
                      "description": "Kiralık daire, villa, ofis, iş yeri hizmetleri"
                    }
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Service",
                      "name": "Satılık Emlak",
                      "description": "Satılık ev, daire, villa, arsa, ofis hizmetleri"
                    }
                  }
                ]
              }
            }),
          }}
        />
      </head>
      <body className={`${inter.className} ${poppins.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
