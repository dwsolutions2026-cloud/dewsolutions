'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface LogoProps {
  width?: number
  height?: number
  className?: string
}

export function Logo({ width = 160, height = 55, className = "" }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Antes de montar no cliente, exibe placeholder invisível para evitar hidratação
  if (!mounted) {
    return <div style={{ width, height }} className={className} />
  }

  const isDark = resolvedTheme === 'dark'
  // No modo escuro usamos a logo branca, no modo claro usamos a preta
  const logoSrc = isDark ? '/logo-branco.png' : '/logo-preto.png'

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoSrc}
      alt="D&W Solutions"
      width={width}
      height={height}
      style={{ width, height, objectFit: 'contain' }}
      className={className}
    />
  )
}
