import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import type { CartItem, CustomizationOption, MenuItem } from '../types';
import { calcItemTotal } from '../utils/pricing';

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'LOAD'; items: CartItem[] };

interface CartState {
  items: CartItem[];
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      // merge if same item + same customizations
      const key = (i: CartItem) =>
        `${i.menuItemId}-${i.selectedCustomizations.map((c) => c.id).sort().join(',')}`;
      const existing = state.items.find((i) => key(i) === key(action.item));
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === existing.id
              ? {
                  ...i,
                  quantity: i.quantity + action.item.quantity,
                  itemTotal: calcItemTotal(
                    i.basePrice,
                    i.quantity + action.item.quantity,
                    i.selectedCustomizations
                  ),
                }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY':
      if (action.quantity <= 0) {
        return { items: state.items.filter((i) => i.id !== action.id) };
      }
      return {
        items: state.items.map((i) =>
          i.id === action.id
            ? {
                ...i,
                quantity: action.quantity,
                itemTotal: calcItemTotal(i.basePrice, action.quantity, i.selectedCustomizations),
              }
            : i
        ),
      };
    case 'CLEAR':
      return { items: [] };
    case 'LOAD':
      return { items: action.items };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (menuItem: MenuItem, quantity: number, customizations: CustomizationOption[], isLarge?: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isOpen, setIsOpen] = React.useState(false);

  // Persist
  useEffect(() => {
    const saved = localStorage.getItem('bluberry_cart');
    if (saved) {
      try {
        dispatch({ type: 'LOAD', items: JSON.parse(saved) });
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bluberry_cart', JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback(
    (menuItem: MenuItem, quantity: number, customizations: CustomizationOption[], isLarge = false) => {
      const base = isLarge && menuItem.priceLarge ? menuItem.priceLarge : menuItem.price;
      const item: CartItem = {
        id: `${menuItem.id}-${Date.now()}`,
        menuItemId: menuItem.id,
        name: menuItem.name + (isLarge ? ' (Large)' : ''),
        basePrice: base,
        quantity,
        selectedCustomizations: customizations,
        itemTotal: calcItemTotal(menuItem.price, quantity, customizations, isLarge, menuItem.priceLarge),
        emoji: menuItem.emoji,
        image: menuItem.image,
      };
      dispatch({ type: 'ADD', item });
      setIsOpen(true);
    },
    []
  );

  const itemCount = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.itemTotal, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount,
        subtotal,
        addItem,
        removeItem: (id) => dispatch({ type: 'REMOVE', id }),
        updateQuantity: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        toggleCart: () => setIsOpen((o) => !o),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
