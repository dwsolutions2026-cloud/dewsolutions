'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { sendCandidaturaConfirmacao, sendConvocacaoEntrevista } from '@/lib/resend'

const getAdmin = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function candidatarAction(vagaId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  // Buscar candidato
  const { data: candidato } = await supabase
    .from('candidatos')
    .select('id, nome, email')
    .eq('user_id', user.id)
    .single()

  if (!candidato) return { error: 'Perfil de candidato não encontrado' }

  // Verificar se já candidatou
  const { data: existing } = await supabase
    .from('candidaturas')
    .select('id')
    .eq('candidato_id', candidato.id)
    .eq('vaga_id', vagaId)
    .single()

  if (existing) return { error: 'Você já se candidatou a esta vaga' }

  // Buscar dados da vaga e empresa
  const { data: vaga } = await supabase
    .from('vagas')
    .select('titulo, empresa:empresas(nome)')
    .eq('id', vagaId)
    .single()

  const admin = getAdmin()
  const { error } = await admin.from('candidaturas').insert({
    candidato_id: candidato.id,
    vaga_id: vagaId,
    status: 'inscrito',
  })

  if (error) return { error: error.message }

  // Enviar e-mail de confirmação (não bloqueia o fluxo se falhar)
  const nomeEmpresa = (vaga?.empresa as any)?.nome || 'Empresa Parceira'
  sendCandidaturaConfirmacao(
    candidato.email,
    candidato.nome,
    vaga?.titulo || 'Vaga',
    nomeEmpresa
  ).catch(console.error)

  revalidatePath('/vagas')
  revalidatePath('/candidato/candidaturas')
  return { success: true }
}

import { ConvocacaoSchema } from '@/lib/schemas'

export async function convocarEntrevistaAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'empresa')) {
    return { error: 'Acesso negado: apenas empresas e administradores podem convocar candidatos' }
  }

  // 1. Zod Validation
  const parsed = ConvocacaoSchema.safeParse({
    candidatura_id: formData.get('candidatura_id'),
    data_entrevista: formData.get('data_entrevista'),
    local_entrevista: formData.get('local_entrevista'),
    observacao: formData.get('observacao') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const { candidatura_id, data_entrevista, local_entrevista, observacao } = parsed.data
  const admin = getAdmin()

  // Buscar candidatura + dados completos
  const { data: candidatura, error: fetchError } = await admin
    .from('candidaturas')
    .select(`
      id,
      candidato:candidatos (nome, email),
      vaga:vagas (titulo, empresa_id, empresa:empresas (nome))
    `)
    .eq('id', candidatura_id)
    .single()

  if (fetchError || !candidatura) return { error: 'Candidatura não encontrada' }

  // Se for empresa, garantir que a vaga pertence a ela
  if (profile.role === 'empresa') {
    const { data: empresa } = await supabase.from('empresas').select('id').eq('user_id', user.id).single()
    const vaga = candidatura.vaga as any
    if (!empresa || vaga.empresa_id !== empresa.id) {
      return { error: 'Acesso negado: esta vaga não pertence à sua empresa' }
    }
  }

  // Atualizar status para entrevista
  const { error: updateError } = await admin
    .from('candidaturas')
    .update({
      status: 'entrevista',
      data_entrevista: data_entrevista,
      local_entrevista: local_entrevista,
      observacao: observacao || null,
    })
    .eq('id', candidatura_id)

  if (updateError) return { error: updateError.message }

  // Formatar data para o e-mail
  const dataFormatada = new Date(data_entrevista).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })

  const cand = candidatura.candidato as any
  const vagaRef = candidatura.vaga as any
  const empresaRef = vagaRef?.empresa as any

  // Enviar e-mail de convocação
  sendConvocacaoEntrevista(
    cand.email,
    cand.nome,
    vagaRef?.titulo || 'Vaga',
    empresaRef?.nome || 'Empresa Parceira',
    dataFormatada,
    local_entrevista,
    observacao || undefined
  ).catch(console.error)

  revalidatePath('/admin/candidatos')
  revalidatePath('/empresa/candidatos')
  return { success: true }
}

export async function atualizarStatusCandidaturaAction(
  candidaturaId: string,
  status: 'inscrito' | 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || (profile.role !== 'admin' && profile.role !== 'empresa')) {
    return { error: 'Acesso negado: apenas empresas e administradores podem atualizar status' }
  }

  const admin = getAdmin()
  
  // Se for empresa, precisa validar a posse da vaga (mesma lógica acima, omitindo por brevidade ou fazer query com RLS normal)
  // Como usamos o admin client, temos que validar.
  if (profile.role === 'empresa') {
    const { data: candidatura } = await admin.from('candidaturas').select('vaga:vagas(empresa_id)').eq('id', candidaturaId).single()
    const { data: empresa } = await supabase.from('empresas').select('id').eq('user_id', user.id).single()
    const vaga = candidatura?.vaga as any
    if (!empresa || !vaga || vaga.empresa_id !== empresa.id) {
      return { error: 'Acesso negado' }
    }
  }

  const { error } = await admin
    .from('candidaturas')
    .update({ status })
    .eq('id', candidaturaId)

  if (error) return { error: error.message }
  revalidatePath('/admin/candidatos')
  revalidatePath('/empresa/candidatos')
  return { success: true }
}
