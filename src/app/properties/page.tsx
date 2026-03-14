import prisma from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import PropertyFilters from "@/components/PropertyFilters";
import { Search } from "lucide-react";
import { getTranslation, getLanguage } from "@/lib/i18n-server";
import Link from "next/link";

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

        {/* Horizontal Filter Bar */}
        <PropertyFilters 
          zones={ZONES}
          priceRanges={PRICE_RANGES}
          propertyTypes={propertyTypes}
        />

        {/* Listings Grid */}
        <main className="w-full">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
  );
}

