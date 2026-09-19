import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Instagram, Navigation } from 'lucide-react'
import { cafeInfo } from '../data/cafe'

export default function Visit() {
  return (
    <section id="visit" className="py-24 lg:py-32 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-blueberry-600 text-sm font-medium tracking-widest uppercase"
            >
              Find Us
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl sm:text-5xl text-blueberry-950 mt-3 mb-8"
            >
              Come say hello
            </motion.h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blueberry-100 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-blueberry-700" />
                </div>
                <div>
                  <p className="font-medium text-blueberry-950">Address</p>
                  <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">{cafeInfo.address}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blueberry-100 flex items-center justify-center shrink-0">
                  <Phone size={20} className="text-blueberry-700" />
                </div>
                <div>
                  <p className="font-medium text-blueberry-950">Phone</p>
                  <a href={`tel:${cafeInfo.phoneRaw}`} className="text-blueberry-700 hover:underline text-sm mt-0.5 block">
                    {cafeInfo.phone}
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blueberry-100 flex items-center justify-center shrink-0">
                  <Clock size={20} className="text-blueberry-700" />
                </div>
                <div>
                  <p className="font-medium text-blueberry-950">Opening Hours</p>
                  <p className="text-gray-600 text-sm mt-0.5">Mon – Fri: {cafeInfo.hours.weekdays}</p>
                  <p className="text-gray-600 text-sm">Sat – Sun: {cafeInfo.hours.weekends}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-blueberry-100 flex items-center justify-center shrink-0">
                  <Instagram size={20} className="text-blueberry-700" />
                </div>
                <div>
                  <p className="font-medium text-blueberry-950">Instagram</p>
                  <p className="text-gray-600 text-sm mt-0.5">{cafeInfo.social.instagram}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${cafeInfo.social.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-blueberry-700 text-white rounded-full font-semibold hover:bg-blueberry-800 transition-colors shadow-lg shadow-blueberry-700/20"
              >
                <Phone size={18} />
                WhatsApp Order
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cafeInfo.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-blueberry-300 text-blueberry-800 rounded-full font-medium hover:bg-blueberry-50 transition-colors"
              >
                <Navigation size={18} />
                Get Directions
              </a>
            </div>

            <p className="mt-6 text-sm text-blueberry-600 font-medium">
              {cafeInfo.delivery}
            </p>
          </div>

          {/* Map placeholder / image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] bg-blueberry-100"
          >
            <img
              src="/exterior.jpg"
              alt="Bluberry Café exterior"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blueberry-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
              <p className="font-display text-lg text-blueberry-950 font-semibold">{cafeInfo.fullName}</p>
              <p className="text-sm text-gray-500 mt-0.5">{cafeInfo.shortAddress}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
