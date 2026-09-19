import { motion } from 'framer-motion'

export default function Story() {
  return (
    <section id="story" className="py-24 lg:py-32 bg-cream-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left editorial text */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-blueberry-600 text-sm font-medium tracking-widest uppercase mb-4 block"
            >
              Our Story
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl text-blueberry-950 leading-tight mb-6"
            >
              More than coffee.
              <span className="block italic font-accent text-blueberry-700">A place to slow down.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg leading-relaxed mb-6"
            >
              In the heart of Renukoot, Bluberry was born from a simple idea — create a pure-veg space where every cup, every pizza, every moment feels intentional.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 leading-relaxed"
            >
              We source fresh ingredients daily, craft recipes with care, and serve them in an atmosphere that invites you to stay a little longer. Whether it’s a quiet morning coffee or an evening with friends, we’re here for it.
            </motion.p>
          </div>

          {/* Right visual composition */}
          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <div className="rounded-2xl overflow-hidden aspect-[3/4] shadow-xl">
                  <img src="/interior2.jpg" alt="Café atmosphere" className="w-full h-full object-cover" />
                </div>
                <div className="bg-blueberry-900 text-white rounded-2xl p-6">
                  <p className="font-display text-3xl font-semibold mb-1">50+</p>
                  <p className="text-blueberry-200 text-sm">Restaurants across India</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 }}
                className="space-y-4 pt-12"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-blueberry-100">
                  <p className="text-blueberry-700 font-medium text-sm uppercase tracking-wider mb-2">Pure Veg</p>
                  <p className="font-display text-2xl text-blueberry-950">100% Vegetarian</p>
                  <p className="text-gray-500 text-sm mt-1">Crafted for every palate</p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square shadow-xl">
                  <img src="/counter.jpg" alt="Order counter" className="w-full h-full object-cover" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
