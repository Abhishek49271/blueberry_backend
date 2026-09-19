import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, CreditCard, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { orderApi } from '../api/client'
import type { PaymentMethod } from '../types'
import Navbar from '../components/Navbar'
import CartDrawer from '../components/CartDrawer'

const steps = ['Address', 'Summary', 'Payment']

export default function Checkout() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(0)
  const [couponCode, setCouponCode] = useState('')
  const [couponMsg, setCouponMsg] = useState('')
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD')
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState('')
  const [upiQr, setUpiQr] = useState<any>(null)
  const [pendingOrderId, setPendingOrderId] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    city: 'Renukoot',
    state: 'Uttar Pradesh',
    pincode: '',
    instructions: '',
  })

  // Client-side estimate only — final price comes from server
  const estDelivery = subtotal >= 299 ? 0 : 30
  const estTax = Math.round((subtotal - discount) * 0.05)
  const estTotal = Math.max(0, subtotal + estDelivery + estTax - discount)

  if (items.length === 0 && step === 0 && !pendingOrderId) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-32 text-center">
          <p className="text-gray-500">Your cart is empty</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blueberry-700 font-medium">
            Back to Menu
          </button>
        </div>
      </div>
    )
  }

  const applyCouponCode = async () => {
    try {
      const res = await orderApi.validateCoupon(couponCode, subtotal)
      setDiscount(res.discount || 0)
      setCouponMsg(res.code ? `Coupon ${res.code} applied` : 'Applied')
    } catch (e: any) {
      setDiscount(0)
      setCouponMsg(e.message || 'Invalid coupon')
    }
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    setError('')
    try {
      const payload = {
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          isLarge: i.name.includes('(Large)'),
          customizations: i.selectedCustomizations,
        })),
        address: {
          fullName: form.fullName,
          phone: form.phone,
          house: form.house,
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          instructions: form.instructions,
        },
        paymentMethod,
        couponCode: discount > 0 ? couponCode : undefined,
        notes: form.instructions,
      }

      const order = await orderApi.create(payload)
      clearCart()

      if (paymentMethod === 'UPI') {
        const qr = await orderApi.getUpiQr(order.id)
        setUpiQr(qr)
        setPendingOrderId(order.id)
        setProcessing(false)
        return
      }

      // COD or other — go to confirmation
      navigate(`/order-confirmation/${order.orderNumber}`)
    } catch (e: any) {
      setError(e.message || 'Could not place order. Is the backend running?')
      setProcessing(false)
    }
  }

  const confirmUpiPaid = async () => {
    if (!pendingOrderId) return
    setProcessing(true)
    try {
      await orderApi.markUpiPaid(pendingOrderId)
      const order = await orderApi.get(pendingOrderId)
      navigate(`/order-confirmation/${order.orderNumber}`)
    } catch (e: any) {
      setError(e.message)
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <CartDrawer />
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        {!upiQr && (
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    i <= step ? 'bg-blueberry-700 text-white' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i < step ? <CheckCircle size={16} /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${i <= step ? 'text-blueberry-800' : 'text-gray-400'}`}>
                  {s}
                </span>
                {i < steps.length - 1 && <div className="w-8 h-px bg-gray-200" />}
              </div>
            ))}
          </div>
        )}

        <motion.div
          key={upiQr ? 'qr' : step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-lg p-6 sm:p-8"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl">{error}</div>
          )}

          {/* UPI QR screen */}
          {upiQr && (
            <div className="text-center">
              <h2 className="font-display text-2xl text-blueberry-950 mb-2">Pay via UPI</h2>
              <p className="text-gray-500 text-sm mb-1">Order {upiQr.orderNumber}</p>
              <p className="font-display text-3xl text-blueberry-800 mb-6">₹{upiQr.amount}</p>
              <img
                src={upiQr.qrDataUrl}
                alt="UPI QR Code"
                className="mx-auto w-64 h-64 rounded-2xl border border-gray-100 shadow-sm"
              />
              <p className="text-sm text-gray-500 mt-4">{upiQr.instructions}</p>
              <p className="text-xs text-gray-400 mt-1">
                UPI ID: {upiQr.upiId} · {upiQr.upiName}
              </p>
              <div className="mt-8 space-y-3">
                <button
                  onClick={confirmUpiPaid}
                  disabled={processing}
                  className="w-full bg-emerald-600 text-white py-3.5 rounded-full font-semibold disabled:opacity-60"
                >
                  {processing ? 'Confirming…' : "I've Paid — Confirm Order"}
                </button>
                <p className="text-xs text-gray-400">
                  Café will verify the payment. Keep your UTR ready if asked.
                </p>
              </div>
            </div>
          )}

          {!upiQr && step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-2xl text-blueberry-950 mb-6 flex items-center gap-2">
                <MapPin size={22} /> Delivery Address
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <input placeholder="Full Name *" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none" />
                <input placeholder="Mobile Number *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none" />
                <input placeholder="House / Flat No. *" value={form.house} onChange={(e) => setForm({ ...form, house: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none sm:col-span-2" />
                <input placeholder="Street / Area *" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none sm:col-span-2" />
                <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none" />
                <input placeholder="Pincode *" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none" />
                <textarea placeholder="Delivery instructions (optional)" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blueberry-500 outline-none sm:col-span-2" rows={2} />
              </div>
              <button
                onClick={() => {
                  if (form.fullName && form.phone && form.house && form.street && form.pincode) setStep(1)
                }}
                className="w-full mt-4 bg-blueberry-700 text-white py-3.5 rounded-full font-semibold flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={18} />
              </button>
            </div>
          )}

          {!upiQr && step === 1 && (
            <div>
              <h2 className="font-display text-2xl text-blueberry-950 mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.emoji} {item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{item.itemTotal}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>{estDelivery === 0 ? 'FREE' : `₹${estDelivery}`}</span></div>
                {discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-₹{discount}</span></div>}
                <div className="flex justify-between"><span className="text-gray-500">Tax (est.)</span><span>₹{estTax}</span></div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t"><span>Total (est.)</span><span>₹{estTotal}</span></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Final amount calculated securely on server</p>
              <div className="mt-6 flex gap-2">
                <input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-blueberry-500" />
                <button onClick={applyCouponCode} className="px-5 py-2.5 bg-blueberry-100 text-blueberry-800 rounded-xl font-medium text-sm">Apply</button>
              </div>
              {couponMsg && <p className={`text-sm mt-2 ${discount > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{couponMsg}</p>}
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(0)} className="flex-1 py-3 rounded-full border border-gray-200 font-medium flex items-center justify-center gap-2"><ArrowLeft size={16} /> Back</button>
                <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-full bg-blueberry-700 text-white font-semibold flex items-center justify-center gap-2">Continue <ArrowRight size={16} /></button>
              </div>
            </div>
          )}

          {!upiQr && step === 2 && (
            <div>
              <h2 className="font-display text-2xl text-blueberry-950 mb-6 flex items-center gap-2"><CreditCard size={22} /> Payment</h2>
              <div className="space-y-3">
                {[
                  { id: 'COD' as PaymentMethod, label: 'Cash on Delivery', desc: 'Pay when order arrives' },
                  { id: 'UPI' as PaymentMethod, label: 'UPI / QR Code', desc: 'GPay, PhonePe, Paytm — scan QR' },
                  { id: 'CARD' as PaymentMethod, label: 'Card / Net Banking', desc: 'Via Razorpay (if configured)' },
                ].map((m) => (
                  <button key={m.id} onClick={() => setPaymentMethod(m.id)} className={`w-full text-left px-5 py-4 rounded-2xl border transition-all ${paymentMethod === m.id ? 'border-blueberry-600 bg-blueberry-50' : 'border-gray-200'}`}>
                    <p className="font-medium text-blueberry-950">{m.label}</p>
                    <p className="text-sm text-gray-500">{m.desc}</p>
                  </button>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blueberry-50 rounded-2xl flex justify-between items-center">
                <span className="font-medium">Amount to pay</span>
                <span className="font-display text-2xl text-blueberry-900">₹{estTotal}</span>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border border-gray-200 font-medium">Back</button>
                <button onClick={handlePlaceOrder} disabled={processing} className="flex-1 py-3.5 rounded-full bg-blueberry-700 text-white font-semibold disabled:opacity-60">
                  {processing ? 'Placing order…' : paymentMethod === 'UPI' ? 'Generate QR & Place Order' : 'Place Order'}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
