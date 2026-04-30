'use server'

import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

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

export async function addExperienciaAction(formData: FormData) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  const { error } = await admin.from('experiencias').insert({
    candidato_id,
    empresa: formData.get('empresa') as string,
    cargo: formData.get('cargo') as string,
    inicio: formData.get('inicio') as string,
    fim: formData.get('fim') as string || null,
    atual: formData.get('atual') === 'on',
    descricao: formData.get('descricao') as string,
  })

  if (error) return { error: error.message }
  revalidatePath('/candidato/perfil')
  return { success: true }
}

export async function deleteExperienciaAction(id: string) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  await admin.from('experiencias').delete().eq('id', id).eq('candidato_id', candidato_id)
  revalidatePath('/candidato/perfil')
  return { success: true }
}

export async function addFormacaoAction(formData: FormData) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  const { error } = await admin.from('formacoes').insert({
    candidato_id,
    instituicao: formData.get('instituicao') as string,
    curso: formData.get('curso') as string,
    nivel: formData.get('nivel') as string,
    conclusao: formData.get('conclusao') as string || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/candidato/perfil')
  return { success: true }
}

export async function deleteFormacaoAction(id: string) {
  const candidato_id = await getCandidatoId()
  if (!candidato_id) return { error: 'Não autenticado' }

  const admin = getAdminClient()
  await admin.from('formacoes').delete().eq('id', id).eq('candidato_id', candidato_id)
  revalidatePath('/candidato/perfil')
  return { success: true }
}
