import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { featuredItems } from '../data/cafe'

export default function FeaturedCarousel() {
  const [active, setActive] = useState(0)

  const next = () => setActive((a) => (a + 1) % featuredItems.length)
  const prev = () => setActive((a) => (a - 1 + featuredItems.length) % featuredItems.length)

  const getOffset = (index: number) => {
    let diff = index - active
    if (diff > featuredItems.length / 2) diff -= featuredItems.length
    if (diff < -featuredItems.length / 2) diff += featuredItems.length
    return diff
  }

  return (
    <section className="py-24 lg:py-32 bg-blueberry-950 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blueberry-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blueberry-300 text-sm font-medium tracking-widest uppercase"
          >
            Must Try
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl text-white mt-3"
          >
            Signature Favourites
          </motion.h2>
        </div>

        <div className="relative h-[420px] sm:h-[480px] perspective-1000">
          <div className="absolute inset-0 flex items-center justify-center preserve-3d">
            {featuredItems.map((item, i) => {
              const offset = getOffset(i)
              const isActive = offset === 0
              const absOffset = Math.abs(offset)

              return (
                <motion.div
                  key={item.id}
                  className="absolute w-[280px] sm:w-[320px] cursor-pointer"
                  style={{ zIndex: isActive ? 20 : 10 - absOffset }}
                  animate={{
                    x: offset * 220,
                    scale: isActive ? 1 : 0.75 - absOffset * 0.05,
                    rotateY: offset * -25,
                    opacity: absOffset > 2 ? 0 : 1 - absOffset * 0.25,
                    filter: isActive ? 'blur(0px)' : `blur(${absOffset * 1.5}px)`,
                  }}
                  transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                  onClick={() => setActive(i)}
                >
                  <div
                    className={`rounded-3xl overflow-hidden bg-white shadow-2xl transition-shadow duration-500 ${
                      isActive ? 'shadow-blueberry-500/30' : ''
                    }`}
                  >
                    <div className="h-48 sm:h-56 bg-gradient-to-br from-blueberry-100 to-blueberry-200 flex items-center justify-center relative">
                      <span className="text-6xl opacity-40">
                        {item.name.includes('Pizza') ? '🍕' :
                         item.name.includes('Burger') ? '🍔' :
                         item.name.includes('Shake') || item.name.includes('Coffee') ? '🥤' :
                         item.name.includes('Lava') || item.name.includes('Choco') ? '🍫' : '✨'}
                      </span>
                      {item.popular && (
                        <span className="absolute top-3 right-3 bg-blueberry-700 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-display text-xl text-blueberry-950 font-semibold leading-tight mb-1">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                      )}
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-blueberry-800">₹{item.price}</span>
                        {item.priceLarge && (
                          <span className="text-sm text-gray-400">/ ₹{item.priceLarge} large</span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex gap-2">
            {featuredItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === active ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                }`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full border border-white/30 text-white flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Next"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}
