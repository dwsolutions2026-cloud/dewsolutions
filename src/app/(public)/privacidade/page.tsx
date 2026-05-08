import { ShieldCheck, Lock, Eye, FileText, Scale } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 space-y-16 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-primary tracking-tight">Privacidade e Proteção</h1>
        <p className="text-muted-foreground text-xl font-medium max-w-2xl mx-auto">
          Sua segurança e a transparência no uso dos seus dados são nossas prioridades absolutas.
        </p>
      </div>

      <div className="bg-card rounded-[3rem] shadow-sm border border-border overflow-hidden">
        <div className="bg-primary p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 blur-3xl -mr-32 -mt-32" />
          <div className="flex items-center gap-6 relative">
            <div className="w-16 h-16 bg-white/10 rounded-sm flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Compromisso LGPD</h2>
              <p className="text-white/60 font-medium mt-1">Estamos em total conformidade com a Lei Geral de Proteção de Dados.</p>
            </div>
          </div>
        </div>

        <div className="p-12 space-y-12">
          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <Eye className="w-5 h-5 text-accent" /> Quais dados coletamos?
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Coletamos informações essenciais para o seu processo de recrutamento: nome, e-mail, telefone, histórico profissional e acadêmico. Esses dados são fornecidos voluntariamente por você ao criar seu perfil ou enviar seu currículo.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <Lock className="w-5 h-5 text-accent" /> Como protegemos seus dados?
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Utilizamos tecnologias de criptografia de ponta e servidores seguros (via Supabase) para garantir que suas informações pessoais estejam protegidas contra acessos não autorizados.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <FileText className="w-5 h-5 text-accent" /> Compartilhamento de informações
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Seus dados profissionais só são compartilhados com os recrutadores e empresas das vagas para as quais você se candidata explicitamente. Nunca vendemos seus dados para terceiros.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-primary flex items-center gap-3">
              <Scale className="w-5 h-5 text-accent" /> Seus Direitos
            </h3>
            <p className="text-muted-foreground leading-relaxed font-medium">
              Você tem o direito de acessar, corrigir ou excluir seus dados a qualquer momento através do seu painel de candidato. Caso deseje encerrar sua conta definitivamente, todos os seus dados serão removidos de nossos servidores.
            </p>
          </section>
        </div>

        <div className="p-8 bg-muted/30 border-t border-border text-center">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  )
}
