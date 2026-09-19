import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus } from 'lucide-react'
import type { MenuItem, CustomizationOption } from '../types'

interface Props {
  item: MenuItem
  onClose: () => void
  onAdd: (item: MenuItem, qty: number, customs: CustomizationOption[], isLarge: boolean) => void
}

export default function CustomizationModal({ item, onClose, onAdd }: Props) {
  const [qty, setQty] = useState(1)
  const [isLarge, setIsLarge] = useState(false)
  const [selected, setSelected] = useState<CustomizationOption[]>([])

  
  const extras = item.customizations?.filter((c) => c.type !== 'size') || []

  const toggleExtra = (opt: CustomizationOption) => {
    setSelected((prev) =>
      prev.find((p) => p.id === opt.id)
        ? prev.filter((p) => p.id !== opt.id)
        : [...prev, opt]
    )
  }

  const base = isLarge && item.priceLarge ? item.priceLarge : item.price
  const extrasTotal = selected.reduce((s, c) => s + c.price, 0)
  const total = (base + extrasTotal) * qty

  const handleAdd = () => {
    const customs = [...selected]
    if (isLarge) {
      customs.push({ id: 'size-l', name: 'Large', price: 0, type: 'size' })
    }
    onAdd(item, qty, customs, isLarge)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 28 }}
          className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between rounded-t-3xl">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{item.emoji}</span>
              <div>
                <h3 className="font-display text-lg text-blueberry-950">{item.name}</h3>
                <p className="text-sm text-gray-500">Customize your order</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <div className="px-5 py-4 space-y-6">
            {/* Size */}
            {item.priceLarge && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Size</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsLarge(false)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      !isLarge
                        ? 'border-blueberry-600 bg-blueberry-50 text-blueberry-800'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Regular · ₹{item.price}
                  </button>
                  <button
                    onClick={() => setIsLarge(true)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                      isLarge
                        ? 'border-blueberry-600 bg-blueberry-50 text-blueberry-800'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Large · ₹{item.priceLarge}
                  </button>
                </div>
              </div>
            )}

            {/* Extras */}
            {extras.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Add-ons</p>
                <div className="space-y-2">
                  {extras.map((opt) => {
                    const active = selected.some((s) => s.id === opt.id)
                    return (
                      <button
                        key={opt.id}
                        onClick={() => toggleExtra(opt)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                          active
                            ? 'border-blueberry-600 bg-blueberry-50'
                            : 'border-gray-200'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="font-medium text-blueberry-700">+₹{opt.price}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Qty */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center"
                >
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 rounded-full bg-blueberry-700 text-white flex items-center justify-center"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t px-5 py-4">
            <button
              onClick={handleAdd}
              className="w-full bg-blueberry-700 text-white py-3.5 rounded-full font-semibold hover:bg-blueberry-800 transition-colors flex items-center justify-center gap-2"
            >
              Add to Cart · ₹{total}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
