import type { CartItem, Coupon, CustomizationOption } from '../types';
import { deliveryConfig, coupons } from '../data/cafe';

export function calcItemTotal(
  basePrice: number,
  quantity: number,
  customizations: CustomizationOption[],
  isLarge = false,
  priceLarge?: number
): number {
  let price = isLarge && priceLarge ? priceLarge : basePrice;
  const extras = customizations
    .filter((c) => c.type !== 'size')
    .reduce((sum, c) => sum + c.price, 0);
  return (price + extras) * quantity;
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.itemTotal, 0);
}

export function calcDeliveryFee(subtotal: number, distanceKm = 2.5): number {
  if (subtotal >= deliveryConfig.freeAbove) return 0;
  for (const tier of deliveryConfig.tiers) {
    if (distanceKm <= tier.maxKm) return tier.fee;
  }
  return deliveryConfig.tiers[deliveryConfig.tiers.length - 1].fee;
}

export function applyCoupon(
  code: string,
  subtotal: number
): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
  if (!coupon) return { valid: false, discount: 0, message: 'Invalid coupon code' };
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order ₹${coupon.minOrder} required`,
    };
  }
  let discount = 0;
  if (coupon.type === 'flat') {
    discount = coupon.value;
  } else {
    discount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  }
  return { valid: true, discount, message: coupon.description, coupon };
}

export function calcTax(subtotal: number): number {
  // GST simplified for demo (5% on food)
  return Math.round(subtotal * 0.05);
}

export function generateOrderNumber(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `CAF-${num}`;
}
