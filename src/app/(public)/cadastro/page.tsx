'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import {
  User,
  Mail,
  Lock,
  Loader2,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react'
import { registerCandidateAction } from '@/app/actions/auth'
import { Logo } from '@/components/Logo'

type ActionState = {
  error: string | null
  success: boolean
}

const initialState: ActionState = {
  error: null,
  success: false,
}

export default function CadastroPage() {
  const [state, formAction, pending] = useActionState(
    async (_prevState: ActionState, formData: FormData): Promise<ActionState> => {
      const result = await registerCandidateAction(formData)
      return (result as ActionState) || { error: null, success: false }
    },
    initialState
  )

  const inputClass =
    'surface-input w-full rounded-sm pl-11 pr-4 py-3 text-sm font-medium shadow-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent sm:rounded-sm sm:pl-12 sm:py-4 sm:text-base'

  if (state.success) {
    return (
      <div className="animate-in fade-in zoom-in flex min-h-[calc(100vh-64px)] items-center justify-center bg-background px-4 pb-6 pt-32 duration-500 sm:px-6 sm:pb-10 sm:pt-36">
        <div className="w-full max-w-md space-y-6 text-center sm:space-y-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-sm bg-green-100 text-green-600 shadow-xl shadow-green-200 dark:bg-green-900/25 dark:text-green-300 dark:shadow-green-900/20 sm:h-24 sm:w-24 sm:rounded-[2.5rem]">
            <ShieldCheck className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-2xl font-black tracking-tight text-primary sm:text-4xl">
              Verifique seu e-mail
            </h1>
            <p className="text-xs font-medium leading-relaxed text-muted-foreground sm:text-sm md:text-base">
              Enviamos um link de confirmação para o seu e-mail. Por favor,
              valide sua conta para continuar.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-3 text-base font-black text-primary-foreground transition-all hover:scale-105 sm:gap-3 sm:rounded-sm sm:px-10 sm:py-4 sm:text-lg"
          >
            Ir para o Login <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-in fade-in flex min-h-[calc(100vh-64px)] items-center justify-center bg-background px-4 pb-8 pt-32 duration-700 sm:px-6 sm:pb-12 sm:pt-36">
      <div className="w-full max-w-md space-y-6 sm:space-y-8">
        <div className="space-y-4 text-center sm:space-y-6">
          <div className="flex justify-center">
            <Logo width={180} height={54} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black tracking-tight text-primary sm:text-3xl">
              Crie sua conta
            </h1>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Junte-se à nossa rede de talentos e oportunidades.
            </p>
          </div>
        </div>

        <div className="surface-card rounded-sm p-6 sm:rounded-[2.5rem] sm:p-10">
          <form action={formAction} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                Nome Completo
              </label>
              <div className="group relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                <input name="nome" required className={inputClass} placeholder="Seu nome" />
              </div>
            </div>

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
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                Sua Senha
              </label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                <input
                  name="password"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                Confirmar Senha
              </label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                <input
                  name="passwordConfirm"
                  type="password"
                  required
                  className={inputClass}
                  placeholder="Repita sua senha"
                />
              </div>
            </div>

            <div className="surface-muted flex items-start gap-3 rounded-sm p-4">
              <input
                id="lgpd"
                name="lgpd"
                type="checkbox"
                required
                className="mt-1 h-4 w-4 rounded border-border text-accent focus:ring-accent"
              />
              <label htmlFor="lgpd" className="text-xs font-medium leading-relaxed text-foreground/85">
                Estou de acordo com a{' '}
                <Link href="/privacidade" className="text-accent underline">
                  Política de Privacidade
                </Link>{' '}
                e autorizo o tratamento dos meus dados para fins de recrutamento e contato.
              </label>
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
              {pending ? 'Criando Conta...' : 'Começar Agora'}
            </button>
          </form>

          <div className="mt-8 space-y-4 border-t border-border/70 pt-6 text-center sm:mt-10 sm:pt-8">
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Já possui uma conta?
            </p>
            <Link
              href="/login"
              className="block text-[9px] font-black uppercase tracking-widest text-primary hover:underline sm:text-xs dark:text-accent"
            >
              Fazer login agora
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
