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

  let resolvedRole = profile?.role || user.user_metadata?.role

  if (!resolvedRole) {
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (empresa) {
      resolvedRole = 'empresa'
    } else {
      resolvedRole = 'candidato'
    }
  }

  let redirectUrl = '/'
  if (resolvedRole === 'admin') {
    redirectUrl = '/admin/dashboard'
  } else if (resolvedRole === 'empresa') {
    redirectUrl = '/empresa/dashboard'
  } else {
    const { data: candidato } = await supabase
      .from('candidatos')
      .select('curriculo_url, curriculo_json')
      .eq('user_id', user.id)
      .maybeSingle()

    if (candidato && (candidato.curriculo_url || candidato.curriculo_json)) {
      redirectUrl = '/candidato/minha-area'
    } else {
      redirectUrl = '/candidato/curriculo/criar'
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
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createServerClient()
      await supabase.auth.signOut()
    }
  } catch (e) {
    console.warn('Supabase server signOut warning (safe to ignore):', e)
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
    // 1. Busca todos os usuários cadastrados para achar o usuário correspondente
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      // Retorna sucesso para evitar enumeração de e-mails, mas avisa amigavelmente
      return { success: true, message: 'Se o e-mail estiver cadastrado, você receberá o link em breve.' }
    }

    // 2. Cria um token seguro único e data de expiração de 1 hora
    const resetToken = crypto.randomUUID()
    const resetTokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    // 3. Salva esses dados nos metadados do próprio usuário de forma 100% segura
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...user.user_metadata,
        reset_token: resetToken,
        reset_token_expires_at: resetTokenExpiresAt,
      }
    })

    if (updateError) throw updateError

    // 4. Cria o link DIRETO para a página de redefinição de senha sem callbacks intermediários
    const actionLink = `${origin}/redefinir-senha?email=${encodeURIComponent(email)}&token=${resetToken}`

    // 5. Envia o e-mail personalizado com o botão dourado via Gmail
    const emailResult = await sendPasswordResetEmail(email, actionLink)

    if (emailResult.error) {
      return { error: `Erro ao enviar o e-mail de recuperação via Gmail: ${emailResult.error}` }
    }

    return { success: true }
  } catch (error: any) {
    console.error('Erro geral ao solicitar recuperação de senha:', error)
    return { error: error.message || 'Erro inesperado ao solicitar redefinição.' }
  }
}

export async function resetPasswordWithTokenAction(email: string, token: string, newPassword: string) {
  if (!email || !token || !newPassword) {
    return { error: 'Todos os campos são obrigatórios.' }
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
    // 1. Busca o usuário pelo e-mail
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    if (listError) throw listError

    const user = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    if (!user) {
      return { error: 'Usuário não encontrado.' }
    }

    // 2. Valida o token e a data de expiração salvos nos metadados
    const metaToken = user.user_metadata?.reset_token
    const metaExpires = user.user_metadata?.reset_token_expires_at

    if (!metaToken || metaToken !== token) {
      return { error: 'O link de recuperação é inválido ou já foi utilizado.' }
    }

    if (!metaExpires || new Date() > new Date(metaExpires)) {
      return { error: 'Este link de recuperação expirou. Por favor, solicite um novo.' }
    }

    // 3. Atualiza a senha do usuário administrativamente e limpa o token de uso único
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
      user_metadata: {
        ...user.user_metadata,
        reset_token: null,
        reset_token_expires_at: null,
      }
    })

    if (updateError) throw updateError

    return { success: true }
  } catch (error: any) {
    console.error('Erro ao redefinir senha com token:', error)
    return { error: error.message || 'Erro inesperado ao redefinir senha.' }
  }
}

