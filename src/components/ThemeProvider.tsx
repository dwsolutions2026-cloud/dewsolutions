'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type Theme = 'light' | 'dark'

type ThemeContextValue = {
  resolvedTheme: Theme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'theme'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY)
    const initialTheme = storedTheme === 'light' || storedTheme === 'dark' ? storedTheme : 'dark'

    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    window.localStorage.setItem(STORAGE_KEY, nextTheme)
    applyTheme(nextTheme)
  }, [])

  const value = useMemo<ThemeContextValue>(
    () => ({
      resolvedTheme: theme,
      setTheme,
    }),
    [setTheme, theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    return {
      resolvedTheme: 'dark' as Theme,
      setTheme: () => {},
    }
  }

  return context
}
