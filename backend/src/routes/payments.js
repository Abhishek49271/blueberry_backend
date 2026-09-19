import { Router } from 'express';
import crypto from 'crypto';
import { getSetting, findOrder, updateOrder } from '../db/index.js';

const router = Router();

router.post('/razorpay/create', async (req, res) => {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID || getSetting('razorpay_key_id');
    const keySecret = process.env.RAZORPAY_KEY_SECRET || getSetting('razorpay_key_secret');
    if (!keyId || !keySecret) {
      return res.status(400).json({
        error: 'Razorpay not configured',
        message: 'Add RAZORPAY keys in .env or Admin settings. Use UPI QR instead.',
      });
    }
    const { orderId } = req.body;
    const order = findOrder(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const Razorpay = (await import('razorpay')).default;
    const rzp = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.order_number || order.orderNumber,
      notes: { order_id: order.id },
    });
    updateOrder(order.id, { razorpay_order_id: rzpOrder.id });
    res.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId,
      orderNumber: order.order_number || order.orderNumber,
      customerName: order.customer_name || order.customerName,
      customerPhone: order.customer_phone || order.customerPhone,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || 'Payment init failed' });
  }
});

router.post('/razorpay/verify', (req, res) => {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET || getSetting('razorpay_key_secret');
    if (!keySecret) return res.status(400).json({ error: 'Razorpay not configured' });
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields' });
    }
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex');
    if (expected !== razorpay_signature) {
      return res.status(400).json({ error: 'Payment verification failed', verified: false });
    }
    const order = findOrder(orderId) || findOrder(razorpay_order_id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    updateOrder(order.id, {
      payment_status: 'PAID',
      payment_id: razorpay_payment_id,
      status: order.status === 'PENDING' ? 'CONFIRMED' : order.status,
    });
    res.json({ verified: true, paymentId: razorpay_payment_id, message: 'Payment successful' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Verification error' });
  }
});

router.post('/upi/mark-paid', (req, res) => {
  const { orderId, utr } = req.body;
  const order = findOrder(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  updateOrder(order.id, {
    payment_status: 'PENDING',
    payment_id: utr ? `UTR:${utr}` : 'UPI_CLAIMED',
  });
  res.json({ message: 'Payment claim received. Café will verify.', status: 'PENDING_VERIFICATION' });
});

export default router;
