import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // ── Protect /dashboard ───────────────────────────────────────────────────
  if (path.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login?redirect=/dashboard', request.url))
  }

  // ── Protect /admin — also require admin role ──────────────────────────────
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login?redirect=/admin', request.url))
    }
    // Check role in DB
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const adminRoles = ['admin', 'operations', 'content', 'finance']
    if (!profile || !adminRoles.includes(profile.role)) {
      return NextResponse.redirect(new URL('/?error=unauthorized', request.url))
    }
  }

  // ── Redirect logged-in users away from login ──────────────────────────────
  if (path === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/login',
  ],
}
