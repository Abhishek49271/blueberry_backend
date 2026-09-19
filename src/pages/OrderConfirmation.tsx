import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Clock } from 'lucide-react'
import { orderApi } from '../api/client'
import Navbar from '../components/Navbar'

export default function OrderConfirmation() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (orderNumber) {
      orderApi.get(orderNumber).then(setOrder).catch(() => {})
    }
  }, [orderNumber])

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-32 text-center text-gray-400">Loading…</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-32 pb-16 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-emerald-600" />
        </motion.div>
        <h1 className="font-display text-3xl text-blueberry-950 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-1">Order {order.orderNumber}</p>
        <p className="text-sm text-gray-400 mb-8">The café has received your order.</p>
        <div className="bg-white rounded-3xl p-6 shadow-lg text-left space-y-4 mb-8">
          <div className="flex items-center gap-3">
            <Clock size={18} className="text-blueberry-600" />
            <div>
              <p className="text-sm text-gray-500">Estimated delivery</p>
              <p className="font-medium">30–40 minutes</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-blueberry-600" />
            <div>
              <p className="text-sm text-gray-500">Delivering to</p>
              <p className="font-medium text-sm">{order.address?.house}, {order.address?.street}, {order.address?.city}</p>
            </div>
          </div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
          <p className="text-xs text-gray-400">Payment: {order.paymentMethod} · {order.paymentStatus}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to={`/track/${order.orderNumber}`} className="flex-1 bg-blueberry-700 text-white py-3.5 rounded-full font-semibold text-center">Track Order</Link>
          <Link to="/" className="flex-1 border border-blueberry-300 text-blueberry-800 py-3.5 rounded-full font-medium text-center">Continue Shopping</Link>
        </div>
      </div>
    </div>
  )
}
