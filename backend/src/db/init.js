import bcrypt from 'bcryptjs';
import { getDb, saveDb } from './store.js';

const db = getDb();

// Admin
if (!db.users.find((u) => u.phone === '9999999999')) {
  db.users.push({
    id: 'admin-1',
    name: 'Café Admin',
    phone: '9999999999',
    password_hash: bcrypt.hashSync('admin123', 10),
    role: 'admin',
    created_at: new Date().toISOString(),
  });
  console.log('Admin created: phone 9999999999 / password admin123');
}

// Coupons
if (db.coupons.length === 0) {
  db.coupons = [
    { id: 'c1', code: 'WELCOME50', type: 'flat', value: 50, min_order: 200, max_discount: null, is_active: 1, description: '₹50 off on orders above ₹200' },
    { id: 'c2', code: 'CAFE10', type: 'percent', value: 10, min_order: 150, max_discount: 100, is_active: 1, description: '10% off up to ₹100' },
    { id: 'c3', code: 'FIRSTORDER', type: 'flat', value: 75, min_order: 250, max_discount: null, is_active: 1, description: '₹75 off on first order above ₹250' },
  ];
}

// Settings
const defaults = {
  cafe_name: 'Bluberry The Restro Cafe',
  cafe_phone: '9278242692',
  cafe_address: 'Kalkatta Battery, In front of Smart Point, Shiva Park, Renukoot, Sonbhadra',
  cafe_lat: '24.2056',
  cafe_lng: '83.0347',
  upi_id: 'bluberry@upi',
  upi_name: 'Bluberry Cafe',
  delivery_free_above: '299',
  delivery_base_fee: '30',
  gst_percent: '5',
  razorpay_key_id: '',
  razorpay_key_secret: '',
};
for (const [k, v] of Object.entries(defaults)) {
  if (db.settings[k] === undefined) db.settings[k] = v;
}

// Categories + menu
if (db.categories.length === 0) {
  db.categories = [
    { id: 'featured', name: 'Signature', sort_order: 0 },
    { id: 'pizza', name: 'Pizza', sort_order: 1 },
    { id: 'burger', name: 'Burgers', sort_order: 2 },
    { id: 'garlic', name: 'Garlic Bread', sort_order: 3 },
    { id: 'beverages', name: 'Beverages', sort_order: 4 },
    { id: 'dessert', name: 'Desserts', sort_order: 5 },
    { id: 'snacks', name: 'Snacks', sort_order: 6 },
    { id: 'pasta', name: 'Pasta', sort_order: 7 },
    { id: 'wrap', name: 'Wraps', sort_order: 8 },
    { id: 'maggi', name: 'Maggi', sort_order: 9 },
  ];
}

if (db.menu_items.length === 0) {
  db.menu_items = [
    { id: 'blueberry-mix-master', category_id: 'pizza', name: 'Blueberry Mix Master Pizza', description: 'Signature pizza', price: 220, price_large: 350, emoji: '🍕', is_popular: 1, is_available: 1 },
    { id: 'maha-veggie', category_id: 'burger', name: 'Maha Veggie Burger', description: 'Loaded double patty', price: 199, price_large: null, emoji: '🍔', is_popular: 1, is_available: 1 },
    { id: 'blueberry-shake', category_id: 'beverages', name: 'Blueberry Shake', description: 'House special', price: 149, price_large: null, emoji: '🥤', is_popular: 1, is_available: 1 },
    { id: 'choco-lava', category_id: 'dessert', name: 'Choco Lava Cake', description: 'Molten chocolate', price: 71, price_large: null, emoji: '🍫', is_popular: 1, is_available: 1 },
    { id: 'margherita', category_id: 'pizza', name: 'Margherita Pizza', description: null, price: 91, price_large: 155, emoji: '🍕', is_popular: 0, is_available: 1 },
    { id: 'paneer-tandoori', category_id: 'pizza', name: 'Paneer Tandoori Pizza', description: null, price: 170, price_large: 280, emoji: '🍕', is_popular: 1, is_available: 1 },
    { id: 'aloo-tikki', category_id: 'burger', name: 'Aloo Tikki Burger', description: null, price: 49, price_large: null, emoji: '🍔', is_popular: 0, is_available: 1 },
    { id: 'crunchy-paneer', category_id: 'burger', name: 'Crunchy Paneer Burger', description: null, price: 119, price_large: null, emoji: '🍔', is_popular: 1, is_available: 1 },
    { id: 'cheese-garlic', category_id: 'garlic', name: 'Cheese Garlic Bread', description: null, price: 75, price_large: null, emoji: '🥖', is_popular: 0, is_available: 1 },
    { id: 'cold-coffee', category_id: 'beverages', name: 'Cold Coffee', description: null, price: 99, price_large: null, emoji: '🧊', is_popular: 1, is_available: 1 },
    { id: 'french-fries', category_id: 'snacks', name: 'Classic French Fries', description: null, price: 70, price_large: null, emoji: '🍟', is_popular: 0, is_available: 1 },
    { id: 'peri-peri-fries', category_id: 'snacks', name: 'Peri Peri Fries with Sauce', description: null, price: 110, price_large: null, emoji: '🍟', is_popular: 1, is_available: 1 },
    { id: 'creamy-cheese', category_id: 'pasta', name: 'Creamy Cheese Pasta', description: null, price: 139, price_large: null, emoji: '🍝', is_popular: 1, is_available: 1 },
    { id: 'crispy-paneer-wrap', category_id: 'wrap', name: 'Crispy Paneer Wrap', description: null, price: 149, price_large: null, emoji: '🌯', is_popular: 1, is_available: 1 },
    { id: 'cheese-maggi', category_id: 'maggi', name: 'Cheese Maggi', description: null, price: 99, price_large: null, emoji: '🍜', is_popular: 1, is_available: 1 },
    { id: 'hot-coffee', category_id: 'beverages', name: 'Hot Coffee', description: null, price: 49, price_large: null, emoji: '☕', is_popular: 0, is_available: 1 },
    { id: 'coke-sprite', category_id: 'beverages', name: 'Coke / Sprite', description: null, price: 40, price_large: null, emoji: '🥤', is_popular: 0, is_available: 1 },
  ];
  console.log('Sample menu seeded');
}

saveDb(db);
console.log('Database ready (JSON file — works on Windows, no Visual Studio needed)');
