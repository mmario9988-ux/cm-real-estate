import Link from "next/link";
import { ArrowRight, Mountain, Sun, Home as HomeIcon } from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
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
      <section className="relative h-[80vh] flex items-center bg-primary-900 overflow-hidden">
        {/* Abstract background elements in place of a real image */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl bg-black/20 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Your Peace in <span className="text-accent-500">Chiang Mai</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-50 mb-8 leading-relaxed">
              Discover properties that blend traditional Lanna charm with modern luxury, surrounded by the breathtaking mountains of northern Thailand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/properties" className="bg-accent-500 hover:bg-accent-600 text-white px-8 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-lg shadow-accent-500/30 flex items-center justify-center gap-2">
                Browse Properties <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-lg font-semibold text-center transition-all duration-300">
                Contact an Agent
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Sale Properties */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">🏠 ขายบ้านเชียงใหม่ (For Sale)</h2>
              <p className="text-foreground/70 max-w-2xl">บ้านและคอนโดคุณภาพเยี่ยม สำหรับซื้อเพื่ออยู่อาศัยหรือลงทุนในเชียงใหม่</p>
            </div>
            <Link href="/properties" className="text-primary-600 font-semibold hover:text-primary-700 mt-4 md:mt-0 flex items-center gap-1 group">
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
            <div className="text-center py-12 bg-primary-50 rounded-2xl border border-primary-100">
              <p className="text-primary-600 mb-2">ยังไม่มีรายการประกาศขาย</p>
            </div>
          )}
        </div>
      </section>

      {/* For Rent Properties */}
      <section className="py-20 bg-primary-50 dark:bg-primary-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">🔑 บ้านเช่าเชียงใหม่ (For Rent)</h2>
              <p className="text-foreground/70 max-w-2xl">บ้านเช่า คอนโดให้เช่า สภาพสวยพร้อมอยู่ ทำเลดีทั่วเมืองเชียงใหม่</p>
            </div>
            <Link href="/properties" className="text-primary-600 font-semibold hover:text-primary-700 mt-4 md:mt-0 flex items-center gap-1 group">
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
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-primary-600 mb-2">ยังไม่มีรายการให้เช่า</p>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-primary-50 dark:bg-primary-900/10">
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
