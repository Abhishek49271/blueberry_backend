import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bike, CheckCircle, ChefHat, Package, MapPin } from 'lucide-react'
import { orderApi } from '../api/client'
import Navbar from '../components/Navbar'
import type { OrderStatus } from '../types'

const statusSteps: { key: OrderStatus; label: string; icon: any }[] = [
  { key: 'PENDING', label: 'Order Placed', icon: CheckCircle },
  { key: 'CONFIRMED', label: 'Café Accepted', icon: CheckCircle },
  { key: 'PREPARING', label: 'Preparing', icon: ChefHat },
  { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', icon: Package },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
  { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
]

const statusOrder: OrderStatus[] = [
  'PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED',
]

export default function TrackOrder() {
  const { orderNumber } = useParams()
  const [order, setOrder] = useState<any>(null)
  const [error, setError] = useState('')
  const [riderProgress, setRiderProgress] = useState(0)

  useEffect(() => {
    if (!orderNumber) return
    const load = async () => {
      try {
        const o = await orderApi.get(orderNumber)
        setOrder(o)
        setError('')
      } catch (e: any) {
        setError(e.message || 'Order not found')
      }
    }
    load()
    const t = setInterval(load, 5000) // poll every 5s for status updates
    return () => clearInterval(t)
  }, [orderNumber])

  useEffect(() => {
    if (order?.status !== 'OUT_FOR_DELIVERY') {
      setRiderProgress(0)
      return
    }
    const interval = setInterval(() => {
      setRiderProgress((p) => Math.min(p + 0.04, 0.95))
    }, 1200)
    return () => clearInterval(interval)
  }, [order?.status])

  if (error && !order) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-32 text-center px-4">
          <p className="text-gray-500 mb-4">{error}</p>
          <Link to="/orders" className="text-blueberry-700 font-medium">View My Orders</Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-32 text-center text-gray-400">Loading order…</div>
      </div>
    )
  }

  const currentIdx = statusOrder.indexOf(order.status)
  const visualIdx = order.status === 'PICKED_UP' ? statusOrder.indexOf('OUT_FOR_DELIVERY') : currentIdx

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500">Live Tracking</p>
          <h1 className="font-display text-2xl text-blueberry-950">{order.orderNumber}</h1>
          <p className="text-sm text-gray-400 mt-1">{order.customerName} · {order.customerPhone}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="space-y-0">
            {statusSteps.map((s, i) => {
              const stepIdx = statusOrder.indexOf(s.key)
              const done = visualIdx >= stepIdx
              const active = order.status === s.key || (s.key === 'OUT_FOR_DELIVERY' && order.status === 'PICKED_UP')
              const Icon = s.icon
              return (
                <div key={s.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${done ? 'bg-blueberry-700 text-white' : 'bg-gray-100 text-gray-400'} ${active ? 'ring-4 ring-blueberry-200 scale-110' : ''}`}>
                      <Icon size={18} />
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`w-0.5 h-10 ${done && visualIdx > stepIdx ? 'bg-blueberry-700' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <div className="pt-2 pb-2">
                    <p className={`font-medium ${done ? 'text-blueberry-950' : 'text-gray-400'}`}>{s.label}</p>
                    {active && order.status !== 'DELIVERED' && <p className="text-xs text-blueberry-600 mt-0.5">Current status</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6">
          <div className="h-56 bg-gradient-to-br from-blueberry-50 to-blueberry-100 relative">
            <div className="absolute inset-0">
              <div className="absolute w-9 h-9 bg-blueberry-700 rounded-full flex items-center justify-center text-white text-sm shadow-lg z-10" style={{ left: '18%', top: '38%' }}>☕</div>
              <div className="absolute w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm shadow-lg z-10" style={{ left: '72%', top: '58%' }}>🏠</div>
              {order.status === 'OUT_FOR_DELIVERY' && (
                <motion.div className="absolute w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-lg z-20" style={{ left: `${18 + riderProgress * 54}%`, top: `${38 + riderProgress * 20}%` }}>🚴</motion.div>
              )}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line x1="22%" y1="42%" x2="74%" y2="62%" stroke="#7c3aed" strokeWidth="2" strokeDasharray="8 5" opacity="0.4" />
              </svg>
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur rounded-xl px-4 py-2.5 text-sm flex justify-between items-center">
              <span className="font-medium text-gray-800">
                {order.status === 'OUT_FOR_DELIVERY' ? '🚴 Delivery partner is on the way'
                  : order.status === 'DELIVERED' ? '✓ Order delivered'
                  : order.status === 'PREPARING' ? '👨‍🍳 Kitchen is preparing your order'
                  : order.status === 'CONFIRMED' ? '✓ Café has accepted your order'
                  : order.status === 'READY_FOR_PICKUP' ? '📦 Order is ready'
                  : 'Waiting for café to confirm…'}
              </span>
              {order.status !== 'DELIVERED' && (
                <span className="text-blueberry-700 font-semibold text-xs whitespace-nowrap">ETA ~{order.estimatedDeliveryMinutes || 35} min</span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-lg">
          <p className="text-sm font-medium text-gray-500 mb-3">Order items</p>
          {order.items?.map((item: any, i: number) => (
            <div key={i} className="flex justify-between text-sm py-1.5">
              <span>{item.emoji} {item.name} × {item.quantity}</span>
              <span className="font-medium">₹{item.itemTotal}</span>
            </div>
          ))}
          <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
          <div className="mt-4 pt-3 border-t text-xs text-gray-400 flex items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <span>{order.address?.house}, {order.address?.street}, {order.address?.city} – {order.address?.pincode}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
