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
  description: "Türkiye'nin en prestijli emlak pazarlama platformu. Kiralık ve satılık gayrimenkul fırsatları için doğru adres.",
  keywords: "emlak, gayrimenkul, kiralık, satılık, daire, villa, ofis, arsa",
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script src="https://cdn.jsdelivr.net/npm/marzipano@0.10.2/dist/marzipano.min.js" async></script>
      </head>
      <body className={`${inter.className} ${poppins.variable} min-h-screen flex flex-col`}>
        <AuthProvider>
          <LayoutContent>
            {children}
          </LayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
