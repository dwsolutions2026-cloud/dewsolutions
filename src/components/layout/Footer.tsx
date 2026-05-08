'use client'

import Link from 'next/link'
import { Logo } from '@/components/Logo'
import { Mail, Phone, MapPin } from 'lucide-react'

interface FooterProps {
  configs: Record<string, string>
}

const shellPadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

export function Footer({ configs }: FooterProps) {
  const contatoEmail = configs.contato_email || 'contato@dwsolutions.com.br'
  const contatoTelefone = configs.contato_telefone || '(41) 3333-3333'
  const contatoEndereco = configs.contato_endereco || 'Curitiba - PR'
  const mapsIframe = configs.contato_maps_iframe

  return (
    <footer className="mt-16 border-t border-border/70 bg-card/70 pb-8 pt-14 sm:mt-20 sm:pb-10 sm:pt-20">
      <div className={`mb-12 grid grid-cols-1 gap-10 md:mb-16 md:grid-cols-4 md:gap-12 ${shellPadding}`}>
        {/* Coluna 1: Logo e Descrição */}
        <div className="space-y-6 md:col-span-1">
          <div className="flex justify-start">
            <Logo width={180} height={50} variant="auto" />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A <span className="font-bold text-primary">D&W Solutions</span> conecta talentos
            de alta performance às melhores empresas do mercado, com processos ágeis e humanizados.
          </p>
        </div>

        {/* Coluna 2: Institucional */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Institucional</h4>
          <ul className="space-y-4">
            {['Sobre nós', 'Nossos serviços', 'Vagas abertas'].map((item) => (
              <li key={item}>
                <Link href={`/#${item.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-muted-foreground transition-colors hover:text-accent">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Coluna 3: Contatos */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Contatos</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-accent mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">E-mail</p>
                <a href={`mailto:${contatoEmail}`} className="text-sm font-medium text-primary hover:text-accent transition-colors">{contatoEmail}</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-accent mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Telefone</p>
                <a href={`tel:${contatoTelefone.replace(/\D/g, '')}`} className="text-sm font-medium text-primary hover:text-accent transition-colors">{contatoTelefone}</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-accent mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Endereço</p>
                <p className="text-sm font-medium text-primary leading-tight">{contatoEndereco}</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Coluna 4: Mapa */}
        <div className="space-y-6">
          <h4 className="text-xs font-black uppercase tracking-widest text-primary">Onde Estamos</h4>
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-border bg-muted/30">
            {mapsIframe ? (
              <iframe 
                src={mapsIframe} 
                className="h-full w-full grayscale contrast-[1.1]" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-40">
                  Mapa será configurado em breve via painel admin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-center md:flex-row md:text-left ${shellPadding}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          &copy; {new Date().getFullYear()} D&W Solutions. Todos os direitos reservados.
        </p>
        <div className="flex items-center gap-6">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground opacity-40">
            Inteligência em Recrutamento
          </span>
        </div>
      </div>
    </footer>
  )
}
