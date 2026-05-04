'use client'

import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
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

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await loginAction(formData)
      return (result as ActionState) || { error: null, success: false }
    },
    initialState
  )

  const inputClass = "w-full pl-11 sm:pl-12 pr-4 py-3 sm:py-4 rounded-lg sm:rounded-2xl text-sm sm:text-base border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium"

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-6 bg-background animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="text-center space-y-4 sm:space-y-6">
          <div className="flex justify-center">
            <Logo scale={1} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">Bem-vindo de volta</h1>
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Acesse sua conta para gerenciar suas vagas ou candidaturas.</p>
          </div>
        </div>

        <div className="bg-card p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border border-border shadow-xl shadow-primary/5">
          <form action={formAction} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest px-2">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
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
              <div className="flex justify-between items-center px-2">
                <label className="text-[9px] sm:text-xs font-black text-muted-foreground uppercase tracking-widest">Senha</label>
                <Link href="/recuperar-senha" title="Em breve" className="text-[8px] sm:text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Esqueceu?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                <input
                  name="password"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {state.error && (
              <div className="p-3 sm:p-4 bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/20 rounded-lg sm:rounded-xl flex items-center gap-3 text-red-600 dark:text-red-500 animate-in shake duration-500">
                <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 shrink-0" />
                <p className="font-bold text-xs sm:text-sm">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-3 sm:py-5 bg-primary text-primary-foreground rounded-lg sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 sm:gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-5 sm:w-6 h-5 sm:h-6 animate-spin" /> : <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6" />}
              {pending ? 'Entrando...' : 'Acessar Conta'}
            </button>
          </form>

          <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border text-center space-y-4">
            <p className="text-xs sm:text-sm text-muted-foreground font-medium">Ainda não tem uma conta?</p>
            <Link 
              href="/cadastro" 
              className="text-accent font-black uppercase tracking-widest text-[9px] sm:text-xs hover:underline block"
            >
              Criar conta gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
