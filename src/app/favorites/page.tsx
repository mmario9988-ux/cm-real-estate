"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/context/FavoritesContext";
import { useLanguage } from "@/context/LanguageContext";
import PropertyCard from "@/components/PropertyCard";
import { Heart, Search } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/properties/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: favorites }),
        });

        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        }
      } catch (error) {
        console.error("Failed to fetch favorite properties:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [favorites]);

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white border-b border-primary-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-accent-50 p-3 rounded-2xl text-accent-500">
              <Heart size={32} className="fill-current" />
            </div>
            <h1 className="text-4xl font-black text-foreground">{t("favorites.title")}</h1>
          </div>
          <p className="text-foreground/60 text-lg max-w-2xl">
            {t("favorites.noFavorites") === "You haven't saved any properties yet." 
              ? "All your saved properties in one place." 
              : "รวมรายการบ้านที่คุณบันทึกไว้ทั้งหมดในที่เดียว"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-[450px] animate-pulse border border-primary-100" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-primary-100 shadow-sm px-6">
            <div className="bg-primary-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-primary-300">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{t("favorites.noFavorites")}</h2>
            <Link 
              href="/properties" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md shadow-primary-600/20"
            >
              <Search size={20} />
              {t("favorites.browseAll")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
