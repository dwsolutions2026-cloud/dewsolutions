'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CurriculoJsonSchema } from '@/lib/schemas'
import { updateCurriculoJsonAction } from '@/app/actions/candidato'
import { 
  Save, Plus, Trash2, Briefcase, GraduationCap, 
  Languages, FileText, Upload, CheckCircle 
} from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

type CurriculoData = z.infer<typeof CurriculoJsonSchema>

export function CurriculoBuilderClient({ initialData, userId }: { initialData: any, userId: string }) {
  const [activeTab, setActiveTab] = useState<'form' | 'pdf'>('form')
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Form setup
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CurriculoData>({
    resolver: zodResolver(CurriculoJsonSchema),
    defaultValues: initialData || {
      experiencias: [],
      formacoes: [],
      idiomas: [],
    },
  })

  // Dynamic fields
  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experiencias' })
  const { fields: formFields, append: appendForm, remove: removeForm } = useFieldArray({ control, name: 'formacoes' })
  const { fields: langFields, append: appendLang, remove: removeLang } = useFieldArray({ control, name: 'idiomas' })

  const onSubmit = async (data: CurriculoData) => {
    setMsg(null)
    const result = await updateCurriculoJsonAction(data)
    if (result.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Currículo salvo com sucesso!' })
      router.push('/candidato/minha-area')
    }
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      alert('Apenas arquivos PDF são permitidos.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('O arquivo não pode exceder 5MB.')
      return
    }

    setUploading(true)
    const filePath = `${userId}.pdf`
    
    const { error: uploadError } = await supabase.storage
      .from('curriculos')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      alert('Erro no upload: ' + uploadError.message)
    } else {
      // Update DB
      await supabase.from('candidatos').update({ curriculo_url: filePath }).eq('user_id', userId)
      setMsg({ type: 'success', text: 'PDF enviado com sucesso!' })
      router.refresh()
    }
    setUploading(false)
  }

  return (
    <div className="space-y-6">
      {msg && (
        <div className={`p-4 rounded-lg text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}

      {/* Tabs Selection */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab('form')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'form' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4" /> Construtor Online
          </div>
        </button>
        <button 
          onClick={() => setActiveTab('pdf')}
          className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'pdf' ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-primary'}`}
        >
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4" /> Anexar PDF
          </div>
        </button>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
          {/* Objective */}
          <section className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-accent" /> Objetivo Profissional
            </h3>
            <textarea 
              {...register('objetivo')}
              placeholder="Descreva brevemente seu objetivo (máx 300 caracteres)..."
              className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground h-24 focus:ring-1 focus:ring-accent outline-none"
            />
            {errors.objetivo && <p className="text-xs text-red-500 mt-1">{errors.objetivo.message}</p>}
          </section>

          {/* Experience */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-accent" /> Experiências Profissionais
              </h3>
              <button 
                type="button" 
                onClick={() => appendExp({ cargo: '', empresa: '', periodo: '', descricao: '' })}
                className="text-accent hover:text-accent/80 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
            
            <div className="space-y-6">
              {expFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg relative bg-muted/30">
                  <button 
                    type="button" 
                    onClick={() => removeExp(index)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Cargo</label>
                      <input {...register(`experiencias.${index}.cargo`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Empresa</label>
                      <input {...register(`experiencias.${index}.empresa`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Período (ex: Jan/2020 - Atual)</label>
                      <input {...register(`experiencias.${index}.periodo`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Descrição das atividades</label>
                      <textarea {...register(`experiencias.${index}.descricao`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm h-20" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section className="bg-card border border-border rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-accent" /> Formação Acadêmica
              </h3>
              <button 
                type="button" 
                onClick={() => appendForm({ curso: '', instituicao: '', periodo: '', status: '' })}
                className="text-accent hover:text-accent/80 text-sm font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
            
            <div className="space-y-6">
              {formFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-border rounded-lg relative bg-muted/30">
                  <button type="button" onClick={() => removeForm(index)} className="absolute top-4 right-4 text-muted-foreground hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Curso</label>
                      <input {...register(`formacoes.${index}.curso`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Instituição</label>
                      <input {...register(`formacoes.${index}.instituicao`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Período</label>
                      <input {...register(`formacoes.${index}.periodo`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground mb-1 uppercase">Status</label>
                      <select {...register(`formacoes.${index}.status`)} className="w-full rounded border border-border px-3 py-2 bg-card text-sm">
                        <option value="Concluído">Concluído</option>
                        <option value="Cursando">Cursando</option>
                        <option value="Incompleto">Incompleto</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-accent" /> Habilidades
              </h3>
              <textarea 
                {...register('habilidades')}
                placeholder="Ex: Excel Avançado, Gestão de Equipes, CNH B..."
                className="w-full rounded-md border border-border px-3 py-2 bg-card text-foreground h-32 focus:ring-1 focus:ring-accent outline-none"
              />
            </section>

            <section className="bg-card border border-border rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Languages className="w-5 h-5 text-accent" /> Idiomas
                </h3>
                <button type="button" onClick={() => appendLang({ idioma: '', nivel: '' })} className="text-accent hover:text-accent/80 text-sm font-bold flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              <div className="space-y-3">
                {langFields.map((field, index) => (
                  <div key={field.id} className="flex gap-2 items-center">
                    <input {...register(`idiomas.${index}.idioma`)} placeholder="Idioma" className="flex-1 rounded border border-border px-3 py-2 bg-card text-sm" />
                    <select {...register(`idiomas.${index}.nivel`)} className="w-32 rounded border border-border px-3 py-2 bg-card text-sm">
                      <option value="Básico">Básico</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                      <option value="Fluente">Fluente</option>
                    </select>
                    <button type="button" onClick={() => removeLang(index)} className="text-muted-foreground hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-lg font-bold transition-all disabled:opacity-70"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? 'Salvando...' : 'Salvar Currículo'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-card border border-border rounded-xl p-8 text-center animate-in fade-in duration-500">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">Upload de PDF</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            Se você já tem um currículo pronto em PDF, pode enviá-lo aqui. 
            Ele substituirá qualquer PDF enviado anteriormente.
          </p>
          
          <label className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-bold cursor-pointer hover:bg-primary/90 transition-all">
            <Upload className="w-5 h-5" />
            {uploading ? 'Enviando...' : 'Selecionar Arquivo PDF'}
            <input 
              type="file" 
              accept="application/pdf" 
              className="hidden" 
              onChange={handlePdfUpload}
              disabled={uploading}
            />
          </label>
          <p className="text-xs text-muted-foreground mt-4">Tamanho máximo: 5MB</p>
        </div>
      )}
    </div>
  )
}

function Edit2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
    </svg>
  )
}
