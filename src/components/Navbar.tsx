"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Bell, Search, Smartphone, Globe, Heart, LogOut, LayoutDashboard, LogIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import LoginModal from "./LoginModal";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { count } = useFavorites();
  const { data: session } = useSession();

  const navLinks = [
    { name: t("navbar.buy"), href: "/properties?status=For+Sale", hasDropdown: true },
    { name: t("navbar.rent"), href: "/properties?status=For+Rent", hasDropdown: true },
    { name: t("navbar.all"), href: "/properties", hasDropdown: false },
    { name: t("blog.title") || "Blog", href: "/blog", hasDropdown: false },
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
              <Logo />
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

            {/* Login / Profile */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-1.5 pr-4 pl-1.5 rounded-full bg-gray-50 border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all duration-300 shadow-sm overflow-hidden whitespace-nowrap">
                  <div className="relative inline-block flex-shrink-0">
                    <div className="w-10 h-10 rounded-full border-2 border-primary-600 p-[1px] shadow-sm transform group-hover:scale-105 transition-transform duration-300">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                          {session.user?.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    {/* Verified Status Dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-sm">
                      <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 text-white fill-current" stroke="currentColor" strokeWidth="1">
                        <path d="M10 3L4.5 8.5L2 6" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-col items-start pr-1 max-w-[120px]">
                    <span className="text-sm font-bold text-gray-900 truncate w-full">
                      {session.user?.name || "Member"}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5 uppercase tracking-wider">
                      Verified Member
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:text-primary-600 transition-colors" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-[60]">
                  <div className="px-5 py-3 border-b border-gray-100 mb-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Account</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{session.user?.email}</p>
                  </div>
                  
                  {/* Admin link - only show if on ADMIN_EMAILS list */}
                  {(() => {
                    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "m.mario9988@gmail.com").split(",");
                    if (session.user?.email && adminEmails.includes(session.user.email)) {
                      return (
                        <Link href="/admin" className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                          <LayoutDashboard size={18} className="text-primary-600" />
                          {t("admin.portal") || "Admin Portal"}
                        </Link>
                      );
                    }
                    return null;
                  })()}

                  <button 
                    onClick={() => signOut()}
                    className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <LogOut size={18} />
                    {t("navbar.logout") || "Sign Out"}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="relative overflow-hidden group bg-primary-700 text-white px-6 py-2.5 rounded-full text-[15px] font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] flex items-center gap-2 cursor-pointer"
              >
                {/* Shine Effect */}
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shine" />
                
                <LogIn size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                {t("navbar.login")}
              </button>
            )}
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
          <div className="px-3 pt-2 pb-3 space-y-1 sm:px-3">
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
            {session ? (
               <div className="px-3 py-2 space-y-3">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-full border-2 border-primary-600 p-[1px] shadow-sm">
                      {session.user?.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || "User"} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg">
                          {session.user?.name?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-gray-900">{session.user?.name || "Member"}</span>
                      <span className="text-xs font-bold text-blue-600 flex items-center gap-0.5 uppercase tracking-wider">
                        Verified Member
                      </span>
                    </div>
                  </div>
                  
                  {(() => {
                    const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "m.mario9988@gmail.com").split(",");
                    if (session.user?.email && adminEmails.includes(session.user.email)) {
                      return (
                        <Link 
                          href="/admin" 
                          className="flex items-center gap-3 py-2 font-bold text-gray-900"
                          onClick={() => setIsOpen(false)}
                        >
                          <LayoutDashboard size={20} className="text-primary-600" />
                          {t("admin.portal") || "Admin Portal"}
                        </Link>
                      );
                    }
                    return null;
                  })()}

                  <button 
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }} 
                    className="flex items-center gap-3 py-2 text-red-600 font-bold w-full text-left"
                  >
                    <LogOut size={20} />
                    {t("navbar.logout") || "Sign Out"}
                  </button>
               </div>
            ) : (
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsOpen(false);
                }}
                className="mx-3 mt-4 flex items-center justify-center gap-2 bg-primary-700 text-white px-5 py-3 rounded-full text-base font-bold shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <LogIn size={20} />
                {t("navbar.login")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </nav>
  );
}

function Logo() {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none" strokeWidth="3">
        <circle cx="20" cy="20" r="18" stroke="#facc15" />
        <path d="M9 22L20 11L31 22M13 18V28H27V18" stroke="#dc2626" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt="บ้านเช่าเชียงใหม่" 
      className="w-12 h-12 object-contain"
      onError={() => setImgError(true)}
    />
  );
}
