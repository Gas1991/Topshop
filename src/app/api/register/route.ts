import { NextRequest, NextResponse } from 'next/server';

const WC_URL    = process.env.NEXT_PUBLIC_WC_URL    || 'https://shop.toprix.tn';
const WC_KEY    = process.env.WC_CONSUMER_KEY        || '';
const WC_SECRET = process.env.WC_CONSUMER_SECRET     || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url = new URL(`${WC_URL}/wp-json/wc/v3/customers`);
    url.searchParams.set('consumer_key', WC_KEY);
    url.searchParams.set('consumer_secret', WC_SECRET);

    const res = await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json({ error: err.message || 'WC error' }, { status: 400 });
    }

    const data = await res.json();
    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
