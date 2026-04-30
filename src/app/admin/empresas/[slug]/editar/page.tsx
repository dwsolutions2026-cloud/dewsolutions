import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import EmpresaEditarClient from './EmpresaEditarClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminEmpresaEditarPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: empresa, error } = await supabase
    .from('empresas')
    .select('*')
    .or(`slug.eq."${slug}",id.eq."${slug}"`)
    .single()

  if (error || !empresa) notFound()

  return <EmpresaEditarClient empresa={empresa} />
}
