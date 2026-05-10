import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    // 1. Cria a resposta inicial de redirecionamento para onde os cookies serão injetados
    const response = NextResponse.redirect(`${origin}${next}`)

    // 2. Cria o cliente do Supabase escrevendo os cookies diretamente no objeto de resposta redirecionado
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get('cookie')
            if (!cookieHeader) return []
            return cookieHeader.split(';').map(cookie => {
              const [name, ...value] = cookie.trim().split('=')
              return { name, value: value.join('=') }
            })
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set({ name, value, ...options })
            })
          },
        },
      }
    )

    // 3. Troca o código pela sessão (grava os cookies direto na 'response')
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && sessionData.session) {
      const user = sessionData.session.user
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      
      let redirectUrl = next === '/' ? null : next

      if (!redirectUrl && profile) {
        if (profile.role === 'admin') redirectUrl = '/admin/dashboard'
        else if (profile.role === 'empresa') redirectUrl = '/empresa/dashboard'
        else if (profile.role === 'candidato') {
          const { data: candidato } = await supabase
            .from('candidatos')
            .select('curriculo_url, curriculo_json')
            .eq('user_id', user.id)
            .single()

          if (candidato && (candidato.curriculo_url || candidato.curriculo_json)) {
            redirectUrl = '/candidato/minha-area'
          } else {
            redirectUrl = '/candidato/curriculo/criar'
          }
        }
      }

      // 4. Atualiza o cabeçalho Location para o destino final, preservando cookies setados
      response.headers.set('Location', `${origin}${redirectUrl || '/'}`)
      return response
    }
  }

  // Se falhar, redireciona para login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
