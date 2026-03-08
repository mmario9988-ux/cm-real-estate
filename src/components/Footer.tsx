import Link from "next/link";
import { MapPin, Phone, Mail, Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-900 text-primary-50 py-12 border-t border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold tracking-tight mb-4 text-white">Chiang Mai Estates</h3>
            <p className="text-primary-200 mb-6 max-w-sm leading-relaxed">
              Discover your perfect home in the Rose of the North. We curate the finest properties embracing the Lanna lifestyle and modern comfort.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-primary-200 hover:text-accent-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="text-primary-200 hover:text-accent-500 transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/properties" className="text-primary-200 hover:text-white transition-colors">Properties</Link></li>
              <li><Link href="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-primary-200 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-accent-500 shrink-0 mt-1" />
                <span className="text-primary-200">123 Nimmanahaeminda Road, Suthep, Chiang Mai 50200</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-accent-500 shrink-0" />
                <span className="text-primary-200">+66 (0) 53-123-456</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-accent-500 shrink-0" />
                <span className="text-primary-200">sawadee@chiangmaiestates.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-800/50 flex flex-col md:flex-row justify-between items-center text-primary-200/60 text-sm">
          <p>&copy; {new Date().getFullYear()} Chiang Mai Estates. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <Link href="#" className="hover:text-primary-200 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-200 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
