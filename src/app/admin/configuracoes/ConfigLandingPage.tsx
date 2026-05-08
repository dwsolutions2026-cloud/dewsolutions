'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConfigLandingSchema } from '@/lib/schemas'
import { updateConfiguracoesAction } from '@/app/actions/oportunidades'
import { toast } from 'react-hot-toast'
import { 
  Save, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Image as ImageIcon, 
  MessageSquare, 
  TrendingUp 
} from 'lucide-react'

export function ConfigLandingPage({ initialConfigs }: { initialConfigs: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ConfigLandingSchema),
    defaultValues: {
      contato_email: initialConfigs.contato_email || '',
      contato_telefone: initialConfigs.contato_telefone || '',
      contato_endereco: initialConfigs.contato_endereco || '',
      contato_maps_iframe: initialConfigs.contato_maps_iframe || '',
      landing_logos: initialConfigs.landing_logos || '',
      landing_depoimentos: initialConfigs.landing_depoimentos || '',
      landing_stats: initialConfigs.landing_stats || '',
    },
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    const result = await updateConfiguracoesAction(data)
    if (result.success) {
      toast.success('Configurações da Landing Page salvas!')
    } else {
      toast.error(result.error || 'Erro ao salvar.')
    }
    setIsSubmitting(false)
  }

  const labelClass = "mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70"
  const inputContainerClass = "group relative"
  const iconClass = "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent"
  const inputClass = "surface-input w-full rounded-sm pl-11 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
  const textareaClass = "surface-input w-full resize-none rounded-sm pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in space-y-10 fade-in duration-500">
      {/* Contato e Endereço */}
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <MapPin className="h-4 w-4 text-accent" /> Informações de Contato e Rodapé
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass}>E-mail de Contato (Público)</label>
            <div className={inputContainerClass}>
              <Mail className={iconClass} />
              <input {...register('contato_email')} placeholder="contato@dwsolutions.com.br" className={inputClass} />
            </div>
            {errors.contato_email && <p className="ml-1 text-[10px] font-bold text-red-500">{errors.contato_email.message as string}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Telefone de Contato</label>
            <div className={inputContainerClass}>
              <Phone className={iconClass} />
              <input {...register('contato_telefone')} placeholder="(41) 3333-3333" className={inputClass} />
            </div>
            {errors.contato_telefone && <p className="ml-1 text-[10px] font-bold text-red-500">{errors.contato_telefone.message as string}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Endereço Completo</label>
          <div className={inputContainerClass}>
            <MapPin className={iconClass} />
            <input {...register('contato_endereco')} placeholder="Rua Exemplo, 123 - Curitiba/PR" className={inputClass} />
          </div>
          {errors.contato_endereco && <p className="ml-1 text-[10px] font-bold text-red-500">{errors.contato_endereco.message as string}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Iframe do Google Maps (Link do SRC)</label>
          <div className={inputContainerClass}>
            <Globe className={iconClass} />
            <input {...register('contato_maps_iframe')} placeholder="https://www.google.com/maps/embed?..." className={inputClass} />
          </div>
          <p className="px-1 text-[9px] text-muted-foreground italic mt-1">Cole apenas o link que está dentro do atributo 'src' do iframe do Google Maps.</p>
        </div>
      </section>

      {/* Conteúdo Dinâmico */}
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <ImageIcon className="h-4 w-4 text-accent" /> Conteúdo da Landing Page (JSON)
        </h3>

        <div className="grid grid-cols-1 gap-8">
          <div className="space-y-1.5">
            <label className={labelClass}>Logos dos Clientes (URLs)</label>
            <div className={inputContainerClass}>
              <ImageIcon className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <textarea 
                {...register('landing_logos')} 
                rows={4} 
                placeholder='["/logos/empresa1.png", "/logos/empresa2.png"]' 
                className={textareaClass} 
              />
            </div>
            <p className="px-1 text-[9px] text-muted-foreground italic mt-1">Formato: Lista de URLs de imagens entre colchetes.</p>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Depoimentos</label>
            <div className={inputContainerClass}>
              <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <textarea 
                {...register('landing_depoimentos')} 
                rows={6} 
                placeholder='[{"nome": "Fulano", "cargo": "CEO", "texto": "Excelente serviço!"}]' 
                className={textareaClass} 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelClass}>Números que Impressionam</label>
            <div className={inputContainerClass}>
              <TrendingUp className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <textarea 
                {...register('landing_stats')} 
                rows={4} 
                placeholder='[{"label": "Vagas", "valor": "+500"}]' 
                className={textareaClass} 
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4 border-t border-border">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-sm bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Salvar Configurações da Landing Page
        </button>
      </div>
    </form>
  )
}
