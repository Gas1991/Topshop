'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  if (user) {
    router.replace('/account');
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Veuillez remplir tous les champs'); return; }
    setLoading(true);
    setError('');
    const { ok, error: err } = await login(email, password);
    setLoading(false);
    if (ok) router.replace('/account');
    else setError(err || 'Erreur de connexion');
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .auth-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: #F8F9FA; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.09); padding: 40px 36px; width: 100%; max-width: 420px; }
        .auth-logo { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 6px; }
        .auth-logo span { color: #FFB800; }
        .auth-title { font-size: 24px; font-weight: 900; color: #111; margin: 20px 0 6px; }
        .auth-sub { font-size: 14px; color: #888; margin-bottom: 28px; }
        .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 16px; }
        .auth-label { font-size: 12px; font-weight: 700; color: #555; }
        .auth-input { border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; width: 100%; }
        .auth-input:focus { border-color: #FFB800; }
        .auth-input.err { border-color: #dc2626; background: #fff5f5; }
        .auth-pw-wrap { position: relative; }
        .auth-pw-wrap .auth-input { padding-right: 44px; }
        .auth-pw-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #aaa; font-size: 16px; padding: 0; line-height: 1; }
        .auth-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; }
        .auth-btn { width: 100%; height: 52px; background: #FFB800; color: #111; border: 0; border-radius: 12px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; margin-top: 4px; }
        .auth-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #F2A900; }
        .auth-btn:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }
        .auth-divider { text-align: center; color: #bbb; font-size: 12px; margin: 20px 0; position: relative; }
        .auth-divider::before, .auth-divider::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: #ececec; }
        .auth-divider::before { left: 0; }
        .auth-divider::after { right: 0; }
        .auth-link-row { text-align: center; font-size: 13px; color: #888; margin-top: 16px; }
        .auth-link-row a { color: #111; font-weight: 700; text-decoration: none; }
        .auth-link-row a:hover { color: #FFB800; }
        .auth-forgot { text-align: right; font-size: 12px; margin-top: -10px; margin-bottom: 16px; }
        .auth-forgot a { color: #888; text-decoration: none; }
        .auth-forgot a:hover { color: #111; }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">topshop<span>.</span>tn</div>
          <div className="auth-title">Connexion</div>
          <div className="auth-sub">Accédez à votre espace personnel</div>

          {error && <div className="auth-error">✗ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Adresse email</label>
              <input
                className={`auth-input${error ? ' err' : ''}`}
                type="email"
                placeholder="votre@email.tn"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label className="auth-label">Mot de passe</label>
              <div className="auth-pw-wrap">
                <input
                  className={`auth-input${error ? ' err' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-pw-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="auth-forgot">
              <a href="#">Mot de passe oublié ?</a>
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter →'}
            </button>
          </form>

          <div className="auth-divider">ou</div>

          <div className="auth-link-row">
            Pas encore de compte ?{' '}
            <Link href="/account/register">Créer un compte</Link>
          </div>
        </div>
      </div>
    </>
  );
}
