import type { MenuItem, Coupon, DeliveryConfig } from '../types';

export const cafeInfo = {
  name: "Bluberry",
  fullName: "Bluberry The Restro Cafe",
  tagline: "Pure Vegetarian Moments. Crafted with Care.",
  shortTagline: "More than coffee. A place to slow down.",
  description: "A cozy pure-veg café in the heart of Renukoot, serving artisan beverages, gourmet pizzas, burgers, wraps and more — made fresh every day.",
  phone: "+91 92782 42692",
  phoneRaw: "9278242692",
  address: "Kalkatta Battery, In front of Smart Point, Shiva Park, Renukoot, Sonbhadra",
  shortAddress: "Renukoot, Sonbhadra",
  lat: 24.2056,
  lng: 83.0347,
  hours: {
    weekdays: "10:00 AM – 10:30 PM",
    weekends: "10:00 AM – 11:00 PM",
  },
  social: {
    instagram: "@bluberry.renukoot",
    whatsapp: "919278242692",
  },
  delivery: "Free home delivery on orders above ₹299",
  pureVeg: true,
};

export const deliveryConfig: DeliveryConfig = {
  baseFee: 30,
  tiers: [
    { maxKm: 3, fee: 30 },
    { maxKm: 5, fee: 50 },
    { maxKm: 10, fee: 70 },
  ],
  freeAbove: 299,
};

export const coupons: Coupon[] = [
  { code: 'WELCOME50', type: 'flat', value: 50, minOrder: 200, description: '₹50 off on orders above ₹200' },
  { code: 'CAFE10', type: 'percent', value: 10, minOrder: 150, maxDiscount: 100, description: '10% off up to ₹100' },
  { code: 'FIRSTORDER', type: 'flat', value: 75, minOrder: 250, description: '₹75 off on first order above ₹250' },
];

export const categories = [
  { id: "featured", label: "Signature" },
  { id: "pizza", label: "Pizza" },
  { id: "burger", label: "Burgers" },
  { id: "garlic", label: "Garlic Bread" },
  { id: "loaf", label: "Creamy Loaf" },
  { id: "wrap", label: "Wraps" },
  { id: "pasta", label: "Pasta" },
  { id: "snacks", label: "Snacks" },
  { id: "maggi", label: "Maggi" },
  { id: "beverages", label: "Beverages" },
  { id: "dessert", label: "Desserts" },
];

const sizeCustom = [
  { id: 'size-s', name: 'Regular', price: 0, type: 'size' as const },
  { id: 'size-l', name: 'Large', price: 0, type: 'size' as const },
];

const pizzaAddons = [
  { id: 'extra-cheese', name: 'Extra Cheese', price: 40, type: 'addon' as const },
  { id: 'extra-paneer', name: 'Extra Paneer', price: 50, type: 'addon' as const },
  { id: 'jalapeno', name: 'Jalapeños', price: 25, type: 'addon' as const },
];

const burgerAddons = [
  { id: 'extra-patty', name: 'Extra Patty', price: 40, type: 'addon' as const },
  { id: 'cheese-slice', name: 'Cheese Slice', price: 20, type: 'addon' as const },
  { id: 'extra-sauce', name: 'Extra Sauce', price: 15, type: 'addon' as const },
];

const coffeeExtras = [
  { id: 'extra-shot', name: 'Extra Shot', price: 30, type: 'extra' as const },
  { id: 'almond-milk', name: 'Almond Milk', price: 25, type: 'extra' as const },
  { id: 'extra-cream', name: 'Extra Cream', price: 20, type: 'extra' as const },
];

