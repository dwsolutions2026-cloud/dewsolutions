'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { CurriculoJsonSchema } from '@/lib/schemas'
import { updateCurriculoJsonAction } from '@/app/actions/candidato'
import { toast } from 'react-hot-toast'
import * as z from 'zod'

type CurriculoData = z.infer<typeof CurriculoJsonSchema>

interface Props {
  initialData?: any
}

export function CurriculoBuilderClient({ initialData }: Props) {
  const [isExpanded, setIsExpanded] = useState({
    experiencias: true,
    formacoes: true,
    idiomas: true,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurriculoData>({
    resolver: zodResolver(CurriculoJsonSchema),
    defaultValues: {
      objetivo: initialData?.objetivo || '',
      linkedin: initialData?.linkedin || '',
      github: initialData?.github || '',
      habilidades: initialData?.habilidades || '',
      experiencias: initialData?.experiencias || [],
      formacoes: initialData?.formacoes || [],
      idiomas: initialData?.idiomas || [],
    },
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control,
    name: 'experiencias',
  })

  const { fields: formFields, append: appendForm, remove: removeForm } = useFieldArray({
    control,
    name: 'formacoes',
  })

  const { fields: idiomaFields, append: appendIdioma, remove: removeIdioma } = useFieldArray({
    control,
    name: 'idiomas',
  })

  const onSubmit = async (data: CurriculoData) => {
    const result = await updateCurriculoJsonAction(data)
    if (result.success) {
      toast.success('Currículo salvo com sucesso!')
    } else {
      toast.error(result.error || 'Erro ao salvar currículo')
    }
  }

  const toggleSection = (section: keyof typeof isExpanded) => {
    setIsExpanded(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
      
      {/* Informações Básicas / Links */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <div className="w-2 h-8 bg-accent rounded-full" /> Links e Redes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">LinkedIn</label>
            <input
              {...register('linkedin')}
              placeholder="https://linkedin.com/in/seu-perfil"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
            {errors.linkedin && <p className="text-xs text-red-500 font-medium">{errors.linkedin.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">GitHub</label>
            <input
              {...register('github')}
              placeholder="https://github.com/seu-usuario"
              className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
            {errors.github && <p className="text-xs text-red-500 font-medium">{errors.github.message}</p>}
          </div>
        </div>
      </div>

      {/* Objetivo Profissional */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <div className="w-2 h-8 bg-accent rounded-full" /> Objetivo Profissional
        </h2>
        <textarea
          {...register('objetivo')}
          placeholder="Descreva brevemente seus objetivos profissionais..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
        />
        {errors.objetivo && <p className="text-xs text-red-500 font-medium">{errors.objetivo.message}</p>}
      </div>

      {/* Experiências */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('experiencias')}
          className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-2 h-8 bg-accent rounded-full" /> Experiências Profissionais
          </h2>
          {isExpanded.experiencias ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isExpanded.experiencias && (
          <div className="p-6 md:p-8 border-t border-border space-y-8 bg-muted/5">
            {expFields.map((field, index) => (
              <div key={field.id} className="relative p-6 bg-card rounded-2xl border border-border shadow-sm animate-in fade-in zoom-in duration-300">
                <button
                  type="button"
                  onClick={() => removeExp(index)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Cargo</label>
                    <input
                      {...register(`experiencias.${index}.cargo`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Empresa</label>
                    <input
                      {...register(`experiencias.${index}.empresa`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Período</label>
                    <input
                      {...register(`experiencias.${index}.periodo`)}
                      placeholder="Ex: Jan 2020 - Mar 2023"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Descrição das Atividades</label>
                    <textarea
                      {...register(`experiencias.${index}.descricao`)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendExp({ cargo: '', empresa: '', periodo: '', descricao: '' })}
              className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Plus className="w-5 h-5" /> Adicionar Experiência
            </button>
          </div>
        )}
      </div>

      {/* Formações */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('formacoes')}
          className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-2 h-8 bg-accent rounded-full" /> Formação Acadêmica
          </h2>
          {isExpanded.formacoes ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isExpanded.formacoes && (
          <div className="p-6 md:p-8 border-t border-border space-y-6 bg-muted/5">
            {formFields.map((field, index) => (
              <div key={field.id} className="relative p-6 bg-card rounded-2xl border border-border shadow-sm">
                <button
                  type="button"
                  onClick={() => removeForm(index)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Curso</label>
                    <input
                      {...register(`formacoes.${index}.curso`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Instituição</label>
                    <input
                      {...register(`formacoes.${index}.instituicao`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Período</label>
                    <input
                      {...register(`formacoes.${index}.periodo`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase">Status</label>
                    <select
                      {...register(`formacoes.${index}.status`)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none appearance-none"
                    >
                      <option value="Concluído">Concluído</option>
                      <option value="Cursando">Cursando</option>
                      <option value="Trancado">Trancado</option>
                      <option value="Incompleto">Incompleto</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendForm({ curso: '', instituicao: '', periodo: '', status: 'Concluído' })}
              className="w-full py-4 border-2 border-dashed border-border rounded-2xl text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Plus className="w-5 h-5" /> Adicionar Formação
            </button>
          </div>
        )}
      </div>

      {/* Idiomas */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('idiomas')}
          className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <div className="w-2 h-8 bg-accent rounded-full" /> Idiomas
          </h2>
          {isExpanded.idiomas ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        {isExpanded.idiomas && (
          <div className="p-6 md:p-8 border-t border-border space-y-4 bg-muted/5">
            {idiomaFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-4 bg-card p-4 rounded-xl border border-border">
                <div className="flex-1">
                  <input
                    {...register(`idiomas.${index}.idioma`)}
                    placeholder="Ex: Inglês"
                    className="w-full bg-transparent border-none outline-none font-bold text-primary"
                  />
                </div>
                <div className="w-48">
                  <select
                    {...register(`idiomas.${index}.nivel`)}
                    className="w-full bg-transparent border-none outline-none text-muted-foreground font-medium appearance-none"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => removeIdioma(index)}
                  className="p-2 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendIdioma({ idioma: '', nivel: 'Básico' })}
              className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:text-accent hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2 font-bold"
            >
              <Plus className="w-4 h-4" /> Adicionar Idioma
            </button>
          </div>
        )}
      </div>

      {/* Habilidades */}
      <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
          <div className="w-2 h-8 bg-accent rounded-full" /> Habilidades
        </h2>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Separe por vírgulas (Ex: React, Node.js, Liderança)</p>
          <textarea
            {...register('habilidades')}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-border bg-muted/20 focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
          />
        </div>
      </div>

      {/* Botão Salvar Fixo */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-accent text-accent-foreground rounded-2xl font-black text-lg shadow-2xl shadow-accent/40 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
        >
          {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
          {isSubmitting ? 'Salvando...' : 'Salvar Currículo'}
        </button>
      </div>

    </form>
  )
}
