import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import VagaEditarClient from './VagaEditarClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminVagaEditarPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: vaga, error } = await supabase
    .from('vagas')
    .select('*')
    .or(`slug.eq."${slug}",id.eq."${slug}"`)
    .single()

  if (error || !vaga) notFound()

  const { data: empresas } = await supabase
    .from('empresas')
    .select('id, nome')
    .order('nome')

  return <VagaEditarClient vaga={vaga} empresas={empresas || []} />
}
