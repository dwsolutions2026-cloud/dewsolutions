'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LogoProps {
  width?: number
  height?: number
}

export function Logo({ width = 160, height = 50 }: LogoProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Evita mismatch de hidratação
  if (!mounted) return <div style={{ width, height }} className="bg-transparent" />

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="relative" style={{ width, height }}>
      <Image
        src={isDark ? "/logo-branco.png" : "/logo-preto.png"}
        alt="DW Solutions Logo"
        fill
        priority
        className="object-contain"
        sizes="(max-width: 768px) 140px, 160px"
      />
    </div>
  )
}
