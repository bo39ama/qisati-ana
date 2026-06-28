import { NextRequest, NextResponse } from 'next/server'

// POST /api/checkout — create payment session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { total, currency, email, items, order_meta } = body

    // ── Option 1: Tap Payments (MENA — Mada, KNET, Apple Pay) ──────────────
    // Use for SAR, AED, KWD
    if (['SAR', 'AED', 'KWD'].includes(currency)) {
      const tapResponse = await createTapCharge({ total, currency, email, items, order_meta })
      return NextResponse.json(tapResponse)
    }

    // ── Option 2: Stripe (global — USD, EUR) ─────────────────────────────────
    const stripeResponse = await createStripeSession({ total, currency, email, items, order_meta })
    return NextResponse.json(stripeResponse)

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}

// ─── Tap Payments ─────────────────────────────────────────────────────────────
async function createTapCharge({ total, currency, email, items, order_meta }: any) {
  const response = await fetch('https://api.tap.company/v2/charges', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TAP_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: total,
      currency,
      customer_initiated: true,
      threeDSecure: true,
      save_card: false,
      description: `قصتي أنا — ${items?.[0]?.name || 'قصة'}`,
      metadata: { order_meta: JSON.stringify(order_meta) },
      reference: { transaction: `QA-${Date.now()}`, order: `QA-${Date.now()}` },
      receipt: { email: true, sms: false },
      customer: {
        email,
        first_name: '',
      },
      source: { id: 'src_all' }, // allows all payment methods
      post: { url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/tap` },
      redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={id}` },
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Tap error: ${err}`)
  }

  const data = await response.json()
  return {
    provider: 'tap',
    checkout_url: data.transaction?.url,
    charge_id: data.id,
    status: data.status,
  }
}

// ─── Stripe ───────────────────────────────────────────────────────────────────
async function createStripeSession({ total, currency, email, items, order_meta }: any) {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: currency.toLowerCase(),
        product_data: {
          name: items?.[0]?.name || 'Qisati Ana Story',
          description: 'Personalized Arabic children\'s story',
        },
        unit_amount: Math.round(total * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    customer_email: email,
    metadata: { order_meta: JSON.stringify(order_meta) },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/create`,
    //locale: 'ar',
  })

  return {
    provider: 'stripe',
    checkout_url: session.url,
    session_id: session.id,
  }
}
