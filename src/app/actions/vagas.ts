'use server'

import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { checkAdmin } from '@/app/actions/admin'

const getServiceSupabase = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function createVagaAdminAction(formData: FormData) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Acesso negado' }

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').insert({
    empresa_id: formData.get('empresa_id') as string,
    titulo: formData.get('titulo') as string,
    area: formData.get('area') as string,
    descricao: formData.get('descricao') as string,
    requisitos: formData.get('requisitos') as string,
    beneficios: formData.get('beneficios') as string,
    regime: formData.get('regime') as string,
    modalidade: formData.get('modalidade') as string,
    cidade: formData.get('cidade') as string,
    estado: formData.get('estado') as string,
    quantidade_vagas: parseInt(formData.get('quantidade_vagas') as string) || 1,
    salario_min: formData.get('salario_min') ? parseFloat(formData.get('salario_min') as string) : null,
    salario_max: formData.get('salario_max') ? parseFloat(formData.get('salario_max') as string) : null,
    exibir_salario: formData.get('exibir_salario') === 'on',
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

  const supabase = getServiceSupabase()
  const { error } = await supabase.from('vagas').update({
    titulo: formData.get('titulo') as string,
    area: formData.get('area') as string,
    descricao: formData.get('descricao') as string,
    requisitos: formData.get('requisitos') as string,
    beneficios: formData.get('beneficios') as string,
    regime: formData.get('regime') as string,
    modalidade: formData.get('modalidade') as string,
    cidade: formData.get('cidade') as string,
    estado: formData.get('estado') as string,
    quantidade_vagas: parseInt(formData.get('quantidade_vagas') as string) || 1,
    salario_min: formData.get('salario_min') ? parseFloat(formData.get('salario_min') as string) : null,
    salario_max: formData.get('salario_max') ? parseFloat(formData.get('salario_max') as string) : null,
    exibir_salario: formData.get('exibir_salario') === 'on',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/admin/vagas')
  return { success: true }
}
