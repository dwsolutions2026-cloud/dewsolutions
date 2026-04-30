'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { OportunidadeLeadSchema, ConfigSiteSchema } from '@/lib/schemas'
import { checkAdmin } from '@/app/actions/admin'

export async function createOportunidadeLeadAction(formData: any) {
  try {
    const parsed = OportunidadeLeadSchema.safeParse(formData)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('oportunidade_leads')
      .insert({
        ...parsed.data,
        telefone: parsed.data.telefone.replace(/\D/g, '')
      })

    if (error) throw error

    revalidatePath('/admin/oportunidades')
    return { success: true }
  } catch (error: any) {
    console.error('Error creating oportunidade lead:', error)
    return { error: 'Erro ao salvar seus dados. Tente novamente.' }
  }
}

export async function updateConfiguracoesAction(data: any) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    const parsed = ConfigSiteSchema.safeParse(data)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    
    const updates = [
      { chave: 'whatsapp_numero', valor: parsed.data.whatsapp_numero.replace(/\D/g, '') },
      { chave: 'whatsapp_mensagem', valor: parsed.data.whatsapp_mensagem },
      { chave: 'prazo_retorno_texto', valor: parsed.data.prazo_retorno_texto },
      { chave: 'admin_email_notificacao', valor: parsed.data.admin_email_notificacao },
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from('configuracoes_site')
        .upsert(update, { onConflict: 'chave' })
      
      if (error) throw error
    }

    revalidatePath('/admin/configuracoes')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating configurations:', error)
    return { error: 'Erro ao salvar configurações.' }
  }
}

export async function updateLeadStatusAction(id: string, status: string) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    const supabase = await createClient()
    const { error } = await supabase
      .from('oportunidade_leads')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/oportunidades')
    return { success: true }
  } catch (error: any) {
    console.error('Error updating lead status:', error)
    return { error: 'Erro ao atualizar status.' }
  }
}

export async function deleteLeadAction(id: string) {
  try {
    const isAdmin = await checkAdmin()
    if (!isAdmin) return { error: 'Acesso negado' }

    const supabase = await createClient()
    const { error } = await supabase
      .from('oportunidade_leads')
      .delete()
      .eq('id', id)

    if (error) throw error

    revalidatePath('/admin/oportunidades')
    return { success: true }
  } catch (error: any) {
    console.error('Error deleting lead:', error)
    return { error: 'Erro ao excluir lead.' }
  }
}

export async function getConfiguracoes() {
  const supabase = await createClient()
  const { data } = await supabase.from('configuracoes_site').select('chave, valor')
  
  const configs: Record<string, string> = {}
  data?.forEach(c => {
    configs[c.chave] = c.valor
  })
  
  return configs
}