export const menuItems: MenuItem[] = [
  {
    id: "blueberry-mix-master",
    name: "Blueberry Mix Master Pizza",
    price: 220,
    priceLarge: 350,
    description: "Our signature pizza with a special blend of toppings",
    popular: true,
    category: "featured",
    emoji: "🍕",
    available: true,
    customizations: [...sizeCustom, ...pizzaAddons],
  },
  {
    id: "maha-veggie",
    name: "Maha Veggie Burger",
    price: 199,
    description: "Loaded double patty veggie burger with premium sauces",
    popular: true,
    category: "featured",
    emoji: "🍔",
    available: true,
    customizations: burgerAddons,
  },
  {
    id: "blueberry-shake",
    name: "Blueberry Shake",
    price: 149,
    description: "Creamy, fruity & refreshing house special",
    popular: true,
    category: "featured",
    emoji: "🥤",
    available: true,
    customizations: [
      { id: 'extra-scoop', name: 'Extra Scoop', price: 30, type: 'extra' },
      { id: 'whipped-cream', name: 'Whipped Cream', price: 20, type: 'extra' },
    ],
  },
  {
    id: "choco-lava",
    name: "Choco Lava Cake",
    price: 71,
    description: "Warm molten chocolate center, pure indulgence",
    popular: true,
    category: "featured",
    emoji: "🍫",
    available: true,
    customizations: [
      { id: 'with-icecream', name: 'Add Ice Cream', price: 20, type: 'addon' },
    ],
  },
  { id: "margherita", name: "Margherita Pizza", price: 91, priceLarge: 155, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "veggie-delight", name: "Veggie Delight Pizza", price: 120, priceLarge: 200, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "paneer-tandoori", name: "Paneer Tandoori Pizza", price: 170, priceLarge: 280, category: "pizza", popular: true, emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "veggie-corn", name: "Veggie Corn Pizza", price: 180, priceLarge: 310, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "spicy-mushroom", name: "Spicy Mushroom Pizza", price: 200, priceLarge: 340, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "fiery-paneer", name: "Fiery Paneer Pizza", price: 180, priceLarge: 310, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "mexican-wave", name: "Mexican Wave Pizza", price: 220, priceLarge: 330, category: "pizza", emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "blueberry-master", name: "Blueberry Mix Master Pizza", price: 220, priceLarge: 350, category: "pizza", popular: true, emoji: "🍕", available: true, customizations: [...sizeCustom, ...pizzaAddons] },
  { id: "aloo-tikki", name: "Aloo Tikki Burger", price: 49, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "veggie-tikki", name: "Veggie Tikki Burger", price: 69, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "peppery", name: "Peppery Burger", price: 99, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "crunchy-paneer", name: "Crunchy Paneer Burger", price: 119, category: "burger", popular: true, emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "spicy-jalapeno", name: "Spicy Jalapeno Burger", price: 129, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "crispy-corn", name: "Crispy Corn Burger", price: 149, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "peri-peri-paneer", name: "Peri Peri Paneer Burger", price: 169, category: "burger", emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "maha-veggie-b", name: "Maha Veggie Burger", price: 199, category: "burger", popular: true, emoji: "🍔", available: true, customizations: burgerAddons },
  { id: "cheese-garlic", name: "Cheese Garlic Bread", price: 75, category: "garlic", emoji: "🥖", available: true },
  { id: "cheese-corn-garlic", name: "Cheese Corn Garlic Bread", price: 85, category: "garlic", emoji: "🥖", available: true },
  { id: "classic-garlic", name: "Classic Garlic Bread", price: 110, category: "garlic", emoji: "🥖", available: true },
  { id: "stuffed-sweet-corn", name: "Cheese Sweet Corn Stuffed Garlic Bread", price: 130, category: "garlic", emoji: "🥖", available: true },
  { id: "stuffed-paneer", name: "Cheese Paneer Stuffed Garlic Bread", price: 149, category: "garlic", popular: true, emoji: "🥖", available: true },
  { id: "veggie-cheesy-loaf", name: "Veggie Cheesy Loaf", price: 91, priceLarge: 175, category: "loaf", emoji: "🍞", available: true, customizations: sizeCustom },
  { id: "paneer-cheesy-loaf", name: "Paneer Cheesy Loaf", price: 110, priceLarge: 200, category: "loaf", emoji: "🍞", available: true, customizations: sizeCustom },
  { id: "tandoori-paneer-loaf", name: "Tandoori Paneer Loaf", price: 130, priceLarge: 225, category: "loaf", popular: true, emoji: "🍞", available: true, customizations: sizeCustom },
  { id: "veggie-corn-loaf", name: "Veggie Corn Loaf", price: 140, priceLarge: 250, category: "loaf", emoji: "🍞", available: true, customizations: sizeCustom },
  { id: "cheese-mushroom-loaf", name: "Cheese Mushroom Loaf", price: 150, priceLarge: 280, category: "loaf", emoji: "🍞", available: true, customizations: sizeCustom },
  { id: "grilled-potato-wrap", name: "Grilled Potato Wrap", price: 99, category: "wrap", emoji: "🌯", available: true },
  { id: "veggie-cheese-potato", name: "Veggie Cheese Potato Wrap", price: 119, category: "wrap", emoji: "🌯", available: true },
  { id: "crispy-paneer-wrap", name: "Crispy Paneer Wrap", price: 149, category: "wrap", popular: true, emoji: "🌯", available: true },
  { id: "spicy-paneer-wrap", name: "Spicy Paneer Wrap", price: 169, category: "wrap", emoji: "🌯", available: true },
  { id: "spicy-red", name: "Spicy Red Sauce Pasta", price: 119, category: "pasta", emoji: "🍝", available: true },
  { id: "creamy-cheese", name: "Creamy Cheese Pasta", price: 139, category: "pasta", popular: true, emoji: "🍝", available: true },
  { id: "mix-sauce", name: "Mix Sauce Pasta", price: 159, category: "pasta", emoji: "🍝", available: true },
  { id: "french-fries", name: "Classic French Fries", price: 70, category: "snacks", emoji: "🍟", available: true },
  { id: "peri-peri-fries", name: "Peri Peri Fries with Sauce", price: 110, category: "snacks", popular: true, emoji: "🍟", available: true },
  { id: "spicy-potato-balls", name: "Spicy Potato Balls", price: 89, category: "snacks", emoji: "🥔", available: true },
  { id: "crunchy-paneer-balls", name: "Crunchy Paneer Balls", price: 130, category: "snacks", emoji: "🧀", available: true },
  { id: "maggi", name: "Classic Maggi", price: 59, category: "maggi", emoji: "🍜", available: true },
  { id: "veggie-corn-maggi", name: "Veggie Corn Maggi", price: 79, category: "maggi", emoji: "🍜", available: true },
  { id: "cheese-maggi", name: "Cheese Maggi", price: 99, category: "maggi", popular: true, emoji: "🍜", available: true },
  { id: "coke-sprite", name: "Coke / Sprite", price: 40, category: "beverages", emoji: "🥤", available: true },
  { id: "special-tea", name: "Special Tea", price: 25, category: "beverages", emoji: "🍵", available: true },
  { id: "hot-coffee", name: "Hot Coffee", price: 49, category: "beverages", emoji: "☕", available: true, customizations: coffeeExtras },
  { id: "ice-tea", name: "Ice Tea Lemon", price: 70, category: "beverages", emoji: "🍹", available: true },
  { id: "mojito", name: "Mojito", price: 89, category: "beverages", emoji: "🍸", available: true },
  { id: "mocktails", name: "Mocktails (Mango / Strawberry)", price: 89, category: "beverages", emoji: "🍹", available: true },
  { id: "cold-coffee", name: "Cold Coffee", price: 99, category: "beverages", popular: true, emoji: "🧊", available: true, customizations: coffeeExtras },
  { id: "shakes", name: "Shakes (Mango / Chocolate / Strawberry)", price: 129, category: "beverages", emoji: "🥤", available: true },
  { id: "oreo-kitkat", name: "Oreo / KitKat Shake", price: 139, category: "beverages", emoji: "🥤", available: true },
  { id: "blueberry-shake-b", name: "Blueberry Shake", price: 149, category: "beverages", popular: true, emoji: "🫐", available: true },
  { id: "choco-lava-d", name: "Choco Lava Cake", price: 71, category: "dessert", popular: true, emoji: "🍫", available: true },
  { id: "choco-lava-ic", name: "Choco Lava Cake with Ice Cream", price: 91, category: "dessert", emoji: "🍨", available: true },
  { id: "ice-cream", name: "Ice Cream", price: 61, category: "dessert", emoji: "🍦", available: true },
  { id: "fruit-frozen", name: "Fruit Frozen Dessert", price: 135, category: "dessert", emoji: "🍧", available: true },
  { id: "hot-chocolate", name: "Hot Chocolate", price: 135, category: "dessert", emoji: "☕", available: true },
];

export const featuredItems = menuItems.filter((i) => i.popular).slice(0, 6);

export const galleryImages = [
  { src: "/interior1.jpg", alt: "Bluberry Café interior seating", caption: "Cozy corners for long conversations" },
  { src: "/interior2.jpg", alt: "Bluberry Café dining area", caption: "Warm lights & inviting vibes" },
  { src: "/counter.jpg", alt: "Order counter at Bluberry", caption: "Where every order begins with a smile" },
  { src: "/exterior.jpg", alt: "Bluberry Café storefront", caption: "Find us in Renukoot" },
  { src: "/promo.jpg", alt: "Bluberry menu highlights", caption: "Freshly prepared favourites" },
];
