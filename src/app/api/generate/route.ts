import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { generateStory, estimateGenerationCost } from '@/lib/ai/generate-story'
import type { Order, Story } from '@/types'

// This route is called internally after payment confirmation
// It handles the full AI generation pipeline

export async function POST(request: NextRequest) {
  const supabase = createAdminClient()

  try {
    const { order_id } = await request.json()
    if (!order_id) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

    // 1. Fetch order + story
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, story:stories(*)')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // 2. Update status to generating
    await supabase.from('orders').update({ status: 'generating' }).eq('id', order_id)

    // 3. Generate story text via Claude
    const startTime = Date.now()
    const generated = await generateStory(
      order.story as Story,
      {
        name: (order as any).child_name,
        age: order.child_age,
        gender: order.child_gender,
        ...order.child_info
      },
      order.illustration_style,
      order.language
    )

    const generationTime = Date.now() - startTime

    // 4. Save generated story to DB
    const { data: genStory, error: genError } = await supabase
      .from('generated_stories')
      .insert({
        order_id,
        story_text: generated.pages,
        generation_model: 'claude-sonnet-4-6',
        generation_tokens: generated.tokens_used,
        generation_cost: estimateGenerationCost(generated.tokens_used),
        generation_time_ms: generationTime,
      })
      .select()
      .single()

    if (genError) throw genError

    // 5. Build PDF (async job)
    // In production: trigger Vercel background function / queue job
    // For now: mark as qc_review for print, ready for PDF
    const newStatus = order.product_type === 'pdf' ? 'ready' : 'qc_review'

    // 6. Generate placeholder PDF URL (in production: call PDF builder)
    const pdfUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}/generated/${order_id}/story.pdf`

    // 7. Update order with results
    await supabase.from('orders').update({
      status: newStatus,
      pdf_url: pdfUrl,
    }).eq('id', order_id)

    // 8. Send notification email
    await sendReadyEmail(order, pdfUrl)

    return NextResponse.json({
      success: true,
      order_id,
      status: newStatus,
      pdf_url: newStatus === 'ready' ? pdfUrl : null,
      pages_count: generated.pages.length,
    })

  } catch (error) {
    console.error('Generation error:', error)

    // Log failed attempt
    if (request.body) {
      const body = await request.json().catch(() => ({}))
      if (body.order_id) {
        await supabase.from('generated_stories').insert({
          order_id: body.order_id,
          error_log: String(error),
        })
        // Don't leave order stuck — alert admin
        await supabase.from('orders')
          .update({ status: 'pending', admin_notes: `Generation failed: ${String(error)}` })
          .eq('id', body.order_id)
      }
    }

    return NextResponse.json({ error: 'Generation failed', details: String(error) }, { status: 500 })
  }
}

// ─── GET: Check generation status ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const orderId = request.nextUrl.searchParams.get('order_id')

  if (!orderId) return NextResponse.json({ error: 'order_id required' }, { status: 400 })

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, pdf_url, audio_url, video_url, updated_at')
    .eq('id', orderId)
    .single()

  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const statusMessages: Record<string, string> = {
    pending: 'في الانتظار...',
    generating: 'يكتب القصة بالذكاء الاصطناعي...',
    qc_review: 'مراجعة الجودة...',
    ready: 'القصة جاهزة! ✅',
    shipped: 'تم الشحن 🚚',
    delivered: 'تم التوصيل 🎉',
  }

  const progressMap: Record<string, number> = {
    pending: 10,
    generating: 50,
    qc_review: 80,
    ready: 100,
    shipped: 100,
    delivered: 100,
  }

  return NextResponse.json({
    order_id: order.id,
    status: order.status,
    progress: progressMap[order.status] || 0,
    current_step: statusMessages[order.status] || '',
    pdf_url: order.status === 'ready' ? order.pdf_url : null,
    audio_url: order.audio_url,
    video_url: order.video_url,
  })
}

// ─── Email helper ─────────────────────────────────────────────────────────────

async function sendReadyEmail(order: Order & { story?: Story }, pdfUrl: string) {
  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Get user email
    const supabase = createAdminClient()
    const { data: user } = await supabase
      .from('users')
      .select('email, full_name')
      .eq('id', order.user_id)
      .single()

    if (!user?.email) return

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@qisatiana.com',
      to: user.email,
      subject: `✨ قصة ${(order as any).child_name} جاهزة للتحميل!`,
      html: `
        <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#1A1A2E,#16213E);padding:32px;border-radius:16px 16px 0 0;text-align:center">
            <h1 style="color:white;font-size:1.5rem">✨ قصتي أنا</h1>
          </div>
          <div style="background:white;padding:32px;border-radius:0 0 16px 16px">
            <h2 style="color:#1A1A2E">مبروك! قصة ${(order as any).child_name} جاهزة 🎉</h2>
            <p style="color:#64748B;line-height:1.7">
              السلام عليكم ${user.full_name || ''},<br><br>
              يسعدنا إخبارك أن قصة "<strong>${order.story?.title_ar}</strong>" لطفلك <strong>${(order as any).child_name}</strong> جاهزة الآن للتحميل!
            </p>
            <div style="text-align:center;margin:24px 0">
              <a href="${pdfUrl}" style="background:linear-gradient(135deg,#4FACF7,#3B82F6);color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-weight:700;display:inline-block">
                ⬇️ تحميل القصة
              </a>
            </div>
            <p style="color:#64748B;font-size:0.85rem">
              يمكنك أيضاً تحميل القصة من <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">لوحة تحكمك</a> في أي وقت.
            </p>
          </div>
        </div>
      `,
    })
  } catch (err) {
    console.error('Email send failed:', err)
    // Don't throw — email failure shouldn't block generation
  }
}
