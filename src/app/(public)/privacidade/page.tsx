import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export default function PrivacidadePage() {
  return (
    <div className="bg-muted min-h-[calc(100vh-140px)] py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="bg-primary p-8 text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Política de Privacidade</h1>
              <p className="text-white/70 text-sm">D&W Solutions • Última atualização: Abril 2026</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4">1. Coleta de Informações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Coletamos informações essenciais para o processo de recrutamento, incluindo nome completo, 
                e-mail, telefone, histórico profissional e currículos enviados. Esses dados são 
                fornecidos voluntariamente por você ao criar seu perfil ou se candidatar a uma vaga.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">2. Uso dos Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seus dados são utilizados exclusivamente para conectar você a oportunidades de emprego. 
                Ao se candidatar a uma vaga, as informações do seu perfil e seu currículo são 
                compartilhados com a empresa anunciante daquela vaga específica.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">3. Segurança</h2>
              <p className="text-muted-foreground leading-relaxed">
                Implementamos medidas de segurança técnicas e administrativas para proteger seus dados 
                contra acesso não autorizado, perda ou alteração. Todos os currículos são armazenados 
                em servidores seguros com acesso restrito.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Seus Direitos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Em conformidade com a LGPD, você tem o direito de acessar, corrigir ou excluir seus 
                dados pessoais a qualquer momento através do seu painel de candidato ou entrando 
                em contato com nosso suporte.
              </p>
            </section>

            <div className="pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground italic text-center">
                Dúvidas sobre nossa política? Entre em contato através do e-mail: suporte@dwsolutions.com.br
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
