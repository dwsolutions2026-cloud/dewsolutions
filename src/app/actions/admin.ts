'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slugify'

import { createClient as createServerClient } from '@/utils/supabase/server'

// Use service role to have admin privileges (delete users)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function checkAdmin() {
  try {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return false

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    return profile?.role === 'admin'
  } catch (error) {
    console.error('Error in checkAdmin:', error)
    return false
  }
}

export async function deleteCandidatoAction(candidatoId: string, userId: string, curriculoUrl: string | null) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: Ação restrita a administradores.' }
  }

  try {
    // 1. Delete curriculum from storage if exists
    if (curriculoUrl) {
      await supabaseAdmin.storage.from('curriculos').remove([curriculoUrl])
    }

    // 2. Delete the candidate record (cascade will handle candidaturas if configured, 
    // but better to be safe if not)
    // Actually, in Supabase, we should delete the user from AUTH, which should cascade 
    // to public.profiles and then public.candidatos if ON DELETE CASCADE is set.
    
    // Let's delete the auth user directly
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { error: 'Erro ao remover acesso do usuário: ' + authError.message }
    }

    // Revalidate the page
    revalidatePath('/admin/talentos')
    revalidatePath('/admin/candidatos')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteCandidatoAction:', error)
    return { error: 'Erro interno ao excluir candidato.' }
  }
}

import { EmpresaSchema } from '@/lib/schemas'

export async function createEmpresaAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: Ação restrita a administradores.' }
  }

  const rawData = Object.fromEntries(formData.entries())
  const result = EmpresaSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { email, password, nome, cnpj, setor, cidade, estado, site } = result.data

  try {
    // 1. Criar usuário no Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'empresa' }
    })

    if (authError) {
      return { error: 'Erro ao criar usuário no Auth: ' + authError.message }
    }

    const userId = authData.user.id

    // 2. Atualizar Role no Profile (O trigger handle_new_user insere como candidato por padrão)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role: 'empresa' })
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating profile role:', profileError)
      // Não interrompemos aqui, mas o acesso pode falhar se o papel estiver errado
    }

    // 3. Inserir na tabela de empresas
    const { error: empresaError } = await supabaseAdmin
      .from('empresas')
      .insert({
        user_id: userId,
        nome,
        slug: slugify(nome),
        cnpj: cnpj.replace(/\D/g, ''),
        setor,
        cidade,
        estado,
        site
      })

    if (empresaError) {
      console.error('Error creating empresa record:', empresaError)
      // Cleanup: Remover usuário se falhar a inserção na tabela
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return { error: 'Erro ao salvar dados da empresa: ' + empresaError.message }
    }

    revalidatePath('/admin/empresas')
    return { success: true }
  } catch (error: any) {
    console.error('Error in createEmpresaAction:', error)
    return { error: 'Erro interno ao cadastrar empresa.' }
  }
}

export async function updateEmpresaAction(id: string, formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: Ação restrita a administradores.' }
  }

  const rawData = Object.fromEntries(formData.entries())
  // Use a partial schema or just pick fields
  const { nome, cnpj, setor, cidade, estado, site } = rawData as any

  try {
    const { error } = await supabaseAdmin
      .from('empresas')
      .update({
        nome,
        cnpj: cnpj.replace(/\D/g, ''),
        setor,
        cidade,
        estado,
        site
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating empresa:', error)
      return { error: 'Erro ao atualizar dados: ' + error.message }
    }

    revalidatePath('/admin/empresas')
    revalidatePath(`/admin/empresas/${id}`)
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateEmpresaAction:', error)
    return { error: 'Erro interno ao atualizar empresa.' }
  }
}
