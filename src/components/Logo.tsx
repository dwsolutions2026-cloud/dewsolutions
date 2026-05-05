'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from '@/components/ThemeProvider'

interface LogoProps {
  className?: string
  width?: number
  height?: number
  variant?: 'white' | 'black' | 'auto'
}

export function Logo({
  className = '',
  width = 160,
  height = 50,
  variant = 'auto',
}: LogoProps) {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={`opacity-0 ${className}`} style={{ width, height }} />
  }

  const logoVariant = variant === 'auto' ? (resolvedTheme === 'dark' ? 'white' : 'black') : variant

  return (
    <div className={`relative flex items-center transition-all ${className}`} style={{ width, height }}>
      <Image
        src={logoVariant === 'white' ? '/logo-branco.png' : '/logo-preto.png'}
        alt="D&W Solutions Logo"
        fill
        sizes={`${width}px`}
        className="object-contain object-left"
        priority
      />
    </div>
  )
}
