import { useEffect, useState, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi, adminApi } from '../api/client'
import Navbar from '../components/Navbar'

const flow = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const

const actionLabel: Record<string, string> = {
  CONFIRMED: 'Confirm Order',
  PREPARING: 'Start Preparing',
  READY_FOR_PICKUP: 'Mark Ready',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Mark Delivered',
}

export default function Admin() {
  const { isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [settings, setSettings] = useState<any>({})
  const [tab, setTab] = useState<'orders' | 'settings'>('orders')
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    try {
      const [o, d, s] = await Promise.all([
        orderApi.list(),
        adminApi.dashboard(),
        adminApi.settings(),
      ])
      setOrders(o)
      setStats(d)
      setSettings(s)
    } catch (e: any) {
      setMsg(e.message || 'Failed to load. Is backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login')
      return
    }
    load()
    const t = setInterval(load, 8000) // poll for new orders
    return () => clearInterval(t)
  }, [isAdmin, navigate, load])

  const updateStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status)
      await load()
    } catch (e: any) {
      alert(e.message)
    }
  }

  const saveSettings = async () => {
    try {
      await adminApi.saveSettings(settings)
      setMsg('Settings saved')
      setTimeout(() => setMsg(''), 2000)
    } catch (e: any) {
      alert(e.message)
    }
  }

  const getNext = (status: string) => {
    const idx = flow.indexOf(status as any)
    if (idx === -1 || idx >= flow.length - 1) return null
    return flow[idx + 1]
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="font-display text-2xl text-blueberry-950">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">{user?.name} · Live orders</p>
          </div>
          <div className="flex gap-3 items-center">
            <button onClick={() => setTab('orders')} className={`text-sm font-medium ${tab === 'orders' ? 'text-blueberry-700' : 'text-gray-400'}`}>Orders</button>
            <button onClick={() => setTab('settings')} className={`text-sm font-medium ${tab === 'settings' ? 'text-blueberry-700' : 'text-gray-400'}`}>Settings</button>
            <Link to="/delivery" className="text-sm text-blueberry-700 font-medium">Delivery</Link>
            <button onClick={logout} className="text-sm text-gray-500">Logout</button>
          </div>
        </div>

        {msg && <div className="mb-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-xl">{msg}</div>}

        {tab === 'orders' && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Today's Orders", value: stats.todayOrders },
              { label: "Today's Revenue", value: `₹${stats.todayRevenue}` },
              { label: 'Pending', value: stats.pending },
              { label: 'Out for Delivery', value: stats.outForDelivery },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
                <p className="font-display text-2xl text-blueberry-950 mt-1">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'orders' && (
          <>
            <h2 className="font-medium text-lg mb-4">Orders ({orders.length})</h2>
            {loading ? (
              <p className="text-gray-400">Loading…</p>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">No orders yet</p>
                <p className="text-sm text-gray-400">When customers place orders, they appear here automatically.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const next = getNext(order.status)
                  return (
                    <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex flex-wrap justify-between gap-3 mb-3">
                        <div>
                          <p className="font-semibold text-blueberry-950">{order.orderNumber}</p>
                          <p className="text-sm text-gray-600">{order.customerName} · {order.customerPhone}</p>
                          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">₹{order.total}</p>
                          <p className="text-xs text-gray-500">{order.paymentMethod} · {order.paymentStatus}</p>
                          <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                            order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                            order.status === 'OUT_FOR_DELIVERY' ? 'bg-orange-100 text-orange-700' :
                            'bg-blueberry-100 text-blueberry-700'
                          }`}>{order.status.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {order.items?.map((i: any) => `${i.emoji || ''} ${i.name}×${i.quantity}`).join(' · ')}
                      </p>
                      <p className="text-xs text-gray-400 mb-3">
                        📍 {order.address?.house}, {order.address?.street}, {order.address?.city}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {next && (
                          <button
                            onClick={() => updateStatus(order.id, next)}
                            className="px-4 py-2 bg-blueberry-700 text-white text-sm font-semibold rounded-full"
                          >
                            {actionLabel[next] || next}
                          </button>
                        )}
                        {order.paymentMethod === 'UPI' && order.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => updateStatus(order.id, order.status)}
                            className="px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full"
                            title="Confirm UPI payment received"
                          >
                            Mark Payment Received
                          </button>
                        )}
                        {['PENDING', 'CONFIRMED'].includes(order.status) && (
                          <button onClick={() => updateStatus(order.id, 'CANCELLED')} className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-full">
                            Cancel
                          </button>
                        )}
                        <Link to={`/track/${order.orderNumber}`} className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full">
                          Tracking
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {tab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm space-y-4 max-w-lg">
            <h2 className="font-medium text-lg mb-2">Café & Payment Settings</h2>
            {[
              ['cafe_name', 'Café Name'],
              ['cafe_phone', 'Phone'],
              ['cafe_address', 'Address'],
              ['upi_id', 'UPI ID (for QR payments)'],
              ['upi_name', 'UPI Display Name'],
              ['delivery_free_above', 'Free delivery above (₹)'],
              ['delivery_base_fee', 'Delivery fee (₹)'],
              ['gst_percent', 'GST %'],
              ['razorpay_key_id', 'Razorpay Key ID'],
              ['razorpay_key_secret', 'Razorpay Key Secret'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="text-xs text-gray-500">{label}</label>
                <input
                  value={settings[key] || ''}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blueberry-500"
                  type={key.includes('secret') ? 'password' : 'text'}
                />
              </div>
            ))}
            <button onClick={saveSettings} className="w-full bg-blueberry-700 text-white py-3 rounded-full font-semibold">
              Save Settings
            </button>
            <p className="text-xs text-gray-400">
              Set your real UPI ID so customer QR payments go to your account. Add Razorpay keys for card payments.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
