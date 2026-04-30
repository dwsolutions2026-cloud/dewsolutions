import { createClient } from '@/utils/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  User, Mail, Phone, MapPin, FileText, Download, 
  Briefcase, GraduationCap, CheckCircle, ArrowLeft,
  Calendar, Building, BadgeCheck
} from 'lucide-react'

export const metadata = {
  title: 'Detalhes do Candidato | Admin D&W',
}

export default async function AdminCandidatoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // Auth check
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/')

  // Fetch candidate data
  const { data: candidato, error } = await supabase
    .from('candidatos')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !candidato) notFound()

  // Fetch applications
  const { data: candidaturas } = await supabase
    .from('candidaturas')
    .select(`
      id,
      status,
      created_at,
      vaga:vagas(titulo, empresa:empresas(nome))
    `)
    .eq('candidato_id', candidato.id)
    .order('created_at', { ascending: false })

  // Generate signed URL for PDF if it exists
  let signedUrl = null
  if (candidato.curriculo_url) {
    const { data } = await supabase.storage
      .from('curriculos')
      .createSignedUrl(candidato.curriculo_url, 3600) // 1 hour
    signedUrl = data?.signedUrl
  }

  const jsonResume = candidato.curriculo_json as any

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/talentos" 
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Perfil do Candidato</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="flex flex-col items-center text-center pb-6 border-b border-border mb-6">
              <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-4xl mb-4">
                {candidato.nome.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-primary">{candidato.nome}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mt-2">
                ID: {candidato.id.slice(0, 8)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{candidato.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">{candidato.telefone || 'Não informado'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  {candidato.cidade ? `${candidato.cidade} - ${candidato.estado}` : 'Localização não informada'}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground">
                  Cadastrado em: {new Date(candidato.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            {signedUrl && (
              <div className="mt-8">
                <a 
                  href={signedUrl} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-all"
                >
                  <Download className="w-5 h-5" /> Baixar PDF Original
                </a>
              </div>
            )}
          </div>

          {/* Candidaturas Card */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-accent" /> Histórico de Candidaturas
            </h3>
            {candidaturas && candidaturas.length > 0 ? (
              <div className="space-y-4">
                {candidaturas.map((cand: any) => {
                  const statusMap: any = {
                    inscrito: 'bg-blue-100 text-blue-700',
                    em_analise: 'bg-amber-100 text-amber-700',
                    entrevista: 'bg-purple-100 text-purple-700',
                    aprovado: 'bg-green-100 text-green-700',
                    reprovado: 'bg-red-100 text-red-700'
                  }
                  return (
                    <div key={cand.id} className="p-3 bg-muted/30 rounded-lg border border-border/50">
                      <p className="font-bold text-sm text-primary leading-tight">{cand.vaga?.titulo}</p>
                      <p className="text-xs text-muted-foreground mb-2">{cand.vaga?.empresa?.nome}</p>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${statusMap[cand.status] || 'bg-gray-100'}`}>
                          {cand.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(cand.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4 italic">Sem candidaturas registradas.</p>
            )}
          </div>
        </div>

        {/* Resume Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {!jsonResume ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-primary mb-2">Sem Currículo Digital</h3>
              <p className="text-muted-foreground">
                O candidato ainda não preencheu o currículo no sistema. 
                {signedUrl ? ' Verifique o anexo em PDF disponível na lateral.' : ' Não há currículo disponível no momento.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Objective */}
              {jsonResume.objetivo && (
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-3 flex items-center gap-2 border-b border-border pb-2">
                    <FileText className="w-5 h-5 text-accent" /> Objetivo Profissional
                  </h3>
                  <p className="text-foreground leading-relaxed italic">"{jsonResume.objetivo}"</p>
                </section>
              )}

              {/* Experiences */}
              <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 border-b border-border pb-2">
                  <Briefcase className="w-5 h-5 text-accent" /> Experiência Profissional
                </h3>
                <div className="space-y-8">
                  {jsonResume.experiencias?.length > 0 ? (
                    jsonResume.experiencias.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-0.5 before:bg-accent/30">
                        <div className="absolute left-[-4px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent" />
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                          <div>
                            <h4 className="font-bold text-primary text-lg leading-tight">{exp.cargo}</h4>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building className="w-3.5 h-3.5" />
                              <span className="text-sm font-medium">{exp.empresa}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold bg-muted px-3 py-1 rounded-full text-muted-foreground shrink-0 mt-2 md:mt-0">
                            {exp.periodo}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{exp.descricao}</p>
                      </div>
                    ))
                  ) : <p className="text-sm italic text-muted-foreground">Nenhuma experiência registrada.</p>}
                </div>
              </section>

              {/* Education */}
              <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 border-b border-border pb-2">
                  <GraduationCap className="w-5 h-5 text-accent" /> Formação Acadêmica
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jsonResume.formacoes?.length > 0 ? (
                    jsonResume.formacoes.map((form: any, i: number) => (
                      <div key={i} className="p-4 bg-muted/20 rounded-lg border border-border">
                        <h4 className="font-bold text-primary leading-tight">{form.curso}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{form.instituicao}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-2 py-0.5 rounded">
                            {form.status}
                          </span>
                          <span className="text-[10px] text-muted-foreground italic">{form.periodo}</span>
                        </div>
                      </div>
                    ))
                  ) : <p className="text-sm italic text-muted-foreground">Nenhuma formação registrada.</p>}
                </div>
              </section>

              {/* Skills & Languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
                    <BadgeCheck className="w-5 h-5 text-accent" /> Habilidades
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {jsonResume.habilidades?.split(',').map((skill: string, i: number) => (
                      <span key={i} className="bg-muted px-3 py-1 rounded-md text-xs font-medium text-primary border border-border">
                        {skill.trim()}
                      </span>
                    )) || <p className="text-sm italic text-muted-foreground">Nenhuma habilidade listada.</p>}
                  </div>
                </section>

                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-border pb-2">
                    <Languages className="w-5 h-5 text-accent" /> Idiomas
                  </h3>
                  <div className="space-y-2">
                    {jsonResume.idiomas?.length > 0 ? (
                      jsonResume.idiomas.map((lang: any, i: number) => (
                        <div key={i} className="flex justify-between items-center text-sm">
                          <span className="font-bold text-primary">{lang.idioma}</span>
                          <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded font-bold uppercase">
                            {lang.nivel}
                          </span>
                        </div>
                      ))
                    ) : <p className="text-sm italic text-muted-foreground">Nenhum idioma listado.</p>}
                  </div>
                </section>
              </div>

              {/* Links */}
              {(jsonResume.linkedin || jsonResume.github) && (
                <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-muted-foreground mb-4 uppercase tracking-wider">Links Externos</h3>
                  <div className="flex gap-4">
                    {jsonResume.linkedin && (
                      <a href={jsonResume.linkedin} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline font-bold flex items-center gap-1">
                        LinkedIn
                      </a>
                    )}
                    {jsonResume.github && (
                      <a href={jsonResume.github} target="_blank" rel="noreferrer" className="text-sm text-accent hover:underline font-bold flex items-center gap-1">
                        GitHub
                      </a>
                    )}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

function Languages(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 8 6 6" />
      <path d="m4 14 6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="m22 22-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  )
}
