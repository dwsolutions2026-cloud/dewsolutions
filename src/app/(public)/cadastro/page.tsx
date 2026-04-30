'use client'

import { useActionState } from 'react'
import { registerCandidateAction } from '@/app/actions/auth'
import { User, Mail, Lock, Loader2, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false
}

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await registerCandidateAction(formData)
      return (result as ActionState) || { error: null, success: false }
    },
    initialState
  )

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium"

  if (state.success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background animate-in fade-in zoom-in duration-500">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-xl shadow-green-200">
            <ShieldCheck className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-black text-primary tracking-tight">Verifique seu e-mail</h1>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed">
              Enviamos um link de confirmação para o seu e-mail. Por favor, valide sua conta para continuar.
            </p>
          </div>
          <Link 
            href="/login" 
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-4 rounded-2xl font-black text-lg hover:scale-105 transition-all"
          >
            Ir para o Login <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] py-20 flex items-center justify-center p-6 bg-background animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo width={180} height={56} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-primary tracking-tight">Crie sua conta</h1>
            <p className="text-muted-foreground font-medium">Junte-se à maior rede de talentos e oportunidades.</p>
          </div>
        </div>

        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5">
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Nome Completo</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  name="nome"
                  required
                  className={inputClass}
                  placeholder="Seu nome"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  name="email"
                  type="email"
                  required
                  className={inputClass}
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-muted-foreground uppercase tracking-widest px-2">Sua Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            {state.error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-bold text-xs">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-5 bg-accent text-accent-foreground rounded-2xl font-black text-lg shadow-xl shadow-accent/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
              {pending ? 'Criando Conta...' : 'Começar Agora'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center space-y-4">
            <p className="text-sm text-muted-foreground font-medium">Já possui uma conta?</p>
            <Link 
              href="/login" 
              className="text-primary font-black uppercase tracking-widest text-xs hover:underline block"
            >
              Fazer login agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
