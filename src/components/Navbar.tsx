"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Home } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Properties", href: "/properties" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur-md sticky top-0 z-50 border-b border-primary-100 dark:border-primary-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary-500 text-white p-2 rounded-lg group-hover:bg-primary-600 transition-colors">
                <Home size={20} />
              </div>
              <span className="text-xl font-semibold text-primary-900 dark:text-primary-100 tracking-tight">Chiang Mai <span className="text-accent-600">Estates</span></span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground/80 hover:text-primary-600 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="bg-accent-500 hover:bg-accent-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Portal
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-foreground/80 hover:text-primary-600 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-primary-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground/80 hover:text-primary-600 hover:bg-primary-50"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-accent-600 hover:bg-accent-50"
              onClick={() => setIsOpen(false)}
            >
              Agent Portal
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
