'use server'

import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import {
  createClient as createServerClient,
  isSupabaseConfigured,
} from '@/utils/supabase/server'
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/resend'
import { CandidatoRegistrationSchema } from '@/lib/schemas'

function getSupabaseEnvError(action: 'login' | 'cadastro') {
  return action === 'login'
    ? 'Configuração do Supabase ausente. Verifique as variáveis de ambiente (URL/Key).'
    : 'Configuração do Supabase ausente. Verifique as variáveis de ambiente (URL/Key).'
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured()) {
    return redirect('/login?error=supabase_not_configured')
  }

  const supabase = await createServerClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Erro no login social:', error.message)
    return redirect('/login?error=social_failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithApple() {
  if (!isSupabaseConfigured()) {
    return redirect('/login?error=supabase_not_configured')
  }

  const supabase = await createServerClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'apple',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error('Erro no login Apple:', error.message)
    return redirect('/login?error=social_failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'E-mail e senha são obrigatórios.' }
  }

  if (!isSupabaseConfigured()) {
    return { error: getSupabaseEnvError('login') }
  }

  const supabase = await createServerClient()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !authData.user) {
    return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' }
  }

  const user = authData.user
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  let redirectUrl = '/'
  if (profile) {
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

  redirect(redirectUrl)
}

export async function registerCandidateAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: getSupabaseEnvError('cadastro') }
  }

  const parsed = CandidatoRegistrationSchema.safeParse({
    nome: formData.get('nome'),
    email: formData.get('email'),
    telefone: formData.get('telefone') || undefined,
    password: formData.get('password'),
    passwordConfirm: formData.get('passwordConfirm'),
    cidade: formData.get('cidade') || undefined,
    estado: formData.get('estado') || undefined,
    lgpd: formData.get('lgpd'),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { email, password, nome, lgpd } = parsed.data
  const lgpd_aceito = lgpd === 'on'
  const curriculo = formData.get('curriculo') as File | null

  if (curriculo && curriculo.size > 0) {
    if (curriculo.type !== 'application/pdf') {
      return { error: 'O currículo deve ser um arquivo PDF.' }
    }
    if (curriculo.size > 5 * 1024 * 1024) {
      return { error: 'O currículo não pode exceder 5MB.' }
    }
  }

  const supabase = await createServerClient()

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    const userId = authData.user.id
    let curriculo_url: string | null = null

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return {
        error:
          'A chave SUPABASE_SERVICE_ROLE_KEY não está configurada no servidor.',
      }
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    if (curriculo && curriculo.size > 0) {
      const filePath = `${userId}.pdf`
      const { error: uploadError } = await supabaseAdmin.storage
        .from('curriculos')
        .upload(filePath, curriculo, {
          upsert: true,
          contentType: 'application/pdf',
        })

      if (uploadError) {
        console.error('CV Upload Error:', uploadError)
        return { error: `Erro ao enviar o currículo: ${uploadError.message}` }
      }
      curriculo_url = filePath
    }

    const telefone = formData.get('telefone') as string
    const cidade = formData.get('cidade') as string
    const estado = formData.get('estado') as string

    const { error: candidateError } = await supabaseAdmin.from('candidatos').insert({
      user_id: userId,
      nome,
      email,
      telefone,
      cidade,
      estado,
      curriculo_url,
      lgpd_aceito,
      lgpd_aceito_em: new Date().toISOString(),
    })

    if (candidateError) {
      console.error('Error creating candidate record:', candidateError)
      return { error: `Erro ao criar perfil de candidato: ${candidateError.message}` }
    }

    await sendWelcomeEmail(email, nome)
  }

  const sem_curriculo = formData.get('sem_curriculo') === 'on'
  const redirectUrl = sem_curriculo
    ? '/candidato/curriculo/criar'
    : '/candidato/minha-area'

  redirect(redirectUrl)
}

export async function logoutAction() {
  if (isSupabaseConfigured()) {
    const supabase = await createServerClient()
    await supabase.auth.signOut()
  }
  redirect('/login')
}

export async function requestPasswordResetAction(email: string, origin: string) {
  if (!email) {
    return { error: 'E-mail é obrigatório.' }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { error: 'A chave SUPABASE_SERVICE_ROLE_KEY não está configurada no servidor.' }
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  try {
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${origin}/auth/callback?next=/redefinir-senha`
      }
    })

    if (error || !data?.properties?.action_link) {
      console.error('Erro ao gerar link de redefinição no Supabase:', error)
      return { error: error?.message || 'Erro ao gerar o link de redefinição.' }
    }

    const actionLink = data.properties.action_link
    const emailResult = await sendPasswordResetEmail(email, actionLink)

    if (emailResult.error) {
      return { error: `Erro ao enviar o e-mail de recuperação via Gmail: ${emailResult.error}` }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro geral na redefinição de senha:', error)
    return { error: error.message || 'Erro inesperado ao solicitar redefinição de senha.' }
  }
}

