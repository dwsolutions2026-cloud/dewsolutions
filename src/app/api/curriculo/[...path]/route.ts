import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'

const getAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function GET(
  _req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  // Verificar se usuário está autenticado (admin ou empresa)
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const filePath = params.path.join('/')

  const admin = getAdmin()
  const { data, error } = await admin.storage
    .from('curriculos')
    .createSignedUrl(filePath, 3600) // válido por 1 hora

  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 })
  }

  // Redirecionar para a URL assinada
  return NextResponse.redirect(data.signedUrl)
}
