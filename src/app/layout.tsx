import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from '@next/third-parties/google';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://cm-real-estate.vercel.app'),
  title: "บ้านเช่าเชียงใหม่",
  description: "เว็บไซต์รวมประกาศให้เช่าบ้าน คอนโด ที่ดิน ในเชียงใหม่",
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: "บ้านเช่าเชียงใหม่",
    description: "เว็บไซต์รวมประกาศให้เช่าบ้าน คอนโด ที่ดิน ในเชียงใหม่",
    url: "/",
    siteName: "บ้านเช่าเชียงใหม่",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1200,
        height: 630,
        alt: "บ้านเช่าเชียงใหม่",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
      </body>
    </html>
  );
}
