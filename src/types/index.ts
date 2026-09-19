export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'COD_PENDING'
  | 'REFUNDED';

export type PaymentMethod = 'COD' | 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  type: 'size' | 'extra' | 'addon';
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  priceLarge?: number;
  description?: string;
  image?: string;
  emoji?: string;
  popular?: boolean;
  category: string;
  available?: boolean;
  customizations?: CustomizationOption[];
}

export interface CartItem {
  id: string; // unique cart line id
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedCustomizations: CustomizationOption[];
  itemTotal: number;
  emoji?: string;
  image?: string;
}

export interface Address {
  id: string;
  label: string; // Home, Work, Other
  fullName: string;
  phone: string;
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  instructions?: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
  isAdmin?: boolean;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  basePrice: number;
  customizations: CustomizationOption[];
  itemTotal: number;
  emoji?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  items: OrderItem[];
  address: Address;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  estimatedDeliveryMinutes?: number;
  notes?: string;
}

export interface Coupon {
  code: string;
  type: 'flat' | 'percent';
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  description: string;
}

export interface DeliveryConfig {
  baseFee: number;
  tiers: { maxKm: number; fee: number }[];
  freeAbove: number;
}
