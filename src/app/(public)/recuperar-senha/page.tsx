'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`,
      })
      if (error) throw error
      setSuccess(true)
      toast.success('E-mail enviado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar e-mail. Verifique se o e-mail está correto.')
    } finally {
      setLoading(false)
    }
  }

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
              Recuperar Senha
            </h1>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Enviaremos um link para você redefinir sua senha.
            </p>
          </div>
        </div>

        <div className="surface-card rounded-sm p-6 sm:rounded-[2.5rem] sm:p-10">
          {success ? (
            <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-black text-xl text-primary">E-mail Enviado!</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Verifique sua caixa de entrada e pasta de spam para o e-mail <strong>{email}</strong>.
                </p>
              </div>
              <Link
                href="/login"
                className="mt-6 flex w-full items-center justify-center rounded-sm bg-accent px-4 py-3 text-sm font-black text-black shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:py-4 sm:text-base"
              >
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                  E-mail cadastrado
                </label>
                <div className="group relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="seu.email@exemplo.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center rounded-sm bg-accent px-4 py-3 text-sm font-black text-black shadow-lg shadow-accent/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:py-4 sm:text-base"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Enviar Link de Recuperação'
                )}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs font-bold text-muted-foreground sm:text-sm">
          Lembrou a senha?{' '}
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-primary hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-3 h-3" /> Voltar para o login
          </Link>
        </p>
      </div>
    </div>
  )
}
