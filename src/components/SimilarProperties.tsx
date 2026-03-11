import prisma from "@/lib/prisma";
import PropertyCard from "./PropertyCard";
import { getTranslation, getLanguage } from "@/lib/i18n-server";

interface SimilarPropertiesProps {
  currentPropertyId: string;
  location: string;
  price: number;
  type: string;
}

export default async function SimilarProperties({
  currentPropertyId,
  location,
  price,
  type,
}: SimilarPropertiesProps) {
  const t = await getTranslation();
  const lang = await getLanguage();
  
  // Define price range: +/- 25% for a broader but still relevant search
  const minPrice = price * 0.75;
  const maxPrice = price * 1.25;

  // Fetch similar properties
  const similarProperties = await prisma.property.findMany({
    where: {
      id: { not: currentPropertyId },
      status: { in: ["Available", "For Sale", "For Rent"] },
      OR: [
        { location: { contains: location, mode: 'insensitive' } },
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
      ],
    },
    take: 8, 
  });

  // Sort by similarity
  const sortedProperties = similarProperties
    .map(p => {
      let score = 0;
      if (p.location.toLowerCase().includes(location.toLowerCase())) score += 3;
      if (p.type === type) score += 2;
      const priceDiff = Math.abs(p.price - price) / price;
      if (priceDiff <= 0.2) score += 1;
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  if (sortedProperties.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-16 border-t border-primary-100">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{t("property.similarProperties")}</h2>
          <p className="text-foreground/60 mt-2">
            {lang === 'en' 
              ? "Properties in the same area or similar price range." 
              : "คัดสรรบ้านที่ตั้งในโซนเดียวกันหรือราคาใกล้เคียงมาให้คุณ"}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}
