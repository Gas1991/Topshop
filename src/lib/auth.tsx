'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/* ── Types ───────────────────────────────────────────────────────── */
export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  governorat?: string;
  delegation?: string;
  localite?: string;
  codePostal?: string;
  rue?: string;
}

interface StoredAccount {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  ph: string; // password hash
  governorat?: string;
  delegation?: string;
  localite?: string;
  codePostal?: string;
  rue?: string;
}

export interface StoredOrder {
  id: string;
  wcOrderId?: number;
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

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phone: string;
  governorat?: string;
  delegation?: string;
  localite?: string;
  codePostal?: string;
  rue?: string;
  currentPassword?: string;
  newPassword?: string;
}

interface AuthCtx {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ ok: boolean; error?: string }>;
  updateProfile: (data: UpdateProfileData) => Promise<{ ok: boolean; error?: string }>;
  requestPasswordReset: (email: string) => Promise<{ ok: boolean; error?: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ ok: boolean; error?: string }>;
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

    // Email de bienvenue (non-bloquant)
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'welcome', to: data.email, firstName: data.firstName, lastName: data.lastName }),
    }).catch(() => {});

    return { ok: true };
  }

  async function login(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
    const accounts = getAccounts();
    const a = accounts.find(ac => ac.email.toLowerCase() === email.toLowerCase());
    if (!a) return { ok: false, error: 'Aucun compte trouvé avec cet email' };
    if (a.ph !== hash(password)) return { ok: false, error: 'Mot de passe incorrect' };
    persistUser({ id: a.id, email: a.email, firstName: a.firstName, lastName: a.lastName, phone: a.phone, governorat: a.governorat, delegation: a.delegation, localite: a.localite, codePostal: a.codePostal, rue: a.rue });
    return { ok: true };
  }

  async function updateProfile(data: UpdateProfileData): Promise<{ ok: boolean; error?: string }> {
    if (!user) return { ok: false, error: 'Non connecté' };
    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.id === user.id);
    if (idx === -1) return { ok: false, error: 'Compte introuvable' };

    const account = accounts[idx];

    // Password change requested
    if (data.newPassword) {
      if (!data.currentPassword) return { ok: false, error: 'Mot de passe actuel requis' };
      if (account.ph !== hash(data.currentPassword)) return { ok: false, error: 'Mot de passe actuel incorrect' };
      account.ph = hash(data.newPassword);
    }

    account.firstName  = data.firstName;
    account.lastName   = data.lastName;
    account.phone      = data.phone;
    account.governorat = data.governorat;
    account.delegation = data.delegation;
    account.localite   = data.localite;
    account.codePostal = data.codePostal;
    account.rue        = data.rue;
    accounts[idx] = account;
    saveAccounts(accounts);

    const updated: AuthUser = {
      id: user.id, email: user.email,
      firstName: data.firstName, lastName: data.lastName, phone: data.phone,
      governorat: data.governorat, delegation: data.delegation,
      localite: data.localite, codePostal: data.codePostal, rue: data.rue,
    };
    persistUser(updated);
    return { ok: true };
  }

  async function requestPasswordReset(email: string): Promise<{ ok: boolean; error?: string }> {
    const accounts = getAccounts();
    const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (!account) return { ok: false, error: 'Aucun compte trouvé avec cet email' };

    // Générer token aléatoire et stocker dans localStorage
    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    const expiry = Date.now() + 30 * 60 * 1000; // 30 min

    const tokens = JSON.parse(localStorage.getItem('toprix_reset_tokens') || '[]')
      .filter((t: { email: string }) => t.email !== email.toLowerCase()); // remove old token for same email
    tokens.push({ token, email: email.toLowerCase(), expiry });
    localStorage.setItem('toprix_reset_tokens', JSON.stringify(tokens));

    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://topshop.tn';
    const resetLink = `${SITE}/account/reset-password?token=${token}`;

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'password_reset', to: email, firstName: account.firstName, resetLink }),
      });
    } catch {}

    return { ok: true };
  }

  async function resetPassword(token: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
    const tokens: { token: string; email: string; expiry: number }[] =
      JSON.parse(localStorage.getItem('toprix_reset_tokens') || '[]');
    const record = tokens.find(t => t.token === token);

    if (!record) return { ok: false, error: 'Lien invalide ou déjà utilisé' };
    if (Date.now() > record.expiry) return { ok: false, error: 'Lien expiré — veuillez faire une nouvelle demande' };

    const accounts = getAccounts();
    const idx = accounts.findIndex(a => a.email.toLowerCase() === record.email);
    if (idx === -1) return { ok: false, error: 'Compte introuvable' };

    accounts[idx].ph = hash(newPassword);
    saveAccounts(accounts);

    // Invalider le token
    localStorage.setItem('toprix_reset_tokens', JSON.stringify(tokens.filter(t => t.token !== token)));
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
    <AuthContext.Provider value={{ user, login, register, updateProfile, requestPasswordReset, resetPassword, logout, getOrders, saveOrder }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
