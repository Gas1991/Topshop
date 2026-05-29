import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST   || 'mail3.serv00.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER     || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
  tls: { rejectUnauthorized: false },
});

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.toprix.tn';
const FROM = process.env.SMTP_FROM || 'Topshop.tn <toprix@oven-cleaner.serv00.net>';
const YEAR = new Date().getFullYear();

/* ── Shared layout wrappers ─────────────────────────────────────── */
function wrap(content: string) {
  return `<!DOCTYPE html><html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8F9FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FA;padding:32px 16px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

<!-- Header -->
<tr><td style="background:#FFB800;border-radius:14px 14px 0 0;padding:24px 32px;text-align:center;">
  <div style="font-size:26px;font-weight:900;color:#111;">Topshop.tn</div>
  <div style="font-size:12px;color:#5a3e00;margin-top:3px;">Votre boutique high-tech en Tunisie</div>
</td></tr>

<!-- Body -->
<tr><td style="background:#fff;padding:32px;">
  ${content}
</td></tr>

<!-- Footer -->
<tr><td style="background:#F8F9FA;border-radius:0 0 14px 14px;padding:18px 32px;text-align:center;border-top:1px solid #ececec;">
  <p style="font-size:12px;color:#aaa;margin:0;">© ${YEAR} Topshop.tn — Tous droits réservés</p>
  <p style="font-size:12px;color:#aaa;margin:5px 0 0;">
    <a href="${SITE}/contact" style="color:#FFB800;text-decoration:none;">Contact</a> ·
    <a href="${SITE}/livraison" style="color:#FFB800;text-decoration:none;">Livraison</a> ·
    <a href="${SITE}/retours" style="color:#FFB800;text-decoration:none;">Retours</a>
  </p>
</td></tr>

</table></td></tr></table>
</body></html>`;
}

function btn(href: string, label: string) {
  return `<div style="text-align:center;margin-top:24px;">
    <a href="${href}" style="display:inline-block;background:#FFB800;color:#111;font-weight:800;padding:14px 32px;border-radius:10px;text-decoration:none;font-size:15px;">${label}</a>
  </div>`;
}

/* ── Template: order_confirmation ───────────────────────────────── */
interface OrderItem { name: string; qty: number; price: number; img: string; }
interface OrderConfirmPayload {
  type?: 'order_confirmation';
  to: string; orderId: string; prenom: string; nom: string; tel: string;
  governorat: string; delegation: string; localite?: string; rue: string;
  items: OrderItem[]; subtotal: number; delivery: number; discount: number; total: number;
}

function htmlOrderConfirmation(p: OrderConfirmPayload): string {
  const rows = p.items.map(i => `
    <tr>
      <td style="padding:10px 16px;border-bottom:1px solid #f3f3f3;font-size:14px;color:#111;">${i.name} <span style="color:#888;">× ${i.qty}</span></td>
      <td style="padding:10px 16px;border-bottom:1px solid #f3f3f3;font-size:14px;font-weight:700;text-align:right;">${(i.price * i.qty).toFixed(3)} TND</td>
    </tr>`).join('');

  return wrap(`
    <h1 style="font-size:22px;font-weight:900;color:#111;margin:0 0 8px;">✅ Commande confirmée !</h1>
    <p style="font-size:15px;color:#555;margin:0 0 24px;">Bonjour <strong>${p.prenom}</strong>, merci pour votre commande.</p>

    <div style="background:#FFFCEF;border:2px solid #FFB800;border-radius:10px;padding:14px 20px;margin-bottom:24px;text-align:center;">
      <div style="font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Numéro de commande</div>
      <div style="font-size:22px;font-weight:900;color:#111;">#${p.orderId}</div>
    </div>

    <div style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Articles</div>
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:10px;overflow:hidden;margin-bottom:18px;">${rows}</table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr><td style="padding:4px 0;font-size:13px;color:#666;">Sous-total</td><td style="padding:4px 0;font-size:13px;color:#666;text-align:right;">${p.subtotal.toFixed(3)} TND</td></tr>
      <tr><td style="padding:4px 0;font-size:13px;color:#666;">Livraison</td><td style="padding:4px 0;font-size:13px;color:#666;text-align:right;">${p.delivery.toFixed(3)} TND</td></tr>
      ${p.discount > 0 ? `<tr><td style="padding:4px 0;font-size:13px;color:#16a34a;font-weight:700;">Réduction</td><td style="padding:4px 0;font-size:13px;color:#16a34a;font-weight:700;text-align:right;">-${p.discount.toFixed(3)} TND</td></tr>` : ''}
      <tr><td colspan="2" style="border-top:2px solid #ececec;padding-top:8px;"></td></tr>
      <tr><td style="font-size:16px;font-weight:900;color:#111;">TOTAL</td><td style="font-size:16px;font-weight:900;color:#111;text-align:right;">${p.total.toFixed(3)} TND</td></tr>
    </table>

    <div style="background:#F8F9FA;border-radius:10px;padding:14px 16px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px;">📍 Adresse de livraison</div>
      <div style="font-size:14px;color:#111;line-height:1.7;"><strong>${p.prenom} ${p.nom}</strong><br>${p.rue}<br>${[p.localite, p.delegation, p.governorat].filter(Boolean).join(', ')}<br>📞 +216 ${p.tel}</div>
    </div>
    <p style="font-size:13px;color:#666;margin:0 0 4px;">💵 <strong>Paiement à la livraison</strong> — Délai estimé : <strong>48–72h</strong></p>
    <p style="font-size:13px;color:#666;margin:0 0 20px;">Notre équipe vous contactera dans les <strong>24h</strong> pour confirmer.</p>
    ${btn(`${SITE}/suivi-commande`, 'Suivre ma commande →')}
  `);
}

