'use server'

import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { sendWelcomeEmail } from '@/lib/resend'

export async function signInWithGoogle() {
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
    return { error: 'E-mail e senha são obrigatórios' }
  }

  const supabase = await createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Credenciais inválidas. Verifique seu e-mail e senha.' }
  }

  // The middleware will handle redirecting the user based on their role
  redirect('/login') // Trigger middleware to redirect correctly
}

import { CandidatoRegistrationSchema } from '@/lib/schemas'

export async function registerCandidateAction(formData: FormData) {
  // 1. Zod Validation
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
    return { error: parsed.error.errors[0].message }
  }

  const { email, password, nome, telefone, cidade, estado, lgpd } = parsed.data
  const lgpd_aceito = lgpd === 'on'

  const curriculo = formData.get('curriculo') as File | null

  // Só valida o tipo se o arquivo for enviado
  if (curriculo && curriculo.size > 0 && curriculo.type !== 'application/pdf') {
    return { error: 'O currículo deve ser um arquivo PDF' }
  }

  const supabase = await createServerClient()

  // Register the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { error: authError.message }
  }

  if (authData.user) {
    const userId = authData.user.id
    let curriculo_url = null
    
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Upload CV apenas se o arquivo foi enviado
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

    // Update 'candidatos' table using Admin client
    const { error: candidateError } = await supabaseAdmin
      .from('candidatos')
      .insert({
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

    // Send welcome email
    await sendWelcomeEmail(email, nome)
  }

  // Redireciona diretamente para a área do candidato após o cadastro
  redirect('/candidato/candidaturas')
}
