"use client";

import { useState } from "react";
import { MessageCircle, X, Phone } from "lucide-react";

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);

  // Using the provided WhatsApp number 0932744601 (formatted to +66932744601)
  const whatsappLink = "https://wa.me/66932744601"; 
  const lineLink = "https://line.me/ti/p/~@378pooou";

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
      {/* Menu Options */}
      <div 
        className={`flex flex-col gap-3 transition-all duration-300 origin-bottom ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0 pointer-events-none"
        }`}
      >
        <a 
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <span className="text-sm font-bold text-gray-700">WhatsApp</span>
          <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
            <Phone size={20} className="fill-current" />
          </div>
        </a>

        <a 
          href={lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-white px-4 py-3 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group cursor-pointer"
        >
          <span className="text-sm font-bold text-gray-700">LINE Chat</span>
          <div className="w-10 h-10 rounded-full bg-[#00B900] flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform">
             <MessageCircle size={22} className="fill-current" />
          </div>
        </a>
      </div>

      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-300 hover:scale-105 ${
          isOpen ? "bg-gray-800 rotate-90" : "bg-primary-600 animate-bounce hover:animate-none"
        }`}
        aria-label="Chat options"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
}
