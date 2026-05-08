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
        email: parsed.data.email || null,
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

    // Usamos .partial() para validar apenas os campos enviados (WhatsApp ou Landing Page)
    const parsed = ConfigSiteSchema.partial().safeParse(data)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const supabase = await createClient()
    
    const updates = Object.entries(parsed.data).map(([chave, valor]) => ({
      chave,
      valor: typeof valor === 'string' ? valor : JSON.stringify(valor)
    }))

    // Limpar telefone se necessário
    const whatsappIdx = updates.findIndex(u => u.chave === 'whatsapp_numero')
    if (whatsappIdx !== -1 && updates[whatsappIdx].valor) {
      updates[whatsappIdx].valor = (updates[whatsappIdx].valor as string).replace(/\D/g, '')
    }

    for (const update of updates) {
      const { error } = await supabase
        .from('configuracoes_site')
        .upsert(update, { onConflict: 'chave' })
      
      if (error) throw error
    }

    revalidatePath('/admin/configuracoes')
    revalidatePath('/') // Revalidar a home também
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
  // Buscamos sem cache para garantir que as alterações no admin apareçam na hora
  const { data } = await supabase
    .from('configuracoes_site')
    .select('chave, valor')
  
  const configs: Record<string, string> = {}
  data?.forEach(c => {
    configs[c.chave] = c.valor
  })
  
  return configs
}
