import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';
import { findUserByPhone, findUserById, insertUser, insertAddress, getAddresses } from '../db/index.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/login', (req, res) => {
  const { phone, name, password } = req.body;
  if (!phone || String(phone).length < 10) {
    return res.status(400).json({ error: 'Valid phone number required' });
  }

  let user = findUserByPhone(phone);

  if (!user) {
    user = {
      id: uuid(),
      name: name || 'Guest',
      phone,
      role: 'customer',
      created_at: new Date().toISOString(),
    };
    insertUser(user);
  } else if (user.role === 'admin') {
    if (!password) return res.status(401).json({ error: 'Admin password required' });
    if (!user.password_hash || !bcrypt.compareSync(password, user.password_hash)) {
      return res.status(401).json({ error: 'Invalid admin password' });
    }
  }

  const token = signToken(user);
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, role: user.role },
  });
});

router.get('/me', authRequired, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const addresses = getAddresses(user.id);
  res.json({
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email, role: user.role },
    addresses,
  });
});

router.post('/addresses', authRequired, (req, res) => {
  const { label, fullName, phone, house, street, city, state, pincode, instructions, lat, lng } = req.body;
  if (!fullName || !phone || !house || !street || !pincode) {
    return res.status(400).json({ error: 'Missing required address fields' });
  }
  const addr = {
    id: uuid(),
    user_id: req.user.id,
    label: label || 'Home',
    full_name: fullName,
    phone,
    house,
    street,
    city: city || 'Renukoot',
    state: state || 'Uttar Pradesh',
    pincode,
    instructions: instructions || null,
    lat: lat || null,
    lng: lng || null,
  };
  insertAddress(addr);
  res.status(201).json(addr);
});

export default router;
