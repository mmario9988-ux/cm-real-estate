"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroSearchBox() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/properties');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-2">
      {/* Search Input Area */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา เมือง นิมมาน สันทราย หางดง สันกำแพง"
            className="w-full pl-11 pr-4 py-3.5 border-0 rounded-xl text-[16px] focus:outline-none focus:ring-0 transition-shadow bg-transparent"
          />
        </div>
        <button 
          type="submit"
          className="bg-[#cf0a2c] hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold text-[16px] flex items-center justify-center gap-2 shadow-sm transition-colors whitespace-nowrap"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <circle cx="11" cy="11" r="8"></circle>
             <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          ค้นหา
        </button>
      </form>
    </div>
  );
}
