"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";

type PropertyProps = {
  property: {
    id: string;
    title: string;
    price: number;
    location: string;
    bedrooms: number;
    bathrooms: number;
    area: number | null;
    type: string;
    status: string;
    images: string; // JSON string
  };
  isFeatured?: boolean;
};

export default function PropertyCard({ property, isFeatured }: PropertyProps) {
  const { t } = useLanguage();
  const { toggleFavorite, isFavorite } = useFavorites();
  const isFav = isFavorite(property.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(property.id);
  };
  
  // Parse images if possible, otherwise use a placeholder
  let imageUrl = "/placeholder-property.jpg";
  try {
    const imagesArray = JSON.parse(property.images);
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      imageUrl = imagesArray[0];
    }
  } catch (e) {
    // Keep placeholder
  }

  // Format price
  const formattedPrice = `฿${property.price.toLocaleString('en-US')}`;

  // Translate status and type
  const displayStatus = property.status === "For Rent" ? t("filters.rent") : 
                        property.status === "For Sale" ? t("filters.sale") : 
                        property.status;
  
  const displayType = property.type === "House" ? t("property.house") :
                      property.type === "Condo" ? t("property.condo") :
                      property.type === "Townhouse" ? t("property.townhouse") :
                      property.type === "Land" ? t("property.land") :
                      property.type;

  return (
    <Link href={`/properties/${property.id}`} className="group block h-full" suppressHydrationWarning>
      <div suppressHydrationWarning className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-primary-100 flex flex-col h-full transform group-hover:-translate-y-1">
        <div className="relative h-64 2xl:h-72 w-full overflow-hidden">
          {/* Badges Container */}
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-md whitespace-nowrap ${
              property.status === 'For Sale' ? 'bg-amber-500 text-white' : 
              property.status === 'For Rent' ? 'bg-blue-500 text-white' : 
              property.status === 'Sold' ? 'bg-red-500 text-white' : 
              property.status === 'Rented' ? 'bg-gray-500 text-white' : 
              'bg-primary-500 text-white'
            }`}>
              {displayStatus}
            </span>

            {/* Featured Badge */}
            {isFeatured && (
              <div className="bg-accent-500 text-white text-[10px] font-bold py-1 px-3 rounded-full text-center uppercase tracking-widest shadow-lg animate-pulse whitespace-nowrap">
                Recommended
              </div>
            )}
          </div>
          
          {/* Type Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <span className="bg-background/90 backdrop-blur-sm text-foreground px-3 py-1 rounded-md text-xs font-medium shadow-sm">
              {displayType}
            </span>
          </div>

          {/* Heart icon */}
          <button
            onClick={handleFavoriteClick}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className={`absolute top-4 right-4 z-20 p-2.5 rounded-full transition-all duration-300 shadow-lg ${
              isFav 
                ? "bg-accent-500 text-white" 
                : "bg-white/90 text-primary-600 hover:bg-accent-500 hover:text-white"
            }`}
          >
            <Heart size={20} className={isFav ? "fill-current" : ""} />
          </button>

          {/* Property Image */}
          <div className="absolute inset-0 bg-primary-100 group-hover:scale-105 transition-transform duration-500">
            {imageUrl.startsWith('http') ? (
              <Image 
                src={imageUrl} 
                alt={property.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-primary-200 flex items-center justify-center text-primary-500/50">
                <span className="text-sm">Property Image</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-start justify-between mb-2 gap-4">
            <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary-600 transition-colors">
              {property.title}
            </h3>
          </div>
          
          <div className="flex items-center text-foreground/60 mb-4 text-sm">
            <MapPin size={16} className="mr-1 shrink-0 text-accent-500" />
            <span className="truncate">{property.location}</span>
          </div>

          <div className="text-2xl font-bold text-primary-600 mb-6">
            {formattedPrice}
          </div>

          <div className="mt-auto pt-4 border-t border-primary-100 grid grid-cols-3 gap-2 text-foreground/70 text-sm">
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary-50">
              <Bed size={18} className="mb-1 text-primary-500" />
              <span className="font-semibold">{property.bedrooms}</span>
              <span className="text-[10px] text-gray-400">{t("property.bedrooms")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary-50">
              <Bath size={18} className="mb-1 text-primary-500" />
              <span className="font-semibold">{property.bathrooms}</span>
              <span className="text-[10px] text-gray-400">{t("property.bathrooms")}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-primary-50 text-center">
              <Square size={18} className="mb-1 text-primary-500" />
              <span className="font-semibold">{property.area || '-'} <span className="text-xs font-medium">{t("property.sqm")}</span></span>
              <span className="text-[10px] text-gray-400">{t("property.area")}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
