'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ConfigSiteSchema } from '@/lib/schemas'
import { updateConfiguracoesAction } from '@/app/actions/oportunidades'
import { toast } from 'react-hot-toast'
import { Phone, MessageSquare, Save, Loader2, Info, Eye, Mail, Clock } from 'lucide-react'
import { generateWhatsAppLink } from '@/lib/whatsapp'

export function ConfigWhatsApp({ initialConfigs }: { initialConfigs: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(ConfigSiteSchema),
    defaultValues: {
      whatsapp_numero: initialConfigs.whatsapp_numero || '4197010813',
      whatsapp_mensagem: initialConfigs.whatsapp_mensagem || '',
      prazo_retorno_texto: initialConfigs.prazo_retorno_texto || 'Retornamos em até 1 dia útil',
      admin_email_notificacao: initialConfigs.admin_email_notificacao || ''
    }
  })

  const whatsapp_numero = watch('whatsapp_numero')
  const whatsapp_mensagem = watch('whatsapp_mensagem')

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    const result = await updateConfiguracoesAction(data)
    if (result.success) {
      toast.success('Configurações salvas!')
    } else {
      toast.error(result.error || 'Erro ao salvar.')
    }
    setIsSubmitting(false)
  }

  const previewData = {
    nome_empresa: 'Empresa Exemplo LTDA',
    nome_responsavel: 'João Silva',
    email: 'joao@exemplo.com',
    telefone: '(11) 98888-7777',
    cargo_vaga: 'Desenvolvedor Full Stack',
    cidade: 'Curitiba',
    mensagem: 'Gostaria de saber os valores para anunciar.'
  }

  const previewLink = generateWhatsAppLink(whatsapp_numero || '', whatsapp_mensagem || '', previewData)
  const previewMessage = decodeURIComponent(previewLink.split('text=')[1] || '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <section className="space-y-6">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest border-b border-border pb-4 flex items-center gap-2">
          <Phone className="w-4 h-4 text-accent" /> WhatsApp "Anunciar Oportunidade"
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 mb-1.5 block opacity-70">
              Número de Contato
            </label>
            <div className="relative group">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                {...register('whatsapp_numero')}
                placeholder="(41) 9 9999-9999"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium" 
              />
            </div>
            {errors.whatsapp_numero && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.whatsapp_numero.message as string}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 mb-1.5 block opacity-70">
              E-mail para Notificações
            </label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                {...register('admin_email_notificacao')}
                placeholder="admin@exemplo.com"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium" 
              />
            </div>
            {errors.admin_email_notificacao && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.admin_email_notificacao.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 mb-1.5 block opacity-70">
              Texto de Prazo de Retorno
            </label>
            <div className="relative group">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input 
                {...register('prazo_retorno_texto')}
                placeholder="Ex: Retornamos em até 1 dia útil"
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium" 
              />
            </div>
            {errors.prazo_retorno_texto && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.prazo_retorno_texto.message as string}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-1 mb-1.5 block opacity-70">
              Template da Mensagem
            </label>
            <div className="relative group">
              <MessageSquare className="absolute left-3.5 top-4 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <textarea 
                {...register('whatsapp_mensagem')}
                rows={8}
                placeholder="Olá! Tenho interesse..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium resize-none" 
              />
            </div>

            <div className="bg-muted/30 p-3 rounded-xl border border-border/50 space-y-2 mt-2">
              <p className="text-[9px] font-black uppercase text-muted-foreground flex items-center gap-1.5">
                <Info className="w-3 h-3" /> Variáveis Disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {['{nome_empresa}', '{nome_responsavel}', '{email}', '{telefone}', '{cargo_vaga}', '{cidade}', '{mensagem}'].map(v => (
                  <code key={v} className="text-[10px] font-bold bg-background px-1.5 py-0.5 rounded border border-border text-accent">{v}</code>
                ))}
              </div>
            </div>
            {errors.whatsapp_mensagem && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.whatsapp_mensagem.message as string}</p>}
          </div>
        </div>
      </section>

      {/* Real-time Preview */}
      <section className="space-y-4">
        <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2 opacity-70">
          <Eye className="w-4 h-4" /> Preview em Tempo Real
        </h3>
        <div className="bg-green-50/50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 p-6 rounded-4xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="relative">
            <p className="text-[10px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest mb-3">Mensagem no WhatsApp:</p>
            <div className="bg-white dark:bg-card p-5 rounded-2xl border border-green-100 dark:border-green-800/20 shadow-sm">
              <p className="text-sm font-medium text-primary whitespace-pre-wrap leading-relaxed">
                {previewMessage || 'Escreva seu template acima...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:scale-100"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Salvar Configurações
        </button>
      </div>
    </form>
  )
}
