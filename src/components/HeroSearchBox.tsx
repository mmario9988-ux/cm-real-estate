"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Home, Banknote, Bed, MapPin, Filter } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const { language, t } = useLanguage();
  
  // Advanced filters
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (status) params.set("status", status);
    if (type) params.set("type", type);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);

    const queryString = params.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  const zones = [
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

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white/95 backdrop-blur-md rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] p-3 border border-white/20">
        {/* Main Search Row */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary-400 group-focus-within:text-primary-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("hero.searchPlaceholder")}
              className="w-full pl-14 pr-4 py-4.5 border-0 rounded-2xl text-[16px] focus:outline-none focus:ring-0 transition-all bg-primary-50/30 font-medium text-primary-950 placeholder:text-primary-300"
            />
          </div>

          <div className="flex gap-3">
            <button 
              type="button"
              onClick={() => setIsAdvanced(!isAdvanced)}
              className={`flex items-center justify-center gap-2 px-6 rounded-2xl font-bold transition-all border-2 ${
                isAdvanced 
                ? "bg-primary-950 border-primary-950 text-white" 
                : "bg-white border-primary-100 text-primary-900 hover:border-primary-300"
              }`}
            >
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">{t("hero.filters")}</span>
              {isAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <button 
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4.5 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Search className="h-5 w-5" />
              {t("hero.search")}
            </button>
          </div>
        </form>

        {/* Advanced Filters Panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdvanced ? "max-h-[600px] opacity-100 mt-6 pb-4 px-3" : "max-h-0 opacity-0"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 pt-6 border-t border-primary-50">
            {/* Status Filter */}
            <div className="space-y-2 lg:col-span-1">
              <label className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                <Filter size={12} className="text-primary-600" /> {t("filters.status")}
              </label>
              <div className="flex bg-primary-50/50 p-1 rounded-xl border border-primary-100 h-11">
                {[
                  { label: t("filters.all"), value: "" },
                  { label: t("filters.rent"), value: "For Rent" },
                  { label: t("filters.sale"), value: "For Sale" }
                ].map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => setStatus(s.value)}
                    className={`flex-grow rounded-lg text-xs font-bold transition-all ${
                      status === s.value 
                      ? "bg-white text-primary-950 shadow-sm" 
                      : "text-primary-400 hover:text-primary-600"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                <MapPin size={12} className="text-primary-600" /> {t("filters.zone")}
              </label>
              <select 
                value={location} 
                onChange={(e) => setLocation(e.target.value)}
                aria-label={t("filters.zone")}
                title={t("filters.zone")}
                className="w-full bg-primary-50/50 border border-primary-100 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t("filters.all")}</option>
                {zones.map(z => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                <Home size={12} className="text-primary-600" /> {t("filters.type")}
              </label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                aria-label={t("filters.type")}
                title={t("filters.type")}
                className="w-full bg-primary-50/50 border border-primary-100 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-300 transition-all appearance-none cursor-pointer"
              >
                <option value="">{t("filters.all")}</option>
                <option value="House">{t("property.house")} (House)</option>
                <option value="Condo">{t("property.condo")} (Condo)</option>
                <option value="Townhouse">{t("property.townhouse")} (Townhouse)</option>
                <option value="Land">{t("property.land")} (Land)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                <Banknote size={12} className="text-primary-600" /> {t("filters.price")}
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-grow">
                  <span className="absolute left-4 inset-y-0 flex items-center text-[10px] font-black text-primary-300 uppercase">Min</span>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-primary-50/50 border border-primary-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-300"
                  />
                </div>
                <span className="text-primary-200 font-bold">−</span>
                <div className="relative flex-grow">
                  <span className="absolute left-4 inset-y-0 flex items-center text-[10px] font-black text-primary-300 uppercase">Max</span>
                  <input 
                    type="number" 
                    placeholder={language === 'en' ? "Max" : "ไกลสุด"}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-primary-50/50 border border-primary-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-300"
                  />
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                <Bed size={12} className="text-primary-600" /> {t("filters.bedrooms")}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBedrooms(bedrooms === String(b) ? "" : String(b))}
                    className={`flex-grow h-11 rounded-xl text-sm font-black transition-all border-2 ${
                      bedrooms === String(b) 
                      ? "bg-primary-950 border-primary-950 text-white" 
                      : "bg-primary-50/50 border-primary-100 text-primary-900 hover:border-primary-300"
                    }`}
                  >
                    {b}+
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

