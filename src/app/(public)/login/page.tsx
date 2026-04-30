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

  const inputClass = "w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-card focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all shadow-sm font-medium"

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-background animate-in fade-in duration-700">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <Logo width={180} height={56} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-primary tracking-tight">Bem-vindo de volta</h1>
            <p className="text-muted-foreground font-medium">Acesse sua conta para gerenciar suas vagas ou candidaturas.</p>
          </div>
        </div>

        <div className="bg-card p-10 rounded-[2.5rem] border border-border shadow-xl shadow-primary/5">
          <form action={formAction} className="space-y-6">
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
              <div className="flex justify-between items-center px-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest">Senha</label>
                <Link href="/recuperar-senha" title="Em breve" className="text-[10px] font-black text-accent uppercase tracking-widest hover:underline">Esqueceu a senha?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
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
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in shake duration-500">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="font-bold text-xs">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full py-5 bg-primary text-primary-foreground rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : <ArrowRight className="w-6 h-6" />}
              {pending ? 'Entrando...' : 'Acessar Conta'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border text-center space-y-4">
            <p className="text-sm text-muted-foreground font-medium">Ainda não tem uma conta?</p>
            <Link 
              href="/cadastro" 
              className="text-accent font-black uppercase tracking-widest text-xs hover:underline block"
            >
              Criar conta gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
