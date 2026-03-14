"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronDown, 
  MapPin, 
  Home, 
  Banknote, 
  Bed, 
  Filter, 
  X,
  Check
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface PropertyFiltersProps {
  zones: string[];
  priceRanges: { label: string; min?: number; max?: number }[];
  propertyTypes: { label: string; value: string }[];
}

export default function PropertyFilters({ zones, priceRanges, propertyTypes }: PropertyFiltersProps) {
  const { t, language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Current filter values from URL
  const status = searchParams.get("status") || "";
  const location = searchParams.get("location") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const type = searchParams.get("type") || "";
  const bedrooms = searchParams.get("bedrooms") || "";

  // Count active filters
  const activeCount = [status, location, minPrice || maxPrice, type, bedrooms].filter(Boolean).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    router.push(`/properties?${params.toString()}`);
    setActiveDropdown(null);
  };

  const clearFilters = () => {
    router.push("/properties");
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const FilterButton = ({ name, label, icon: Icon, isActive, valueLabel }: any) => (
    <div className="relative">
      <button
        onClick={() => toggleDropdown(name)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all border-2 whitespace-nowrap ${
          isActive || activeDropdown === name
          ? "bg-primary-950 border-primary-950 text-white shadow-md" 
          : "bg-white border-primary-50 text-primary-900 hover:border-primary-200"
        }`}
      >
        <Icon size={16} className={isActive || activeDropdown === name ? "text-white" : "text-primary-600"} />
        <span>{valueLabel || label}</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === name ? "rotate-180" : ""}`} />
      </button>

      {activeDropdown === name && (
        <div className="absolute top-full mt-2 left-0 z-50 min-w-[240px] bg-white rounded-2xl shadow-xl border border-primary-100 p-2 animate-in fade-in zoom-in duration-200 origin-top-left">
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {renderDropdownContent(name)}
          </div>
        </div>
      )}
    </div>
  );

  const renderDropdownContent = (name: string, isMobile = false) => {
    const containerClass = isMobile ? "grid grid-cols-1 gap-2 p-1" : "grid grid-cols-1 gap-1";
    const itemClass = (isSelected: boolean) => `flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      isSelected ? "bg-primary-50 text-primary-950" : "hover:bg-primary-50/50 text-primary-600"
    }`;

    switch (name) {
      case "status":
        return (
          <div className={containerClass}>
            {[
              { label: t("filters.all"), value: "" },
              { label: t("filters.sale"), value: "For Sale" },
              { label: t("filters.rent"), value: "For Rent" }
            ].map((s) => (
              <button
                key={s.value}
                onClick={() => updateFilters({ status: s.value })}
                className={itemClass(status === s.value)}
              >
                {s.label}
                {status === s.value && <Check size={16} className="text-primary-600" />}
              </button>
            ))}
          </div>
        );
      case "location":
        return (
          <div className={containerClass}>
            <button
              onClick={() => updateFilters({ location: "" })}
              className={itemClass(location === "")}
            >
              {t("filters.all")}
              {location === "" && <Check size={16} className="text-primary-600" />}
            </button>
            {zones.map((z) => (
              <button
                key={z}
                onClick={() => updateFilters({ location: z })}
                className={itemClass(location === z)}
              >
                {z}
                {location === z && <Check size={16} className="text-primary-600" />}
              </button>
            ))}
          </div>
        );
      case "price":
        return (
          <div className={containerClass}>
            <button
              onClick={() => updateFilters({ minPrice: null, maxPrice: null })}
              className={itemClass(!minPrice && !maxPrice)}
            >
              {t("filters.all")}
              {!minPrice && !maxPrice && <Check size={16} className="text-primary-600" />}
            </button>
            {priceRanges.map((r, idx) => {
              const isActive = String(r.min || "") === minPrice && String(r.max || "") === maxPrice;
              return (
                <button
                  key={idx}
                  onClick={() => updateFilters({ minPrice: r.min ? String(r.min) : null, maxPrice: r.max ? String(r.max) : null })}
                  className={itemClass(isActive)}
                >
                  {r.label}
                  {isActive && <Check size={16} className="text-primary-600" />}
                </button>
              );
            })}
          </div>
        );
      case "type":
        return (
          <div className={containerClass}>
            <button
              onClick={() => updateFilters({ type: "" })}
              className={itemClass(type === "")}
            >
              {t("filters.all")}
              {type === "" && <Check size={16} className="text-primary-600" />}
            </button>
            {propertyTypes.map((pt) => (
              <button
                key={pt.value}
                onClick={() => updateFilters({ type: pt.value })}
                className={itemClass(type === pt.value)}
              >
                {pt.label}
                {type === pt.value && <Check size={16} className="text-primary-600" />}
              </button>
            ))}
          </div>
        );
      case "bedrooms":
        return (
          <div className={containerClass}>
            <button
              onClick={() => updateFilters({ bedrooms: "" })}
              className={itemClass(bedrooms === "")}
            >
              {t("filters.all")}
              {bedrooms === "" && <Check size={16} className="text-primary-600" />}
            </button>
            {[1, 2, 3, 4, 5].map((b) => (
              <button
                key={b}
                onClick={() => updateFilters({ bedrooms: String(b) })}
                className={itemClass(bedrooms === String(b))}
              >
                {b}+ {t("property.bedrooms")}
                {bedrooms === String(b) && <Check size={16} className="text-primary-600" />}
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const getPriceLabel = () => {
    if (!minPrice && !maxPrice) return null;
    const range = priceRanges.find(r => String(r.min || "") === minPrice && String(r.max || "") === maxPrice);
    return range ? range.label : null;
  };

  const getTypeLabel = () => {
    if (!type) return null;
    const pt = propertyTypes.find(t => t.value === type);
    return pt ? pt.label : null;
  };

  const getStatusLabel = () => {
    if (!status) return null;
    if (status === "For Sale") return t("filters.sale");
    if (status === "For Rent") return t("filters.rent");
    return status;
  };

  return (
    <div className="bg-white rounded-3xl p-4 border border-primary-100 shadow-sm mb-10 overflow-visible relative" ref={dropdownRef}>
      <div className="flex items-center justify-between md:justify-start gap-4">
        {/* Mobile Filter Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden flex flex-grow items-center justify-between px-4 py-3 bg-primary-50 rounded-2xl border border-primary-100 text-primary-900 font-bold active:scale-95 transition-all"
        >
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-primary-600" />
            <span>{t("hero.filters")}</span>
            {activeCount > 0 && (
              <span className="flex items-center justify-center bg-primary-600 text-white text-[10px] w-5 h-5 rounded-full">
                {activeCount}
              </span>
            )}
          </div>
          <ChevronDown size={18} className="text-primary-400" />
        </button>

        {/* Desktop Filters */}
        <div className="hidden md:flex items-center gap-2 pr-4 border-r border-primary-50 h-10">
          <Filter size={20} className="text-primary-600" />
          <span className="text-sm font-black text-primary-950 whitespace-nowrap">{t("hero.filters")}</span>
        </div>

        <div className="hidden md:flex flex-wrap lg:flex-nowrap items-center gap-3 flex-grow">
          <FilterButton 
            name="status" 
            label={t("filters.status")} 
            icon={Filter} 
            isActive={!!status} 
            valueLabel={getStatusLabel()}
          />
          
          <FilterButton 
            name="location" 
            label={t("filters.zone")} 
            icon={MapPin} 
            isActive={!!location} 
            valueLabel={location}
          />
          
          <FilterButton 
            name="price" 
            label={t("filters.price")} 
            icon={Banknote} 
            isActive={!!minPrice || !!maxPrice} 
            valueLabel={getPriceLabel()}
          />
          
          <FilterButton 
            name="type" 
            label={t("filters.type")} 
            icon={Home} 
            isActive={!!type} 
            valueLabel={getTypeLabel()}
          />
          
          <FilterButton 
            name="bedrooms" 
            label={t("filters.bedrooms")} 
            icon={Bed} 
            isActive={!!bedrooms} 
            valueLabel={bedrooms ? `${bedrooms}+ ${t("property.bedrooms")}` : null}
          />
        </div>

        {(status || location || minPrice || maxPrice || type || bedrooms) && (
          <button
            onClick={clearFilters}
            className={`${isMobileMenuOpen ? 'hidden' : 'flex'} items-center gap-2 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary-400 hover:text-primary-600 transition-colors shrink-0`}
          >
            <X size={14} />
            <span className="hidden sm:inline">{t("filters.clearAll")}</span>
          </button>
        )}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[10001] md:hidden text-foreground">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-primary-950/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer Content */}
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-primary-50 flex items-center justify-between">
              <h3 className="text-lg font-black text-primary-950 flex items-center gap-2">
                <Filter size={20} className="text-primary-600" />
                {t("hero.filters")}
              </h3>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-primary-50 rounded-full transition-colors"
                aria-label="Close filters"
              >
                <X size={24} className="text-primary-400" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-8">
              {/* Category Sections */}
              {[
                { name: "status", label: t("filters.status"), icon: Filter },
                { name: "location", label: t("filters.zone"), icon: MapPin },
                { name: "price", label: t("filters.price"), icon: Banknote },
                { name: "type", label: t("filters.type"), icon: Home },
                { name: "bedrooms", label: t("filters.bedrooms"), icon: Bed }
              ].map((cat) => (
                <div key={cat.name} className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 flex items-center gap-2">
                    <cat.icon size={12} className="text-primary-600" /> {cat.label}
                  </label>
                  {renderDropdownContent(cat.name, true)}
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-primary-50 grid grid-cols-2 gap-3 bg-primary-50/30">
              <button
                onClick={clearFilters}
                className="py-4 rounded-2xl text-sm font-bold border-2 border-primary-100 text-primary-600 bg-white active:scale-95 transition-all"
              >
                {t("filters.clearAll")}
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-4 rounded-2xl text-sm font-bold bg-primary-600 text-white shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
