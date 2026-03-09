import Link from "next/link";
import { ArrowRight, Mountain, Sun, Home as HomeIcon } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import HeroSearchBox from "@/components/HeroSearchBox";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch properties for sale
  const saleProperties = await prisma.property.findMany({
    where: { status: 'For Sale' },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Fetch properties for rent
  const rentProperties = await prisma.property.findMany({
    where: { status: 'For Rent' },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full bg-white flex flex-col mb-0 md:mb-16">
        {/* Banner Banner */}
        <div className="relative h-[360px] md:h-[440px] w-full bg-primary-100">
          {/* Main Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-hero-pattern"
          >
            {/* Dark Overlay for better text/gradient visibility (Optional) */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent"></div>
          </div>
          
          {/* Left Text / Graphic Content over Banner */}
          <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 max-w-2xl mt-[-60px]">
              <div className="inline-flex flex-col">
                <span className="text-primary-700 font-black text-6xl md:text-7xl tracking-tighter leading-none mb-1">
                  บ้านเช่า
                </span>
                <span className="text-gray-900 font-black text-5xl md:text-6xl tracking-tight leading-none">
                  เชียงใหม่
                </span>
              </div>
              <div className="md:mt-4 max-w-[200px] md:max-w-xs">
                <p className="text-primary-700 font-bold text-lg md:text-xl leading-snug">
                  เว็บบ้านเช่าอันดับหนึ่งของเชียงใหม่
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Search Box */}
        <div className="max-w-[800px] w-full mx-auto px-4 -mt-20 relative z-20">
          <HeroSearchBox />
        </div>
      </section>

      {/* For Rent Properties */}
      <section className="pt-4 pb-20 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">บ้านเช่าเชียงใหม่</h2>
              <p className="text-foreground/70 max-w-2xl">บ้านเช่า คอนโดให้เช่า สภาพสวยพร้อมอยู่ ทำเลดีทั่วเมืองเชียงใหม่</p>
            </div>
            <Link href="/properties?status=For+Rent" className="text-primary-600 font-semibold hover:text-primary-700 mt-4 md:mt-0 flex items-center gap-1 group">
              ดูทั้งหมด <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {rentProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rentProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-primary-600 mb-2">ยังไม่มีรายการให้เช่า</p>
            </div>
          )}
        </div>
      </section>

      {/* For Sale Properties */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">ขายบ้านเชียงใหม่</h2>
              <p className="text-foreground/70 max-w-2xl">บ้านและคอนโดคุณภาพเยี่ยม สำหรับซื้อเพื่ออยู่อาศัยหรือลงทุนในเชียงใหม่</p>
            </div>
            <Link href="/properties?status=For+Sale" className="text-primary-600 font-semibold hover:text-primary-700 mt-4 md:mt-0 flex items-center gap-1 group">
              ดูทั้งหมด <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {saleProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {saleProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-primary-600 mb-2">ยังไม่มีรายการประกาศขาย</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">The Chiang Mai Estates Difference</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">We don"t just sell houses; we curate lifestyles in one of the world"s most beautiful and culturally rich destinations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-primary-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                <Mountain size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Local Expertise</h3>
              <p className="text-foreground/70">With over a decade of experience in the local market, we know every neighborhood, mountain view, and hidden gem.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-primary-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                <HomeIcon size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Curated Portfolio</h3>
              <p className="text-foreground/70">From traditional teak wood houses to modern luxury condos, each property is vetted to meet our high standards.</p>
            </div>
            <div className="bg-background p-8 rounded-2xl shadow-sm border border-primary-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <Sun size={32} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">Seamless Process</h3>
              <p className="text-foreground/70">Whether buying, selling, or renting, we handle the complexities of Thai real estate law so you can relax.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
