'use client';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface CartItem {
  id: number;
  slug: string;
  name: string;
  price: number;
  img: string;
  qty: number;
}

export type CartNotice = CartItem & { key: number };

interface CartCtx {
  items: CartItem[];
  /** false tant que le panier enregistre dans le navigateur n'est pas relu */
  ready: boolean;
  /** dernier produit ajoute, pour la notification */
  notice: CartNotice | null;
  closeNotice: () => void;
  restoreItem: (item: CartItem, index: number) => void;
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number, options?: { silent?: boolean }) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
}

const Ctx = createContext<CartCtx | null>(null);

const KEY = 'toprix_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState<CartNotice | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items, ready]);

  const addItem = useCallback((item: Omit<CartItem, 'qty'>, qty: number = 1, options?: { silent?: boolean }) => {
    if (!options?.silent) setNotice({ ...item, qty, key: Date.now() });
    setItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) { setItems(prev => prev.filter(i => i.id !== id)); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const closeNotice = useCallback(() => setNotice(null), []);

  const restoreItem = useCallback((item: CartItem, index: number) => {
    setItems(prev => prev.some(i => i.id === item.id) ? prev : [...prev.slice(0, index), item, ...prev.slice(index)]);
  }, []);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <Ctx.Provider value={{ items, count, total, ready, notice, closeNotice, restoreItem, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
