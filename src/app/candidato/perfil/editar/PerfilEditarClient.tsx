'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PerfilSchema } from '@/lib/schemas'
import { updatePerfilAction } from '@/app/actions/candidato'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, UserCircle2, Mail, Phone, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'
import * as z from 'zod'

type PerfilData = z.infer<typeof PerfilSchema>

interface Props {
  initialData: any
}

export function PerfilEditarClient({ initialData }: Props) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilData>({
    resolver: zodResolver(PerfilSchema),
    defaultValues: {
      nome: initialData.nome,
      telefone: initialData.telefone || '',
      cidade: initialData.cidade || '',
      estado: initialData.estado || '',
      avatar_url: initialData.avatar_url,
    },
  })

  const onSubmit = async (data: PerfilData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string)
      }
    })

    const result = await updatePerfilAction(formData)
    if (result.success) {
      toast.success('Perfil atualizado com sucesso!')
      router.push('/candidato/perfil')
      router.refresh()
    } else {
      toast.error(result.error || 'Erro ao atualizar perfil')
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-sm border border-border bg-muted/20 focus:bg-card focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all shadow-sm font-semibold text-primary"
  const labelClass = "text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] px-4 mb-2 flex items-center gap-2"

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link 
            href="/candidato/perfil" 
            className="group flex items-center gap-2 text-muted-foreground hover:text-accent transition-all font-bold text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" /> 
            VOLTAR PARA VISUALIZAÇÃO
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-accent rounded-full" />
            <h1 className="text-4xl font-black text-primary tracking-tight">Editar Perfil</h1>
          </div>
          <p className="text-muted-foreground font-medium max-w-md">Refine suas informações para garantir que os recrutadores tenham os dados mais precisos.</p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-accent/5 rounded-full border border-accent/10">
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-black text-accent uppercase tracking-widest">Seu perfil está visível</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-secondary rounded-sm border-none p-8 md:p-14 shadow-sm space-y-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
        
        <div className="grid grid-cols-1 md:grid-cols-6 gap-x-8 gap-y-10 relative z-10">
          {/* Nome */}
          <div className="md:col-span-6 space-y-2">
            <label className={labelClass}>Nome Completo</label>
            <div className="relative group">
              <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
              <input {...register('nome')} className={inputClass} placeholder="Ex: João da Silva" />
            </div>
            {errors.nome && <p className="text-[10px] text-red-500 font-bold px-4 mt-1">{errors.nome.message}</p>}
          </div>

          {/* E-mail (read-only) */}
          <div className="md:col-span-3 space-y-2">
            <label className={labelClass}>E-mail de Acesso <span className="text-[9px] lowercase font-medium opacity-50">(Não alterável)</span></label>
            <div className="relative opacity-50 cursor-not-allowed">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30" />
              <input defaultValue={initialData.email} readOnly className={inputClass + " cursor-not-allowed"} />
            </div>
          </div>

          {/* Telefone */}
          <div className="md:col-span-3 space-y-2">
            <label className={labelClass}>Telefone / WhatsApp</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
              <input {...register('telefone')} className={inputClass} placeholder="(41) 99999-9999" />
            </div>
            {errors.telefone && <p className="text-[10px] text-red-500 font-bold px-4 mt-1">{errors.telefone.message}</p>}
          </div>

          {/* Cidade */}
          <div className="md:col-span-4 space-y-2">
            <label className={labelClass}>Cidade</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/30 group-focus-within:text-accent transition-colors" />
              <input {...register('cidade')} className={inputClass} placeholder="Sua cidade atual" />
            </div>
            {errors.cidade && <p className="text-[10px] text-red-500 font-bold px-4 mt-1">{errors.cidade.message}</p>}
          </div>

          {/* Estado */}
          <div className="md:col-span-2 space-y-2">
            <label className={labelClass}>UF</label>
            <div className="relative group">
              <input 
                {...register('estado')} 
                maxLength={2} 
                className="w-full px-4 py-4 rounded-sm border border-border bg-muted/20 focus:bg-card focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all shadow-sm font-black text-center uppercase text-primary" 
                placeholder="UF" 
              />
            </div>
            {errors.estado && <p className="text-[10px] text-red-500 font-bold px-4 mt-1 text-center">{errors.estado.message}</p>}
          </div>
        </div>

        <div className="pt-10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[11px] text-muted-foreground font-medium italic">Seus dados serão atualizados em todos os seus processos ativos.</p>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary text-primary-foreground px-12 py-5 rounded-sm font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {isSubmitting ? 'Salvando...' : 'Confirmar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}

