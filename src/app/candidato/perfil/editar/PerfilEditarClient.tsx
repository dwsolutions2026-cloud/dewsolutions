'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { PerfilSchema } from '@/lib/schemas'
import { updatePerfilAction } from '@/app/actions/candidato'
import { Save } from 'lucide-react'

type PerfilData = z.infer<typeof PerfilSchema>

export function PerfilEditarClient({ initialData }: { initialData: any }) {
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PerfilData>({
    resolver: zodResolver(PerfilSchema),
    defaultValues: {
      nome: initialData.nome || '',
      telefone: initialData.telefone || '',
      cidade: initialData.cidade || '',
      estado: initialData.estado || '',
    },
  })

  const onSubmit = async (data: PerfilData) => {
    setMsg(null)
    const formData = new FormData()
    formData.append('nome', data.nome)
    if (data.telefone) formData.append('telefone', data.telefone)
    if (data.cidade) formData.append('cidade', data.cidade)
    if (data.estado) formData.append('estado', data.estado)

    const result = await updatePerfilAction(formData)
    if (result.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' })
      setTimeout(() => setMsg(null), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/50' : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary mb-1">Nome Completo *</label>
          <input 
            {...register('nome')} 
            className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" 
          />
          {errors.nome && <p className="text-xs text-red-500 mt-1">{errors.nome.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Telefone (WhatsApp)</label>
          <input 
            {...register('telefone')} 
            className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" 
          />
          {errors.telefone && <p className="text-xs text-red-500 mt-1">{errors.telefone.message}</p>}
        </div>

        <div className="hidden md:block"></div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Cidade</label>
          <input 
            {...register('cidade')} 
            className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" 
          />
          {errors.cidade && <p className="text-xs text-red-500 mt-1">{errors.cidade.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary mb-1">Estado (UF)</label>
          <input 
            {...register('estado')} 
            maxLength={2}
            className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground uppercase focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" 
          />
          {errors.estado && <p className="text-xs text-red-500 mt-1">{errors.estado.message}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-end">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  )
}
