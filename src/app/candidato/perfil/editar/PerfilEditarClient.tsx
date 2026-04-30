'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { PerfilSchema } from '@/lib/schemas'
import { updatePerfilAction } from '@/app/actions/candidato'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { Save, Loader2, ArrowLeft, UserCircle2, Mail, Phone, MapPin } from 'lucide-react'
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
      cidade: initialData.cidade,
      estado: initialData.estado,
    },
  })

  const onSubmit = async (data: PerfilData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string)
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

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium"
  const labelClass = "text-xs font-black text-muted-foreground uppercase tracking-[0.2em] px-2 mb-2 block"

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div>
        <Link 
          href="/candidato/perfil" 
          className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Cancelar e Voltar
        </Link>
        <h1 className="text-4xl font-black text-primary tracking-tight">Editar Meu Perfil</h1>
        <p className="text-muted-foreground text-lg font-medium">Mantenha seus dados atualizados para recrutadores.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-card rounded-[3rem] border border-border p-8 md:p-12 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Nome */}
          <div className="md:col-span-2 space-y-2">
            <label className={labelClass}>Nome Completo</label>
            <div className="relative group">
              <UserCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input {...register('nome')} className={inputClass} placeholder="Seu nome completo" />
            </div>
            {errors.nome && <p className="text-xs text-red-500 font-bold px-2">{errors.nome.message}</p>}
          </div>

          {/* E-mail (read-only usually) */}
          <div className="space-y-2">
            <label className={labelClass}>E-mail</label>
            <div className="relative opacity-60">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input defaultValue={initialData.email} readOnly className={inputClass} />
            </div>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <label className={labelClass}>Telefone / WhatsApp</label>
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input {...register('telefone')} className={inputClass} placeholder="(00) 00000-0000" />
            </div>
          </div>

          {/* Cidade */}
          <div className="space-y-2">
            <label className={labelClass}>Cidade</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input {...register('cidade')} className={inputClass} placeholder="Sua cidade" />
            </div>
            {errors.cidade && <p className="text-xs text-red-500 font-bold px-2">{errors.cidade.message}</p>}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <label className={labelClass}>Estado (UF)</label>
            <input {...register('estado')} maxLength={2} className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:ring-2 focus:ring-accent outline-none font-bold text-center uppercase shadow-sm" placeholder="UF" />
            {errors.estado && <p className="text-xs text-red-500 font-bold px-2">{errors.estado.message}</p>}
          </div>
        </div>

        <div className="pt-6 border-t border-border flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-accent text-accent-foreground px-12 py-4 rounded-2xl font-black text-lg shadow-xl shadow-accent/20 flex items-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
