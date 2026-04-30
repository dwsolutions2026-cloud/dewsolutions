'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { PerfilSchema, CurriculoJsonSchema } from '@/lib/schemas'

const getAdminClient = () =>
  createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

async function getCandidatoId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('candidatos').select('id').eq('user_id', user.id).single()
  return data?.id || null
}

export async function updatePerfilAction(formData: FormData) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const parsed = PerfilSchema.safeParse({
    nome: formData.get('nome'),
    telefone: formData.get('telefone') || undefined,
    cidade: formData.get('cidade') || undefined,
    estado: formData.get('estado') || undefined,
  })

  if (!parsed.success) {
    return { error: parsed.error.errors[0].message }
  }

  const admin = getAdminClient()
  const { error } = await admin
    .from('candidatos')
    .update(parsed.data)
    .eq('id', candidato_id)

  if (error) return { error: error.message }
  revalidatePath('/candidato/minha-area')
  revalidatePath('/candidato/perfil/editar')
  return { success: true }
}

export async function updateCurriculoJsonAction(data: any) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const parsed = CurriculoJsonSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Dados do currículo inválidos' }
  }

  const admin = getAdminClient()
  
  // Atualiza o JSON e limpa o URL do PDF se ele optou pelo construtor (opcional, mas recomendado)
  const { error } = await admin
    .from('candidatos')
    .update({ 
      curriculo_json: parsed.data,
      // curriculo_url: null // Comentado para permitir que coexistam, como pedido
    })
    .eq('id', candidato_id)

  if (error) return { error: error.message }
  revalidatePath('/candidato/minha-area')
  revalidatePath('/candidato/curriculo/editar')
  return { success: true }
}
