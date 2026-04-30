'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/app/actions/admin'

import { VagaSchema } from '@/lib/schemas'
import { slugify } from '@/lib/slugify'

const getServiceSupabase = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function createVagaAdminAction(formData: FormData) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    // 1. Zod Validation
    const parsed = VagaSchema.safeParse({
      empresa_id: formData.get('empresa_id'),
      titulo: formData.get('titulo'),
      area: formData.get('area'),
      descricao: formData.get('descricao'),
      requisitos: formData.get('requisitos') || undefined,
      beneficios: formData.get('beneficios') || undefined,
      regime: formData.get('regime') || undefined,
      modalidade: formData.get('modalidade') || undefined,
      cidade: formData.get('cidade') || undefined,
      estado: formData.get('estado') || undefined,
      quantidade_vagas: parseInt(formData.get('quantidade_vagas') as string) || 1,
      salario_min: formData.get('salario_min') ? parseFloat(formData.get('salario_min') as string) : null,
      salario_max: formData.get('salario_max') ? parseFloat(formData.get('salario_max') as string) : null,
      exibir_salario: formData.get('exibir_salario') === 'on',
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from('vagas').insert({
      ...parsed.data,
      slug: `${slugify(parsed.data.titulo)}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'ativa',
    })

    if (error) return { error: error.message }
    revalidatePath('/admin/vagas')
    return { success: true }
  } catch (error: any) {
    console.error('Error in createVagaAdminAction:', error)
    return { error: 'Erro interno ao criar vaga.' }
  }
}

export async function updateVagaStatusAction(id: string, status: 'ativa' | 'encerrada') {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from('vagas').update({ status }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/vagas')
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateVagaStatusAction:', error)
    return { error: 'Erro interno ao atualizar status da vaga.' }
  }
}

export async function deleteVagaAdminAction(id: string) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from('vagas').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/vagas')
    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteVagaAdminAction:', error)
    return { error: 'Erro interno ao excluir vaga.' }
  }
}

export async function updateVagaAdminAction(id: string, formData: FormData) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    // 1. Zod Validation (reusing the same schema, but ignoring empresa_id if it's not present)
    const parsed = VagaSchema.omit({ empresa_id: true }).safeParse({
      titulo: formData.get('titulo'),
      area: formData.get('area'),
      descricao: formData.get('descricao'),
      requisitos: formData.get('requisitos') || undefined,
      beneficios: formData.get('beneficios') || undefined,
      regime: formData.get('regime') || undefined,
      modalidade: formData.get('modalidade') || undefined,
      cidade: formData.get('cidade') || undefined,
      estado: formData.get('estado') || undefined,
      quantidade_vagas: parseInt(formData.get('quantidade_vagas') as string) || 1,
      salario_min: formData.get('salario_min') ? parseFloat(formData.get('salario_min') as string) : null,
      salario_max: formData.get('salario_max') ? parseFloat(formData.get('salario_max') as string) : null,
      exibir_salario: formData.get('exibir_salario') === 'on',
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = getServiceSupabase()
    const { error } = await supabase.from('vagas').update({
      ...parsed.data,
      slug: `${slugify(parsed.data.titulo)}-${id.substring(0, 4)}`
    }).eq('id', id)

    if (error) return { error: error.message }
    revalidatePath('/admin/vagas')
    return { success: true }
  } catch (error: any) {
    console.error('Error in updateVagaAdminAction:', error)
    return { error: 'Erro interno ao atualizar vaga.' }
  }
}
