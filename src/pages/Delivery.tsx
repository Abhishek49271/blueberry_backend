import { useOrders } from '../context/OrderContext'
import Navbar from '../components/Navbar'
import { Bike } from 'lucide-react'

export default function Delivery() {
  const { orders, updateOrderStatus } = useOrders()
  const active = orders.filter((o) =>
    ['READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status)
  )

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-28 pb-16">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <Bike size={24} className="text-orange-600" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-blueberry-950">Delivery Partner</h1>
            <p className="text-sm text-gray-500">Demo panel</p>
          </div>
        </div>

        {active.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-gray-400">
            No active deliveries
          </div>
        ) : (
          <div className="space-y-4">
            {active.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="font-semibold">{order.orderNumber}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {order.address.fullName}
                </p>
                <p className="text-sm text-gray-500">
                  {order.address.house}, {order.address.street}
                </p>
                <p className="text-xs text-blueberry-600 mt-2">
                  Status: {order.status.replace(/_/g, ' ')}
                </p>
                <div className="flex gap-2 mt-4">
                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'OUT_FOR_DELIVERY')}
                      className="flex-1 bg-orange-500 text-white py-2.5 rounded-full text-sm font-semibold"
                    >
                      Start Delivery
                    </button>
                  )}
                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="flex-1 bg-emerald-600 text-white py-2.5 rounded-full text-sm font-semibold"
                    >
                      Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
