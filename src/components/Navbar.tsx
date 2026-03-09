"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown, Bell, Search, Smartphone } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "ซื้อ", href: "/properties?status=For+Sale", hasDropdown: true },
    { name: "เช่า", href: "/properties?status=For+Rent", hasDropdown: true },
    { name: "ดูทั้งหมด", href: "/properties", hasDropdown: false },
    { name: "About", href: "/about", hasDropdown: false },
    { name: "Contact", href: "/contact", hasDropdown: false },
  ];

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm relative">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px]">
          {/* Left Layout */}
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group mr-8">
              {/* This img tag looks for logo.png in the public folder */}
              <img 
                src="/logo.png" 
                alt="บ้านเช่าเชียงใหม่" 
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  // Fallback if image not yet placed in public/
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
                <span className="text-[10px] text-gray-500 font-medium">Power By CM DIGITAL MEDIA</span>
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
            {/* Download App */}
            <Link href="#" className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Smartphone size={16} />
              ดาวน์โหลดแอป
              <ChevronDown size={14} className="text-gray-500 ml-1" />
            </Link>

            {/* Login */}
            <Link
              href="/admin"
              className="bg-primary-700 hover:bg-primary-800 text-white px-5 py-2 rounded-full text-[15px] font-medium transition-colors"
            >
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden">
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
        <div className="lg:hidden bg-white border-b border-gray-200 absolute w-full left-0 top-full">
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
            <div className="border-t border-gray-200 my-2 pt-2"></div>
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-primary-50"
              onClick={() => setIsOpen(false)}
            >
              เข้าสู่ระบบ
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
