import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import VagaEditarClient from './VagaEditarClient'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function AdminVagaEditarPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Safe: two separate .eq() queries instead of string-interpolated .or()
  const { data: bySlug } = await supabase
    .from('vagas')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  const { data: byId } = !bySlug
    ? await supabase.from('vagas').select('*').eq('id', slug).maybeSingle()
    : { data: null }

  const vaga = bySlug ?? byId
  if (!vaga) notFound()

  const { data: empresas } = await supabase
    .from('empresas')
    .select('id, nome')
    .order('nome')

  return <VagaEditarClient vaga={vaga} empresas={empresas || []} />
}
