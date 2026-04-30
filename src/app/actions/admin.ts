'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

// Use service role to have admin privileges (delete users)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function deleteCandidatoAction(candidatoId: string, userId: string, curriculoUrl: string | null) {
  try {
    // 1. Delete curriculum from storage if exists
    if (curriculoUrl) {
      await supabaseAdmin.storage.from('curriculos').remove([curriculoUrl])
    }

    // 2. Delete the candidate record (cascade will handle candidaturas if configured, 
    // but better to be safe if not)
    // Actually, in Supabase, we should delete the user from AUTH, which should cascade 
    // to public.profiles and then public.candidatos if ON DELETE CASCADE is set.
    
    // Let's delete the auth user directly
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    
    if (authError) {
      console.error('Error deleting auth user:', authError)
      return { error: 'Erro ao remover acesso do usuário: ' + authError.message }
    }

    // Revalidate the page
    revalidatePath('/admin/talentos')
    revalidatePath('/admin/candidatos')
    
    return { success: true }
  } catch (error: any) {
    console.error('Error in deleteCandidatoAction:', error)
    return { error: 'Erro interno ao excluir candidato.' }
  }
}
