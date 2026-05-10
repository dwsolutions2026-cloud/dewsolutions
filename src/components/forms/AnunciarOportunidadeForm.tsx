'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { OportunidadeLeadSchema } from '@/lib/schemas'
import { getConfiguracoes } from '@/app/actions/oportunidades'
import { toast } from 'react-hot-toast'
import { Building2, User, Mail, Phone, Briefcase, MapPin, Send, Loader2, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { hasTrackingConsent } from '@/components/ConsentBanner'

export function AnunciarOportunidadeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [configs, setConfigs] = useState<any>(null)
  const [aceitouTermos, setAceitouTermos] = useState(false)

  useEffect(() => {
    getConfiguracoes().then(setConfigs)
    if (hasTrackingConsent()) {
      fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento: 'pagina_visualizada' })
      })
    }
  }, [])
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(OportunidadeLeadSchema)
  })

  const onSubmit = async (data: any) => {
    if (!aceitouTermos) {
      toast.error('Você precisa aceitar os termos de privacidade.')
      return
    }

    setIsSubmitting(true)
    
    // Track submission attempt
    if (hasTrackingConsent()) {
      fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento: 'formulario_submetido' })
      })
    }

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
      if (hasTrackingConsent()) {
        fetch('/api/eventos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ evento: 'whatsapp_aberto' })
        })
      }

      setTimeout(() => {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
        setIsSubmitting(false)
      }, 1500)

    } catch (error) {
      toast.error('Ocorreu um erro ao processar sua solicitação.')
      setIsSubmitting(false)
    }
  }

  const prazoTexto = configs?.prazo_retorno_texto || 'Retornamos em até 1 dia útil'

  return (
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
            Conectamos sua empresa aos melhores talentos através da curadoria inteligente da <span className="text-primary font-bold">DW Solutions</span>.
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
      <div className="surface-card rounded-sm p-8 md:p-10 shadow-xl border-none animate-in slide-in-from-right duration-700">
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
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
                  className="surface-input w-full pl-11 pr-4 py-3.5 rounded-sm border-none shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Checkbox LGPD */}
          <div className="flex items-start gap-3 p-4 bg-background/50 rounded-sm border-none">
            <input
              type="checkbox"
              id="lgpd"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-sm border-none bg-background text-accent focus:ring-accent cursor-pointer"
            />
            <label htmlFor="lgpd" className="text-[10px] sm:text-xs font-medium text-muted-foreground cursor-pointer leading-relaxed">
              Estou de acordo com a <Link href="/privacidade" className="text-accent underline hover:text-accent/80 transition-colors">Política de Privacidade</Link> e autorizo o contato da DW Solutions via WhatsApp ou e-mail.
            </label>
          </div>

          <div className="space-y-4 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !aceitouTermos}
              className="w-full gold-gradient text-black py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
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
        </form>
      </div>
    </div>
  )
}
