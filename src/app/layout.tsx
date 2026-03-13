import type { Metadata } from "next";
import { Inter, Prompt } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import FloatingChat from "@/components/FloatingChat";
import { GoogleAnalytics } from '@next/third-parties/google';
import { getLanguage } from "@/lib/i18n-server";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cm-real-estate.vercel.app'),
  title: {
    default: "เชียงใหม่ เอสเตทส์ - บ้านเช่า คอนโด ขายบ้าน เชียงใหม่",
    template: "%s | Chiang Mai Estates"
  },
  description: "ศูนย์รวมประกาศ ให้เช่าบ้าน คอนโด ขายบ้าน และที่ดิน ในเชียงใหม่ ทำเลดี ราคาคุ้มค่า พร้อมบริการดูแลครบวงจร",
  keywords: ["บ้านเช่าเชียงใหม่", "คอนโดเชียงใหม่", "ขายบ้านเชียงใหม่", "ที่ดินเชียงใหม่", "Real Estate Chiang Mai", "Rent House Chiang Mai"],
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: "เชียงใหม่ เอสเตทส์ - บริการด้านอสังหาริมทรัพย์ครบวงจร",
    description: "รวมประกาศเช่าและขายบ้าน คอนโด ที่ดิน ในเชียงใหม่ ครบจบในที่เดียว",
    url: "/",
    siteName: "Chiang Mai Estates",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai Estates - Real Estate Services",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: 'summary_large_image',
    title: 'เชียงใหม่ เอสเตทส์ - บ้านเช่า คอนโด ขายบ้าน เชียงใหม่',
    description: 'รวมประกาศเช่าและขายบ้าน คอนโด ที่ดิน ในเชียงใหม่ ครบจบในที่เดียว',
    images: ['/hero-bg.jpg'],
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguage();
  
  return (
    <html lang={lang}>
      <body
        className={`${inter.variable} ${prompt.variable} antialiased min-h-screen flex flex-col`}
      >
        <Providers>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </Providers>
        <FloatingChat />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
