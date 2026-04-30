'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/app/actions/admin'

import { VagaSchema } from '@/lib/schemas'

const getServiceSupabase = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function createVagaAdminAction(formData: FormData) {
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
    return { error: parsed.error.errors[0].message }
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').insert({
    ...parsed.data,
    status: 'ativa',
  })

  if (error) return { error: error.message }
  revalidatePath('/admin/vagas')
  return { success: true }
}

export async function updateVagaStatusAction(id: string, status: 'ativa' | 'encerrada') {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Acesso negado' }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').update({ status }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/vagas')
  return { success: true }
}

export async function deleteVagaAdminAction(id: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Acesso negado' }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/admin/vagas')
  return { success: true }
}

export async function updateVagaAdminAction(id: string, formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Acesso negado' }

  // 1. Zod Validation (reusing the same schema, but ignoring empresa_id if it's not present)
  // When editing, empresa_id might not be passed because it's disabled or not rendered
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
    return { error: parsed.error.errors[0].message }
  }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').update(parsed.data).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/vagas')
  return { success: true }
}
