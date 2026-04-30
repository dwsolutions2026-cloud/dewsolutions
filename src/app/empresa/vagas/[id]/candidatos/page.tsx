import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Mail, Phone, MapPin, Users } from 'lucide-react'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function CandidatosDaVagaPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Ensure empresa owns this vaga
  const { data: vaga } = await supabase
    .from('vagas')
    .select('id, titulo, empresa_id')
    .eq('id', id)
    .single()

  if (!vaga) notFound()

  const { data: empresa } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!empresa || empresa.id !== vaga.empresa_id) {
    return <div className="p-8 text-red-500">Acesso negado. Esta vaga não pertence a você.</div>
  }

  // Fetch candidates
  const { data: candidaturas, error } = await supabase
    .from('candidaturas')
    .select(`
      id,
      created_at,
      candidato:candidatos (
        id,
        nome,
        email,
        telefone,
        cidade,
        estado,
        curriculo_url
      )
    `)
    .eq('vaga_id', id)
    .order('created_at', { ascending: false })

  // Function to generate signed url for each curriculum
  // In a real app we might fetch it on demand via an API route to save resources if there are many candidates, 
  // but for simplicity we can pre-generate them here if the list isn't huge.
  
  const getSignedUrl = async (path: string) => {
    if (!path) return null
    const { data } = await supabase.storage.from('curriculos').createSignedUrl(path, 3600) // 1 hour
    return data?.signedUrl
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/empresa/vagas" className="p-2 bg-white border border-border rounded-lg text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-primary">Candidatos</h1>
          <p className="text-muted-foreground text-sm mt-1">Vaga: <span className="font-semibold text-primary">{vaga.titulo}</span></p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {error ? (
          <div className="p-8 text-center text-red-500">Erro ao carregar candidatos.</div>
        ) : candidaturas && candidaturas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted border-b border-border text-sm text-muted-foreground">
                  <th className="p-4 font-medium">Candidato</th>
                  <th className="p-4 font-medium">Contato</th>
                  <th className="p-4 font-medium">Localização</th>
                  <th className="p-4 font-medium">Data</th>
                  <th className="p-4 font-medium text-right">Currículo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {await Promise.all(candidaturas.map(async (cand: any) => {
                  const c = Array.isArray(cand.candidato) ? cand.candidato[0] : cand.candidato
                  const signedUrl = await getSignedUrl(c.curriculo_url)

                  return (
                    <tr key={cand.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-primary">{c.nome}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1 text-sm">
                          <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 text-accent hover:underline">
                            <Mail className="w-3.5 h-3.5" /> {c.email}
                          </a>
                          {c.telefone && (
                            <a href={`https://wa.me/55${c.telefone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-muted-foreground hover:text-primary">
                              <Phone className="w-3.5 h-3.5" /> {c.telefone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {c.cidade} - {c.estado}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-4 text-right">
                        {signedUrl ? (
                          <a 
                            href={signedUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                          >
                            <FileText className="w-4 h-4" />
                            PDF
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Não disponível</span>
                        )}
                      </td>
                    </tr>
                  )
                }))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-primary mb-2">Nenhum candidato ainda</h3>
            <p>Ninguém se candidatou a esta vaga até o momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
