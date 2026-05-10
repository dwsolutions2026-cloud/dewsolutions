'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Loader2, ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'

export default function RedefinirSenhaPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.')
      return
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })
      if (error) {
        if (error.message.toLowerCase().includes('session') || error.message.toLowerCase().includes('unauthorized')) {
          throw new Error('Sessão expirada ou link inválido. Por favor, solicite um novo link de redefinição.')
        }
        throw error
      }
      toast.success('Senha atualizada com sucesso!')
      router.push('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao redefinir senha.')
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
              Nova Senha
            </h1>
            <p className="text-xs font-medium text-muted-foreground sm:text-sm">
              Digite e confirme sua nova senha de acesso.
            </p>
          </div>
        </div>

        <div className="surface-card rounded-sm p-6 sm:rounded-[2.5rem] sm:p-10">
          <form onSubmit={handleReset} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                Nova Senha
              </label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                <input
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground sm:text-xs">
                Confirmar Nova Senha
              </label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-accent sm:left-4" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="gold-gradient flex w-full items-center justify-center gap-2 rounded-sm py-3 text-base font-black text-black shadow-xl shadow-accent/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 sm:gap-3 sm:rounded-sm sm:py-5 sm:text-lg mt-4"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin sm:h-6 sm:w-6" />
              ) : (
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
              {loading ? 'Salvando...' : 'Salvar Nova Senha'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
