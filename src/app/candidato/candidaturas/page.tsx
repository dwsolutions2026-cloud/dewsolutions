import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Briefcase, MapPin, Building, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function CandidaturasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get Candidato
  const { data: candidato } = await supabase
    .from('candidatos')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!candidato) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-red-50 text-red-500 p-6 rounded-lg text-center">
          Perfil de candidato não encontrado.
        </div>
      </div>
    )
  }

  // Get Candidaturas
  const { data: candidaturas, error } = await supabase
    .from('candidaturas')
    .select(`
      id,
      created_at,
      vagas (
        id,
        titulo,
        cidade,
        estado,
        status,
        empresas (
          nome,
          logo_url
        )
      )
    `)
    .eq('candidato_id', candidato.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary">Minhas Candidaturas</h1>
        <p className="text-muted-foreground text-sm">Acompanhe o status das suas inscrições em tempo real.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
          Erro ao carregar candidaturas.
        </div>
      )}

      {!error && (!candidaturas || candidaturas.length === 0) && (
        <div className="bg-white p-12 rounded-2xl border border-border text-center shadow-sm">
          <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-primary mb-2">Você ainda não se candidatou</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Explore as vagas disponíveis e encontre a oportunidade ideal para sua carreira.</p>
          <Link 
            href="/vagas"
            className="bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent/90 transition-all inline-block shadow-lg shadow-accent/20"
          >
            Buscar Vagas
          </Link>
        </div>
      )}

      {!error && candidaturas && candidaturas.length > 0 && (
        <div className="grid gap-4">
          {candidaturas.map((cand: any) => {
            const vaga = cand.vagas
            const empresa = vaga.empresas
            const dataCandidatura = new Date(cand.created_at).toLocaleDateString('pt-BR')

            return (
              <div key={cand.id} className="bg-white p-6 rounded-2xl border border-border flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border group-hover:border-accent/30 transition-colors">
                    {empresa.logo_url ? (
                      <img src={empresa.logo_url} alt={`Logo ${empresa.nome}`} className="w-full h-full object-cover" />
                    ) : (
                      <Building className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-1">
                      <Link href={`/vagas/${vaga.id}`} className="hover:text-accent transition-colors">
                        {vaga.titulo}
                      </Link>
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">{empresa.nome}</p>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{vaga.cidade} - {vaga.estado}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Inscrito em {dataCandidatura}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 border-t md:border-t-0 pt-4 md:pt-0">
                  <span className={`px-4 py-1.5 text-[10px] uppercase tracking-widest font-black rounded-full ${
                    vaga.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {vaga.status === 'ativa' ? 'Vaga Ativa' : 'Encerrada'}
                  </span>
                  
                  <Link 
                    href={`/vagas/${vaga.id}`}
                    className="bg-muted text-foreground px-4 py-2 rounded-lg text-xs font-bold hover:bg-border transition-colors whitespace-nowrap"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
