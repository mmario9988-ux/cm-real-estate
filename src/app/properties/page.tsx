import prisma from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties | Chiang Mai Estates",
  description: "Browse our curated selection of properties in Chiang Mai.",
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const statusParam = searchParams.status as string | undefined;

  // Build the query where clause
  const whereClause = statusParam ? { status: statusParam } : {};

  const properties = await prisma.property.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  // Dynamic titles based on status
  let pageTitle = "Properties in Chiang Mai";
  let pageDescription = "Explore our exclusive collection of houses, condos, and villas in Northern Thailand.";

  if (statusParam === "For Sale") {
    pageTitle = "🏠 ขายบ้านเชียงใหม่ (For Sale)";
    pageDescription = "บ้านและคอนโดคุณภาพเยี่ยม สำหรับซื้อเพื่ออยู่อาศัยหรือลงทุนในเชียงใหม่";
  } else if (statusParam === "For Rent") {
    pageTitle = "🔑 บ้านเช่าเชียงใหม่ (For Rent)";
    pageDescription = "บ้านเช่า คอนโดให้เช่า สภาพสวยพร้อมอยู่ ทำเลดีทั่วเมืองเชียงใหม่";
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">{pageTitle}</h1>
        <p className="text-lg text-foreground/70 max-w-2xl">
          {pageDescription}
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-primary-50 rounded-2xl border border-primary-100">
          <h3 className="text-xl font-semibold text-primary-900 mb-2">ยังไม่มีรายการในหมวดหมู่นี้</h3>
          <p className="text-primary-900/60">เรากำลังอัปเดตข้อมูล โปรดกลับมาดูใหม่ภายหลัง</p>
        </div>
      )}
    </div>
  );
}
