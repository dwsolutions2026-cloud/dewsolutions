import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error, data: sessionData } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && sessionData.session) {
      const user = sessionData.session.user
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      
      let redirectUrl = next === '/' ? null : next

      if (!redirectUrl && profile) {
        if (profile.role === 'admin') redirectUrl = '/admin/dashboard'
        else if (profile.role === 'empresa') redirectUrl = '/empresa/dashboard'
        else if (profile.role === 'candidato') {
          const { data: candidato } = await supabase.from('candidatos').select('curriculo_url, curriculo_json').eq('user_id', user.id).single()
          if (candidato && (candidato.curriculo_url || candidato.curriculo_json)) {
            redirectUrl = '/candidato/minha-area'
          } else {
            redirectUrl = '/candidato/curriculo/criar'
          }
        }
      }

      return NextResponse.redirect(`${origin}${redirectUrl || '/'}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
