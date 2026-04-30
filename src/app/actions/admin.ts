'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { sendCompanyCredentials } from '@/lib/resend'

// We need the service role key to manage users securely
const getServiceSupabase = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export async function checkAdmin() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return profile?.role === 'admin'
}

export async function createEmpresaAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Acesso negado' }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const nome = formData.get('nome') as string
  const cnpj = formData.get('cnpj') as string
  const setor = formData.get('setor') as string
  const cidade = formData.get('cidade') as string
  const estado = formData.get('estado') as string

  if (!email || !password || !nome || !cnpj) {
    return { error: 'Preencha os campos obrigatórios' }
  }

  const supabaseAdmin = getServiceSupabase()

  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return { error: 'Erro ao criar usuário: ' + authError.message }
  }

  const userId = authData.user.id

  // 2. The trigger automatically inserted a 'candidato' profile. We MUST update it to 'empresa'.
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: 'empresa' })
    .eq('id', userId)

  if (profileError) {
    console.error('Error updating role:', profileError)
    return { error: 'Erro ao definir permissões da empresa.' }
  }

  // 3. Insert into 'empresas' table
  const { error: empresaError } = await supabaseAdmin
    .from('empresas')
    .insert({
      user_id: userId,
      nome,
      cnpj: cnpj.replace(/\D/g, ''), // clean CNPJ
      setor,
      cidade,
      estado,
      logradouro: formData.get('logradouro') as string || null,
      numero: formData.get('numero') as string || null,
      complemento: formData.get('complemento') as string || null,
      bairro: formData.get('bairro') as string || null,
      cep: formData.get('cep') as string || null,
      site: formData.get('site') as string || null,
    })

  if (empresaError) {
    console.error('Error creating empresa record:', empresaError)
    return { error: 'Erro ao cadastrar dados da empresa.' }
  }

  // Enviar e-mail com as credenciais para a empresa
  await sendCompanyCredentials(email, nome, password)

  revalidatePath('/admin/empresas')
  redirect('/admin/empresas')
}
