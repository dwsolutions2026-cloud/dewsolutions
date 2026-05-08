import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EmpresaEditarClient from './EmpresaEditarClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminEmpresaEditarPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Busca segura primeiro por slug, se falhar, busca por ID (UUID)
  const { data: bySlug } = await supabase.from('empresas').select('*').eq('slug', slug).maybeSingle()
  const { data: byId } = !bySlug ? await supabase.from('empresas').select('*').eq('id', slug).maybeSingle() : { data: null }
  
  const empresa = bySlug ?? byId

  if (!empresa) notFound()

  return <EmpresaEditarClient empresa={empresa} />
}
