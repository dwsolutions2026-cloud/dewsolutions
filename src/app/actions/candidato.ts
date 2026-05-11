'use server'

import 'server-only'
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
  try {
    const candidato_id = await getCandidatoId()
    if (!candidato_id) return { error: 'Não autenticado' }

    const parsed = PerfilSchema.safeParse({
      nome: formData.get('nome'),
      telefone: formData.get('telefone') || undefined,
      cidade: formData.get('cidade') || undefined,
      estado: formData.get('estado') || undefined,
      avatar_url: formData.get('avatar_url') || undefined,
    })

    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const admin = getAdminClient()
    const { error } = await admin
      .from('candidatos')
      .update(parsed.data)
      .eq('id', candidato_id)

    if (error) return { error: error.message }
    revalidatePath('/candidato/minha-area')
    revalidatePath('/candidato/perfil')
    return { success: true }
  } catch (error: any) {
    console.error('Error in updatePerfilAction:', error)
    return { error: 'Erro interno ao atualizar perfil.' }
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Não autenticado' }

    const file = formData.get('avatar') as File
    if (!file || file.size === 0) return { error: 'Nenhum arquivo enviado' }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return { error: 'O arquivo deve ser uma imagem.' }
    }

    // Validar tamanho (máximo 2MB para avatars)
    if (file.size > 2 * 1024 * 1024) {
      return { error: 'A imagem deve ter no máximo 2MB.' }
    }

    const admin = getAdminClient()
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await admin.storage
      .from('avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type,
      })

    if (uploadError) {
      console.error('Avatar Upload Error:', uploadError)
      return { error: `Erro ao enviar foto: ${uploadError.message}` }
    }

    // Obter URL pública
    const { data: { publicUrl } } = admin.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Atualizar o candidato com a nova URL
    const { error: updateError } = await admin
      .from('candidatos')
      .update({ avatar_url: publicUrl })
      .eq('user_id', user.id)

    if (updateError) return { error: updateError.message }

    revalidatePath('/candidato/perfil')
    return { success: true, url: publicUrl }
  } catch (error: any) {
    console.error('Error in uploadAvatarAction:', error)
    return { error: 'Erro interno ao processar upload.' }
  }
}

export async function updateCurriculoJsonAction(data: any) {
  try {
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
  } catch (error: any) {
    console.error('Error in updateCurriculoJsonAction:', error)
    return { error: 'Erro interno ao salvar currículo.' }
  }
}
