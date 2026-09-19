import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderApi } from '../api/client'
import Navbar from '../components/Navbar'
import { Package } from 'lucide-react'

export default function Orders() {
  const { user, logout, token } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return
    orderApi.list().then(setOrders).catch((e) => setError(e.message))
  }, [token])

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-display text-2xl text-blueberry-950">My Orders</h1>
            {user && <p className="text-sm text-gray-500">Hi, {user.name}</p>}
          </div>
          {user && <button onClick={logout} className="text-sm text-gray-500 hover:text-blueberry-700">Logout</button>}
        </div>
        {!token && (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Login to see your orders</p>
            <Link to="/login" className="text-blueberry-700 font-medium">Login</Link>
          </div>
        )}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {token && orders.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders yet</p>
            <Link to="/#menu" className="text-blueberry-700 font-medium mt-2 inline-block">Browse Menu</Link>
          </div>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-blueberry-950">{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                  order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                  'bg-blueberry-100 text-blueberry-700'
                }`}>{order.status.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {order.items?.map((i: any) => i.name).join(', ').slice(0, 60)}…
              </p>
              <div className="flex justify-between items-center">
                <span className="font-semibold">₹{order.total}</span>
                <div className="flex gap-3">
                  {!['DELIVERED', 'CANCELLED'].includes(order.status) && (
                    <Link to={`/track/${order.orderNumber}`} className="text-sm text-blueberry-700 font-medium">Track</Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
