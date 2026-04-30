import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { MapPin, Briefcase, Clock, Building, Calendar, DollarSign } from 'lucide-react'
import { BotaoCandidatar } from '@/components/vagas/BotaoCandidatar'

export const dynamic = 'force-dynamic'

export default async function VagaDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Buscar vaga
  const { data: vaga, error } = await supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas(nome, logo_url, site, cidade, estado, setor)
    `)
    .eq('id', id)
    .single()

  if (error || !vaga || vaga.status !== 'ativa') {
    notFound()
  }

  // Garantir que empresa seja um objeto, não um array
  if (Array.isArray(vaga.empresa)) {
    vaga.empresa = vaga.empresa[0]
  }

  // Verificar se o usuário está logado e se já se candidatou
  const { data: { user } } = await supabase.auth.getUser()
  let isLogado = !!user
  let jaCandidatou = false

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    
    if (profile?.role === 'candidato') {
      const { data: candidato } = await supabase.from('candidatos').select('id').eq('user_id', user.id).single()
      
      if (candidato) {
        const { data: candidatura } = await supabase
          .from('candidaturas')
          .select('id')
          .eq('candidato_id', candidato.id)
          .eq('vaga_id', id)
          .maybeSingle()
          
        if (candidatura) {
          jaCandidatou = true
        }
      }
    }
  }

  const formatCurrency = (value?: number) => {
    if (!value) return ''
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
  }

  const dataPublicacao = new Date(vaga.created_at).toLocaleDateString('pt-BR')

  return (
    <div className="bg-muted min-h-[calc(100vh-140px)] py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden mb-8">
          {/* Cabecalho da Vaga */}
          <div className="p-8 border-b border-border flex flex-col md:flex-row items-start gap-6">
            <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border">
              {vaga.empresa.logo_url ? (
                <img src={vaga.empresa.logo_url} alt={`Logo ${vaga.empresa.nome}`} className="w-full h-full object-cover" />
              ) : (
                <Building className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-primary mb-2">{vaga.titulo}</h1>
              <p className="text-xl font-medium text-muted-foreground mb-6">{vaga.empresa.nome}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-primary">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span>{vaga.cidade} - {vaga.estado}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-muted-foreground" />
                  <span>{vaga.modalidade}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <span>{vaga.regime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <span>{dataPublicacao}</span>
                </div>
              </div>

              {vaga.exibir_salario && (
                <div className="mt-6 items-center gap-2 bg-green-50 text-green-700 py-2 px-4 rounded-md inline-flex font-medium">
                  <DollarSign className="w-5 h-5" />
                  <span>
                    {formatCurrency(vaga.salario_min)} 
                    {vaga.salario_max && ` a ${formatCurrency(vaga.salario_max)}`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Corpo da Vaga */}
          <div className="p-8 grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-xl font-bold text-primary mb-4">Descrição da Vaga</h2>
                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {vaga.descricao}
                </div>
              </section>

              {vaga.requisitos && (
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4">Requisitos</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {vaga.requisitos}
                  </div>
                </section>
              )}

              {vaga.beneficios && (
                <section>
                  <h2 className="text-xl font-bold text-primary mb-4">Benefícios</h2>
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {vaga.beneficios}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar da Vaga */}
            <div className="space-y-6">
              <div className="bg-muted p-6 rounded-xl border border-border">
                <h3 className="font-bold text-primary mb-4">Sobre a empresa</h3>
                <p className="font-medium text-primary mb-2">{vaga.empresa.nome}</p>
                {vaga.empresa.setor && (
                  <p className="text-sm text-muted-foreground mb-1">Setor: {vaga.empresa.setor}</p>
                )}
                {vaga.empresa.site && (
                  <a href={vaga.empresa.site} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline block mt-4">
                    Visitar website
                  </a>
                )}
              </div>

              <BotaoCandidatar 
                vagaId={vaga.id} 
                jaCandidatou={jaCandidatou} 
                isLogado={isLogado} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
