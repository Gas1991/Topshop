'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

function ResetForm() {
  const { resetPassword } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token') || '';

  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState(false);

  useEffect(() => {
    if (!token) setError('Lien invalide — aucun token trouvé.');
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    setLoading(true);
    const res = await resetPassword(token, password);
    setLoading(false);
    if (!res.ok) { setError(res.error || 'Erreur'); return; }
    setSuccess(true);
    setTimeout(() => router.replace('/account/login'), 3000);
  }

  return (
    <>
      <div className="auth-logo">topshop<span>.</span>tn</div>
      <div className="auth-title">🔑 Nouveau mot de passe</div>
      <div className="auth-sub">Choisissez un mot de passe sécurisé (min. 6 caractères).</div>

      {success ? (
        <div className="auth-success">
          ✅ <strong>Mot de passe mis à jour !</strong><br />
          Vous allez être redirigé vers la connexion…
        </div>
      ) : (
        <>
          {error && <div className="auth-error">✗ {error}</div>}
          {!error.includes('invalide') && !error.includes('expiré') && (
            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Nouveau mot de passe</label>
                <div className="auth-pw-wrap">
                  <input
                    className="auth-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button type="button" className="auth-pw-eye" onClick={() => setShowPw(v => !v)}>
                    {showPw ? '🙈' : '👁'}
                  </button>
                </div>
              </div>
              <div className="auth-field">
                <label className="auth-label">Confirmer le mot de passe</label>
                <input
                  className="auth-input"
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirm}
                  onChange={e => { setConfirm(e.target.value); setError(''); }}
                  autoComplete="new-password"
                />
              </div>
              <button className="auth-btn" disabled={loading || !token}>
                {loading ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe →'}
              </button>
            </form>
          )}
        </>
      )}

      <div className="auth-link-row" style={{ marginTop: 20 }}>
        {error.includes('expiré') ? (
          <Link href="/account/forgot-password">Faire une nouvelle demande →</Link>
        ) : (
          <Link href="/account/login">← Retour à la connexion</Link>
        )}
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .auth-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: #F8F9FA; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.09); padding: 40px 36px; width: 100%; max-width: 420px; }
        .auth-logo { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 6px; }
        .auth-logo span { color: #FFB800; }
        .auth-title { font-size: 22px; font-weight: 900; color: #111; margin: 20px 0 6px; }
        .auth-sub { font-size: 14px; color: #888; margin-bottom: 28px; }
        .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
        .auth-label { font-size: 12px; font-weight: 700; color: #555; }
        .auth-input { border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; width: 100%; }
        .auth-input:focus { border-color: #FFB800; }
        .auth-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; }
        .auth-success { background: #f0fdf4; border: 1px solid #86efac; border-radius: 10px; padding: 18px; font-size: 14px; color: #15803d; line-height: 1.6; }
        .auth-pw-wrap { position: relative; }
        .auth-pw-wrap .auth-input { padding-right: 44px; }
        .auth-pw-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #aaa; font-size: 16px; padding: 0; }
        .auth-btn { width: 100%; height: 52px; background: #FFB800; color: #111; border: 0; border-radius: 12px; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; }
        .auth-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .auth-btn:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }
        .auth-link-row { text-align: center; font-size: 13px; color: #888; }
        .auth-link-row a { color: #111; font-weight: 700; text-decoration: none; }
        .auth-link-row a:hover { color: #FFB800; }
      `}</style>
      <div className="auth-wrap">
        <div className="auth-card">
          <Suspense fallback={<div style={{ textAlign: 'center', color: '#888' }}>Chargement…</div>}>
            <ResetForm />
          </Suspense>
        </div>
      </div>
    </>
  );
}
