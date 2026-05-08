'use client'

import { useActionState, useEffect } from 'react'
import { updateEmpresaAction } from '@/app/actions/admin'
import { 
  Building2, 
  Globe, 
  MapPin, 
  ArrowLeft, 
  Save, 
  Loader2,
  FileBadge2,
  Briefcase
} from 'lucide-react'
import Link from 'next/link'
import Form from 'next/form'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false
}

interface Props {
  empresa: any
}

export default function EmpresaEditarClient({ empresa }: Props) {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await updateEmpresaAction(empresa.id, formData)
      return (result as any as ActionState) || { error: null, success: false }
    },
    initialState
  )

  useEffect(() => {
    if (state.success) {
      toast.success('Dados da empresa atualizados!')
      router.push(`/admin/empresas/${empresa.slug || empresa.id}`)
      router.refresh()
    }
    if (state.error) {
      toast.error(state.error)
    }
  }, [state, router, empresa.id, empresa.slug])

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-sm border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium text-sm"
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 mb-1.5 block opacity-70"

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href={`/admin/empresas/${empresa.slug || empresa.id}`}
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-3"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para Detalhes
          </Link>
          <h1 className="text-2xl font-black text-primary tracking-tight">Editar Empresa</h1>
          <p className="text-muted-foreground text-sm font-medium">Atualize as informações cadastrais da {empresa.nome}.</p>
        </div>
      </div>

      <Form action={formAction} className="bg-secondary rounded-[2rem] border-none p-8 shadow-sm space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>Razão Social</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input name="nome" defaultValue={empresa.nome} required className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>CNPJ</label>
            <div className="relative group">
              <FileBadge2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input name="cnpj" defaultValue={empresa.cnpj} required className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Setor de Atuação</label>
            <div className="relative group">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input name="setor" defaultValue={empresa.setor} className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Site Institucional</label>
            <div className="relative group">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input name="site" type="url" defaultValue={empresa.site} className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Cidade</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
              <input name="cidade" defaultValue={empresa.cidade} required className={inputClass} />
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClass}>Estado (UF)</label>
            <input name="estado" defaultValue={empresa.estado} required maxLength={2} className="w-full px-4 py-2.5 rounded-sm border border-border bg-card focus:ring-2 focus:ring-accent outline-none font-bold text-center uppercase shadow-sm text-sm" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={pending}
            className="px-10 py-3 bg-accent text-accent-foreground rounded-sm font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {pending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </Form>
    </div>
  )
}
