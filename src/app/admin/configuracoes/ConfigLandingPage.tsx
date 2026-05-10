'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
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
  TrendingUp,
  Plus,
  Trash2
} from 'lucide-react'

export function ConfigLandingPage({ initialConfigs }: { initialConfigs: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Parse initial arrays safely
  const safeParse = (str: string, fallback: any) => {
    try {
      return str ? JSON.parse(str) : fallback
    } catch {
      return fallback
    }
  }

  const initialLogos = safeParse(initialConfigs.landing_logos, [])
  const initialStats = safeParse(initialConfigs.landing_stats, [])

  // We are not passing landing_logos and landing_stats to useForm directly because they are JSON strings in the schema.
  // We'll manage them with local state for a better UI experience.
  const [logos, setLogos] = useState<string[]>(initialLogos)
  const [stats, setStats] = useState<{valor: string, label: string}[]>(initialStats)

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
      landing_logos: initialConfigs.landing_logos || '[]',
      landing_depoimentos: initialConfigs.landing_depoimentos || '[]',
      landing_stats: initialConfigs.landing_stats || '[]',
    },
  })

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    // Override the string fields with our local states serialized
    const payload = {
      ...data,
      landing_logos: JSON.stringify(logos),
      landing_stats: JSON.stringify(stats)
    }

    const result = await updateConfiguracoesAction(payload)
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
  const inputSimpleClass = "surface-input w-full rounded-sm px-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
  const textareaClass = "surface-input w-full resize-none rounded-sm pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"

  // Handlers for Logos
  const addLogo = () => setLogos([...logos, ''])
  const updateLogo = (index: number, value: string) => {
    const newLogos = [...logos]
    newLogos[index] = value
    setLogos(newLogos)
  }
  const removeLogo = (index: number) => {
    setLogos(logos.filter((_, i) => i !== index))
  }

  // Handlers for Stats
  const addStat = () => setStats([...stats, { valor: '', label: '' }])
  const updateStat = (index: number, field: 'valor' | 'label', value: string) => {
    const newStats = [...stats]
    newStats[index] = { ...newStats[index], [field]: value }
    setStats(newStats)
  }
  const removeStat = (index: number) => {
    setStats(stats.filter((_, i) => i !== index))
  }

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

      {/* Logos Dinâmicos */}
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <ImageIcon className="h-4 w-4 text-accent" /> Logos das Empresas (Prova Social)
        </h3>

        <div className="space-y-4">
          {logos.map((logo, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                value={logo}
                onChange={(e) => updateLogo(index, e.target.value)}
                placeholder="URL da logo (ex: https://site.com/logo.png)"
                className={inputSimpleClass}
              />
              {logo && (
                <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center p-2 shrink-0">
                  <img src={logo} alt="Preview" className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
              <button
                type="button"
                onClick={() => removeLogo(index)}
                className="w-10 h-10 shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addLogo}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-colors py-2"
          >
            <Plus className="w-4 h-4" /> Adicionar Logo
          </button>
        </div>
      </section>

      {/* Números Dinâmicos */}
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <TrendingUp className="h-4 w-4 text-accent" /> Números que Impressionam
        </h3>

        <div className="space-y-4">
          {stats.map((stat, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input
                value={stat.valor}
                onChange={(e) => updateStat(index, 'valor', e.target.value)}
                placeholder="Valor (ex: +500, 98%)"
                className={`${inputSimpleClass} w-1/3`}
              />
              <input
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                placeholder="Rótulo (ex: Vagas Preenchidas)"
                className={`${inputSimpleClass} w-2/3`}
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="w-10 h-10 shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-sm flex items-center justify-center transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStat}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent hover:text-accent/80 transition-colors py-2"
          >
            <Plus className="w-4 h-4" /> Adicionar Métrica
          </button>
        </div>
      </section>

      {/* Depoimentos (Ainda raw JSON) */}
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <MessageSquare className="h-4 w-4 text-accent" /> Depoimentos
        </h3>

        <div className="space-y-1.5">
          <div className={inputContainerClass}>
            <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
            <textarea 
              {...register('landing_depoimentos')} 
              rows={4} 
              placeholder='[{"nome": "Fulano", "cargo": "CEO", "texto": "Excelente serviço!"}]' 
              className={textareaClass} 
            />
          </div>
          <p className="px-1 text-[9px] text-muted-foreground italic mt-1">Insira os depoimentos em formato JSON por enquanto.</p>
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
