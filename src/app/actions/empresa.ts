'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function saveVagaAction(formData: FormData) {
  const supabase = await createClient()

  // Ensure user is authorized
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autorizado' }

  // Fetch empresa securely based on authenticated user instead of trusting client
  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa) return { error: 'Empresa não encontrada para este usuário' }
  const empresaId = empresa.id

  const id = formData.get('id') as string | null

  const titulo = formData.get('titulo') as string
  const descricao = formData.get('descricao') as string
  const requisitos = formData.get('requisitos') as string
  const beneficios = formData.get('beneficios') as string
  const modalidade = formData.get('modalidade') as string
  const regime = formData.get('regime') as string
  const cidade = formData.get('cidade') as string
  const estado = formData.get('estado') as string
  const salario_min = formData.get('salario_min') ? parseFloat(formData.get('salario_min') as string) : null
  const salario_max = formData.get('salario_max') ? parseFloat(formData.get('salario_max') as string) : null
  const exibir_salario = formData.get('exibir_salario') === 'on'
  const status = formData.get('status') as string || 'ativa'

  if (!titulo || !descricao || !modalidade || !regime || !cidade || !estado) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  const payload = {
    empresa_id: empresaId,
    titulo,
    descricao,
    requisitos,
    beneficios,
    modalidade,
    regime,
    cidade,
    estado,
    salario_min,
    salario_max,
    exibir_salario,
    status,
    created_by: user.id
  }

  if (id) {
    // Update
    const { error } = await supabase
      .from('vagas')
      .update(payload)
      .eq('id', id)
      .eq('empresa_id', empresaId)

    if (error) return { error: 'Erro ao atualizar vaga: ' + error.message }
  } else {
    // Insert
    const { error } = await supabase
      .from('vagas')
      .insert(payload)

    if (error) return { error: 'Erro ao criar vaga: ' + error.message }
  }

  revalidatePath('/empresa/vagas')
  revalidatePath('/empresa/dashboard')
  revalidatePath('/vagas')
  
  redirect('/empresa/vagas')
}
