import { Check, Send, Zap, Crown, Building2 } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Planos e Preços | DW Solutions',
  description: 'Conheça nossos planos de recrutamento e seleção. Encontre a solução ideal para sua empresa.',
}

export default function PlanosPage() {
  const planos = [
    {
      nome: 'Básico',
      slug: 'basico',
      icon: Send,
      preco: 'R$ 0',
      periodo: 'anúncio simples',
      desc: 'Ideal para quem está começando e precisa de visibilidade.',
      features: [
        'Exposição por 30 dias',
        'Recebimento via WhatsApp',
        'Dashboard simplificado',
        'Suporte via e-mail'
      ],
      cta: 'Anunciar Agora',
      color: 'bg-muted/50',
      accent: 'text-muted-foreground'
    },
    {
      nome: 'Profissional',
      slug: 'profissional',
      icon: Zap,
      preco: 'Consulte-nos',
      periodo: 'por vaga',
      desc: 'Acelere suas contratações com curadoria inteligente.',
      features: [
        'Destaque na plataforma',
        'Triagem de candidatos',
        'Curadoria especializada',
        'Dashboard avançado',
        'Suporte dedicado WhatsApp'
      ],
      cta: 'Entrar em Contato',
      popular: true,
      color: 'bg-accent/10',
      accent: 'text-accent'
    },
    {
      nome: 'Enterprise',
      slug: 'enterprise',
      icon: Crown,
      preco: 'Personalizado',
      periodo: 'mensal',
      desc: 'Soluções completas para alto volume de contratações.',
      features: [
        'Vagas ilimitadas',
        'Recrutador dedicado',
        'Integração via API',
        'Relatórios de performance',
        'Gestão total de processos'
      ],
      cta: 'Falar com Especialista',
      color: 'bg-primary/5',
      accent: 'text-primary'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-primary tracking-tight">Planos para Empresas</h1>
        <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto leading-relaxed">
          Escolha a solução que melhor se adapta ao momento da sua empresa e encontre talentos de alta performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {planos.map((plano, i) => (
          <div 
            key={i} 
            className={`relative p-8 rounded-[2.5rem] border ${plano.popular ? 'border-accent shadow-2xl shadow-accent/10' : 'border-border shadow-sm'} bg-card flex flex-col space-y-6 transition-all hover:scale-[1.02]`}
          >
            {plano.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-accent/20">
                Mais Procurado
              </div>
            )}

            <div className="space-y-4">
              <div className={`w-14 h-14 ${plano.color} rounded-2xl flex items-center justify-center ${plano.accent}`}>
                <plano.icon className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-primary uppercase tracking-tight">{plano.nome}</h3>
                <p className="text-sm text-muted-foreground font-medium">{plano.desc}</p>
              </div>
            </div>

            <div className="py-6 border-y border-border/50">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-primary tracking-tighter">{plano.preco}</span>
                <span className="text-sm text-muted-foreground font-bold italic">/ {plano.periodo}</span>
              </div>
            </div>

            <ul className="flex-1 space-y-4">
              {plano.features.map((f, j) => (
                <li key={j} className="flex items-center gap-3">
                  <div className={`w-5 h-5 ${plano.color} rounded-full flex items-center justify-center shrink-0`}>
                    <Check className={`w-3 h-3 ${plano.accent}`} />
                  </div>
                  <span className="text-sm font-bold text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/anunciar-oportunidade"
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-center transition-all ${
                plano.popular 
                ? 'bg-accent text-white shadow-xl shadow-accent/20 hover:opacity-90' 
                : 'bg-muted text-primary hover:bg-border'
              }`}
            >
              {plano.cta}
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-card p-10 rounded-[3rem] border border-border flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center text-primary">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-primary">Precisa de algo sob medida?</h3>
            <p className="text-muted-foreground font-medium">Desenvolvemos soluções personalizadas para grandes volumes.</p>
          </div>
        </div>
        <Link 
          href="https://wa.me/5541999999999" 
          target="_blank"
          className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/10 whitespace-nowrap"
        >
          Falar com Consultor
        </Link>
      </div>
    </div>
  )
}
