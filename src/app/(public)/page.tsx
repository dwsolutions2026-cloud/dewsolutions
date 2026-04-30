import Link from 'next/link'
import { Search, Briefcase, Building2, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-7xl font-black text-primary leading-[1.1] mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              Conectando <span className="text-accent italic">talentos</span> às melhores empresas.
            </h1>
            <p className="text-xl text-muted-foreground mb-12 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
              A plataforma definitiva para recrutamento e seleção de alta performance. Encontre sua próxima oportunidade ou o candidato ideal hoje.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link 
                href="/vagas" 
                className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                Explorar Vagas <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/anunciar-oportunidade" 
                className="bg-card border border-border text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-muted transition-all flex items-center justify-center"
              >
                Anunciar Oportunidade
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Features */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Briefcase, title: 'Milhares de Vagas', desc: 'Oportunidades em diversas áreas e níveis de experiência.' },
            { icon: Building2, title: 'Empresas Premium', desc: 'Trabalhe nas empresas mais inovadoras do mercado.' },
            { icon: Users, title: 'Processo Ágil', desc: 'Candidaturas simplificadas e feedback direto no dashboard.' },
          ].map((item, i) => (
            <div key={i} className="bg-card p-8 rounded-3xl border border-border hover:border-accent/40 transition-all group">
              <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-white blur-3xl" />
            <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-accent blur-3xl" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-8 relative">
            Pronto para dar o próximo passo?
          </h2>
          <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto relative">
            Junte-se a milhares de profissionais e empresas que já estão transformando o mercado de trabalho através da nossa plataforma.
          </p>
          <Link 
            href="/cadastro" 
            className="bg-accent text-accent-foreground px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all inline-block relative shadow-2xl shadow-accent/20"
          >
            Começar Agora Gratuitamente
          </Link>
        </div>
      </section>
    </div>
  )
}
