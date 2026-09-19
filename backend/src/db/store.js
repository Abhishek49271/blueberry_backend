import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensure() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      users: [],
      addresses: [],
      categories: [],
      menu_items: [],
      orders: [],
      coupons: [],
      settings: {},
      delivery_locations: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

function read() {
  ensure();
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function write(data) {
  ensure();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function getDb() {
  return read();
}

export function saveDb(data) {
  write(data);
}

export function getSetting(key, fallback = '') {
  const db = read();
  return db.settings[key] !== undefined ? db.settings[key] : fallback;
}

export function setSetting(key, value) {
  const db = read();
  db.settings[key] = String(value);
  write(db);
}

export function findUserByPhone(phone) {
  return read().users.find((u) => u.phone === phone);
}

export function findUserById(id) {
  return read().users.find((u) => u.id === id);
}

export function insertUser(user) {
  const db = read();
  db.users.push(user);
  write(db);
  return user;
}

export function getMenuItems(availableOnly = true) {
  const items = read().menu_items;
  return availableOnly ? items.filter((i) => i.is_available !== 0 && i.is_available !== false) : items;
}

export function getCategories() {
  return read().categories.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export function findMenuItem(id) {
  return read().menu_items.find((i) => i.id === id);
}

export function upsertMenuItem(item) {
  const db = read();
  const idx = db.menu_items.findIndex((i) => i.id === item.id);
  if (idx >= 0) db.menu_items[idx] = { ...db.menu_items[idx], ...item };
  else db.menu_items.push(item);
  write(db);
}

export function deleteMenuItem(id) {
  const db = read();
  db.menu_items = db.menu_items.filter((i) => i.id !== id);
  write(db);
}

export function insertOrder(order) {
  const db = read();
  db.orders.unshift(order);
  write(db);
  return order;
}

export function findOrder(idOrNumber) {
  return read().orders.find((o) => o.id === idOrNumber || o.order_number === idOrNumber || o.orderNumber === idOrNumber);
}

export function updateOrder(idOrNumber, patch) {
  const db = read();
  const idx = db.orders.findIndex(
    (o) => o.id === idOrNumber || o.order_number === idOrNumber || o.orderNumber === idOrNumber
  );
  if (idx < 0) return null;
  db.orders[idx] = {
    ...db.orders[idx],
    ...patch,
    updated_at: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  write(db);
  return db.orders[idx];
}

export function getOrders({ userId, phone, admin } = {}) {
  let orders = read().orders;
  if (admin) return orders;
  if (userId || phone) {
    orders = orders.filter(
      (o) => o.user_id === userId || o.userId === userId || o.customer_phone === phone || o.customerPhone === phone
    );
  }
  return orders;
}

export function findCoupon(code) {
  if (!code) return null;
  return read().coupons.find((c) => c.code === code.toUpperCase() && c.is_active !== 0 && c.is_active !== false);
}

export function getAllCoupons() {
  return read().coupons;
}

export function insertCoupon(c) {
  const db = read();
  db.coupons.push(c);
  write(db);
}

export function insertAddress(addr) {
  const db = read();
  db.addresses.push(addr);
  write(db);
  return addr;
}

export function getAddresses(userId) {
  return read().addresses.filter((a) => a.user_id === userId);
}

export { DATA_DIR, DB_FILE };
