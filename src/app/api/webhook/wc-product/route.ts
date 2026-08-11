import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { submitToIndexNow, productUrl } from '@/lib/indexnow';

/**
 * WooCommerce webhook — product.created / product.updated / product.deleted
 *
 * Configure dans WC Admin → WooCommerce → Paramètres → Avancé → Webhooks
 * (un webhook par sujet) :
 *   Sujet  : Produit créé / Produit mis à jour / Produit supprimé
 *   URL    : https://shop.toprix.tn/api/webhook/wc-product
 *   Secret : même valeur que WEBHOOK_SECRET (celle déjà utilisée pour wc-order)
 *
 * À chaque événement, notifie IndexNow (Bing/Yandex) que l'URL produit
 * correspondante sur shop.toprix.tn a changé, pour un crawl plus rapide
 * qu'en attendant le prochain passage du sitemap.
 */

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

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

    // WC envoie un corps vide pour le ping de test lors de la création du webhook
    if (!rawBody.trim()) return NextResponse.json({ ok: true, skipped: true });

    let product: Record<string, unknown>;
    try { product = JSON.parse(rawBody); }
    catch { return NextResponse.json({ ok: true, skipped: true }); }

    const slug = product.slug as string | undefined;
    // Les webhooks "product.deleted" de WooCommerce n'incluent pas toujours
    // le slug — dans ce cas on ne peut pas construire l'URL, on ignore.
    if (!slug) return NextResponse.json({ ok: true, skipped: true });

    await submitToIndexNow(productUrl(slug));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[webhook/wc-product]', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
