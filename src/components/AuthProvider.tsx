'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

const hasSupabaseEnv = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

interface AuthContextType {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!hasSupabaseEnv) {
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    // 1. Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setIsLoading(false)
    })

    // 2. Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
