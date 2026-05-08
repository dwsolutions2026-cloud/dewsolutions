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
  const mapsIframe = configs.contato_maps_iframe

  return (
    <footer className="bg-[#050505] text-white border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-5 sm:px-8 lg:px-10 xl:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Logo e Sobre */}
          <div className="lg:col-span-5 space-y-8">
            <div className="h-12 w-48 relative">
              <Logo width={192} height={48} variant="white" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-md">
              A D&W Solutions é uma consultoria especializada em Recrutamento e Seleção de alta performance, 
              conectando os melhores talentos às empresas que buscam excelência e resultados estratégicos.
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
          <div className="lg:col-span-4 grid grid-cols-2 gap-4 sm:gap-8">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Navegação</h4>
              <ul className="space-y-4 text-sm font-bold text-white/50">
                <li><Link href="#home" className="hover:text-accent transition-colors whitespace-nowrap">Início</Link></li>
                <li><Link href="#sobre" className="hover:text-accent transition-colors whitespace-nowrap">Sobre</Link></li>
                <li><Link href="#servicos" className="hover:text-accent transition-colors whitespace-nowrap">Serviços</Link></li>
                <li><Link href="/vagas" className="hover:text-accent transition-colors whitespace-nowrap">Vagas</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium text-white/70 whitespace-nowrap">{email}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-sm font-medium text-white/70 whitespace-nowrap">{telefone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-white/70 leading-relaxed">{endereco}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mapa */}
          <div className="lg:col-span-3 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Localização</h4>
            <div className="w-full h-40 rounded-2xl overflow-hidden grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 border border-white/10">
              {mapsIframe ? (
                <iframe 
                  src={mapsIframe}
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="w-full h-full bg-white/5 flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-white/20" />
                </div>
              )}
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
