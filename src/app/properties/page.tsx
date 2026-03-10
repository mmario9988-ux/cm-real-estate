import prisma from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { Filter, Home, Banknote, Bed, X, Search } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties | Chiang Mai Estates",
  description: "Browse our curated selection of properties in Chiang Mai with advanced search filters.",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const statusParam = params.status as string | undefined;
  const searchQuery = params.q as string | undefined;
  const typeParam = params.type as string | undefined;
  const minPrice = params.minPrice ? parseInt(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : undefined;
  const bedroomsParam = params.bedrooms ? parseInt(params.bedrooms as string) : undefined;

  // Build the query where clause
  const whereClause: any = {};
  
  if (statusParam) whereClause.status = statusParam;
  if (typeParam) whereClause.type = typeParam;
  
  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.price = {};
    if (minPrice !== undefined) whereClause.price.gte = minPrice;
    if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
  }

  if (bedroomsParam !== undefined) {
    whereClause.bedrooms = { gte: bedroomsParam };
  }

  if (searchQuery) {
    whereClause.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
      { location: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  const propertyTypes = ["House", "Condo", "Townhome", "Land"];

  return (
    <div className="bg-primary-50/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Header Section */}
        <div className="mb-12 lg:mb-16">
          <div className="flex items-center gap-2 text-primary-600 font-black uppercase tracking-widest text-[10px] mb-4">
             <div className="w-8 h-[2px] bg-primary-600"></div>
             Premium Listings
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary-950 tracking-tight mb-4">
            {searchQuery ? `ผลการค้นหา: "${searchQuery}"` : statusParam ? `${statusParam} in Chiang Mai` : "All Properties"}
          </h1>
          <p className="text-lg text-primary-900/60 max-w-2xl font-medium">
             {properties.length} properties found matching your criteria.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-primary-950 flex items-center gap-2">
                  <Filter size={18} className="text-primary-600" />
                  ตัวกรอง
                </h3>
                <Link href="/properties" className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-600 transition-colors">
                  ล้างทั้งหมด
                </Link>
              </div>

              <div className="space-y-10">
                {/* Status Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block">สถานะ</span>
                  <div className="flex flex-wrap gap-2">
                    {["For Sale", "For Rent"].map((s) => (
                      <Link 
                        key={s}
                        href={{ query: { ...params, status: s } }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          statusParam === s 
                          ? "bg-primary-950 border-primary-950 text-white" 
                          : "bg-white border-primary-50 text-primary-900 hover:border-primary-200"
                        }`}
                      >
                        {s}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block">ประเภททรัพย์สิน</span>
                  <div className="grid grid-cols-1 gap-2">
                    {propertyTypes.map((t) => (
                      <Link 
                        key={t}
                        href={{ query: { ...params, type: t } }}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 ${
                          typeParam === t 
                          ? "bg-primary-50 border-primary-500 text-primary-950 shadow-sm" 
                          : "bg-white border-primary-50 text-primary-600 hover:border-primary-100"
                        }`}
                      >
                         <span className="flex items-center gap-2">
                            <Home size={16} className={typeParam === t ? "text-primary-600" : "text-primary-200"} />
                            {t}
                         </span>
                         {typeParam === t && <X size={14} className="text-primary-400" />}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block">ห้องนอน</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <Link 
                        key={b}
                        href={{ query: { ...params, bedrooms: b } }}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border-2 ${
                          bedroomsParam === b 
                          ? "bg-primary-950 border-primary-950 text-white" 
                          : "bg-white border-primary-50 text-primary-900 hover:border-primary-200"
                        }`}
                      >
                        {b}+
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <main className="flex-grow">
            {properties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] border border-primary-100 p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-primary-200">
                   <Search size={40} />
                </div>
                <h3 className="text-2xl font-black text-primary-950 mb-2">ไม่พบรายการที่ตรงกับเงื่อนไข</h3>
                <p className="text-primary-900/60 font-medium mb-8">ลองปรับเปลี่ยนตัวกรอง หรือค้นหาด้วยคำอื่น</p>
                <Link href="/properties" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black transition-all">
                   แสดงทั้งหมด
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

