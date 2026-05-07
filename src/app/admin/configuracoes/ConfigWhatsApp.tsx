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

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ConfigSiteSchema),
    defaultValues: {
      whatsapp_numero: initialConfigs.whatsapp_numero || '4197010813',
      whatsapp_mensagem: initialConfigs.whatsapp_mensagem || '',
      prazo_retorno_texto: initialConfigs.prazo_retorno_texto || 'Retornamos em até 1 dia útil',
      admin_email_notificacao: initialConfigs.admin_email_notificacao || '',
    },
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
    mensagem: 'Gostaria de saber os valores para anunciar.',
  }

  const previewLink = generateWhatsAppLink(
    whatsapp_numero || '',
    whatsapp_mensagem || '',
    previewData
  )
  const previewMessage = decodeURIComponent(previewLink.split('text=')[1] || '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in space-y-8 fade-in duration-500">
      <section className="space-y-6">
        <h3 className="flex items-center gap-2 border-b border-border pb-4 text-sm font-black uppercase tracking-widest text-primary">
          <Phone className="h-4 w-4 text-accent" /> WhatsApp “Anunciar Oportunidade”
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              Número de Contato
            </label>
            <div className="group relative">
              <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                {...register('whatsapp_numero')}
                placeholder="(41) 9 9999-9999"
                className="surface-input w-full rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
              />
            </div>
            {errors.whatsapp_numero && (
              <p className="ml-1 text-[10px] font-bold text-red-500">
                {errors.whatsapp_numero.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              E-mail para Notificações
            </label>
            <div className="group relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                {...register('admin_email_notificacao')}
                placeholder="admin@exemplo.com"
                className="surface-input w-full rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
              />
            </div>
            {errors.admin_email_notificacao && (
              <p className="ml-1 text-[10px] font-bold text-red-500">
                {errors.admin_email_notificacao.message as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-1.5">
            <label className="mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              Texto de Prazo de Retorno
            </label>
            <div className="group relative">
              <Clock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <input
                {...register('prazo_retorno_texto')}
                placeholder="Ex: Retornamos em até 1 dia útil"
                className="surface-input w-full rounded-xl pl-11 pr-4 py-2.5 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
              />
            </div>
            {errors.prazo_retorno_texto && (
              <p className="ml-1 text-[10px] font-bold text-red-500">
                {errors.prazo_retorno_texto.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="mb-1.5 block px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-70">
              Template da Mensagem
            </label>
            <div className="group relative">
              <MessageSquare className="absolute left-3.5 top-4 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-accent" />
              <textarea
                {...register('whatsapp_mensagem')}
                rows={8}
                placeholder="Olá! Tenho interesse..."
                className="surface-input w-full resize-none rounded-xl pl-11 pr-4 py-3 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="surface-muted mt-2 space-y-2 rounded-xl p-3">
              <p className="flex items-center gap-1.5 text-[9px] font-black uppercase text-muted-foreground">
                <Info className="h-3 w-3" /> Variáveis Disponíveis
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  '{nome_empresa}',
                  '{nome_responsavel}',
                  '{email}',
                  '{telefone}',
                  '{cargo_vaga}',
                  '{cidade}',
                  '{mensagem}',
                ].map((variable) => (
                  <code
                    key={variable}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-bold text-accent"
                  >
                    {variable}
                  </code>
                ))}
              </div>
            </div>
            {errors.whatsapp_mensagem && (
              <p className="ml-1 text-[10px] font-bold text-red-500">
                {errors.whatsapp_mensagem.message as string}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-primary opacity-70">
          <Eye className="h-4 w-4" /> Preview em Tempo Real
        </h3>
        <div className="relative overflow-hidden rounded-4xl border border-green-200 bg-green-50/50 p-6 dark:border-green-800/30 dark:bg-green-900/10">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-green-500/5 blur-3xl" />
          <div className="relative">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400">
              Mensagem no WhatsApp:
            </p>
            <div className="surface-card rounded-2xl border-green-100 p-5 dark:border-green-800/20">
              <p className="whitespace-pre-wrap text-sm font-medium leading-relaxed text-primary">
                {previewMessage || 'Escreva seu template acima...'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-primary px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvar Configurações
        </button>
      </div>
    </form>
  )
}
