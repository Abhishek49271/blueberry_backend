import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import QRCode from 'qrcode';
import {
  getSetting, findMenuItem, findCoupon, insertOrder, findOrder, updateOrder, getOrders,
} from '../db/index.js';
import { authRequired, adminRequired } from '../middleware/auth.js';

const router = Router();

function generateOrderNumber() {
  return `CAF-${Math.floor(10000 + Math.random() * 90000)}`;
}

function calcDeliveryFee(subtotal) {
  const freeAbove = Number(getSetting('delivery_free_above', '299'));
  const base = Number(getSetting('delivery_base_fee', '30'));
  return subtotal >= freeAbove ? 0 : base;
}

function calcTax(amount) {
  const pct = Number(getSetting('gst_percent', '5'));
  return Math.round((amount * pct) / 100);
}

function applyCoupon(code, subtotal) {
  if (!code) return { discount: 0, code: null };
  const c = findCoupon(code);
  if (!c) return { discount: 0, code: null, error: 'Invalid coupon' };
  if (subtotal < (c.min_order || 0)) return { discount: 0, code: null, error: `Min order ₹${c.min_order}` };
  let discount = c.type === 'flat' ? c.value : Math.round((subtotal * c.value) / 100);
  if (c.max_discount) discount = Math.min(discount, c.max_discount);
  return { discount, code: c.code };
}

function validateAndPrice(items) {
  let subtotal = 0;
  const validated = [];
  for (const line of items) {
    const menuItem = findMenuItem(line.menuItemId);
    if (!menuItem || menuItem.is_available === 0 || menuItem.is_available === false) {
      throw new Error(`Item unavailable: ${line.name || line.menuItemId}`);
    }
    const qty = Math.max(1, Number(line.quantity) || 1);
    let unit = line.isLarge && menuItem.price_large ? menuItem.price_large : menuItem.price;
    let extras = 0;
    if (Array.isArray(line.customizations)) {
      extras = line.customizations.reduce((s, c) => s + (Number(c.price) || 0), 0);
    }
    const itemTotal = (unit + extras) * qty;
    subtotal += itemTotal;
    validated.push({
      menuItemId: menuItem.id,
      name: menuItem.name + (line.isLarge ? ' (Large)' : ''),
      quantity: qty,
      basePrice: unit,
      customizations: line.customizations || [],
      itemTotal,
      emoji: menuItem.emoji,
    });
  }
  return { items: validated, subtotal };
}

function formatOrder(row) {
  if (!row) return null;
  const address = typeof row.address_json === 'string' ? JSON.parse(row.address_json) : (row.address || row.address_json);
  const items = typeof row.items_json === 'string' ? JSON.parse(row.items_json) : (row.items || row.items_json);
  return {
    id: row.id,
    orderNumber: row.order_number || row.orderNumber,
    userId: row.user_id || row.userId,
    customerName: row.customer_name || row.customerName,
    customerPhone: row.customer_phone || row.customerPhone,
    address,
    items,
    subtotal: row.subtotal,
    deliveryFee: row.delivery_fee ?? row.deliveryFee,
    discount: row.discount || 0,
    tax: row.tax || 0,
    total: row.total,
    couponCode: row.coupon_code || row.couponCode,
    paymentMethod: row.payment_method || row.paymentMethod,
    paymentStatus: row.payment_status || row.paymentStatus,
    paymentId: row.payment_id || row.paymentId,
    status: row.status,
    notes: row.notes,
    estimatedDeliveryMinutes: row.estimated_minutes || row.estimatedDeliveryMinutes || 35,
    createdAt: row.created_at || row.createdAt,
    updatedAt: row.updated_at || row.updatedAt,
  };
}

router.post('/', (req, res) => {
  try {
    const { items, address, paymentMethod, couponCode, notes, userId } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Cart is empty' });
    if (!address?.fullName || !address?.phone || !address?.house || !address?.street || !address?.pincode) {
      return res.status(400).json({ error: 'Complete address required' });
    }
    if (!['COD', 'UPI', 'CARD', 'NETBANKING', 'WALLET'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    const { items: validated, subtotal } = validateAndPrice(items);
    const deliveryFee = calcDeliveryFee(subtotal);
    const coupon = applyCoupon(couponCode, subtotal);
    if (coupon.error) return res.status(400).json({ error: coupon.error });
    const tax = calcTax(Math.max(0, subtotal - coupon.discount));
    const total = Math.max(0, subtotal + deliveryFee + tax - coupon.discount);

    const order = {
      id: uuid(),
      order_number: generateOrderNumber(),
      orderNumber: null,
      user_id: userId || null,
      customer_name: address.fullName,
      customer_phone: address.phone,
      address_json: address,
      address,
      items_json: validated,
      items: validated,
      subtotal,
      delivery_fee: deliveryFee,
      discount: coupon.discount,
      tax,
      total,
      coupon_code: coupon.code,
      payment_method: paymentMethod,
      payment_status: paymentMethod === 'COD' ? 'COD_PENDING' : 'PENDING',
      status: 'PENDING',
      notes: notes || null,
      estimated_minutes: 35,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    order.orderNumber = order.order_number;

    insertOrder(order);
    res.status(201).json(formatOrder(order));
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message || 'Could not create order' });
  }
});

router.get('/:idOrNumber', (req, res) => {
  if (req.params.idOrNumber === 'validate-coupon') return res.status(404).end();
  const row = findOrder(req.params.idOrNumber);
  if (!row) return res.status(404).json({ error: 'Order not found' });
  res.json(formatOrder(row));
});

router.get('/', authRequired, (req, res) => {
  const rows = getOrders({
    admin: req.user.role === 'admin',
    userId: req.user.id,
    phone: req.user.phone,
  });
  res.json(rows.map(formatOrder));
});

router.patch('/:id/status', adminRequired, (req, res) => {
  const { status } = req.body;
  const allowed = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
  if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const updated = updateOrder(req.params.id, { status });
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(formatOrder(updated));
});

router.patch('/:id/payment', (req, res) => {
  const { paymentStatus, paymentId } = req.body;
  const updated = updateOrder(req.params.id, {
    payment_status: paymentStatus || 'PAID',
    payment_id: paymentId || null,
  });
  if (!updated) return res.status(404).json({ error: 'Order not found' });
  res.json(formatOrder(updated));
});

router.get('/:id/upi-qr', async (req, res) => {
  try {
    const order = findOrder(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const upiId = getSetting('upi_id', 'bluberry@upi');
    const upiName = getSetting('upi_name', 'Bluberry Cafe');
    const amount = Number(order.total).toFixed(2);
    const note = `Order ${order.order_number || order.orderNumber}`;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    const qrDataUrl = await QRCode.toDataURL(upiUrl, { width: 320, margin: 2, color: { dark: '#2e1065', light: '#ffffff' } });
    res.json({
      upiId,
      upiName,
      amount: order.total,
      orderNumber: order.order_number || order.orderNumber,
      upiUrl,
      qrDataUrl,
      instructions: 'Scan with any UPI app (GPay, PhonePe, Paytm, BHIM)',
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Could not generate QR' });
  }
});

router.post('/validate-coupon', (req, res) => {
  const { code, subtotal } = req.body;
  const result = applyCoupon(code, Number(subtotal) || 0);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

export default router;
