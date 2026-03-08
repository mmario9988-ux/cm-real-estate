import prisma from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Properties | Chiang Mai Estates",
  description: "Browse our curated selection of properties in Chiang Mai.",
};

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground mb-4">Properties in Chiang Mai</h1>
        <p className="text-lg text-foreground/70 max-w-2xl">
          Explore our exclusive collection of houses, condos, and villas in Northern Thailand.
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
          <h3 className="text-xl font-semibold text-primary-900 mb-2">No properties found</h3>
          <p className="text-primary-900/60">We are currently updating our listings. Please check back later.</p>
        </div>
      )}
    </div>
  );
}
