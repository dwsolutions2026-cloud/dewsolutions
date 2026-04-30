'use client'

import { useActionState } from 'react'
import { loginAction, signInWithGoogle, signInWithApple } from '@/app/actions/auth'
import Link from 'next/link'
import { Briefcase } from 'lucide-react'

const initialState = {
  error: null as string | null,
}

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await loginAction(formData)
      return result || { error: null }
    },
    initialState
  )

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl shadow-sm border border-border">
        <div className="text-center">
          <Briefcase className="mx-auto h-12 w-12 text-accent" />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-primary">
            Acesse sua conta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Candidato ou Empresa
          </p>
        </div>

        <form className="mt-8 space-y-6" action={formAction}>
          {state.error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm text-center">
              {state.error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-primary">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full rounded-md border border-border px-3 py-2 bg-card text-foreground placeholder-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent sm:text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={pending}
              className="flex w-full justify-center rounded-md bg-primary px-3 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-colors"
            >
              {pending ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground uppercase">Ou entrar com</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => signInWithGoogle()}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-card px-3 py-3 text-sm font-semibold text-primary hover:bg-muted transition-colors shadow-sm"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <button
            onClick={() => signInWithApple()}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-border bg-black px-3 py-3 text-sm font-semibold text-white hover:bg-black/90 transition-colors shadow-sm"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.039 2.48-4.5 2.597-4.571-1.428-2.09-3.623-2.324-4.402-2.376-2.116-.17-3.948 1.144-5.048 1.144zm2.324-2.13c.948-1.142 1.584-2.726 1.402-4.312-1.352.052-2.987.896-3.961 2.039-.87 1.013-1.636 2.637-1.428 4.168 1.506.117 3.026-.74 3.987-1.895z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Ainda não tem conta?{' '}
            <Link href="/cadastro" className="font-semibold text-accent hover:text-accent/80">
              Cadastre seu currículo
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
