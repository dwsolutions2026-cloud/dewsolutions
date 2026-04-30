'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="p-2 w-10 h-10" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-all border border-border/50 shadow-sm"
      aria-label="Alternar tema"
    >
      {resolvedTheme === 'dark' ? (
        <Sun className="w-5 h-5 animate-in spin-in duration-500" />
      ) : (
        <Moon className="w-5 h-5 animate-in spin-in duration-500" />
      )}
    </button>
  )
}
