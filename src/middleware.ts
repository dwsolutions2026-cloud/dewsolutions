import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const isProtectedRoute = path.startsWith('/admin') || path.startsWith('/empresa') || path.startsWith('/candidato')
  const isAuthRoute = path === '/login' || path === '/cadastro'

  if (isProtectedRoute || (user && isAuthRoute)) {
    if (!user && isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user) {
      // Otimização: Consulta de role unificada
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role

      // Redirecionamentos se já logado e acessando rotas públicas de auth
      if (isAuthRoute) {
        if (role === 'admin') return NextResponse.redirect(new URL('/admin/dashboard', request.url))
        if (role === 'empresa') return NextResponse.redirect(new URL('/empresa/dashboard', request.url))
        if (role === 'candidato') return NextResponse.redirect(new URL('/vagas', request.url)) // ou '/candidato/candidaturas'
      }

      // Controle de Acesso rígido para rotas protegidas
      if (path.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (path.startsWith('/empresa') && role !== 'empresa') {
        return NextResponse.redirect(new URL('/', request.url))
      }
      if (path.startsWith('/candidato') && role !== 'candidato') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
