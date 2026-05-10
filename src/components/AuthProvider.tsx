'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

const hasSupabaseEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

type UserRole = 'admin' | 'empresa' | 'candidato'

interface AuthContextType {
  user: User | null
  role: UserRole
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'candidato',
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<UserRole>('candidato')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    const loadSession = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      setUser(currentUser)

      if (!currentUser) {
        setRole('candidato')
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      const roleFromMeta = currentUser.user_metadata?.role as UserRole | undefined
      let resolved = (profile?.role as UserRole | undefined) || roleFromMeta

      if (!resolved) {
        const { data: empresa } = await supabase
          .from('empresas')
          .select('id')
          .eq('user_id', currentUser.id)
          .maybeSingle()
        if (empresa) {
          resolved = 'empresa'
        }
      }

      setRole(resolved || 'candidato')
      setIsLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: any, session: any) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (!currentUser) {
        setRole('candidato')
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single()

      const roleFromMeta = currentUser.user_metadata?.role as UserRole | undefined
      let resolved = (profile?.role as UserRole | undefined) || roleFromMeta

      if (!resolved) {
        const { data: empresa } = await supabase
          .from('empresas')
          .select('id')
          .eq('user_id', currentUser.id)
          .maybeSingle()
        if (empresa) {
          resolved = 'empresa'
        }
      }

      setRole(resolved || 'candidato')
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