/* ── Template: order_status ─────────────────────────────────────── */
const WC_STATUS: Record<string, { label: string; message: string; color: string; icon: string }> = {
  pending:    { label: 'En attente de paiement', message: 'Votre commande est en attente de paiement.', color: '#888', icon: '⏳' },
  processing: { label: 'En cours de traitement', message: 'Votre commande est confirmée ! Nous préparons votre colis.', color: '#2563eb', icon: '📦' },
  'on-hold':  { label: 'En attente',             message: 'Votre commande est temporairement en attente.', color: '#d97706', icon: '⏸' },
  completed:  { label: 'Livrée',                 message: 'Votre commande a été livrée avec succès. Merci pour votre confiance !', color: '#16a34a', icon: '🎉' },
  cancelled:  { label: 'Annulée',                message: 'Votre commande a été annulée. Contactez-nous pour plus d\'informations.', color: '#dc2626', icon: '❌' },
  refunded:   { label: 'Remboursée',             message: 'Votre commande a été remboursée. Le virement peut prendre 3-5 jours ouvrables.', color: '#7c3aed', icon: '↩️' },
  failed:     { label: 'Échouée',                message: 'Votre commande a rencontré un problème. Contactez notre support.', color: '#dc2626', icon: '⚠️' },
};

interface OrderStatusPayload {
  type: 'order_status';
  to: string; orderId: string | number; prenom: string; wcStatus: string;
}

function htmlOrderStatus(p: OrderStatusPayload): string {
  const s = WC_STATUS[p.wcStatus] ?? { label: p.wcStatus, message: `Statut : ${p.wcStatus}`, color: '#555', icon: '📬' };
  return wrap(`
    <h1 style="font-size:20px;font-weight:900;color:#111;margin:0 0 8px;">${s.icon} Mise à jour de commande</h1>
    <p style="font-size:15px;color:#555;margin:0 0 24px;">Bonjour <strong>${p.prenom}</strong>,</p>

    <div style="background:#FFFCEF;border:2px solid #FFB800;border-radius:10px;padding:14px 20px;margin-bottom:20px;text-align:center;">
      <div style="font-size:11px;color:#888;font-weight:700;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Commande</div>
      <div style="font-size:20px;font-weight:900;color:#111;">#${p.orderId}</div>
    </div>

    <div style="background:${s.color}18;border:1.5px solid ${s.color}40;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
      <div style="font-size:12px;font-weight:700;color:${s.color};text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">Nouveau statut</div>
      <div style="font-size:16px;font-weight:900;color:${s.color};">${s.label}</div>
      <div style="font-size:13px;color:#555;margin-top:8px;">${s.message}</div>
    </div>
    ${btn(`${SITE}/suivi-commande`, 'Suivre ma commande →')}
  `);
}

/* ── Template: welcome ──────────────────────────────────────────── */
interface WelcomePayload {
  type: 'welcome';
  to: string; firstName: string; lastName: string;
}

function htmlWelcome(p: WelcomePayload): string {
  return wrap(`
    <h1 style="font-size:22px;font-weight:900;color:#111;margin:0 0 8px;">🎉 Bienvenue sur Topshop.tn !</h1>
    <p style="font-size:15px;color:#555;margin:0 0 20px;">Bonjour <strong>${p.firstName} ${p.lastName}</strong>,<br>Votre compte a été créé avec succès.</p>

    <div style="background:#F8F9FA;border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="font-size:14px;font-weight:700;color:#111;margin-bottom:12px;">Avec votre compte vous pouvez :</div>
      <ul style="margin:0;padding:0 0 0 18px;font-size:14px;color:#555;line-height:2;">
        <li>Suivre vos commandes en temps réel</li>
        <li>Sauvegarder votre adresse de livraison</li>
        <li>Accéder à l'historique de vos achats</li>
        <li>Profiter d'offres exclusives membres</li>
      </ul>
    </div>
    ${btn(`${SITE}/shop`, 'Découvrir nos produits →')}
  `);
}

