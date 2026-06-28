import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// GET /api/stories — fetch all active stories
export async function GET(request: NextRequest) {
  const supabase = createAdminClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')

  let query = supabase
    .from('stories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (category && category !== 'all') query = query.eq('category', category)
  if (featured === 'true') query = query.eq('is_featured', true)
  if (slug) query = query.eq('slug', slug).single() as any

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data }, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
    }
  })
}
