"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Home, Banknote, Bed } from "lucide-react";

export default function HeroSearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  
  // Advanced filters
  const [type, setType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (type) params.set("type", type);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);

    const queryString = params.toString();
    router.push(`/properties${queryString ? `?${queryString}` : ""}`);
  };

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
              placeholder="ค้นหาทำเล นิมมาน, สันทราย, หางดง..."
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
              <span className="hidden sm:inline">ตัวกรอง</span>
              {isAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <button 
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4.5 rounded-2xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-lg shadow-primary-600/20 transition-all active:scale-95 whitespace-nowrap"
            >
              <Search className="h-5 w-5" />
              ค้นหา
            </button>
          </div>
        </form>

        {/* Advanced Filters Panel */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAdvanced ? "max-h-[400px] opacity-100 mt-6 pb-4 px-3" : "max-h-0 opacity-0"}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2 border-t border-primary-50">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-400 flex items-center gap-2">
                <Home size={12} /> ประเภททรัพย์สิน
              </label>
              <select 
                value={type} 
                onChange={(e) => setType(e.target.value)}
                aria-label="ประเภททรัพย์สิน"
                className="w-full bg-primary-50/50 border border-primary-50 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-200 transition-all appearance-none cursor-pointer"
              >
                <option value="">ทั้งหมด</option>
                <option value="House">บ้านเดี่ยว (House)</option>
                <option value="Condo">คอนโด (Condo)</option>
                <option value="Townhome">ทาวน์โฮม (Townhome)</option>
                <option value="Land">ที่ดิน (Land)</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="space-y-2 lg:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-400 flex items-center gap-2">
                <Banknote size={12} /> ช่วงราคา (บาท)
              </label>
              <div className="flex items-center gap-3">
                <input 
                  type="number" 
                  placeholder="ขั้นต่ำ"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full bg-primary-50/50 border border-primary-50 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-200"
                />
                <span className="text-primary-200 font-bold">−</span>
                <input 
                  type="number" 
                  placeholder="สูงสุด"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full bg-primary-50/50 border border-primary-50 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-200"
                />
              </div>
            </div>

            {/* Bedrooms */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-primary-400 flex items-center gap-2">
                <Bed size={12} /> ห้องนอน
              </label>
              <select 
                value={bedrooms} 
                onChange={(e) => setBedrooms(e.target.value)}
                aria-label="จำนวนห้องนอน"
                className="w-full bg-primary-50/50 border border-primary-50 rounded-xl px-4 py-3 text-sm font-bold text-primary-900 focus:outline-none focus:border-primary-200 appearance-none cursor-pointer"
              >
                <option value="">ไม่ระบุ</option>
                <option value="1">1+ ห้องนอน</option>
                <option value="2">2+ ห้องนอน</option>
                <option value="3">3+ ห้องนอน</option>
                <option value="4">4+ ห้องนอน</option>
                <option value="5">5+ ห้องนอน</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

