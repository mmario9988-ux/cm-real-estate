import prisma from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import Link from "next/link";
import { Filter, Home, Banknote, Bed, X, Search, MapPin } from "lucide-react";
import { getTranslation, getLanguage } from "@/lib/i18n-server";

const ZONES = [
  "เมืองเชียงใหม่",
  "นิมมาน",
  "หางดง",
  "แม่ริม",
  "สันทราย",
  "แม่เหียะ",
  "สันกำแพง",
  "สารภี",
  "ดอยสะเก็ด",
  "หนองจ๊อม",
  "หนองหอย"
];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties | Chiang Mai Estates",
  description: "Browse our curated selection of properties in Chiang Mai with advanced search filters.",
  alternates: {
    canonical: '/properties',
    languages: {
      'th': '/properties',
      'en': '/en/properties',
    },
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PropertiesPage({ searchParams }: PageProps) {
  const t = await getTranslation();
  const lang = await getLanguage();
  
  const PRICE_RANGES = [
    { label: lang === 'en' ? "Under 15k" : "ต่ำกว่า 1.5 หมื่น", max: 15000 },
    { label: lang === 'en' ? "15k - 30k" : "1.5 - 3 หมื่น", min: 15000, max: 30000 },
    { label: lang === 'en' ? "1M - 3M" : "1 - 3 ล้าน", min: 1000000, max: 3000000 },
    { label: lang === 'en' ? "3M - 5M" : "3 - 5 ล้าน", min: 3000000, max: 5000000 },
    { label: lang === 'en' ? "5M - 10M" : "5 - 10 ล้าน", min: 5000000, max: 10000000 },
    { label: lang === 'en' ? "Over 10M" : "10 ล้านขึ้นไป", min: 10000000 },
  ];

  const params = await searchParams;
  const statusParam = params.status as string | undefined;
  const searchQuery = params.q as string | undefined;
  const typeParam = params.type as string | undefined;
  const locationParam = params.location as string | undefined;
  const minPrice = params.minPrice ? parseInt(params.minPrice as string) : undefined;
  const maxPrice = params.maxPrice ? parseInt(params.maxPrice as string) : undefined;
  const bedroomsParam = params.bedrooms ? parseInt(params.bedrooms as string) : undefined;

  // Build the query where clause
  const whereClause: any = {};
  
  if (statusParam) whereClause.status = statusParam;
  if (typeParam) whereClause.type = typeParam;
  if (locationParam) {
    whereClause.location = { contains: locationParam, mode: 'insensitive' };
  }
  
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

  const propertyTypes = [
    { label: t("property.house"), value: "House" },
    { label: t("property.condo"), value: "Condo" },
    { label: t("property.townhouse"), value: "Townhouse" },
    { label: t("property.land"), value: "Land" }
  ];

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
            {searchQuery ? `${lang === 'en' ? 'Search Results' : 'ผลการค้นหา'}: "${searchQuery}"` : statusParam ? `${statusParam === 'For Rent' ? t("filters.rent") : t("filters.sale")} in Chiang Mai` : t("navbar.all")}
          </h1>
          <p className="text-lg text-primary-900/60 max-w-2xl font-medium">
             {properties.length} {lang === 'en' ? 'properties found matching your criteria.' : 'รายการที่พบ'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filters */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-3xl p-8 border border-primary-100 shadow-sm sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-primary-950 flex items-center gap-2">
                  <Filter size={18} className="text-primary-600" />
                  {t("hero.filters")}
                </h3>
                <Link href="/properties" className="text-[9px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-600 transition-colors border-b border-transparent hover:border-primary-600">
                  {t("filters.clearAll")}
                </Link>
              </div>

              <div className="space-y-10">
                {/* Status Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block">{t("filters.status")}</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: t("filters.sale"), value: "For Sale" },
                      { label: t("filters.rent"), value: "For Rent" }
                    ].map((s) => (
                      <Link 
                        key={s.value}
                        href={{ query: { ...params, status: s.value } }}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          statusParam === s.value 
                          ? "bg-primary-950 border-primary-950 text-white" 
                          : "bg-white border-primary-50 text-primary-900 hover:border-primary-200"
                        }`}
                      >
                        {s.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Zone Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block group flex items-center gap-2">
                    <MapPin size={12} className="text-primary-600" /> {t("filters.zone")}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {ZONES.map((z) => (
                      <Link 
                        key={z}
                        href={{ query: { ...params, location: locationParam === z ? undefined : z } }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                          locationParam === z 
                          ? "bg-primary-950 border-primary-950 text-white" 
                          : "bg-white border-primary-50 text-primary-900 hover:border-primary-200"
                        }`}
                      >
                        {z}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block flex items-center gap-2">
                    <Banknote size={12} className="text-primary-600" /> {t("filters.price")}
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {PRICE_RANGES.map((r, idx) => (
                      <Link 
                        key={idx}
                        href={{ query: { ...params, minPrice: r.min, maxPrice: r.max } }}
                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 text-left ${
                          parseInt(params.minPrice as string) === r.min && parseInt(params.maxPrice as string) === r.max
                          ? "bg-primary-50 border-primary-500 text-primary-950 shadow-sm" 
                          : "bg-white border-primary-50 text-primary-600 hover:border-primary-100"
                        }`}
                      >
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block flex items-center gap-2">
                    <Home size={12} className="text-primary-600" /> {t("filters.type")}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {propertyTypes.map((pt) => (
                      <Link 
                        key={pt.value}
                        href={{ query: { ...params, type: typeParam === pt.value ? undefined : pt.value } }}
                        className={`flex items-center justify-center px-4 py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                          typeParam === pt.value 
                          ? "bg-primary-50 border-primary-500 text-primary-950 shadow-sm" 
                          : "bg-white border-primary-50 text-primary-600 hover:border-primary-100"
                        }`}
                      >
                        {pt.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary-400 block flex items-center gap-2">
                    <Bed size={12} className="text-primary-600" /> {t("filters.bedrooms")}
                  </span>
                  <div className="flex justify-between gap-1">
                    {[1, 2, 3, 4, 5].map((b) => (
                      <Link 
                        key={b}
                        href={{ query: { ...params, bedrooms: bedroomsParam === b ? undefined : b } }}
                        className={`flex-grow h-10 flex items-center justify-center rounded-xl text-xs font-black transition-all border-2 ${
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
                <h3 className="text-2xl font-black text-primary-950 mb-2">
                  {lang === 'en' ? "No properties match your criteria" : "ไม่พบรายการที่ตรงกับเงื่อนไข"}
                </h3>
                <p className="text-primary-900/60 font-medium mb-8">
                  {lang === 'en' ? "Try adjusting your filters or search for something else." : "ลองปรับเปลี่ยนตัวกรอง หรือค้นหาด้วยคำอื่น"}
                </p>
                <Link href="/properties" className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-black transition-all">
                   {lang === 'en' ? "Show All" : "แสดงทั้งหมด"}
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

