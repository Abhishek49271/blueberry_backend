import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { categories, menuItems } from '../data/cafe'
import type { MenuItem, CustomizationOption } from '../types'
import { useCart } from '../context/CartContext'
import CustomizationModal from '../components/CustomizationModal'

export default function Menu() {
  const [activeCat, setActiveCat] = useState('featured')
  const [customizing, setCustomizing] = useState<MenuItem | null>(null)
  const [justAdded, setJustAdded] = useState<string | null>(null)
  const { addItem } = useCart()

  const filtered = menuItems.filter((item) => {
    if (activeCat === 'featured') return item.popular
    return item.category === activeCat
  })

  const handleAdd = (item: MenuItem) => {
    if (item.customizations && item.customizations.length > 0) {
      setCustomizing(item)
    } else {
      addItem(item, 1, [])
      setJustAdded(item.id)
      setTimeout(() => setJustAdded(null), 1200)
    }
  }

  const handleCustomAdd = (item: MenuItem, qty: number, customs: CustomizationOption[], isLarge: boolean) => {
    addItem(item, qty, customs, isLarge)
    setCustomizing(null)
    setJustAdded(item.id)
    setTimeout(() => setJustAdded(null), 1200)
  }

  return (
    <section id="menu" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-blueberry-600 text-sm font-medium tracking-widest uppercase"
          >
            Our Menu
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl sm:text-5xl text-blueberry-950 mt-3"
          >
            Crafted with Care
          </motion.h2>
          <p className="text-gray-500 mt-4 max-w-xl mx-auto">
            Pure vegetarian favourites — from gourmet pizzas to refreshing shakes. All prices in ₹.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12 sticky top-20 z-20 bg-white/90 backdrop-blur-md py-3 rounded-2xl">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCat === cat.id
                  ? 'bg-blueberry-700 text-white shadow-md shadow-blueberry-700/20'
                  : 'bg-blueberry-50 text-blueberry-800 hover:bg-blueberry-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCat}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="group bg-cream-50 rounded-2xl p-5 border border-transparent hover:border-blueberry-200 hover:shadow-lg hover:shadow-blueberry-100/50 transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-blueberry-100 flex items-center justify-center text-3xl shrink-0">
                    {item.emoji || '🍽️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-medium text-blueberry-950 group-hover:text-blueberry-800 transition-colors">
                        {item.name}
                      </h3>
                      <div className="text-right shrink-0">
                        <span className="font-semibold text-blueberry-800">₹{item.price}</span>
                        {item.priceLarge && (
                          <p className="text-xs text-gray-400">Large ₹{item.priceLarge}</p>
                        )}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      {item.popular && (
                        <span className="text-[10px] uppercase tracking-wider bg-blueberry-100 text-blueberry-700 px-2 py-0.5 rounded-full font-medium">
                          Popular
                        </span>
                      )}
                      <button
                        onClick={() => handleAdd(item)}
                        className={`ml-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          justAdded === item.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-blueberry-700 text-white hover:bg-blueberry-800'
                        }`}
                      >
                        {justAdded === item.id ? (
                          <>
                            <Check size={14} /> Added
                          </>
                        ) : (
                          <>
                            <Plus size={14} /> Add
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {customizing && (
        <CustomizationModal
          item={customizing}
          onClose={() => setCustomizing(null)}
          onAdd={handleCustomAdd}
        />
      )}
    </section>
  )
}
