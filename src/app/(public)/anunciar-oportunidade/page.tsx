'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OportunidadeLeadSchema } from '@/lib/schemas'
import { createOportunidadeLeadAction, getConfiguracoes } from '@/app/actions/oportunidades'
import { generateWhatsAppLink } from '@/lib/whatsapp'
import { toast } from 'react-hot-toast'
import { Building2, User, Mail, Phone, Briefcase, MapPin, MessageSquare, Send, Loader2, CheckCircle2, Clock } from 'lucide-react'
import { Logo } from '@/components/Logo'
import Link from 'next/link'

export default function AnunciarOportunidadePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configs, setConfigs] = useState<any>(null)

  useEffect(() => {
    getConfiguracoes().then(setConfigs)
    // Track page view
    fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento: 'pagina_visualizada' })
    })
  }, [])
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(OportunidadeLeadSchema)
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    
    // Track submission attempt
    fetch('/api/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ evento: 'formulario_submetido' })
    })

    try {
      const response = await fetch('/api/oportunidade-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.error || 'Erro ao enviar.')
        setIsSubmitting(false)
        return
      }

      toast.success(result.message)
      
      // Track WhatsApp redirect
      fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento: 'whatsapp_aberto' })
      })

      setTimeout(() => {
        window.open(result.whatsapp_url, '_blank')
        setIsSubmitting(false)
      }, 1500)

    } catch (error) {
      toast.error('Ocorreu um erro ao processar sua solicitação.')
      setIsSubmitting(false)
    }
  }

  const prazoTexto = configs?.prazo_retorno_texto || 'Retornamos em até 1 dia útil'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Simple Header */}
      <header className="h-20 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link href="/">
            <Logo width={140} height={44} />
          </Link>
          <Link href="/vagas" className="text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
            Voltar para Vagas
          </Link>
        </div>
      </header>

      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Content side */}
          <div className="space-y-8 animate-in slide-in-from-left duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent text-[10px] font-black uppercase tracking-widest border border-accent/10">
                Para Empresas
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary leading-tight tracking-tight">
                Anuncie sua vaga e encontre o <span className="text-accent">candidato ideal</span>
              </h1>
              <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-md">
                Conectamos sua empresa aos melhores talentos através de uma curadoria inteligente e processos ágeis.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "Processo simplificado e humanizado",
                "Filtro de candidatos por competências",
                "Divulgação estratégica multicanal",
                "Suporte dedicado via WhatsApp"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-bold text-primary">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <div className="bg-card rounded-[2.5rem] border border-border p-8 md:p-10 shadow-2xl shadow-primary/5 animate-in slide-in-from-right duration-700">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Honeypot */}
              <input type="text" {...register('website')} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Empresa*</label>
                  <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('nome_empresa')}
                      placeholder="Nome da empresa"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  {errors.nome_empresa && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nome_empresa.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Responsável*</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('nome_responsavel')}
                      placeholder="Seu nome"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  {errors.nome_responsavel && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.nome_responsavel.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">WhatsApp*</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('telefone')}
                      placeholder="(00) 0 0000-0000"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  {errors.telefone && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.telefone.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cargo Desejado*</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('cargo_vaga')}
                      placeholder="Vaga pretendida"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  {errors.cargo_vaga && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.cargo_vaga.message as string}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail (Opcional)</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="email@empresa.com.br"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                  {errors.email && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.email.message as string}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Cidade (Opcional)</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                      {...register('cidade')}
                      placeholder="Sua cidade"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Entrar em contato pelo WhatsApp
                    </>
                  )}
                </button>
                
                <p className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground animate-pulse">
                  <Clock className="w-3.5 h-3.5" /> ⏱️ {prazoTexto}
                </p>
              </div>

              <p className="text-center text-[10px] font-bold text-muted-foreground opacity-50 px-8 leading-relaxed">
                Ao clicar, seus dados serão enviados e você será redirecionado para o WhatsApp.
              </p>
            </form>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-8 border-t border-border opacity-50">
        <div className="max-w-7xl mx-auto px-6 text-center text-[10px] font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Plataforma de Vagas - Todos os direitos reservados
        </div>
      </footer>
    </div>
  )
}
