import { Building2, Users, Target, Award, Rocket } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós | DW Solutions',
  description: 'Conheça a DW Solutions e nossa missão de transformar o recrutamento e seleção.',
}

export default function SobrePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-20 space-y-20 animate-in fade-in duration-700">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-black uppercase tracking-widest border border-accent/10">
          Nossa História
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-primary tracking-tight leading-tight">
          Transformando o <span className="text-accent italic">talento</span> em resultados.
        </h1>
        <p className="text-muted-foreground text-xl font-medium max-w-3xl mx-auto leading-relaxed">
          A <span className="text-primary font-bold">DW Solutions</span> nasceu com a missão de humanizar e agilizar o processo de recrutamento, conectando as pessoas certas aos lugares certos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-4 text-primary">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center text-accent">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Nossa Missão</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Simplificar a jornada de contratação para empresas e candidatos, utilizando tecnologia e curadoria especializada para garantir eficiência e respeito mútuo.
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-4 text-primary">
              <div className="w-12 h-12 bg-accent/10 rounded-sm flex items-center justify-center text-accent">
                <Rocket className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold">Nossa Visão</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Ser a referência nacional em recrutamento e seleção, reconhecida pela excelência no atendimento e pelo impacto positivo na carreira de milhares de profissionais.
            </p>
          </section>
        </div>

        <div className="bg-card rounded-[3rem] border border-border p-10 shadow-2xl shadow-primary/5 space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-sm flex items-center justify-center text-white shadow-xl shadow-primary/20">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-black text-primary">Valores</h3>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">O que nos guia</p>
            </div>
          </div>
          <ul className="space-y-4">
            {[
              { title: 'Transparência', desc: 'Comunicação clara e honesta em todas as etapas.' },
              { title: 'Inovação', desc: 'Tecnologia a serviço das pessoas, não o contrário.' },
              { title: 'Humanização', desc: 'Cada candidato é uma história, não apenas um currículo.' },
              { title: 'Excelência', desc: 'Comprometimento total com os resultados de nossos clientes.' }
            ].map((v, i) => (
              <li key={i} className="flex gap-4">
                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 shrink-0" />
                <div>
                  <span className="font-bold text-primary block">{v.title}</span>
                  <span className="text-sm text-muted-foreground font-medium">{v.desc}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="bg-primary rounded-[3rem] p-12 text-center text-white space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl -mr-32 -mt-32" />
        <h2 className="text-3xl font-black relative">Conheça a DW Solutions</h2>
        <p className="max-w-2xl mx-auto text-white/70 font-medium relative leading-relaxed">
          Sediada em Curitiba e atuando em todo o Brasil, somos parceiros estratégicos de empresas como a Audipreve e diversas outras referências em seus setores.
        </p>
      </div>
    </div>
  )
}
