import { NextRequest, NextResponse } from 'next/server';

const WC_URL    = process.env.NEXT_PUBLIC_WC_URL    || 'https://wc.toprix.tn';
const WC_KEY    = process.env.WC_CONSUMER_KEY        || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET     || '';

export async function POST(req: NextRequest) {
  if (!WC_KEY || !WC_SECRET) {
    console.error('[orders] WC_CONSUMER_KEY or WC_CONSUMER_SECRET not set');
    return NextResponse.json({ error: 'WooCommerce credentials not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();

    // WooCommerce rejects empty string email — remove it if not provided
    if (body.billing?.email === '') delete body.billing.email;
    if (body.shipping?.email === '') delete body.shipping.email;

    const url = `${WC_URL}/wp-json/wc/v3/orders`;
    const auth = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString('base64');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(12000),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error('[orders] WooCommerce error:', data.message, 'status:', res.status);
      return NextResponse.json({ error: data.message || 'WooCommerce error' }, { status: 400 });
    }

    return NextResponse.json({ id: data.id, number: data.number });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTimeout = msg.includes('timeout') || msg.includes('abort') || msg.includes('AbortError');
    console.error('[orders] error:', msg);
    return NextResponse.json(
      { error: isTimeout ? 'WooCommerce timeout — vérifiez le pare-feu serv00' : 'Server error', detail: msg },
      { status: isTimeout ? 504 : 500 }
    );
  }
}
