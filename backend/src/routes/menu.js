import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import { getCategories, getMenuItems, findMenuItem, upsertMenuItem, deleteMenuItem } from '../db/index.js';
import { adminRequired } from '../middleware/auth.js';

const router = Router();

function mapItem(i) {
  return {
    ...i,
    is_popular: !!i.is_popular,
    is_available: i.is_available !== 0 && i.is_available !== false,
    customizations: typeof i.customizations === 'string' ? JSON.parse(i.customizations || '[]') : (i.customizations || []),
  };
}

router.get('/', (req, res) => {
  res.json({
    categories: getCategories(),
    items: getMenuItems(true).map(mapItem),
  });
});

router.get('/all', adminRequired, (req, res) => {
  res.json({
    categories: getCategories(),
    items: getMenuItems(false).map(mapItem),
  });
});

router.post('/items', adminRequired, (req, res) => {
  const { name, category_id, description, price, price_large, emoji, is_popular, customizations } = req.body;
  if (!name || price == null) return res.status(400).json({ error: 'Name and price required' });
  const id = uuid();
  upsertMenuItem({
    id,
    category_id: category_id || null,
    name,
    description: description || null,
    price,
    price_large: price_large || null,
    emoji: emoji || '🍽️',
    is_popular: is_popular ? 1 : 0,
    is_available: 1,
    customizations: customizations || [],
  });
  res.status(201).json({ id, message: 'Item added' });
});

router.put('/items/:id', adminRequired, (req, res) => {
  const item = findMenuItem(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  upsertMenuItem({
    ...item,
    ...req.body,
    id: item.id,
    is_popular: req.body.is_popular !== undefined ? (req.body.is_popular ? 1 : 0) : item.is_popular,
    is_available: req.body.is_available !== undefined ? (req.body.is_available ? 1 : 0) : item.is_available,
  });
  res.json({ message: 'Updated' });
});

router.delete('/items/:id', adminRequired, (req, res) => {
  deleteMenuItem(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
