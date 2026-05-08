import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/utils/supabase/server'
import { isUuidPdfPath } from '@/lib/security'

const getAdmin = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  // Verificar se usuário está autenticado
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const filePath = path.join('/')
  if (!isUuidPdfPath(filePath)) {
    return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = profile?.role
  const fileUserId = filePath.replace(/\.pdf$/i, '')
  let isAuthorized = role === 'admin'

  // O próprio candidato pode ver seu currículo
  if (!isAuthorized && role === 'candidato') {
    isAuthorized = fileUserId === user.id
  }

  // Uma empresa só pode ver se o candidato aplicou para uma vaga dela
  if (!isAuthorized && role === 'empresa') {
    // 1. Pegar o ID da empresa vinculada ao usuário logado
    const { data: empresa } = await supabase
      .from('empresas')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (empresa) {
      // 2. Pegar o ID do candidato dono do arquivo
      const { data: candidato } = await supabase
        .from('candidatos')
        .select('id')
        .eq('user_id', fileUserId)
        .maybeSingle()

      if (candidato) {
        // 3. Verificar se existe candidatura para este candidato em alguma vaga desta empresa
        const { data: hasApplication } = await supabase
          .from('candidaturas')
          .select('id, vagas!inner(empresa_id)')
          .eq('candidato_id', candidato.id)
          .eq('vagas.empresa_id', empresa.id)
          .limit(1)
          .maybeSingle()
        
        isAuthorized = !!hasApplication
      }
    }
  }

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
  }

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
