import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase'
import type { ChildInfo, IllustrationStyle, Language, ProductType } from '@/types'

// POST /api/orders — create new order after payment
export async function POST(request: NextRequest) {
  const supabase = createAdminClient()
  const authClient = await createServerSupabaseClient()

  try {
    const body = await request.json()
    const {
      story_id,
      product_type,
      illustration_style,
      language,
      child_info,
      upsells,
      total,
      currency,
      coupon_code,
      payment_id,
      payment_method,
      email,
    }: {
      story_id: string
      product_type: ProductType
      illustration_style: IllustrationStyle
      language: Language
      child_info: ChildInfo
      upsells: any[]
      total: number
      currency: string
      coupon_code?: string
      payment_id: string
      payment_method: string
      email: string
    } = body

    // Get or create user
    let user_id: string
    const { data: { user } } = await authClient.auth.getUser()

    if (user) {
      user_id = user.id
      // Ensure user profile exists
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email || email,
      }, { onConflict: 'id', ignoreDuplicates: true })
    } else {
      // Guest checkout: create or find user by email
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single()

      if (existingUser) {
        user_id = existingUser.id
      } else {
        // Create guest user in auth + profile
        const { data: newAuthUser, error: authErr } = await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { is_guest: true }
        })
        if (authErr || !newAuthUser.user) throw authErr

        user_id = newAuthUser.user.id
        await supabase.from('users').insert({
          id: user_id,
          email,
          language: language || 'ar',
        })
      }
    }

    // Calculate subtotal
    const { data: story } = await supabase.from('stories').select('price_sar').eq('id', story_id).single()
    const basePrice = story?.price_sar || 29
    const upsellTotal = upsells.reduce((sum: number, u: any) => sum + (u.price || 0), 0)
    const subtotal = product_type === 'print' ? basePrice + 40 : basePrice
    const discount = coupon_code ? await applyCoupon(supabase, coupon_code, subtotal) : 0

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id,
        story_id,
        product_type,
        illustration_style: illustration_style || 'watercolor',
        language: language || 'ar',
        child_name: child_info.name,
        child_age: child_info.age,
        child_gender: child_info.gender,
        child_info: {
          personality: child_info.personality,
          favorite_animal: child_info.favorite_animal,
          favorite_color: child_info.favorite_color,
          favorite_hobby: child_info.favorite_hobby,
          dream_job: child_info.dream_job,
          dedication_message: child_info.dedication_message,
          photo_url: child_info.photo_url,
        },
        upsells: upsells || [],
        subtotal,
        discount,
        total: total || (subtotal - discount + upsellTotal),
        currency: currency || 'SAR',
        coupon_code: coupon_code || null,
        payment_id,
        payment_method,
        paid_at: new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single()

    if (orderError || !order) throw orderError

    // Trigger AI generation asynchronously
    fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: order.id }),
    }).catch(console.error) // fire and forget

    return NextResponse.json({ success: true, order_id: order.id, order_number: order.order_number })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

// GET /api/orders — fetch user orders
export async function GET(request: NextRequest) {
  const authClient = await createServerSupabaseClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*, story:stories(id,title_ar,title_en,emoji,cover_gradient,slug)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data: orders })
}

// ─── Coupon helper ────────────────────────────────────────────────────────────
async function applyCoupon(supabase: any, code: string, subtotal: number): Promise<number> {
  const { data: coupon } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (!coupon) return 0
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) return 0
  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) return 0
  if (coupon.min_order_value && subtotal < coupon.min_order_value) return 0

  return coupon.discount_type === 'percentage'
    ? (subtotal * coupon.discount_value) / 100
    : coupon.discount_value
}
