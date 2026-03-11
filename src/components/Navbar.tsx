"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Bell, Search, Smartphone, Globe, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { count } = useFavorites();

  const navLinks = [
    { name: t("navbar.buy"), href: "/properties?status=For+Sale", hasDropdown: true },
    { name: t("navbar.rent"), href: "/properties?status=For+Rent", hasDropdown: true },
    { name: t("navbar.all"), href: "/properties", hasDropdown: false },
    { name: t("navbar.about"), href: "/about", hasDropdown: false },
    { name: t("navbar.contact"), href: "/contact", hasDropdown: false },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm relative">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px]">
          {/* Left Layout */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group mr-8">
              <img 
                src="/logo.png" 
                alt="บ้านเช่าเชียงใหม่" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <svg viewBox="0 0 40 40" className="w-10 h-10 hidden" fill="none" strokeWidth="3">
                <circle cx="20" cy="20" r="18" stroke="#facc15" />
                <path d="M9 22L20 11L31 22M13 18V28H27V18" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 leading-tight">บ้านเช่าเชียงใหม่</span>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">By CM DIGITAL MEDIA</span>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-900 hover:text-primary-600 text-[15px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {link.name}
                  {link.hasDropdown && <ChevronDown size={14} className="text-gray-500" />}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Layout */}
          <div className="hidden lg:flex lg:items-center lg:space-x-5">
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-full p-1 mr-2">
              <button
                onClick={() => setLanguage("th")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === "th" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                TH
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  language === "en" ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                EN
              </button>
            </div>
 
            {/* Favorites Icon */}
            <Link href="/favorites" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors" title={t("favorites.title")}>
              <Heart size={22} />
              {count > 0 && (
                <span className="absolute top-0 right-0 bg-accent-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                  {count}
                </span>
              )}
            </Link>

            {/* Download App */}
            <Link href="#" className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Smartphone size={16} />
              {t("navbar.downloadApp")}
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </Link>

            {/* Login */}
            <Link
              href="/admin"
              className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-full text-[15px] font-medium transition-colors"
            >
              {t("navbar.login")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-3">
            {/* Mobile Language Toggle */}
            <button
              onClick={() => setLanguage(language === "th" ? "en" : "th")}
              className="p-2 rounded-md text-gray-600 border border-gray-200"
              aria-label="Toggle language"
            >
              <Globe size={20} />
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary-600 focus:outline-none"
              title="Toggle Menu"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-full shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary-600 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/favorites"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:text-primary-600 hover:bg-gray-50 flex justify-between items-center"
              onClick={() => setIsOpen(false)}
            >
              <span>{t("favorites.title")}</span>
              {count > 0 && <span className="bg-accent-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>}
            </Link>
            <div className="border-t border-gray-200 my-2 pt-2"></div>
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              {t("navbar.login")}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
