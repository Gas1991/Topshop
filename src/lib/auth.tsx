'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ── Types ───────────────────────────────────────────────────────── */
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface StoredAccount {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  ph: string; // password hash
}

export interface StoredOrder {
  id: string;
  date: string;
  status: 'en_attente' | 'confirmee' | 'en_preparation' | 'en_livraison' | 'livree';
  items: { name: string; qty: number; price: number; img: string }[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  prenom: string;
  nom: string;
  tel: string;
  governorat: string;
  delegation: string;
  localite: string;
  rue: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  getOrders: () => StoredOrder[];
  saveOrder: (order: StoredOrder) => void;
}

/* ── Simple hash (demo only) ─────────────────────────────────────── */
function hash(str: string): string {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
  return (h >>> 0).toString(36);
}

/* ── Context ─────────────────────────────────────────────────────── */
const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('toprix_user');
      if (saved) setUser(JSON.parse(saved));
    } catch {}
  }, []);

  function persistUser(u: AuthUser | null) {
    setUser(u);
    if (u) localStorage.setItem('toprix_user', JSON.stringify(u));
    else localStorage.removeItem('toprix_user');
  }

  function getAccounts(): StoredAccount[] {
    try { return JSON.parse(localStorage.getItem('toprix_accounts') || '[]'); }
    catch { return []; }
  }
  function saveAccounts(a: StoredAccount[]) {
    localStorage.setItem('toprix_accounts', JSON.stringify(a));
  }

  async function register(data: RegisterData): Promise<{ ok: boolean; error?: string }> {
    const accounts = getAccounts();
    if (accounts.find(a => a.email.toLowerCase() === data.email.toLowerCase())) {
      return { ok: false, error: 'Un compte existe déjà avec cet email' };
    }

    // Try WC customer creation (server-side, optional)
    let wcId = Date.now();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          username: data.email.split('@')[0] + '_' + Date.now(),
          password: data.password,
        }),
      });
      if (res.ok) { const j = await res.json(); wcId = j.id || wcId; }
    } catch {}

    const account: StoredAccount = {
      id: wcId,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      ph: hash(data.password),
    };
    saveAccounts([...accounts, account]);
    persistUser({ id: wcId, email: data.email, firstName: data.firstName, lastName: data.lastName, phone: data.phone });
    return { ok: true };
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const accounts = getAccounts();
    const a = accounts.find(ac => ac.email.toLowerCase() === email.toLowerCase());
    if (!a) return { ok: false, error: 'Aucun compte trouvé avec cet email' };
    if (a.ph !== hash(password)) return { ok: false, error: 'Mot de passe incorrect' };
    persistUser({ id: a.id, email: a.email, firstName: a.firstName, lastName: a.lastName, phone: a.phone });
    return { ok: true };
  }

  function logout() { persistUser(null); }

  function getOrders(): StoredOrder[] {
    try { return JSON.parse(localStorage.getItem('toprix_orders') || '[]'); }
    catch { return []; }
  }

  function saveOrder(order: StoredOrder) {
    const orders = getOrders();
    localStorage.setItem('toprix_orders', JSON.stringify([order, ...orders]));
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getOrders, saveOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
