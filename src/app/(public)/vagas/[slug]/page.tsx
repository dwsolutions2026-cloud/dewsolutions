/* 
EXECUTE ESTE SQL NO SQL EDITOR DO SUPABASE PARA ATIVAR AS URLs AMIGÁVEIS:

-- 1. Adicionar colunas de slug
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS slug text UNIQUE;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS slug text UNIQUE;

-- 2. Gerar slugs para registros existentes (Empresas)
UPDATE public.empresas 
SET slug = lower(regexp_replace(nome, '[^a-zA-Z0-9]+', '-', 'g')) 
WHERE slug IS NULL;

-- 3. Gerar slugs para registros existentes (Vagas)
-- Adicionamos os 4 primeiros caracteres do ID para garantir unicidade em títulos iguais
UPDATE public.vagas 
SET slug = lower(regexp_replace(titulo, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substr(id::text, 1, 4) 
WHERE slug IS NULL;
*/

import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { 
  MapPin, Briefcase, Building2, Calendar, 
  DollarSign, CheckCircle2, ArrowLeft, Share2 
} from 'lucide-react'
import Link from 'next/link'
import { BotaoCandidatar } from '@/components/vagas/BotaoCandidatar'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function VagaDetalhesPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  // Buscar por slug OU por id (para manter compatibilidade)
  const { data: vaga, error } = await supabase
    .from('vagas')
    .select(`
      *,
      empresa:empresas (*)
    `)
    .or(`slug.eq."${slug}",id.eq."${slug}"`)
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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-700">
      {/* Header / Nav */}
      <div className="flex items-center justify-between">
        <Link 
          href="/vagas" 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar para Vagas
        </Link>
        <button className="p-2 text-muted-foreground hover:text-accent rounded-full hover:bg-accent/5 transition-all">
          <Share2 className="w-4.5 h-4.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Coluna Principal: Detalhes */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Título e Info Básica */}
          <div className="space-y-5">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/10">
              {vaga.area}
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-primary leading-[1.1] tracking-tight">
              {vaga.titulo}
            </h1>
            
            <div className="flex flex-wrap gap-5 text-xs font-bold text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <Building2 className="w-4 h-4" />
                </div>
                {(vaga.empresa as any)?.nome}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <MapPin className="w-4 h-4" />
                </div>
                {vaga.cidade} - {vaga.estado}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <Briefcase className="w-4 h-4" />
                </div>
                {vaga.modalidade}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-accent">
                  <Calendar className="w-4 h-4" />
                </div>
                {new Date(vaga.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-border/50" />

          {/* Conteúdo */}
          <div className="space-y-10">
            <section className="space-y-4">
              <h2 className="text-xl font-black text-primary uppercase tracking-tight">Descrição da Vaga</h2>
              <p className="text-muted-foreground leading-relaxed text-sm whitespace-pre-wrap font-medium">
                {vaga.descricao}
              </p>
            </section>

            {vaga.requisitos && (
              <section className="space-y-4">
                <h2 className="text-xl font-black text-primary uppercase tracking-tight">Requisitos</h2>
                <div className="bg-card p-6 rounded-2xl border border-border space-y-3">
                  {vaga.requisitos.split('\n').map((req: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                      <span className="text-muted-foreground font-medium text-sm">{req}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {vaga.beneficios && (
              <section className="space-y-4">
                <h2 className="text-xl font-black text-primary uppercase tracking-tight">Benefícios</h2>
                <p className="text-muted-foreground leading-relaxed font-medium whitespace-pre-wrap text-sm">
                  {vaga.beneficios}
                </p>
              </section>
            )}
          </div>
        </div>

        {/* Coluna Lateral: CTA e Empresa */}
        <div className="space-y-6">
          {/* Card Candidatura */}
          <div className="bg-card p-6 rounded-[2rem] border border-border shadow-xl shadow-primary/5 sticky top-28 space-y-6">
            {vaga.exibir_salario && vaga.salario_min && (
              <div className="space-y-1">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Remuneração</p>
                <p className="text-2xl font-black text-primary">
                  {vaga.salario_min.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  {vaga.salario_max && ` - ${vaga.salario_max.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                </p>
              </div>
            )}

            <BotaoCandidatar vagaId={vaga.id} jaCandidatou={jaCandidatou} />
            
            <p className="text-center text-[10px] text-muted-foreground font-medium px-2 leading-relaxed opacity-60">
              Ao se candidatar, seu currículo será compartilhado com o recrutador.
            </p>
          </div>

          {/* Card Empresa Info */}
          <div className="bg-muted/30 p-6 rounded-[2rem] border border-border space-y-4">
            <h3 className="font-black text-sm text-primary uppercase tracking-widest opacity-70">
              Empresa
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-card rounded-xl border border-border flex items-center justify-center text-accent">
                <Building2 className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm text-primary">{(vaga.empresa as any)?.nome}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed italic opacity-80">
              {(vaga.empresa as any)?.setor} · {(vaga.empresa as any)?.cidade} - {(vaga.empresa as any)?.estado}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
