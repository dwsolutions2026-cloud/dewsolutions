'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { VagaSchema } from '@/lib/schemas'
import { Save, Loader2 } from 'lucide-react'
import * as z from 'zod'

type VagaData = z.infer<typeof VagaSchema>

interface Props {
  initialData?: any
  empresas: { id: string; nome: string }[]
  onSubmit: (data: FormData) => Promise<any>
}

export function VagaForm({ initialData, empresas, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VagaData>({
    resolver: zodResolver(VagaSchema),
    defaultValues: initialData || {
      quantidade_vagas: 1,
      exibir_salario: false,
    },
  })

  const handleFormSubmit = async (data: VagaData) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString())
      }
    })
    await onSubmit(formData)
  }

  const inputClass = "w-full px-3 sm:px-3.5 py-2 sm:py-2 rounded-lg sm:rounded-xl text-sm border border-border bg-muted/10 focus:ring-2 focus:ring-accent outline-none transition-all font-medium"
  const labelClass = "text-[8px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest px-1 opacity-70"

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 sm:space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        {/* Empresa */}
        <div className="space-y-1.5">
          <label className={labelClass}>Empresa Parceira</label>
          <select
            {...register('empresa_id')}
            className={inputClass}
            disabled={!!initialData}
          >
            <option value="">Selecione uma empresa</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.nome}</option>
            ))}
          </select>
          {errors.empresa_id && <p className="text-[8px] sm:text-[10px] text-red-500 font-bold">{errors.empresa_id.message}</p>}
        </div>

        {/* Título */}
        <div className="space-y-1.5">
          <label className={labelClass}>Título da Vaga</label>
          <input
            {...register('titulo')}
            className={inputClass}
            placeholder="Ex: Desenvolvedor Full Stack"
          />
          {errors.titulo && <p className="text-[8px] sm:text-[10px] text-red-500 font-bold">{errors.titulo.message}</p>}
        </div>

        {/* Área e Modalidade */}
        <div className="space-y-1.5">
          <label className={labelClass}>Área de Atuação</label>
          <input
            {...register('area')}
            className={inputClass}
            placeholder="Ex: Tecnologia, Administrativo"
          />
          {errors.area && <p className="text-[8px] sm:text-[10px] text-red-500 font-bold">{errors.area.message}</p>}
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Modalidade</label>
          <select {...register('modalidade')} className={inputClass}>
            <option value="Presencial">Presencial</option>
            <option value="Remoto">Remoto</option>
            <option value="Híbrido">Híbrido</option>
          </select>
        </div>

        {/* Localização */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="col-span-2 space-y-1.5">
            <label className={labelClass}>Cidade</label>
            <input {...register('cidade')} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>UF</label>
            <input {...register('estado')} maxLength={2} className={inputClass + " text-center uppercase"} />
          </div>
        </div>

        {/* Quantidade */}
        <div className="space-y-1.5">
          <label className={labelClass}>Qtd. de Vagas</label>
          <input
            type="number"
            {...register('quantidade_vagas', { valueAsNumber: true })}
            className={inputClass}
          />
        </div>

        {/* Salário */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div className="space-y-1.5">
            <label className={labelClass}>Salário Mín.</label>
            <input
              type="number"
              step="0.01"
              {...register('salario_min', { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Salário Máx.</label>
            <input
              type="number"
              step="0.01"
              {...register('salario_max', { valueAsNumber: true })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex items-center gap-2.5 pt-2 sm:pt-4">
          <input
            type="checkbox"
            id="exibir_salario"
            {...register('exibir_salario')}
            className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
          />
          <label htmlFor="exibir_salario" className="text-xs sm:text-sm font-bold text-primary cursor-pointer">Exibir salário na vaga?</label>
        </div>
      </div>

      {/* Descrição e Requisitos */}
      <div className="space-y-1.5">
        <label className={labelClass}>Descrição Detalhada</label>
        <textarea
          {...register('descricao')}
          rows={5}
          className={inputClass + " resize-none"}
          placeholder="Descreva as responsabilidades..."
        />
        {errors.descricao && <p className="text-[8px] sm:text-[10px] text-red-500 font-bold">{errors.descricao.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
        <div className="space-y-1.5">
          <label className={labelClass}>Requisitos</label>
          <textarea
            {...register('requisitos')}
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>
        <div className="space-y-1.5">
          <label className={labelClass}>Benefícios</label>
          <textarea
            {...register('beneficios')}
            rows={3}
            className={inputClass + " resize-none"}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 sm:pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-accent text-accent-foreground px-6 sm:px-8 py-2.5 rounded-lg sm:rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-spin" /> : <Save className="w-3.5 sm:w-4 h-3.5 sm:h-4" />}
          {initialData ? 'Atualizar Vaga' : 'Publicar Vaga'}
        </button>
      </div>
    </form>
  )
}
