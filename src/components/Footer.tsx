import { cafeInfo } from '../data/cafe'
import { Phone, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-blueberry-950 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-blueberry-600 flex items-center justify-center">
                <span className="font-display font-bold text-lg">B</span>
              </div>
              <div>
                <p className="font-display text-xl font-semibold">{cafeInfo.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-blueberry-300">The Restro Cafe</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Pure vegetarian café in Renukoot. Freshly crafted, warmly served.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-medium text-sm uppercase tracking-wider text-blueberry-300 mb-4">Explore</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#story" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#menu" className="hover:text-white transition-colors">Menu</a></li>
              <li><a href="#signature" className="hover:text-white transition-colors">Signature</a></li>
              <li><a href="#gallery" className="hover:text-white transition-colors">Gallery</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-medium text-sm uppercase tracking-wider text-blueberry-300 mb-4">Contact</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-blueberry-400" />
                <span>{cafeInfo.shortAddress}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-blueberry-400" />
                <a href={`tel:${cafeInfo.phoneRaw}`} className="hover:text-white">{cafeInfo.phone}</a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram size={16} className="shrink-0 text-blueberry-400" />
                <span>{cafeInfo.social.instagram}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <p className="font-medium text-sm uppercase tracking-wider text-blueberry-300 mb-4">Hours</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Mon – Fri: {cafeInfo.hours.weekdays}</li>
              <li>Sat – Sun: {cafeInfo.hours.weekends}</li>
            </ul>
            <p className="mt-4 text-xs text-blueberry-400">{cafeInfo.delivery}</p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© {new Date().getFullYear()} {cafeInfo.fullName}. All rights reserved.</p>
          <p className="text-xs">Crafted with care · Pure Veg · Renukoot</p>
        </div>
      </div>
    </footer>
  )
}
