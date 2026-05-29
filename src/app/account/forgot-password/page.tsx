'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [sent, setSent]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) { setError('Entrez votre adresse email'); return; }
    setLoading(true); setError('');
    const res = await requestPasswordReset(email.trim());
    setLoading(false);
    if (res.ok) setSent(true);
    else setError(res.error || 'Erreur');
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .auth-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: #F8F9FA; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.09); padding: 40px 36px; width: 100%; max-width: 420px; }
        .auth-logo { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 6px; }
        .auth-logo span { color: #FFB800; }
        .auth-title { font-size: 22px; font-weight: 900; color: #111; margin: 20px 0 6px; }
        .auth-sub { font-size: 14px; color: #888; margin-bottom: 28px; line-height: 1.6; }
        .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
        .auth-label { font-size: 12px; font-weight: 700; color: #555; }
        .auth-input { border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; width: 100%; }
        .auth-input:focus { border-color: #FFB800; }
        .auth-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; }
        .auth-success { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 18px; font-size: 14px; color: #15803d; line-height: 1.6; }
        .auth-btn { width: 100%; height: 52px; background: #FFB800; color: #111; border: 0; border-radius: 12px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; }
        .auth-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .auth-btn:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }
        .auth-link-row { text-align: center; font-size: 13px; color: #888; margin-top: 20px; }
        .auth-link-row a { color: #111; font-weight: 700; text-decoration: none; }
        .auth-link-row a:hover { color: #FFB800; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">topshop<span>.</span>tn</div>
          <div className="auth-title">🔒 Mot de passe oublié</div>
          <div className="auth-sub">Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.</div>

          {sent ? (
            <div className="auth-success">
              ✅ <strong>Email envoyé !</strong><br />
              Vérifiez votre boîte mail (et vos spams). Le lien est valable <strong>30 minutes</strong>.
            </div>
          ) : (
            <>
              {error && <div className="auth-error">✗ {error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="auth-field">
                  <label className="auth-label">Adresse email</label>
                  <input
                    className="auth-input"
                    type="email"
                    placeholder="votre@email.tn"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <button className="auth-btn" disabled={loading}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien →'}
                </button>
              </form>
            </>
          )}

          <div className="auth-link-row">
            <Link href="/account/login">← Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </>
  );
}
