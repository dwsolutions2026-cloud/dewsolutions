'use server'

import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { slugify } from '@/lib/slugify'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { EmpresaSchema } from '@/lib/schemas'

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

export async function checkAdmin() {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

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

export async function deleteCandidatoAction(
  candidatoId: string,
  userId: string,
  curriculoUrl: string | null
) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: ação restrita a administradores.' }
  }

  try {
    const supabaseAdmin = getSupabaseAdmin()

    if (curriculoUrl) {
      await supabaseAdmin.storage.from('curriculos').remove([curriculoUrl])
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { error: 'Erro ao remover acesso do usuário: ' + authError.message }
    }

    revalidatePath('/admin/talentos')
    revalidatePath('/admin/candidatos')

    return { success: true }
  } catch (error: unknown) {
    console.error('Error in deleteCandidatoAction:', error)
    return { error: 'Erro interno ao excluir candidato.' }
  }
}

export async function createEmpresaAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: ação restrita a administradores.' }
  }

  const rawData = Object.fromEntries(formData.entries())
  const result = EmpresaSchema.safeParse(rawData)

  if (!result.success) {
    return { error: result.error.issues[0].message }
  }

  const { email, password, nome, cnpj, setor, cidade, estado, site } = result.data

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { role: 'empresa' },
      })

    if (authError) {
      return { error: 'Erro ao criar usuário no Auth: ' + authError.message }
    }

    const userId = authData.user.id

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: userId, role: 'empresa' })

    if (profileError) {
      console.error('Error upserting profile role:', profileError)
    }

    const { error: empresaError } = await supabaseAdmin.from('empresas').insert({
      user_id: userId,
      nome,
      slug: slugify(nome),
      cnpj: cnpj.replace(/\D/g, ''),
      setor,
      cidade,
      estado,
      site,
    })

    if (empresaError) {
      console.error('Error creating empresa record:', empresaError)
      await supabaseAdmin.auth.admin.deleteUser(userId)
      return { error: 'Erro ao salvar dados da empresa: ' + empresaError.message }
    }

    revalidatePath('/admin/empresas')
    return { success: true }
  } catch (error: unknown) {
    console.error('Error in createEmpresaAction:', error)
    return { error: 'Erro interno ao cadastrar empresa.' }
  }
}

export async function updateEmpresaAction(id: string, formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    return { error: 'Acesso negado: ação restrita a administradores.' }
  }

  const rawData = Object.fromEntries(formData.entries())
  const nome = String(rawData.nome || '')
  const cnpj = String(rawData.cnpj || '')
  const setor = rawData.setor ? String(rawData.setor) : null
  const cidade = rawData.cidade ? String(rawData.cidade) : null
  const estado = rawData.estado ? String(rawData.estado) : null
  const site = rawData.site ? String(rawData.site) : null

  try {
    const supabaseAdmin = getSupabaseAdmin()

    const { error } = await supabaseAdmin
      .from('empresas')
      .update({
        nome,
        cnpj: cnpj.replace(/\D/g, ''),
        setor,
        cidade,
        estado,
        site,
      })
      .eq('id', id)

    if (error) {
      console.error('Error updating empresa:', error)
      return { error: 'Erro ao atualizar dados: ' + error.message }
    }

    revalidatePath('/admin/empresas')
    revalidatePath(`/admin/empresas/${id}`)
    return { success: true }
  } catch (error: unknown) {
    console.error('Error in updateEmpresaAction:', error)
    return { error: 'Erro interno ao atualizar empresa.' }
  }
}
