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

export async function convocarEntrevistaAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Não autenticado' }

  const candidaturaId = formData.get('candidatura_id') as string
  const dataEntrevista = formData.get('data_entrevista') as string
  const localEntrevista = formData.get('local_entrevista') as string
  const observacao = formData.get('observacao') as string

  if (!candidaturaId || !dataEntrevista || !localEntrevista) {
    return { error: 'Preencha todos os campos obrigatórios' }
  }

  const admin = getAdmin()

  // Buscar candidatura + dados completos
  const { data: candidatura, error: fetchError } = await admin
    .from('candidaturas')
    .select(`
      id,
      candidato:candidatos (nome, email),
      vaga:vagas (titulo, empresa:empresas (nome))
    `)
    .eq('id', candidaturaId)
    .single()

  if (fetchError || !candidatura) return { error: 'Candidatura não encontrada' }

  // Atualizar status para entrevista
  const { error: updateError } = await admin
    .from('candidaturas')
    .update({
      status: 'entrevista',
      data_entrevista: dataEntrevista,
      local_entrevista: localEntrevista,
      observacao: observacao || null,
    })
    .eq('id', candidaturaId)

  if (updateError) return { error: updateError.message }

  // Formatar data para o e-mail
  const dataFormatada = new Date(dataEntrevista).toLocaleString('pt-BR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })

  const cand = candidatura.candidato as any
  const vaga = candidatura.vaga as any
  const empresa = vaga?.empresa as any

  // Enviar e-mail de convocação
  sendConvocacaoEntrevista(
    cand.email,
    cand.nome,
    vaga?.titulo || 'Vaga',
    empresa?.nome || 'Empresa Parceira',
    dataFormatada,
    localEntrevista,
    observacao || undefined
  ).catch(console.error)

  revalidatePath('/admin/candidatos')
  return { success: true }
}

export async function atualizarStatusCandidaturaAction(
  candidaturaId: string,
  status: 'inscrito' | 'em_analise' | 'entrevista' | 'aprovado' | 'reprovado'
) {
  const admin = getAdmin()
  const { error } = await admin
    .from('candidaturas')
    .update({ status })
    .eq('id', candidaturaId)

  if (error) return { error: error.message }
  revalidatePath('/admin/candidatos')
  return { success: true }
}
