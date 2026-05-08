import { FileText, CheckCircle, Scale, AlertTriangle, ShieldAlert } from 'lucide-react'

export default function TermosPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-primary tracking-tight">Termos de Uso</h1>
        <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">
          Ao utilizar a plataforma D&W Solutions, você concorda com as diretrizes e regras estabelecidas abaixo.
        </p>
      </div>

      <div className="bg-card rounded-4xl shadow-sm border border-border overflow-hidden">
        <div className="bg-primary p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl -mr-32 -mt-32" />
          <div className="flex items-center gap-6 relative">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Acordo de Utilização</h2>
              <p className="text-white/60 font-medium mt-1">Transparência e segurança para candidatos e empresas.</p>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-12">
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-accent" /> 1. Aceitação dos Termos
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Ao acessar nosso site, você confirma que leu, entendeu e concorda em cumprir estes Termos de Uso. Estes termos podem ser atualizados periodicamente para refletir melhorias em nossos serviços.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <Scale className="w-5 h-5 text-accent" /> 2. Uso Responsável
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              A plataforma deve ser utilizada exclusivamente para fins de recrutamento, seleção e networking profissional. É proibido o uso de informações falsas, a prática de spam ou qualquer atividade que comprometa a integridade do sistema.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-accent" /> 3. Propriedade Intelectual
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Todo o conteúdo presente nesta plataforma, incluindo logotipos, textos e design, é de propriedade exclusiva da D&W Solutions ou de seus parceiros e está protegido por leis de direitos autorais.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-accent" /> 4. Limitação de Responsabilidade
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Embora trabalhemos para garantir a melhor experiência, a D&W Solutions não se responsabiliza por acordos diretos feitos entre empresas e candidatos, nem por falhas técnicas temporárias de conexão.
            </p>
          </section>
        </div>

        <div className="p-8 bg-muted/30 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Vigência a partir de: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
