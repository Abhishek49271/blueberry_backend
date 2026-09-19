import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus, PaymentStatus, Address, PaymentMethod } from '../types';
import { generateOrderNumber, calcSubtotal, calcDeliveryFee, calcTax, applyCoupon } from '../utils/pricing';
import { useCart } from './CartContext';

interface OrderContextValue {
  orders: Order[];
  currentOrder: Order | null;
  placeOrder: (params: {
    address: Address;
    paymentMethod: PaymentMethod;
    couponCode?: string;
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  getOrder: (id: string) => Order | undefined;
  cancelOrder: (orderId: string) => boolean;
  setCurrentOrder: (o: Order | null) => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

const STORAGE_KEY = 'bluberry_orders';

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    // Load immediately on init so Admin sees orders even on first render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const { items, clearCart } = useCart();

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  // Listen for storage events (so Admin tab updates when Customer tab places order)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const placeOrder = useCallback(
    (params: {
      address: Address;
      paymentMethod: PaymentMethod;
      couponCode?: string;
      notes?: string;
    }) => {
      const sub = calcSubtotal(items);
      const delivery = calcDeliveryFee(sub);
      const couponResult = params.couponCode
        ? applyCoupon(params.couponCode, sub)
        : { valid: false, discount: 0 };
      const discount = couponResult.valid ? couponResult.discount : 0;
      const tax = calcTax(Math.max(0, sub - discount));
      const total = Math.max(0, sub + delivery + tax - discount);

      const order: Order = {
        id: `ord-${Date.now()}`,
        orderNumber: generateOrderNumber(),
        items: items.map((i) => ({
          menuItemId: i.menuItemId,
          name: i.name,
          quantity: i.quantity,
          basePrice: i.basePrice,
          customizations: i.selectedCustomizations,
          itemTotal: i.itemTotal,
          emoji: i.emoji,
        })),
        address: params.address,
        subtotal: sub,
        deliveryFee: delivery,
        discount,
        tax,
        total,
        couponCode: couponResult.valid ? params.couponCode : undefined,
        paymentMethod: params.paymentMethod,
        paymentStatus: params.paymentMethod === 'COD' ? 'COD_PENDING' : 'PAID',
        status: 'PENDING',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDeliveryMinutes: 35,
        notes: params.notes,
      };

      setOrders((prev) => {
        const next = [order, ...prev];
        // Force write immediately so other tabs / admin see it
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setCurrentOrder(order);
      clearCart();
      return order;
    },
    [items, clearCart]
  );

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    setCurrentOrder((prev) =>
      prev && (prev.id === orderId || prev.orderNumber === orderId)
        ? { ...prev, status, updatedAt: new Date().toISOString() }
        : prev
    );
  }, []);

  const updatePaymentStatus = useCallback((orderId: string, status: PaymentStatus) => {
    setOrders((prev) => {
      const next = prev.map((o) =>
        o.id === orderId || o.orderNumber === orderId
          ? { ...o, paymentStatus: status, updatedAt: new Date().toISOString() }
          : o
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getOrder = useCallback(
    (id: string) => orders.find((o) => o.id === id || o.orderNumber === id),
    [orders]
  );

  const cancelOrder = useCallback(
    (orderId: string) => {
      const order = getOrder(orderId);
      if (!order) return false;
      if (['PENDING', 'CONFIRMED'].includes(order.status)) {
        updateOrderStatus(orderId, 'CANCELLED');
        return true;
      }
      return false;
    },
    [getOrder, updateOrderStatus]
  );

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        placeOrder,
        updateOrderStatus,
        updatePaymentStatus,
        getOrder,
        cancelOrder,
        setCurrentOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}
