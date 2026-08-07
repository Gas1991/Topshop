'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState('');

  if (user) {
    router.replace('/account');
    return null;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!prenom.trim()) e.prenom = 'Requis';
    if (!nom.trim()) e.nom = 'Requis';
    if (!email.trim() || !email.includes('@')) e.email = 'Email invalide';
    if (!tel.trim() || tel.length < 8) e.tel = 'Numéro invalide';
    if (!password || password.length < 6) e.password = 'Minimum 6 caractères';
    if (password !== confirm) e.confirm = 'Les mots de passe ne correspondent pas';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setGlobalError('');
    const { ok, error } = await register({ firstName: prenom, lastName: nom, email, phone: tel, password });
    setLoading(false);
    if (ok) router.replace('/account');
    else setGlobalError(error || 'Erreur lors de la création du compte');
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        .auth-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 24px 16px; background: #F8F9FA; }
        .auth-card { background: #fff; border-radius: 18px; box-shadow: 0 4px 24px rgba(0,0,0,.09); padding: 40px 36px; width: 100%; max-width: 460px; }
        .auth-logo { font-size: 22px; font-weight: 900; color: #111; margin-bottom: 6px; }
        .auth-logo span { color: #FFB800; }
        .auth-title { font-size: 24px; font-weight: 900; color: #111; margin: 20px 0 6px; }
        .auth-sub { font-size: 14px; color: #888; margin-bottom: 28px; }
        .auth-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .auth-field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
        .auth-label { font-size: 12px; font-weight: 700; color: #555; }
        .auth-input { border: 1.5px solid #e0e0e0; border-radius: 10px; padding: 12px 14px; font-size: 14px; font-family: inherit; outline: none; transition: border-color .12s; width: 100%; }
        .auth-input:focus { border-color: #FFB800; }
        .auth-input.err { border-color: #dc2626; background: #fff5f5; }
        .auth-err-msg { font-size: 11px; color: #dc2626; font-weight: 600; }
        .auth-pw-wrap { position: relative; }
        .auth-pw-wrap .auth-input { padding-right: 44px; }
        .auth-pw-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #aaa; font-size: 16px; padding: 0; line-height: 1; }
        .auth-tel-wrap { display: flex; }
        .auth-tel-prefix { border: 1.5px solid #e0e0e0; border-right: 0; border-radius: 10px 0 0 10px; padding: 12px 12px; font-size: 13px; background: #F8F9FA; color: #555; white-space: nowrap; display: flex; align-items: center; gap: 5px; }
        .auth-tel-input { flex: 1; border: 1.5px solid #e0e0e0; border-radius: 0 10px 10px 0; padding: 12px 12px; font-size: 14px; font-family: inherit; outline: none; }
        .auth-tel-input:focus { border-color: #FFB800; }
        .auth-tel-input.err { border-color: #dc2626; }
        .auth-global-error { background: #fff5f5; border: 1px solid #fca5a5; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #dc2626; font-weight: 600; margin-bottom: 16px; }
        .auth-btn { width: 100%; height: 52px; background: #FFB800; color: #111; border: 0; border-radius: 12px; font-size: 16px; font-weight: 900; cursor: pointer; box-shadow: 0 4px 0 #F2A900; transition: all .12s; margin-top: 4px; }
        .auth-btn:hover { background: #F2A900; transform: translateY(-1px); }
        .auth-btn:active { transform: translateY(2px); box-shadow: 0 2px 0 #F2A900; }
        .auth-btn:disabled { background: #ddd; color: #888; box-shadow: none; cursor: not-allowed; transform: none; }
        .auth-terms { font-size: 11px; color: #aaa; text-align: center; margin-top: 12px; line-height: 1.6; }
        .auth-divider { text-align: center; color: #bbb; font-size: 12px; margin: 20px 0; position: relative; }
        .auth-divider::before, .auth-divider::after { content: ''; position: absolute; top: 50%; width: 42%; height: 1px; background: #ececec; }
        .auth-divider::before { left: 0; }
        .auth-divider::after { right: 0; }
        .auth-link-row { text-align: center; font-size: 13px; color: #888; margin-top: 16px; }
        .auth-link-row a { color: #111; font-weight: 700; text-decoration: none; }
        .auth-link-row a:hover { color: #FFB800; }
        @media (max-width: 480px) { .auth-row2 { grid-template-columns: 1fr; } .auth-card { padding: 28px 20px; } }
      `}</style>

      <div className="auth-wrap">
        <div className="auth-card">
          <div className="auth-logo">topshop<span>.</span>tn</div>
          <div className="auth-title">Créer un compte</div>
          <div className="auth-sub">Rejoignez des milliers de clients satisfaits</div>

          {globalError && <div className="auth-global-error">✗ {globalError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-row2">
              <div className="auth-field">
                <label className="auth-label">Prénom *</label>
                <input
                  className={`auth-input${errors.prenom ? ' err' : ''}`}
                  placeholder="Ahmed"
                  value={prenom}
                  onChange={e => { setPrenom(e.target.value); setErrors(x => ({ ...x, prenom: '' })); }}
                />
                {errors.prenom && <span className="auth-err-msg">{errors.prenom}</span>}
              </div>
              <div className="auth-field">
                <label className="auth-label">Nom *</label>
                <input
                  className={`auth-input${errors.nom ? ' err' : ''}`}
                  placeholder="Ben Ali"
                  value={nom}
                  onChange={e => { setNom(e.target.value); setErrors(x => ({ ...x, nom: '' })); }}
                />
                {errors.nom && <span className="auth-err-msg">{errors.nom}</span>}
              </div>
            </div>

            <div className="auth-field">
              <label className="auth-label">Email *</label>
              <input
                className={`auth-input${errors.email ? ' err' : ''}`}
                type="email"
                placeholder="votre@email.tn"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(x => ({ ...x, email: '' })); }}
                autoComplete="email"
              />
              {errors.email && <span className="auth-err-msg">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Téléphone *</label>
              <div className="auth-tel-wrap">
                <div className="auth-tel-prefix">🇹🇳 +216</div>
                <input
                  className={`auth-tel-input${errors.tel ? ' err' : ''}`}
                  placeholder="XX XXX XXX"
                  value={tel}
                  onChange={e => { setTel(e.target.value); setErrors(x => ({ ...x, tel: '' })); }}
                  maxLength={9}
                />
              </div>
              {errors.tel && <span className="auth-err-msg">{errors.tel}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Mot de passe *</label>
              <div className="auth-pw-wrap">
                <input
                  className={`auth-input${errors.password ? ' err' : ''}`}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Minimum 6 caractères"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(x => ({ ...x, password: '' })); }}
                  autoComplete="new-password"
                />
                <button type="button" className="auth-pw-eye" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {errors.password && <span className="auth-err-msg">{errors.password}</span>}
            </div>

            <div className="auth-field">
              <label className="auth-label">Confirmer le mot de passe *</label>
              <input
                className={`auth-input${errors.confirm ? ' err' : ''}`}
                type={showPw ? 'text' : 'password'}
                placeholder="Répéter le mot de passe"
                value={confirm}
                onChange={e => { setConfirm(e.target.value); setErrors(x => ({ ...x, confirm: '' })); }}
                autoComplete="new-password"
              />
              {errors.confirm && <span className="auth-err-msg">{errors.confirm}</span>}
            </div>

            <button className="auth-btn" disabled={loading}>
              {loading ? 'Création en cours...' : 'Créer mon compte →'}
            </button>

            <p className="auth-terms">
              En créant un compte, vous acceptez nos conditions générales de vente et notre politique de confidentialité.
            </p>
          </form>

          <div className="auth-divider">ou</div>

          <div className="auth-link-row">
            Déjà un compte ?{' '}
            <Link href="/account/login">Se connecter</Link>
          </div>
        </div>
      </div>
    </>
  );
}
