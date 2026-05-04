import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { 
  MapPin, Briefcase, Building2, Calendar, 
  DollarSign, CheckCircle2, ArrowLeft, Share2 
} from 'lucide-react'
import Link from 'next/link'
import { BotaoCandidatar } from '@/components/vagas/BotaoCandidatar'

import { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  
  const { data: vaga } = await supabase
    .from('vagas')
    .select('titulo, empresa:empresas(nome)')
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (!vaga) return { title: 'Vaga não encontrada | DW Solutions' }

  return {
    title: `${vaga.titulo} na ${(vaga.empresa as any)?.nome} | DW Solutions`,
    description: `Candidate-se para a vaga de ${vaga.titulo}. Encontre as melhores oportunidades na DW Solutions.`,
  }
}

export default async function VagaDetalhesPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Buscar por slug OU por id (para manter compatibilidade)
  // Removido as aspas duplas que podiam quebrar a query em alguns casos
  const { data: vaga, error } = await supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas (*)
    `)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single()

  if (error || !vaga) notFound()

  // Verificar se o usuário já se candidatou
  const { data: { user } } = await supabase.auth.getUser()
  let jaCandidatou = false

  if (user) {
    const { data: candidatura } = await supabase
      .from('candidaturas')
      .select('id')
      .eq('vaga_id', vaga.id)
      .eq('user_id', user.id)
      .single()
    
    jaCandidatou = !!candidatura
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* Header / Nav */}
      <div className="flex items-center justify-between">
        <Link 
          href="/vagas" 
          className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-[10px] sm:text-xs"
        >
          <ArrowLeft className="w-3 sm:w-3.5 h-3 sm:h-3.5" /> Voltar
        </Link>
        <button className="p-2 text-muted-foreground hover:text-accent rounded-full hover:bg-accent/5 transition-all" aria-label="Compartilhar">
          <Share2 className="w-4 sm:w-4.5 h-4 sm:h-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
        {/* Coluna Principal: Detalhes */}
        <div className="lg:col-span-2 space-y-8 sm:space-y-10">
          
          {/* Título e Info Básica */}
          <div className="space-y-4 sm:space-y-5">
            <div className="inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full bg-accent/10 text-accent text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-accent/10">
              {vaga.area}
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-primary leading-[1.1] tracking-tight">
              {vaga.titulo}
            </h1>
            
            <div className="flex flex-wrap gap-3 sm:gap-5 text-[9px] sm:text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <Building2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                <span className="line-clamp-1">{(vaga.empresa as any)?.nome}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                {vaga.cidade} - {vaga.estado}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <Briefcase className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                {vaga.modalidade}
              </div>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Conteúdo */}
          <div className="space-y-8 sm:space-y-10">
            <section className="space-y-3 sm:space-y-4">
              <h2 className="text-lg sm:text-xl font-black text-primary uppercase tracking-tight">Descrição da Vaga</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-medium">
                {vaga.descricao}
              </p>
            </section>

            {vaga.requisitos && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-black text-primary uppercase tracking-tight">Requisitos</h2>
                <div className="bg-card p-4 sm:p-6 rounded-lg sm:rounded-2xl border border-border space-y-2.5 sm:space-y-3">
                  {vaga.requisitos.split('\n').map((req: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-2.5">
                      <CheckCircle2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-muted-foreground font-medium">{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {vaga.beneficios && (
              <section className="space-y-3 sm:space-y-4">
                <h2 className="text-lg sm:text-xl font-black text-primary uppercase tracking-tight">Benefícios</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap">
                  {vaga.beneficios}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Coluna Lateral: CTA e Empresa */}
        <div className="space-y-4 sm:space-y-6">
          {/* Card Candidatura */}
          <div className="bg-card p-4 sm:p-6 rounded-xl sm:rounded-4xl border border-border shadow-xl shadow-primary/5 lg:sticky lg:top-24 space-y-4 sm:space-y-6">
            {vaga.exibir_salario && vaga.salario_min && (
              <div className="space-y-1">
                <p className="text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Remuneração</p>
                <p className="text-xl sm:text-2xl font-black text-primary">
                  {vaga.salario_min.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  {vaga.salario_max && ` - ${vaga.salario_max.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                </p>
              </div>
            )}

            <BotaoCandidatar vagaId={vaga.id} jaCandidatou={jaCandidatou} />
            
            <p className="text-center text-[8px] sm:text-[10px] text-muted-foreground font-medium px-2 leading-relaxed opacity-60">
              Ao se candidatar, seu currículo será compartilhado com o recrutador.
            </p>
          </div>

          {/* Card Empresa Info */}
          <div className="bg-muted/30 p-4 sm:p-6 rounded-xl sm:rounded-4xl border border-border space-y-4">
            <h3 className="font-black text-xs sm:text-sm text-primary uppercase tracking-widest opacity-70">
              Empresa
            </h3>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-9 sm:w-10 h-9 sm:h-10 bg-card rounded-lg sm:rounded-xl border border-border flex items-center justify-center text-accent shrink-0">
                <Building2 className="w-4.5 sm:w-5 h-4.5 sm:h-5" />
              </div>
              <p className="font-bold text-xs sm:text-sm text-primary line-clamp-2">{(vaga.empresa as any)?.nome}</p>
            </div>
            <p className="text-[8px] sm:text-xs text-muted-foreground leading-relaxed italic opacity-80">
              {(vaga.empresa as any)?.setor} · {(vaga.empresa as any)?.cidade} - {(vaga.empresa as any)?.estado}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
