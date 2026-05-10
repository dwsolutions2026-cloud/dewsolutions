import Link from 'next/link'
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react'
import { Logo } from '@/components/Logo'

interface Props {
  configs: Record<string, string>
}

export function Footer({ configs }: Props) {
  const email = configs.contato_email || 'contato@dwsolutions.com.br'
  const telefone = configs.contato_telefone || '(41) 9701-0813'
  const endereco = configs.contato_endereco || 'Curitiba, PR'

  return (
    <footer className="bg-[#050505] text-white border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Logo e Sobre */}
          <div className="space-y-8">
            <div className="h-12 w-48 relative">
              <Logo width={192} height={48} variant="white" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              A D&W Solutions é uma consultoria especializada em Recrutamento e Seleção de alta performance, 
              conectando os melhores talentos às empresas.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-black transition-all" title="Instagram">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-black transition-all" title="LinkedIn">
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links e Contatos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-white/50">
                <li><Link href="/" className="hover:text-accent transition-colors">Início</Link></li>
                <li><Link href="/#sobre" className="hover:text-accent transition-colors">Sobre Nós</Link></li>
                <li><Link href="/#servicos" className="hover:text-accent transition-colors">Serviços</Link></li>
                <li><Link href="/vagas" className="hover:text-accent transition-colors">Painel de Vagas</Link></li>
                <li><Link href="/anunciar-oportunidade" className="hover:text-accent transition-colors">Anunciar Vaga</Link></li>
                <li><Link href="/login" className="hover:text-accent transition-colors">Acesso / Portal</Link></li>
                <li><Link href="/privacidade" className="hover:text-accent transition-colors">Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-accent transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/70 break-all">{email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/70">{telefone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/70 leading-relaxed">{endereco}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            © {new Date().getFullYear()} D&W Solutions. Todos os direitos reservados.
          </p>
          <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
            Desenvolvido com <span className="text-accent">♥</span> para alta performance
          </p>
        </div>
      </div>
    </footer>
  )
}
