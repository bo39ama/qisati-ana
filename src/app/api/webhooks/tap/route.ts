import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// POST /api/webhooks/tap — Tap Payments webhook
export async function POST(request: NextRequest) {
  const supabase = createAdminClient()

  try {
    const body = await request.json()
    const { id, status, metadata } = body

    // Verify it's a successful charge
    if (status !== 'CAPTURED') {
      return NextResponse.json({ received: true })
    }

    // Parse order metadata
    const orderMeta = JSON.parse(metadata?.order_meta || '{}')

    // Create the order
    const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderMeta,
        payment_id: id,
        payment_method: 'tap',
      }),
    })

    if (!orderResponse.ok) {
      throw new Error('Failed to create order from webhook')
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Tap webhook error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

// POST /api/webhooks/stripe — Stripe webhook  
export async function stripeWebhook(request: NextRequest) {
  const Stripe = (await import('stripe')).default
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const sig = request.headers.get('stripe-signature')!
  const body = await request.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any
    const orderMeta = JSON.parse(session.metadata?.order_meta || '{}')

    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...orderMeta,
        payment_id: session.id,
        payment_method: 'stripe',
        email: session.customer_email,
      }),
    })
  }

  return NextResponse.json({ received: true })
}
