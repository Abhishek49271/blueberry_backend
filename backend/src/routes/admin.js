import { Router } from 'express';
import { getOrders, getSetting, setSetting, getAllCoupons, insertCoupon } from '../db/index.js';
import { adminRequired } from '../middleware/auth.js';

const router = Router();
router.use(adminRequired);

router.get('/dashboard', (req, res) => {
  const all = getOrders({ admin: true });
  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = all.filter((o) => {
    const d = (o.created_at || o.createdAt || '').slice(0, 10);
    return d === today;
  });
  const revenue = todayOrders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((s, o) => s + (o.total || 0), 0);
  const byStatus = {};
  for (const o of all) byStatus[o.status] = (byStatus[o.status] || 0) + 1;
  res.json({
    todayOrders: todayOrders.length,
    todayRevenue: revenue,
    pending: byStatus['PENDING'] || 0,
    preparing: (byStatus['PREPARING'] || 0) + (byStatus['CONFIRMED'] || 0),
    outForDelivery: byStatus['OUT_FOR_DELIVERY'] || 0,
    delivered: byStatus['DELIVERED'] || 0,
    totalOrders: all.length,
    byStatus,
  });
});

router.get('/settings', (req, res) => {
  const keys = [
    'cafe_name', 'cafe_phone', 'cafe_address', 'cafe_lat', 'cafe_lng',
    'upi_id', 'upi_name', 'delivery_free_above', 'delivery_base_fee', 'gst_percent',
    'razorpay_key_id', 'razorpay_key_secret',
  ];
  const settings = {};
  for (const k of keys) {
    settings[k] = getSetting(k, '');
    if (k === 'razorpay_key_secret' && settings[k]) settings[k] = '••••••••';
  }
  res.json(settings);
});

router.put('/settings', (req, res) => {
  const allowed = [
    'cafe_name', 'cafe_phone', 'cafe_address', 'cafe_lat', 'cafe_lng',
    'upi_id', 'upi_name', 'delivery_free_above', 'delivery_base_fee', 'gst_percent',
    'razorpay_key_id', 'razorpay_key_secret',
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined && req.body[key] !== '••••••••') {
      setSetting(key, req.body[key]);
    }
  }
  res.json({ message: 'Settings saved' });
});

router.get('/coupons', (req, res) => {
  res.json(getAllCoupons());
});

router.post('/coupons', (req, res) => {
  const { code, type, value, min_order, max_discount, description } = req.body;
  if (!code || !type || value == null) return res.status(400).json({ error: 'Missing fields' });
  insertCoupon({
    id: `c-${Date.now()}`,
    code: code.toUpperCase(),
    type,
    value,
    min_order: min_order || 0,
    max_discount: max_discount || null,
    is_active: 1,
    description: description || '',
  });
  res.status(201).json({ message: 'Coupon created' });
});

export default router;
