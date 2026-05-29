import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * WooCommerce webhook — order.updated / order.created
 *
 * Configure dans WC Admin → WooCommerce → Paramètres → Avancé → Webhooks
 *   Sujet  : order.updated
 *   URL    : https://shop.toprix.tn/api/webhook/wc-order
 *   Secret : valeur de WEBHOOK_SECRET dans .env.local
 */

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Vérification signature HMAC (si WEBHOOK_SECRET configuré)
    const secret = process.env.WEBHOOK_SECRET;
    if (secret) {
      const sig = req.headers.get('x-wc-webhook-signature') ?? '';
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody, 'utf8')
        .digest('base64');
      if (sig !== expected) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    // WC envoie parfois un corps vide pour le ping de test
    if (!rawBody.trim()) return NextResponse.json({ ok: true, skipped: true });

    let order: Record<string, unknown>;
    try { order = JSON.parse(rawBody); }
    catch { return NextResponse.json({ ok: true, skipped: true }); }

    const email     = (order.billing as Record<string, string> | undefined)?.email;
    const firstName = (order.billing as Record<string, string> | undefined)?.first_name;
    const orderId   = (order.number ?? order.id) as string | number | undefined;
    const status    = order.status as string | undefined;

    // N'envoyer que pour les statuts pertinents
    const NOTIFY = ['processing', 'completed', 'cancelled', 'on-hold', 'refunded'];
    if (!email || !status || !NOTIFY.includes(status)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://shop.toprix.tn';
    // Fire-and-forget — ne bloque pas la réponse au webhook
    fetch(`${SITE}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type:     'order_status',
        to:       email,
        orderId:  orderId,
        prenom:   firstName || 'Client',
        wcStatus: status,
      }),
    }).catch(() => {});

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook/wc-order]', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