/* ── Template: contact ──────────────────────────────────────────── */
interface ContactPayload {
  type: 'contact';
  name: string; email: string; subject: string; message: string;
}

function htmlContact(p: ContactPayload): string {
  return wrap(`
    <h1 style="font-size:20px;font-weight:900;color:#111;margin:0 0 8px;">📩 Nouveau message de contact</h1>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ececec;border-radius:10px;overflow:hidden;margin-bottom:20px;">
      <tr style="background:#F8F9FA;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#888;width:100px;">Nom</td>
        <td style="padding:10px 16px;font-size:14px;color:#111;font-weight:600;">${p.name}</td>
      </tr>
      <tr>
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#888;border-top:1px solid #f3f3f3;">Email</td>
        <td style="padding:10px 16px;font-size:14px;color:#111;border-top:1px solid #f3f3f3;"><a href="mailto:${p.email}" style="color:#FFB800;">${p.email}</a></td>
      </tr>
      <tr style="background:#F8F9FA;">
        <td style="padding:10px 16px;font-size:12px;font-weight:700;color:#888;border-top:1px solid #f3f3f3;">Sujet</td>
        <td style="padding:10px 16px;font-size:14px;color:#111;font-weight:600;border-top:1px solid #f3f3f3;">${p.subject}</td>
      </tr>
    </table>

    <div style="font-size:12px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px;">Message</div>
    <div style="background:#FFFCEF;border:1.5px solid #FFB800;border-radius:10px;padding:16px 18px;font-size:14px;color:#111;line-height:1.7;white-space:pre-wrap;">${p.message}</div>
    ${btn(`mailto:${p.email}`, `Répondre à ${p.name} →`)}
  `);
}

/* ── Template: password_reset ───────────────────────────────────── */
interface PasswordResetPayload {
  type: 'password_reset';
  to: string; firstName: string; resetLink: string;
}

function htmlPasswordReset(p: PasswordResetPayload): string {
  return wrap(`
    <h1 style="font-size:22px;font-weight:900;color:#111;margin:0 0 8px;">🔒 Réinitialisation du mot de passe</h1>
    <p style="font-size:15px;color:#555;margin:0 0 20px;">Bonjour <strong>${p.firstName}</strong>,<br>Vous avez demandé à réinitialiser votre mot de passe.</p>

    <div style="background:#FFFCEF;border:2px solid #FFB800;border-radius:10px;padding:16px 18px;margin-bottom:20px;">
      <p style="font-size:13px;color:#555;margin:0 0 8px;">Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe. Ce lien est valable <strong>30 minutes</strong>.</p>
      <p style="font-size:12px;color:#aaa;margin:0;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
    </div>
    ${btn(p.resetLink, 'Réinitialiser mon mot de passe →')}
    <p style="font-size:11px;color:#aaa;text-align:center;margin-top:16px;">Ou copiez ce lien : <span style="word-break:break-all;">${p.resetLink}</span></p>
  `);
}

/* ── Route handler ──────────────────────────────────────────────── */
type Payload = OrderConfirmPayload | OrderStatusPayload | WelcomePayload | PasswordResetPayload | ContactPayload;

export async function POST(req: NextRequest) {
  try {
    const body: Payload = await req.json();
    const type = body.type ?? 'order_confirmation';

    let subject = '';
    let html = '';

    if (type === 'order_confirmation') {
      const p = body as OrderConfirmPayload;
      subject = `✅ Commande #${p.orderId} confirmée — Topshop.tn`;
      html    = htmlOrderConfirmation(p);
    } else if (type === 'order_status') {
      const p = body as OrderStatusPayload;
      const s = WC_STATUS[p.wcStatus];
      subject = `📦 Commande #${p.orderId} — ${s?.label ?? p.wcStatus}`;
      html    = htmlOrderStatus(p);
    } else if (type === 'welcome') {
      const p = body as WelcomePayload;
      subject = `🎉 Bienvenue sur Topshop.tn, ${p.firstName} !`;
      html    = htmlWelcome(p);
    } else if (type === 'password_reset') {
      const p = body as PasswordResetPayload;
      subject = '🔒 Réinitialisation de votre mot de passe — Topshop.tn';
      html    = htmlPasswordReset(p);
    } else if (type === 'contact') {
      const p = body as ContactPayload;
      const ADMIN = process.env.SMTP_USER || '';
      subject = `📩 [Contact] ${p.subject} — ${p.name}`;
      html    = htmlContact(p);
      await transporter.sendMail({ from: FROM, to: ADMIN, replyTo: p.email, subject, html });
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }

    await transporter.sendMail({ from: FROM, to: (body as { to: string }).to, subject, html });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-email]', err);
    return NextResponse.json({ error: 'Email send failed' }, { status: 500 });
  }
}
