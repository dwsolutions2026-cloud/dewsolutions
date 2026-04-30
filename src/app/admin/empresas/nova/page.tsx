'use client'

import { useActionState, useEffect } from 'react'
import { createEmpresaAction } from '@/app/actions/admin'
import { 
  Building2, 
  Mail, 
  Lock, 
  Globe, 
  MapPin, 
  ArrowLeft, 
  Save, 
  Loader2,
  FileBadge2,
  Briefcase,
  AlertCircle
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

export default function NovaEmpresaPage() {
  const router = useRouter()
  const [state, formAction, pending] = useActionState(
    async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await createEmpresaAction(formData)
      return (result as any as ActionState) || { error: null, success: false }
    },
    initialState
  )

  useEffect(() => {
    if (state.success) {
      toast.success('Empresa cadastrada com sucesso!')
      router.push('/admin/empresas')
      router.refresh()
    }
  }, [state.success, router])

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium text-sm"
  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 mb-1.5 block opacity-70"

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/admin/empresas" 
            className="flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors font-bold text-xs mb-3"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para Empresas
          </Link>
          <h1 className="text-2xl font-black text-primary tracking-tight">Nova Empresa</h1>
          <p className="text-muted-foreground text-sm font-medium">Cadastre uma nova empresa parceira no sistema.</p>
        </div>
      </div>

      <Form action={formAction} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna 1: Dados de Acesso */}
        <div className="lg:col-span-1">
          <div className="bg-primary rounded-[2rem] p-6 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <h2 className="text-base font-bold mb-6 flex items-center gap-2">
              <Lock className="w-4 h-4 text-accent" /> Acesso
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/50 px-1">E-mail Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl outline-none focus:bg-white/20 focus:border-white/40 transition-all font-medium text-sm placeholder:text-white/20"
                    placeholder="empresa@exemplo.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-white/50 px-1">Senha Provisória</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-11 pr-4 py-2.5 bg-white/10 border border-white/20 rounded-xl outline-none focus:bg-white/20 focus:border-white/40 transition-all font-medium text-sm placeholder:text-white/20"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna 2 & 3: Dados Cadastrais */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-[2.5rem] border border-border p-8 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className={labelClass}>Razão Social</label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input name="nome" required className={inputClass} placeholder="Nome da Empresa" />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>CNPJ</label>
                <div className="relative group">
                  <FileBadge2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input name="cnpj" required className={inputClass} placeholder="00.000.000/0000-00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Setor</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input name="setor" className={inputClass} placeholder="Ex: Tecnologia" />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Site</label>
                <div className="relative group">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input name="site" type="url" className={inputClass} placeholder="https://..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>Cidade</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                  <input name="cidade" required className={inputClass} />
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelClass}>UF</label>
                <input name="estado" required maxLength={2} className="w-full px-4 py-2.5 rounded-xl border border-border bg-card focus:ring-2 focus:ring-accent outline-none font-bold text-center uppercase shadow-sm text-sm" placeholder="UF" />
              </div>
            </div>

            {state.error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3.5 bg-accent text-accent-foreground rounded-xl font-black text-sm shadow-lg shadow-accent/20 flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {pending ? 'Processando...' : 'Cadastrar Empresa'}
            </button>
          </div>
        </div>
      </Form>
    </div>
  )
}
