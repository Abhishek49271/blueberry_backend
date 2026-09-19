import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { calcDeliveryFee } from '../utils/pricing';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, updateQuantity, removeItem } = useCart();
  const deliveryFee = calcDeliveryFee(subtotal);
  const total = subtotal + deliveryFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-[70] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-blueberry-700" />
                <h2 className="font-display text-xl text-blueberry-950">Your Cart</h2>
                {itemCount > 0 && (
                  <span className="bg-blueberry-100 text-blueberry-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-2 rounded-full hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Your cart is empty</p>
                  <button
                    onClick={closeCart}
                    className="mt-4 text-blueberry-700 font-medium text-sm"
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-cream-50 rounded-2xl p-3">
                    <div className="w-16 h-16 rounded-xl bg-blueberry-100 flex items-center justify-center text-2xl shrink-0">
                      {item.emoji || '🍽️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-blueberry-950 text-sm leading-tight truncate">
                        {item.name}
                      </h3>
                      {item.selectedCustomizations.length > 0 && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {item.selectedCustomizations.map((c) => c.name).join(', ')}
                        </p>
                      )}
                      <p className="text-blueberry-800 font-semibold text-sm mt-1">
                        ₹{item.itemTotal}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-blueberry-700 text-white flex items-center justify-center"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto p-1.5 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-3 bg-white">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg text-blueberry-950 pt-2 border-t">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full text-center bg-blueberry-700 text-white py-3.5 rounded-full font-semibold hover:bg-blueberry-800 transition-colors"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
