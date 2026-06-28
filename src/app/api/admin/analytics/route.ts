import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient, createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  // Verify admin access
  const authClient = await createServerSupabaseClient()
  const { data: { user } } = await authClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (!['admin', 'finance', 'operations'].includes(profile?.role || '')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const now = new Date()
  const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Revenue today
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total, status')
    .gte('created_at', todayStart)
    .not('status', 'in', '(pending,refunded)')

  // Revenue this month
  const { data: monthOrders } = await supabase
    .from('orders')
    .select('total, currency, created_at, status')
    .gte('created_at', monthStart)
    .not('status', 'in', '(pending,refunded)')

  // Top stories
  const { data: topStories } = await supabase
    .from('orders')
    .select('story_id, total, story:stories(title_ar)')
    .not('status', 'in', '(pending,refunded)')
    .gte('created_at', monthStart)

  // Story aggregation
  const storyMap: Record<string, { title: string; count: number; revenue: number }> = {}
  topStories?.forEach((o: any) => {
    if (!storyMap[o.story_id]) storyMap[o.story_id] = { title: o.story?.title_ar || '', count: 0, revenue: 0 }
    storyMap[o.story_id].count++
    storyMap[o.story_id].revenue += o.total
  })

  const topStoriesArray = Object.entries(storyMap)
    .map(([story_id, data]) => ({ story_id, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)

  // Daily revenue last 7 days
  const dailyRevenue = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dayStart = new Date(d.setHours(0, 0, 0, 0)).toISOString()
    const dayEnd = new Date(d.setHours(23, 59, 59, 999)).toISOString()

    const { data: dayOrders } = await supabase
      .from('orders')
      .select('total')
      .gte('created_at', dayStart)
      .lte('created_at', dayEnd)
      .not('status', 'in', '(pending,refunded)')

    dailyRevenue.push({
      date: dayStart,
      revenue: dayOrders?.reduce((s: number, o: any) => s + o.total, 0) || 0,
      orders: dayOrders?.length || 0,
    })
  }

  // Generation queue stats
  const { data: queueOrders } = await supabase
    .from('orders')
    .select('id, status, child_name, story:stories(title_ar), created_at')
    .in('status', ['pending', 'generating', 'qc_review'])
    .order('created_at', { ascending: true })
    .limit(10)

  const revenueToday = todayOrders?.reduce((s: number, o: any) => s + o.total, 0) || 0
  const revenueMonth = monthOrders?.reduce((s: number, o: any) => s + o.total, 0) || 0

  return NextResponse.json({
    data: {
      revenue_today: revenueToday,
      revenue_month: revenueMonth,
      orders_today: todayOrders?.length || 0,
      orders_month: monthOrders?.length || 0,
      avg_order_value: monthOrders?.length ? revenueMonth / monthOrders.length : 0,
      top_stories: topStoriesArray,
      daily_revenue: dailyRevenue,
      queue: queueOrders || [],
    }
  })
}
