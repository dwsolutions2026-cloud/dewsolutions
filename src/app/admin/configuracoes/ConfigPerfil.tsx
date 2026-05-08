'use client'

import { useState, useEffect } from 'react'
import { UserCircle, Mail, Key, User, Camera } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'react-hot-toast'

export function ConfigPerfil() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    nome: '',
    email: '',
  })
  const supabase = createClient()

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setProfile({
          nome: user.user_metadata?.nome || '',
          email: user.email || '',
        })
      }
    }
    loadUser()
  }, [supabase])

  async function handleUpdateProfile() {
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { nome: profile.nome }
      })
      if (error) throw error
      toast.success('Perfil atualizado com sucesso!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar perfil.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword() {
    if (!user?.email) return
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/admin/perfil/resetar-senha`,
      })
      if (error) throw error
      toast.success('E-mail de redefinição enviado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar e-mail.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) return <div className="animate-pulse space-y-4">
    <div className="h-8 bg-muted rounded w-1/4"></div>
    <div className="h-32 bg-muted rounded"></div>
  </div>

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <UserCircle className="w-4 h-4 text-accent" /> Perfil do Administrador
          </h3>
          <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase">Suas informações de conta</p>
        </div>
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="bg-accent text-accent-foreground px-6 py-2 rounded-sm font-black text-[10px] uppercase tracking-widest shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Atualizar Dados'}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex flex-col items-center gap-4">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center text-accent border-2 border-border group-hover:border-accent transition-all overflow-hidden">
              <UserCircle className="w-20 h-20" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-accent text-white rounded-full shadow-lg hover:scale-110 transition-all border-2 border-background">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[9px] font-black uppercase text-muted-foreground tracking-tighter text-center">Clique para alterar foto</p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> Nome Completo
            </label>
            <input
              type="text"
              value={profile.nome}
              onChange={(e) => setProfile({ ...profile, nome: e.target.value })}
              className="w-full px-4 py-2.5 rounded-sm bg-background border border-border focus:ring-2 focus:ring-accent outline-none transition-all text-sm font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1 flex items-center gap-2">
              <Mail className="w-3 h-3" /> E-mail de Acesso
            </label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-4 py-2.5 rounded-sm bg-muted border border-border text-muted-foreground cursor-not-allowed text-sm font-medium"
            />
            <p className="text-[8px] text-muted-foreground ml-1">O e-mail de login não pode ser alterado por aqui.</p>
          </div>

          <div className="md:col-span-2 pt-6 border-t border-border mt-4">
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-sm">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Key className="w-3 h-3 text-accent" /> Senha de Acesso
                </p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase mt-0.5">Deseja trocar sua senha atual?</p>
              </div>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-background border border-border text-primary hover:border-accent hover:text-accent rounded-sm font-bold text-[9px] uppercase tracking-widest transition-all"
              >
                Redefinir por E-mail
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
