'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Mail, Lock, Loader2, ArrowRight, AlertCircle } from 'lucide-react'
import { loginAction } from '@/app/actions/auth'
import { Logo } from '@/components/Logo'

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await loginAction(formData)
      return (result as ActionState) || { error: null, success: false }
    },
    initialState
  )

  const inputClass =
    'surface-input w-full rounded-sm pl-11 pr-4 py-3 text-sm font-medium shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent sm:rounded-sm sm:pl-12 sm:py-4 sm:text-base'

  return (
    <div className="animate-in fade-in flex min-h-[calc(100vh-64px)] items-center justify-center bg-background px-4 pb-6 pt-32 duration-700 sm:px-6 sm:pb-10 sm:pt-36">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="space-y-4 text-center sm:space-y-6">
          <div className="flex justify-center">
            <Logo width={180} height={54} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              Bem-vindo de volta
            </h1>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Acesse sua conta para gerenciar suas vagas ou candidaturas.
            </p>
          </div>
        </div>

        <div className="surface-card rounded-sm p-6 sm:rounded-[2.5rem] sm:p-10">
          <form action={formAction} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                E-mail
              </label>
              <div className="group relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
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
              <div className="flex items-center justify-between px-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  title="Em breve"
                  className="text-[8px] font-black uppercase tracking-widest text-accent hover:underline sm:text-[10px]"
                >
                  Esqueceu?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
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
              <div className="animate-in shake flex items-center gap-3 rounded-sm border border-red-200 bg-red-50 p-3 text-red-600 duration-500 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300 sm:rounded-sm sm:p-4">
                <AlertCircle className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />
                <p className="text-xs font-bold sm:text-sm">{state.error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="gold-gradient flex w-full items-center justify-center gap-2 rounded-sm py-3 text-base font-black text-black shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 sm:gap-3 sm:rounded-sm sm:py-5 sm:text-lg"
            >
              {pending ? (
                <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
              ) : (
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
              {pending ? 'Entrando...' : 'Acessar Conta'}
            </button>
          </form>

          <div className="mt-8 space-y-4 border-t border-border/70 pt-6 text-center sm:mt-10 sm:pt-8">
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Ainda não tem uma conta?
            </p>
            <Link
              href="/cadastro"
              className="block text-[9px] font-black uppercase tracking-widest text-accent hover:underline sm:text-xs"
            >
              Criar conta gratuitamente
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
